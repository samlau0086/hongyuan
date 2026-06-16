import express from "express";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const RFQ_MAX_BYTES = 25 * 1024 * 1024;
const rfqDataDir = process.env.RFQ_DATA_DIR || path.join(process.cwd(), "data", "rfq");
const rfqRecordsPath = path.join(rfqDataDir, "records.json");
const adminCookieName = "hongyuan_admin_session";

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

function getAdminUser() {
  return process.env.ADMIN_USER || process.env.RFQ_ADMIN_USER || "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.RFQ_ADMIN_PASSWORD || "";
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf("=");
        return index >= 0 ? [cookie.slice(0, index), decodeURIComponent(cookie.slice(index + 1))] : [cookie, ""];
      })
  );
}

function signValue(value: string) {
  return crypto.createHmac("sha256", getAdminSessionSecret()).update(value).digest("base64url");
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createAdminSession(user: string) {
  const payload = Buffer.from(
    JSON.stringify({
      user,
      exp: Date.now() + 1000 * 60 * 60 * 12,
    })
  ).toString("base64url");
  return `${payload}.${signValue(payload)}`;
}

function readAdminSession(req: any) {
  const token = parseCookies(req.headers.cookie || "")[adminCookieName];
  if (!token || !getAdminSessionSecret()) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !constantTimeEqual(signature, signValue(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session.exp < Date.now() || session.user !== getAdminUser()) return null;
    return session;
  } catch {
    return null;
  }
}

function setAdminSessionCookie(res: any, user: string) {
  res.setHeader(
    "Set-Cookie",
    `${adminCookieName}=${encodeURIComponent(createAdminSession(user))}; HttpOnly; SameSite=Lax; Path=/admin; Max-Age=43200`
  );
}

function clearAdminSessionCookie(res: any) {
  res.setHeader("Set-Cookie", `${adminCookieName}=; HttpOnly; SameSite=Lax; Path=/admin; Max-Age=0`);
}

function isSafeAdminPath(pathname: unknown) {
  return typeof pathname === "string" && pathname.startsWith("/admin") && !pathname.startsWith("//");
}

function requireAdmin(req: any, res: any) {
  if (!getAdminPassword()) {
    res.status(503).type("html").send(renderAdminSetupRequired());
    return false;
  }

  if (!readAdminSession(req)) {
    const next = encodeURIComponent(req.originalUrl || "/admin");
    res.redirect(`/admin/login?next=${next}`);
    return false;
  }

  return true;
}

function renderAdminSetupRequired() {
  return `<!doctype html>
    <html lang="en">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Admin Setup Required</title></head>
      <body style="font-family:Arial,sans-serif;padding:40px;background:#f8fafc;color:#0f172a">
        <h1>Admin setup required</h1>
        <p>Set <code>ADMIN_PASSWORD</code> or <code>RFQ_ADMIN_PASSWORD</code> on the server before using the admin panel.</p>
      </body>
    </html>`;
}

function renderAdminLogin(error = "", next = "/admin") {
  const safeNext = isSafeAdminPath(next) ? next : "/admin";
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Hongyuan Admin Login</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Arial, sans-serif; background: #0f172a; color: #172033; }
          .login { width: min(420px, calc(100vw - 32px)); background: #fff; border: 1px solid #d9e0ea; padding: 32px; box-shadow: 0 24px 80px rgba(0,0,0,.24); }
          h1 { margin: 0 0 8px; color: #0f172a; font-size: 28px; }
          p { margin: 0 0 24px; color: #64748b; line-height: 1.5; }
          label { display: block; margin: 16px 0 8px; color: #334155; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
          input { width: 100%; border: 1px solid #cbd5e1; padding: 12px 14px; font-size: 15px; outline: none; }
          input:focus { border-color: #1d4ed8; box-shadow: 0 0 0 1px #1d4ed8; }
          button { width: 100%; margin-top: 24px; border: 0; background: #0f172a; color: #fff; padding: 13px 16px; font-weight: 700; cursor: pointer; }
          .error { margin: 0 0 16px; padding: 12px; border: 1px solid #fecaca; background: #fef2f2; color: #b91c1c; font-size: 14px; }
        </style>
      </head>
      <body>
        <form class="login" method="post" action="/admin/login">
          <h1>Hongyuan Admin</h1>
          <p>Sign in to manage RFQ submissions and website content.</p>
          ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
          <input type="hidden" name="next" value="${escapeHtml(safeNext)}">
          <label for="user">Username</label>
          <input id="user" name="user" type="text" autocomplete="username" required autofocus>
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required>
          <button type="submit">Sign In</button>
        </form>
      </body>
    </html>`;
}

function renderAdminLayout(title: string, active: string, body: string) {
  const nav = [
    { id: "dashboard", label: "Dashboard", href: "/admin" },
    { id: "rfq", label: "RFQ Submissions", href: "/admin/rfq" },
    { id: "blog", label: "Blog", href: "/admin/blog" },
  ];

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(title)} - Hongyuan Admin</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Arial, sans-serif; background: #f5f7fb; color: #152033; }
          .shell { min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; }
          aside { background: #0f172a; color: white; padding: 24px; }
          aside h1 { font-size: 20px; margin: 0 0 24px; }
          nav a { display: block; color: #cbd5e1; text-decoration: none; padding: 11px 12px; margin-bottom: 6px; border: 1px solid transparent; }
          nav a.active, nav a:hover { color: white; border-color: #334155; background: #1e293b; }
          .logout { color: #93c5fd; font-size: 13px; margin-top: 24px; display: inline-block; }
          header { background: white; border-bottom: 1px solid #d9e0ea; padding: 22px 32px; }
          header h2 { margin: 0; color: #0f172a; }
          main { padding: 32px; }
          table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d9e0ea; }
          th, td { padding: 14px; border-bottom: 1px solid #e5eaf2; text-align: left; vertical-align: top; font-size: 14px; }
          th { background: #eef2f7; color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
          .card { background: white; border: 1px solid #d9e0ea; padding: 24px; }
          .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
          .metric { font-size: 32px; font-weight: 800; color: #0f172a; margin-top: 8px; }
          .muted, span { color: #64748b; }
          a { color: #0f5db8; }
          .empty { padding: 32px; background: white; border: 1px solid #d9e0ea; }
          @media (max-width: 800px) {
            .shell { grid-template-columns: 1fr; }
            aside { position: static; }
            main, header { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="shell">
          <aside>
            <h1>Hongyuan Admin</h1>
            <nav>
              ${nav.map((item) => `<a class="${active === item.id ? "active" : ""}" href="${item.href}">${item.label}</a>`).join("")}
            </nav>
            <a class="logout" href="/admin/logout">Sign out</a>
          </aside>
          <section>
            <header><h2>${escapeHtml(title)}</h2></header>
            <main>${body}</main>
          </section>
        </div>
      </body>
    </html>`;
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
  app.use(express.urlencoded({ extended: false }));

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

  app.get("/admin/login", (req, res) => {
    if (!getAdminPassword()) {
      res.status(503).type("html").send(renderAdminSetupRequired());
      return;
    }

    if (readAdminSession(req)) {
      res.redirect(isSafeAdminPath(req.query.next) ? String(req.query.next) : "/admin");
      return;
    }

    res.type("html").send(renderAdminLogin("", String(req.query.next || "/admin")));
  });

  app.post("/admin/login", (req, res) => {
    if (!getAdminPassword()) {
      res.status(503).type("html").send(renderAdminSetupRequired());
      return;
    }

    const user = String(req.body.user || "");
    const password = String(req.body.password || "");
    const next = isSafeAdminPath(req.body.next) ? String(req.body.next) : "/admin";

    if (user === getAdminUser() && password === getAdminPassword()) {
      setAdminSessionCookie(res, user);
      res.redirect(next);
      return;
    }

    res.status(401).type("html").send(renderAdminLogin("Invalid username or password.", next));
  });

  app.get("/admin/logout", (req, res) => {
    clearAdminSessionCookie(res);
    res.redirect("/admin/login");
  });

  app.get("/admin", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const records = readRfqRecords();
    const latest = records[0];
    res.type("html").send(
      renderAdminLayout(
        "Dashboard",
        "dashboard",
        `<div class="cards">
          <div class="card">
            <div class="muted">RFQ Submissions</div>
            <div class="metric">${records.length}</div>
          </div>
          <div class="card">
            <div class="muted">Latest RFQ</div>
            <div style="margin-top:10px">${latest ? `${escapeHtml(latest.name)}<br><span>${escapeHtml(latest.company)}</span>` : "No submissions yet."}</div>
          </div>
          <div class="card">
            <div class="muted">Blog Admin</div>
            <div style="margin-top:10px">Ready for the next step.</div>
          </div>
        </div>`
      )
    );
  });

  app.get("/admin/blog", (req, res) => {
    if (!requireAdmin(req, res)) return;

    res.type("html").send(
      renderAdminLayout(
        "Blog",
        "blog",
        `<div class="card">
          <h3 style="margin-top:0">Blog admin is not enabled yet</h3>
          <p class="muted">This unified admin panel is ready. The next step is adding Markdown-based blog create/edit screens and local post storage.</p>
        </div>`
      )
    );
  });

  app.get("/admin/rfq", (req, res) => {
    if (!requireAdmin(req, res)) return;

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

    res.type("html").send(
      renderAdminLayout(
        "RFQ Submissions",
        "rfq",
        `<p class="muted">${records.length} submissions stored in ${escapeHtml(rfqDataDir)}</p>
        ${
          records.length
            ? `<table>
                <thead>
                  <tr><th>Date</th><th>Contact</th><th>Email / Phone</th><th>Delivery</th><th>Requirements</th><th>Files</th></tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>`
            : '<div class="empty">No RFQ submissions yet.</div>'
        }`
      )
    );
  });

  app.get("/admin/rfq/:id/files/:index", (req, res) => {
    if (!requireAdmin(req, res)) return;

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
