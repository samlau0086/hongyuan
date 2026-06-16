import express from "express";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const RFQ_MAX_BYTES = 25 * 1024 * 1024;
const BLOG_MAX_BYTES = 12 * 1024 * 1024;
const rfqDataDir = process.env.RFQ_DATA_DIR || path.join(process.cwd(), "data", "rfq");
const rfqRecordsPath = path.join(rfqDataDir, "records.json");
const blogDataDir = process.env.BLOG_DATA_DIR || path.join(process.cwd(), "data", "blog");
const blogPostsPath = path.join(blogDataDir, "posts.json");
const blogUploadsDir = path.join(blogDataDir, "uploads");
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

function decodeHeaderValue(value = "") {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function decodeMultipartFileName(disposition: string) {
  const encodedFileName = disposition.match(/filename\*=UTF-8''([^;\r\n]+)/i)?.[1];
  if (encodedFileName) {
    return decodeHeaderValue(encodedFileName.replace(/^"|"$/g, ""));
  }

  const fileName = disposition.match(/filename="([^"]*)"/i)?.[1] || "";
  if (!fileName) return "";

  try {
    return Buffer.from(fileName, "latin1").toString("utf8");
  } catch {
    return fileName;
  }
}

function repairMojibake(value: string) {
  if (!/[ÃÂÅåçéèæ]/.test(value)) return value;
  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function getClientIp(req: any) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwardedFor || req.socket?.remoteAddress || "";
}

function deleteDirectoryIfInside(targetPath: string, parentDir: string) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedParent = path.resolve(parentDir);
  if (resolvedTarget.startsWith(resolvedParent + path.sep) && fs.existsSync(resolvedTarget)) {
    fs.rmSync(resolvedTarget, { recursive: true, force: true });
  }
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

function ensureBlogStore() {
  fs.mkdirSync(blogUploadsDir, { recursive: true });
  if (!fs.existsSync(blogPostsPath)) {
    fs.writeFileSync(blogPostsPath, "[]");
  }
}

function readBlogPosts(): any[] {
  ensureBlogStore();
  return JSON.parse(fs.readFileSync(blogPostsPath, "utf8"));
}

function writeBlogPosts(posts: any[]) {
  ensureBlogStore();
  fs.writeFileSync(blogPostsPath, JSON.stringify(posts, null, 2));
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `post-${Date.now()}`;
}

function formatDate(value: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(markdown: string) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listOpen = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length + 1;
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(listItem[1])}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  return html.join("\n");
}

