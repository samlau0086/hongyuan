import express from "express";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const RFQ_MAX_BYTES = 25 * 1024 * 1024;
const rfqDataDir = process.env.RFQ_DATA_DIR || path.join(process.cwd(), "data", "rfq");
const rfqRecordsPath = path.join(rfqDataDir, "records.json");

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeFileName(fileName: string) {
  return path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "upload";
}

function ensureRfqStore() {
  fs.mkdirSync(rfqDataDir, { recursive: true });
  if (!fs.existsSync(rfqRecordsPath)) {
    fs.writeFileSync(rfqRecordsPath, "[]");
  }
}

function readRfqRecords(): any[] {
  ensureRfqStore();
  return JSON.parse(fs.readFileSync(rfqRecordsPath, "utf8"));
}

function writeRfqRecords(records: any[]) {
  ensureRfqStore();
  fs.writeFileSync(rfqRecordsPath, JSON.stringify(records, null, 2));
}

function requireRfqAdmin(req: any, res: any) {
  const password = process.env.RFQ_ADMIN_PASSWORD;
  const user = process.env.RFQ_ADMIN_USER || "admin";

  if (!password) {
    res.status(503).send("RFQ admin is not configured. Set RFQ_ADMIN_PASSWORD on the server.");
    return false;
  }

  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");
  const credentials = encoded ? Buffer.from(encoded, "base64").toString("utf8") : "";
  const separator = credentials.indexOf(":");
  const requestUser = separator >= 0 ? credentials.slice(0, separator) : "";
  const requestPassword = separator >= 0 ? credentials.slice(separator + 1) : "";

  if (scheme !== "Basic" || requestUser !== user || requestPassword !== password) {
    res.setHeader("WWW-Authenticate", 'Basic realm="RFQ Admin"');
    res.status(401).send("Authentication required");
    return false;
  }

  return true;
}

function collectRequestBody(req: any, maxBytes: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;

    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error("Request is too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipartForm(body: Buffer, contentType: string) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    throw new Error("Missing multipart boundary");
  }

  const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`;
  const fields: Record<string, string> = {};
  const files: Array<{ fieldName: string; originalName: string; buffer: Buffer; mimeType: string }> = [];

  for (const rawPart of body.toString("latin1").split(boundary)) {
    let part = rawPart;
    if (!part || part === "--\r\n" || part === "--") continue;
    if (part.startsWith("\r\n")) part = part.slice(2);
    if (part.endsWith("\r\n")) part = part.slice(0, -2);
    if (part.endsWith("--")) part = part.slice(0, -2);

    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd < 0) continue;

    const rawHeaders = part.slice(0, headerEnd);
    const content = part.slice(headerEnd + 4);
    const disposition = rawHeaders.match(/content-disposition:[^\r\n]+/i)?.[0] || "";
    const name = disposition.match(/name="([^"]+)"/i)?.[1];
    const filename = disposition.match(/filename="([^"]*)"/i)?.[1];
    const mimeType = rawHeaders.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "application/octet-stream";

    if (!name) continue;

    if (filename) {
      files.push({
        fieldName: name,
        originalName: filename,
        buffer: Buffer.from(content, "latin1"),
        mimeType,
      });
    } else {
      fields[name] = Buffer.from(content, "latin1").toString("utf8").trim();
    }
  }

  return { fields, files };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // Proxy route for WordPress API to bypass CORS
  app.get("/api/posts", async (req, res) => {
    try {
      const wpApiUrl = process.env.VITE_WP_API_URL || 'https://api.hongyuan-precision.com/wp-json/wp/v2/posts';
      
      const response = await fetch(`${wpApiUrl}?_embed&per_page=100`);
      
      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error proxying WP request:", error);
      res.status(500).json({ error: error.message || "Failed to fetch from WordPress" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const wpApiUrl = process.env.VITE_WP_API_URL || 'https://api.hongyuan-precision.com/wp-json/wp/v2/posts';
      
      const response = await fetch(`${wpApiUrl}?slug=${req.params.slug}&_embed`);
      
      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        res.json(data[0]);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error: any) {
      console.error("Error proxying single post request:", error);
      res.status(500).json({ error: error.message || "Failed to fetch post from WordPress" });
    }
  });

  app.post("/api/rfq", async (req, res) => {
    try {
      const contentType = req.headers["content-type"] || "";
      if (!String(contentType).includes("multipart/form-data")) {
        res.status(400).json({ error: "Expected multipart/form-data" });
        return;
      }

      const body = await collectRequestBody(req, RFQ_MAX_BYTES);
      const { fields, files } = parseMultipartForm(body, String(contentType));

      if (!fields.name || !fields.company || !fields.email) {
        res.status(400).json({ error: "Name, company, and email are required." });
        return;
      }

      const id = `${new Date().toISOString().replace(/[-:.TZ]/g, "")}-${crypto.randomBytes(4).toString("hex")}`;
      const uploadDir = path.join(rfqDataDir, "uploads", id);
      fs.mkdirSync(uploadDir, { recursive: true });

      const savedFiles = files
        .filter((file) => file.buffer.length > 0)
        .map((file) => {
          const fileName = `${Date.now()}-${sanitizeFileName(file.originalName)}`;
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, file.buffer);
          return {
            fieldName: file.fieldName,
            originalName: file.originalName,
            fileName,
            mimeType: file.mimeType,
            size: file.buffer.length,
            path: filePath,
          };
        });

      const record = {
        id,
        createdAt: new Date().toISOString(),
        name: fields.name,
        company: fields.company,
        email: fields.email,
        phone: fields.phone || "",
        deliveryDate: fields.deliveryDate || "",
        requirements: fields.requirements || "",
        files: savedFiles,
      };

      const records = readRfqRecords();
      records.unshift(record);
      writeRfqRecords(records);

      res.json({ ok: true, id });
    } catch (error: any) {
      console.error("RFQ submission failed:", error);
      res.status(error.message === "Request is too large" ? 413 : 500).json({
        error: error.message || "Failed to submit RFQ",
      });
    }
  });

  app.get("/admin/rfq", (req, res) => {
    if (!requireRfqAdmin(req, res)) return;

    const records = readRfqRecords();
    const rows = records
      .map((record) => {
        const fileLinks = record.files?.length
          ? record.files
              .map((file: any, index: number) => `<a href="/admin/rfq/${record.id}/files/${index}">${escapeHtml(file.originalName)}</a>`)
              .join("<br>")
          : "No files";

        return `
          <tr>
            <td>${escapeHtml(new Date(record.createdAt).toLocaleString())}</td>
            <td>${escapeHtml(record.name)}<br><span>${escapeHtml(record.company)}</span></td>
            <td><a href="mailto:${escapeHtml(record.email)}">${escapeHtml(record.email)}</a><br>${escapeHtml(record.phone)}</td>
            <td>${escapeHtml(record.deliveryDate)}</td>
            <td>${escapeHtml(record.requirements)}</td>
            <td>${fileLinks}</td>
          </tr>
        `;
      })
      .join("");

    res.type("html").send(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>RFQ Submissions</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #f5f7fb; color: #152033; }
            header { background: #0f172a; color: white; padding: 24px 32px; }
            main { padding: 32px; }
            table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d9e0ea; }
            th, td { padding: 14px; border-bottom: 1px solid #e5eaf2; text-align: left; vertical-align: top; font-size: 14px; }
            th { background: #eef2f7; color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
            span { color: #64748b; }
            a { color: #0f5db8; }
            .empty { padding: 32px; background: white; border: 1px solid #d9e0ea; }
          </style>
        </head>
        <body>
          <header>
            <h1>RFQ Submissions</h1>
            <p>${records.length} submissions stored in ${escapeHtml(rfqDataDir)}</p>
          </header>
          <main>
            ${
              records.length
                ? `<table>
                    <thead>
                      <tr><th>Date</th><th>Contact</th><th>Email / Phone</th><th>Delivery</th><th>Requirements</th><th>Files</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                  </table>`
                : '<div class="empty">No RFQ submissions yet.</div>'
            }
          </main>
        </body>
      </html>`);
  });

  app.get("/admin/rfq/:id/files/:index", (req, res) => {
    if (!requireRfqAdmin(req, res)) return;

    const records = readRfqRecords();
    const record = records.find((item) => item.id === req.params.id);
    const file = record?.files?.[Number(req.params.index)];

    if (!file || !file.path || !fs.existsSync(file.path)) {
      res.status(404).send("File not found");
      return;
    }

    res.download(file.path, file.originalName);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from the built server directory.
    const distPath = __dirname;
    console.log(`Serving static files from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