function getBlogExcerpt(markdown: string, explicitExcerpt = "") {
  if (explicitExcerpt.trim()) return explicitExcerpt.trim();
  return String(markdown || "")
    .replace(/[#*_`>\-[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
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
          .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
          .button { display: inline-block; border: 0; background: #0f172a; color: #fff; padding: 10px 14px; text-decoration: none; font-size: 14px; font-weight: 700; cursor: pointer; }
          .button.secondary { background: #e2e8f0; color: #0f172a; }
          .button.danger { background: #b91c1c; }
          .form-grid { display: grid; gap: 16px; max-width: 980px; }
          label { display: block; font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 7px; }
          input, textarea { width: 100%; border: 1px solid #cbd5e1; padding: 11px 12px; font: inherit; background: white; }
          textarea { min-height: 320px; font-family: Consolas, Monaco, monospace; line-height: 1.5; }
          .help { color: #64748b; font-size: 13px; margin-top: 6px; }
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

function renderBlogForm(post: any = {}, action = "/admin/blog/new") {
  return `<form class="card form-grid" method="post" action="${action}" enctype="multipart/form-data">
    <div>
      <label for="title">Title</label>
      <input id="title" name="title" value="${escapeHtml(post.title || "")}" required>
    </div>
    <div>
      <label for="slug">Slug</label>
      <input id="slug" name="slug" value="${escapeHtml(post.slug || "")}" placeholder="auto-generated-from-title">
      <div class="help">Lowercase URL path, for example: cnc-machining-tolerance-control</div>
    </div>
    <div>
      <label for="date">Date</label>
      <input id="date" name="date" type="date" value="${escapeHtml(formatDate(post.date || new Date().toISOString()))}">
    </div>
    <div>
      <label for="excerpt">Excerpt</label>
      <textarea id="excerpt" name="excerpt" style="min-height:90px;font-family:Arial,sans-serif">${escapeHtml(post.excerpt || "")}</textarea>
    </div>
    <div>
      <label for="cover">Cover Image</label>
      <input id="cover" name="cover" type="file" accept=".jpg,.jpeg,.png,.webp,.gif">
      ${post.coverImage ? `<div class="help">Current: <a href="${escapeHtml(post.coverImage)}" target="_blank">${escapeHtml(post.coverImage)}</a></div>` : ""}
    </div>
    <div>
      <label for="content">Markdown Content</label>
      <textarea id="content" name="content" required>${escapeHtml(post.content || "")}</textarea>
      <div class="help">Supports headings (#), bullet lists, **bold**, *italic*, links, and paragraphs.</div>
    </div>
    <div class="actions">
      <button class="button" type="submit">Save Post</button>
      <a class="button secondary" href="/admin/blog">Cancel</a>
    </div>
  </form>`;
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
    const filename = decodeMultipartFileName(disposition);
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

  app.get("/api/blog/posts", (req, res) => {
    const posts = readBlogPosts()
      .filter((post) => post.status !== "draft")
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

    res.json(
      posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        date: post.date,
        excerpt: post.excerpt,
        img: post.coverImage || "",
      }))
    );
  });

  app.get("/api/blog/posts/:slug", (req, res) => {
    const post = readBlogPosts().find((item) => item.slug === req.params.slug && item.status !== "draft");
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      date: post.date,
      excerpt: post.excerpt,
      img: post.coverImage || "",
      content: post.content,
      contentHtml: markdownToHtml(post.content),
    });
  });

  app.get("/blog-uploads/:file", (req, res) => {
    const filePath = path.join(blogUploadsDir, sanitizeFileName(req.params.file));
    if (!fs.existsSync(filePath)) {
      res.status(404).send("File not found");
      return;
    }
    res.sendFile(filePath);
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
        ip: getClientIp(req),
        userAgent: String(req.headers["user-agent"] || ""),
        referer: String(req.headers.referer || ""),
        uploadDir,
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
    const posts = readBlogPosts();
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
            <div class="muted">Blog Posts</div>
            <div class="metric">${posts.length}</div>
          </div>
        </div>`
      )
    );
  });

  app.get("/admin/blog", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const posts = readBlogPosts().sort((a, b) => String(b.updatedAt || b.date || "").localeCompare(String(a.updatedAt || a.date || "")));
    const rows = posts
      .map(
        (post) => `<tr>
          <td>${post.coverImage ? `<img src="${escapeHtml(post.coverImage)}" alt="" style="width:88px;height:56px;object-fit:cover">` : ""}</td>
          <td><strong>${escapeHtml(post.title)}</strong><br><span>/blog/${escapeHtml(post.slug)}</span></td>
          <td>${escapeHtml(post.date)}</td>
          <td>${escapeHtml(post.status || "published")}</td>
          <td class="actions">
            <a class="button secondary" href="/admin/blog/${post.id}/edit">Edit</a>
            <form method="post" action="/admin/blog/${post.id}/delete" onsubmit="return confirm('Delete this post?')" style="margin:0">
              <button class="button danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>`
      )
      .join("");

    res.type("html").send(
      renderAdminLayout(
        "Blog",
        "blog",
        `<div class="actions" style="margin-bottom:16px">
          <a class="button" href="/admin/blog/new">New Post</a>
        </div>
        ${
          posts.length
            ? `<table>
                <thead><tr><th>Cover</th><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>`
            : '<div class="empty">No blog posts yet. Create your first post.</div>'
        }`
      )
    );
  });

  app.get("/admin/blog/new", (req, res) => {
    if (!requireAdmin(req, res)) return;

    res.type("html").send(renderAdminLayout("New Blog Post", "blog", renderBlogForm()));
  });

  app.post("/admin/blog/new", async (req, res) => {
    if (!requireAdmin(req, res)) return;

    try {
      const body = await collectRequestBody(req, BLOG_MAX_BYTES);
      const { fields, files } = parseMultipartForm(body, String(req.headers["content-type"] || ""));
      const title = fields.title?.trim();
      if (!title || !fields.content?.trim()) {
        res.status(400).type("html").send(renderAdminLayout("New Blog Post", "blog", `<div class="empty">Title and content are required.</div>${renderBlogForm(fields)}`));
        return;
      }

      const posts = readBlogPosts();
      const baseSlug = slugify(fields.slug || title);
      let slug = baseSlug;
      let count = 2;
      while (posts.some((post) => post.slug === slug)) {
        slug = `${baseSlug}-${count++}`;
      }

      const coverFile = files.find((file) => file.fieldName === "cover" && file.buffer.length > 0);
      let coverImage = "";
      if (coverFile) {
        const fileName = `${Date.now()}-${sanitizeFileName(coverFile.originalName)}`;
        fs.mkdirSync(blogUploadsDir, { recursive: true });
        fs.writeFileSync(path.join(blogUploadsDir, fileName), coverFile.buffer);
        coverImage = `/blog-uploads/${fileName}`;
      }

      const post = {
        id: crypto.randomBytes(8).toString("hex"),
        title,
        slug,
        date: formatDate(fields.date),
        excerpt: getBlogExcerpt(fields.content, fields.excerpt),
        content: fields.content,
        coverImage,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      posts.unshift(post);
      writeBlogPosts(posts);
      res.redirect("/admin/blog");
    } catch (error: any) {
      console.error("Blog create failed:", error);
      res.status(error.message === "Request is too large" ? 413 : 500).type("html").send(renderAdminLayout("New Blog Post", "blog", `<div class="empty">${escapeHtml(error.message || "Failed to save post")}</div>${renderBlogForm()}`));
    }
  });

  app.get("/admin/blog/:id/edit", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const post = readBlogPosts().find((item) => item.id === req.params.id);
    if (!post) {
      res.status(404).type("html").send(renderAdminLayout("Post Not Found", "blog", '<div class="empty">Post not found.</div>'));
      return;
    }

    res.type("html").send(renderAdminLayout("Edit Blog Post", "blog", renderBlogForm(post, `/admin/blog/${post.id}/edit`)));
  });

  app.post("/admin/blog/:id/edit", async (req, res) => {
    if (!requireAdmin(req, res)) return;

    try {
      const body = await collectRequestBody(req, BLOG_MAX_BYTES);
      const { fields, files } = parseMultipartForm(body, String(req.headers["content-type"] || ""));
      const posts = readBlogPosts();
      const index = posts.findIndex((item) => item.id === req.params.id);
      if (index < 0) {
        res.status(404).type("html").send(renderAdminLayout("Post Not Found", "blog", '<div class="empty">Post not found.</div>'));
        return;
      }

      const title = fields.title?.trim();
      if (!title || !fields.content?.trim()) {
        res.status(400).type("html").send(renderAdminLayout("Edit Blog Post", "blog", `<div class="empty">Title and content are required.</div>${renderBlogForm({ ...posts[index], ...fields }, `/admin/blog/${req.params.id}/edit`)}`));
        return;
      }

      const baseSlug = slugify(fields.slug || title);
      let slug = baseSlug;
      let count = 2;
      while (posts.some((post) => post.id !== req.params.id && post.slug === slug)) {
        slug = `${baseSlug}-${count++}`;
      }

      const coverFile = files.find((file) => file.fieldName === "cover" && file.buffer.length > 0);
      let coverImage = posts[index].coverImage || "";
      if (coverFile) {
        const fileName = `${Date.now()}-${sanitizeFileName(coverFile.originalName)}`;
        fs.mkdirSync(blogUploadsDir, { recursive: true });
        fs.writeFileSync(path.join(blogUploadsDir, fileName), coverFile.buffer);
        coverImage = `/blog-uploads/${fileName}`;
      }

      posts[index] = {
        ...posts[index],
        title,
        slug,
        date: formatDate(fields.date),
        excerpt: getBlogExcerpt(fields.content, fields.excerpt),
        content: fields.content,
        coverImage,
        updatedAt: new Date().toISOString(),
      };

      writeBlogPosts(posts);
      res.redirect("/admin/blog");
    } catch (error: any) {
      console.error("Blog update failed:", error);
      res.status(error.message === "Request is too large" ? 413 : 500).type("html").send(renderAdminLayout("Edit Blog Post", "blog", `<div class="empty">${escapeHtml(error.message || "Failed to save post")}</div>`));
    }
  });

  app.post("/admin/blog/:id/delete", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const posts = readBlogPosts().filter((post) => post.id !== req.params.id);
    writeBlogPosts(posts);
    res.redirect("/admin/blog");
  });

  app.get("/admin/rfq", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const records = readRfqRecords();
    const rows = records
      .map((record) => {
        const fileLinks = record.files?.length
          ? record.files
              .map((file: any, index: number) => `<a href="/admin/rfq/${record.id}/files/${index}">${escapeHtml(repairMojibake(file.originalName))}</a>`)
              .join("<br>")
          : "No files";
        const meta = [
          record.ip ? `IP: ${escapeHtml(record.ip)}` : "",
          record.userAgent ? `UA: ${escapeHtml(record.userAgent)}` : "",
          record.referer ? `Ref: ${escapeHtml(record.referer)}` : "",
        ].filter(Boolean).join("<br>");

        return `
          <tr>
            <td>${escapeHtml(new Date(record.createdAt).toLocaleString())}</td>
            <td>${escapeHtml(record.name)}<br><span>${escapeHtml(record.company)}</span></td>
            <td><a href="mailto:${escapeHtml(record.email)}">${escapeHtml(record.email)}</a><br>${escapeHtml(record.phone)}</td>
            <td>${escapeHtml(record.deliveryDate)}</td>
            <td>${escapeHtml(record.requirements)}</td>
            <td>${fileLinks}</td>
            <td>${meta || "N/A"}</td>
            <td>
              <form method="post" action="/admin/rfq/${record.id}/delete" onsubmit="return confirm('Delete this RFQ and its uploaded files?')" style="margin:0">
                <button class="button danger" type="submit">Delete</button>
              </form>
            </td>
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
                  <tr><th>Date</th><th>Contact</th><th>Email / Phone</th><th>Delivery</th><th>Requirements</th><th>Files</th><th>IP / UA</th><th>Actions</th></tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>`
            : '<div class="empty">No RFQ submissions yet.</div>'
        }`
      )
    );
  });

  app.post("/admin/rfq/:id/delete", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const records = readRfqRecords();
    const record = records.find((item) => item.id === req.params.id);
    if (record?.uploadDir) {
      deleteDirectoryIfInside(record.uploadDir, path.join(rfqDataDir, "uploads"));
    } else if (record?.id) {
      deleteDirectoryIfInside(path.join(rfqDataDir, "uploads", record.id), path.join(rfqDataDir, "uploads"));
    }

    writeRfqRecords(records.filter((item) => item.id !== req.params.id));
    res.redirect("/admin/rfq");
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

    res.download(file.path, repairMojibake(file.originalName));
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
