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

type Locale = "en" | "ja" | "zh";
type BlogTranslation = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: string;
};

const locales: Locale[] = ["en", "ja", "zh"];

function normalizeLocale(value: unknown): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "en";
}

function localizedPath(pathname: string, locale: Locale) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === "en") return normalized === "/" ? "/en" : `/en${normalized}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

function getBlogTranslation(post: any, locale: Locale): BlogTranslation | null {
  const translation = post.translations?.[locale];
  if (translation?.title && translation?.slug) {
    return translation;
  }

  if (locale === "en" && post.title && post.slug) {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      status: post.status || "published",
    };
  }

  return null;
}

function getAdminBlogTranslation(post: any, locale: Locale): BlogTranslation {
  return getBlogTranslation(post, locale) || {};
}

function getPublishedBlogPosts(locale: Locale = "en") {
  return readBlogPosts()
    .filter((post) => {
      const translation = getBlogTranslation(post, locale);
      return translation?.title && translation?.slug && translation.status !== "draft";
    })
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function formatPublicDate(value: string, style: "short" | "long" = "short", locale: Locale = "en") {
  const date = new Date(value || "");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : "zh-CN", {
    month: style === "long" ? "long" : "short",
    day: style === "long" ? "numeric" : "2-digit",
    year: "numeric",
  });
}

function getPublicBlogSummary(post: any, locale: Locale = "en") {
  const translation = getBlogTranslation(post, locale) || {};
  return {
    id: post.id,
    title: translation.title || "",
    slug: translation.slug || "",
    date: post.date,
    excerpt: translation.excerpt || "",
    img: post.coverImage || "",
  };
}

function getPublicBlogPost(post: any, locale: Locale = "en") {
  const translation = getBlogTranslation(post, locale) || {};
  return {
    ...getPublicBlogSummary(post, locale),
    content: translation.content || "",
    contentHtml: markdownToHtml(translation.content || ""),
  };
}

function findPublishedBlogPostBySlug(slug: string, locale: Locale = "en") {
  return getPublishedBlogPosts(locale).find((post) => getBlogTranslation(post, locale)?.slug === slug);
}

function ensureUniqueLocaleSlug(posts: any[], locale: Locale, baseSlug: string, currentId = "") {
  let slug = baseSlug;
  let count = 2;
  while (
    posts.some((post) => {
      if (post.id === currentId) return false;
      return getBlogTranslation(post, locale)?.slug === slug;
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }
  return slug;
}

function buildBlogTranslations(fields: Record<string, string>, posts: any[], currentId = "") {
  const enTitle = fields.title?.trim();
  const enContent = fields.content?.trim();
  const enSlug = ensureUniqueLocaleSlug(posts, "en", slugify(fields.slug || enTitle), currentId);
  const translations: Record<Locale, BlogTranslation> = {
    en: {
      title: enTitle,
      slug: enSlug,
      excerpt: getBlogExcerpt(enContent, fields.excerpt),
      content: fields.content,
      status: fields.status || "published",
    },
    ja: {},
    zh: {},
  };

  for (const locale of ["ja", "zh"] as Locale[]) {
    const title = fields[`${locale}Title`]?.trim();
    const content = fields[`${locale}Content`]?.trim();
    const existingSlug = fields[`${locale}Slug`]?.trim();
    if (!title && !content && !existingSlug) continue;
    const slug = ensureUniqueLocaleSlug(posts, locale, slugify(existingSlug || enSlug), currentId);
    translations[locale] = {
      title,
      slug,
      excerpt: getBlogExcerpt(content, fields[`${locale}Excerpt`]),
      content: fields[`${locale}Content`] || "",
      status: fields[`${locale}Status`] === "published" ? "published" : "draft",
    };
  }

  return { translations, enSlug };
}

function extractResponsesText(data: any) {
  if (typeof data.output_text === "string") return data.output_text;
  const parts: string[] = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n");
}

function extractChatCompletionText(data: any) {
  return String(data.choices?.[0]?.message?.content || "");
}

function stripJsonCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseTranslationJson(text: string) {
  try {
    return JSON.parse(stripJsonCodeFence(text));
  } catch {
    throw new Error("AI translation response was not valid JSON.");
  }
}

function getJsonTranslationSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["ja", "zh"],
    properties: {
      ja: {
        type: "object",
        additionalProperties: false,
        required: ["title", "excerpt", "content"],
        properties: {
          title: { type: "string" },
          excerpt: { type: "string" },
          content: { type: "string" },
        },
      },
      zh: {
        type: "object",
        additionalProperties: false,
        required: ["title", "excerpt", "content"],
        properties: {
          title: { type: "string" },
          excerpt: { type: "string" },
          content: { type: "string" },
        },
      },
    },
  };
}

function getTranslationProviderConfig() {
  const provider = (process.env.AI_TRANSLATION_PROVIDER || "").trim() || (process.env.AI_TRANSLATION_BASE_URL || process.env.AI_TRANSLATION_ENDPOINT ? "openai-compatible" : "openai-responses");
  const apiKey = process.env.AI_TRANSLATION_API_KEY || process.env.OPENAI_API_KEY || "";
  const model = process.env.AI_TRANSLATION_MODEL || process.env.OPENAI_TRANSLATION_MODEL || "";
  const baseUrl = (process.env.AI_TRANSLATION_BASE_URL || "").replace(/\/+$/, "");
  const endpoint = process.env.AI_TRANSLATION_ENDPOINT || "";
  const includeResponseFormat = process.env.AI_TRANSLATION_RESPONSE_FORMAT !== "false";

  if (!apiKey) throw new Error("AI_TRANSLATION_API_KEY is required to generate translations.");
  if (!model) throw new Error("AI_TRANSLATION_MODEL is required to generate translations.");

  return { provider, apiKey, model, baseUrl, endpoint, includeResponseFormat };
}

async function generateBlogTranslationDrafts(post: any) {
  const en = getAdminBlogTranslation(post, "en");
  if (!en.title || !en.content) throw new Error("English title and content are required before generating translations.");

  const config = getTranslationProviderConfig();
  const systemPrompt =
    "Translate precision manufacturing blog content from English into Japanese and Simplified Chinese. Preserve Markdown structure, technical terms, numbers, units, and links. Return only valid JSON with keys ja and zh. Each language must include title, excerpt, and content.";
  const userPayload = JSON.stringify({
    source: {
      title: en.title,
      slug: en.slug,
      excerpt: en.excerpt || "",
      content: en.content,
    },
    output_schema: {
      ja: { title: "string", excerpt: "string", content: "markdown string" },
      zh: { title: "string", excerpt: "string", content: "markdown string" },
    },
  });

  if (config.provider === "openai-responses") {
    const response = await fetch(config.endpoint || "https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        input: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPayload,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "blog_translations",
            schema: getJsonTranslationSchema(),
          },
        },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error?.message || `AI translation failed with status ${response.status}.`);
    }

    return parseTranslationJson(extractResponsesText(data));
  }

  if (config.provider !== "openai-compatible") {
    throw new Error(`Unsupported AI_TRANSLATION_PROVIDER: ${config.provider}. Use "openai-responses" or "openai-compatible".`);
  }

  const chatEndpoint = config.endpoint || `${config.baseUrl || "https://api.openai.com/v1"}/chat/completions`;
  const body: any = {
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPayload },
    ],
    temperature: 0.2,
  };
  if (config.includeResponseFormat) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(chatEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `AI translation failed with status ${response.status}.`);
  }

  return parseTranslationJson(extractChatCompletionText(data));
}

function serializePublicData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getBuiltAssetTags(distPath: string) {
  const indexPath = path.join(distPath, "index.html");
  if (!fs.existsSync(indexPath)) return "";

  const html = fs.readFileSync(indexPath, "utf8");
  return (
    html.match(/<script\b[^>]*\bsrc="\/assets\/[^"]+"[^>]*><\/script>|<link\b[^>]*\bhref="\/assets\/[^"]+"[^>]*>/g) || []
  ).join("\n");
}

const publicCopy = {
  en: {
    nav: ["Home", "About Us", "Capabilities", "Quality", "Blog", "Contact Us"],
    cta: "UPLOAD DRAWINGS & RFQ",
    blogTitle: "Technical Blog",
    blogDescription: "Insights on precision machining, quality control, and engineering best practices.",
    empty: "No blog posts have been published yet.",
    notFound: "Post Not Found",
    notFoundBody: "The article you're looking for doesn't exist or has been removed.",
    back: "Back to Blog",
    footer: "Precision Machining with Japanese Quality Discipline. We help engineers reduce sourcing complexity and control machining quality from prototype to batch production.",
    quickLinks: "Quick Links",
    quality: "Quality Control",
    technicalBlog: "Technical Blog",
    contact: "Contact Us",
  },
  ja: {
    nav: ["ホーム", "会社概要", "加工能力", "品質管理", "ブログ", "お問い合わせ"],
    cta: "図面アップロード・見積依頼",
    blogTitle: "技術ブログ",
    blogDescription: "精密加工、品質管理、エンジニアリングの実務に関する情報を発信します。",
    empty: "公開済みの記事はまだありません。",
    notFound: "記事が見つかりません",
    notFoundBody: "お探しの記事は存在しないか、削除されています。",
    back: "ブログへ戻る",
    footer: "日本品質の管理思想と深センの製造スピードで、試作から量産まで調達負担を減らし、加工品質を安定させます。",
    quickLinks: "クイックリンク",
    quality: "品質管理",
    technicalBlog: "技術ブログ",
    contact: "お問い合わせ",
  },
  zh: {
    nav: ["首页", "关于我们", "加工能力", "品质管理", "博客", "联系我们"],
    cta: "上传图纸并询价",
    blogTitle: "技术博客",
    blogDescription: "关于精密加工、品质控制和工程实践的经验分享。",
    empty: "目前还没有已发布的博客文章。",
    notFound: "文章未找到",
    notFoundBody: "您查找的文章不存在或已被移除。",
    back: "返回博客",
    footer: "以日本品质管理标准结合深圳制造速度，帮助工程团队降低采购复杂度，从样件到批量生产稳定控制加工品质。",
    quickLinks: "快速链接",
    quality: "品质管理",
    technicalBlog: "技术博客",
    contact: "联系我们",
  },
};

function renderPublicHeader(active = "", locale: Locale = "en") {
  const copy = publicCopy[locale];
  const nav = [
    { href: localizedPath("/", locale), label: copy.nav[0], id: "home" },
    { href: localizedPath("/about", locale), label: copy.nav[1], id: "about" },
    { href: localizedPath("/capabilities", locale), label: copy.nav[2], id: "capabilities" },
    { href: localizedPath("/quality", locale), label: copy.nav[3], id: "quality" },
    { href: localizedPath("/blog", locale), label: copy.nav[4], id: "blog" },
    { href: localizedPath("/contact", locale), label: copy.nav[5], id: "contact" },
  ];

  return `<header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
    <div class="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
      <div class="flex bg-transparent h-20 items-center justify-between">
        <div class="flex-shrink-0 flex items-center gap-2">
          <a class="flex items-center gap-2" href="${localizedPath("/", locale)}">
            <span class="font-extrabold italic text-blue-700 text-[28px] tracking-tighter pr-1">HY</span>
            <div class="flex flex-col justify-center border-l-2 border-slate-200 pl-3 leading-none">
              <span class="font-black text-[22px] text-slate-900 tracking-wide mb-1">HONGYUAN</span>
              <span class="font-bold text-[10px] text-slate-500 tracking-[0.25em]">PRECISION</span>
            </div>
          </a>
        </div>
        <nav class="hidden md:flex items-center gap-4 lg:gap-8">
          ${nav
            .map(
              (item) =>
                `<a class="text-sm font-medium transition-colors hover:text-accent relative py-2 whitespace-nowrap ${
                  active === item.id ? "text-accent" : "text-gray-600"
                }" href="${item.href}">${item.label}${active === item.id ? '<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>' : ""}</a>`
            )
            .join("")}
        </nav>
        <div class="hidden md:block">
          <a class="bg-blue-700 text-white px-4 lg:px-6 py-2.5 text-xs lg:text-sm font-semibold rounded-sm shadow-sm hover:bg-blue-800 transition-colors whitespace-nowrap" href="${localizedPath("/contact", locale)}">${escapeHtml(copy.cta)}</a>
        </div>
      </div>
    </div>
  </header>`;
}

function renderPublicFooter(locale: Locale = "en") {
  const copy = publicCopy[locale];
  return `<footer class="bg-slate-900 text-slate-300">
    <div class="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div class="space-y-6">
          <a class="flex items-center gap-2" href="${localizedPath("/", locale)}">
            <span class="font-extrabold italic text-blue-500 text-[28px] tracking-tighter pr-1">HY</span>
            <div class="flex flex-col justify-center border-l-2 border-slate-700 pl-3 leading-none">
              <span class="font-black text-[22px] text-white tracking-wide mb-1">HONGYUAN</span>
              <span class="font-bold text-[10px] text-slate-400 tracking-[0.25em]">PRECISION</span>
            </div>
          </a>
          <p class="text-sm leading-relaxed text-slate-400">${escapeHtml(copy.footer)}</p>
        </div>
        <div>
          <h3 class="text-white font-sans font-bold tracking-wider uppercase mb-6 text-sm">${escapeHtml(copy.quickLinks)}</h3>
          <ul class="space-y-4">
            <li><a class="text-sm hover:text-white transition-colors" href="${localizedPath("/about", locale)}">${escapeHtml(copy.nav[1])}</a></li>
            <li><a class="text-sm hover:text-white transition-colors" href="${localizedPath("/capabilities", locale)}">${escapeHtml(copy.nav[2])}</a></li>
            <li><a class="text-sm hover:text-white transition-colors" href="${localizedPath("/quality", locale)}">${escapeHtml(copy.quality)}</a></li>
            <li><a class="text-sm hover:text-white transition-colors" href="${localizedPath("/blog", locale)}">${escapeHtml(copy.technicalBlog)}</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-sans font-bold tracking-wider uppercase mb-6 text-sm">Capabilities</h3>
          <ul class="space-y-4">
            <li class="text-sm text-slate-400">CNC Milling</li>
            <li class="text-sm text-slate-400">CNC Turning</li>
            <li class="text-sm text-slate-400">Precision Grinding</li>
            <li class="text-sm text-slate-400">EDM &amp; Wire Cut</li>
            <li class="text-sm text-slate-400">Surface Finishing</li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-sans font-bold tracking-wider uppercase mb-6 text-sm">${escapeHtml(copy.contact)}</h3>
          <ul class="space-y-4">
            <li><a href="mailto:lynn.lee@hongyuan-precision.com" class="text-sm hover:text-white transition-colors">lynn.lee@hongyuan-precision.com</a></li>
            <li class="text-sm">0086-755-23059684 (Tel)</li>
            <li class="text-sm">Shajing, Bao'an District<br>Shenzhen City, China</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderPublicShell({
  distPath,
  title,
  description,
  body,
  blogInitialData,
  locale = "en",
  status = 200,
}: {
  distPath: string;
  title: string;
  description: string;
  body: string;
  blogInitialData: unknown;
  locale?: Locale;
  status?: number;
}) {
  return {
    status,
    html: `<!doctype html>
      <html lang="${locale}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${escapeHtml(title)}</title>
          <meta name="description" content="${escapeHtml(description)}">
          <meta property="og:title" content="${escapeHtml(title)}">
          <meta property="og:description" content="${escapeHtml(description)}">
          <meta property="og:type" content="website">
          <meta name="twitter:card" content="summary_large_image">
          ${getBuiltAssetTags(distPath)}
        </head>
        <body>
          <div id="root">${body}</div>
          <script>window.__BLOG_INITIAL_DATA__=${serializePublicData(blogInitialData)};</script>
        </body>
      </html>`,
  };
}

function renderDynamicBlogIndex(distPath: string, locale: Locale = "en") {
  const copy = publicCopy[locale];
  const posts = getPublishedBlogPosts(locale);
  const summaries = posts.map((post) => getPublicBlogSummary(post, locale));
  const cards = summaries.length
    ? summaries
        .map(
          (post) => `<a class="group block" href="${localizedPath(`/blog/${post.slug}`, locale)}">
            <div class="rounded-lg overflow-hidden mb-4 border border-gray-200 bg-white">
              <img src="${escapeHtml(post.img || "/home-banner.jpg")}" alt="${escapeHtml(post.title)}" class="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <h2 class="text-[15px] font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">${escapeHtml(post.title)}</h2>
            <div class="text-xs text-slate-500">${escapeHtml(formatPublicDate(post.date, "short", locale))}</div>
            ${post.excerpt ? `<p class="mt-3 text-xs text-slate-600 leading-relaxed">${escapeHtml(post.excerpt)}</p>` : ""}
          </a>`
        )
        .join("")
    : `<div class="bg-white border border-gray-200 p-12 text-center text-slate-600">${escapeHtml(copy.empty)}</div>`;

  const body = `<div class="min-h-screen flex flex-col bg-primary-50">
    ${renderPublicHeader("blog", locale)}
    <main class="flex-grow flex flex-col">
      <div class="bg-white">
        <section class="bg-primary-900 border-b border-gray-200 py-16">
          <div class="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl font-display font-bold text-white mb-4">${escapeHtml(copy.blogTitle)}</h1>
            <p class="text-xl text-gray-400 max-w-2xl">${escapeHtml(copy.blogDescription)}</p>
          </div>
        </section>
        <section class="py-24 bg-slate-50 min-h-[600px]">
          <div class="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">${cards}</div>
          </div>
        </section>
      </div>
    </main>
    ${renderPublicFooter(locale)}
  </div>`;

  return renderPublicShell({
    distPath,
    title: `${copy.blogTitle} | Precision Machining Solutions`,
    description: copy.blogDescription,
    body,
    blogInitialData: { posts: summaries },
    locale,
  });
}

function renderDynamicBlogPost(distPath: string, slug: string, locale: Locale = "en") {
  const copy = publicCopy[locale];
  const posts = getPublishedBlogPosts(locale);
  const post = findPublishedBlogPostBySlug(slug, locale);
  const summaries = posts.map((item) => getPublicBlogSummary(item, locale));

  if (!post) {
    const body = `<div class="min-h-screen flex flex-col bg-primary-50">
      ${renderPublicHeader("blog", locale)}
      <main class="flex-grow flex flex-col">
        <div class="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-white">
          <h1 class="text-3xl font-bold text-slate-900 mb-4">${escapeHtml(copy.notFound)}</h1>
          <p class="text-slate-600 mb-8">${escapeHtml(copy.notFoundBody)}</p>
          <a href="${localizedPath("/blog", locale)}" class="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800">${escapeHtml(copy.back)}</a>
        </div>
      </main>
      ${renderPublicFooter(locale)}
    </div>`;
    return renderPublicShell({
      distPath,
      title: "Post Not Found | Precision Machining Solutions",
      description: "The requested blog post was not found.",
      body,
      blogInitialData: { posts: summaries, post: null },
      locale,
      status: 404,
    });
  }

  const publicPost = getPublicBlogPost(post, locale);
  const description = publicPost.excerpt || "Read about precision manufacturing, CNC machining and insights.";
  const body = `<div class="min-h-screen flex flex-col bg-primary-50">
    ${renderPublicHeader("blog", locale)}
    <main class="flex-grow flex flex-col">
      <div class="pt-24 pb-24 bg-white">
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="${localizedPath("/blog", locale)}" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-700 mb-8 transition-colors">${escapeHtml(copy.back)}</a>
          ${
            publicPost.img
              ? `<img src="${escapeHtml(publicPost.img)}" alt="${escapeHtml(publicPost.title)}" class="w-full h-auto max-h-[500px] object-cover rounded-xl mb-10">`
              : ""
          }
          <header class="mb-10">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">${escapeHtml(publicPost.title)}</h1>
            <div class="flex items-center gap-4 text-slate-500 text-sm">
              <time datetime="${escapeHtml(publicPost.date)}">${escapeHtml(formatPublicDate(publicPost.date, "long", locale))}</time>
            </div>
          </header>
          <div class="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-700 hover:prose-a:text-blue-800 prose-img:rounded-xl">
            ${publicPost.contentHtml}
          </div>
        </article>
      </div>
    </main>
    ${renderPublicFooter(locale)}
  </div>`;

  return renderPublicShell({
    distPath,
    title: `${publicPost.title} - Hongyuan Precision | Precision Machining Solutions`,
    description,
    body,
    blogInitialData: { posts: summaries, post: publicPost },
    locale,
  });
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
  const en = getAdminBlogTranslation(post, "en");
  const ja = getAdminBlogTranslation(post, "ja");
  const zh = getAdminBlogTranslation(post, "zh");
  const error = post.formError ? `<div class="empty" style="border-color:#fecaca;background:#fef2f2;color:#991b1b">${escapeHtml(post.formError)}</div>` : "";
  const translateAction = post.id
      ? `<form method="post" action="/admin/blog/${escapeHtml(post.id)}/translate" style="margin:0 0 16px 0">
        <button class="button secondary" type="submit">Generate JA/ZH Drafts</button>
        <span class="help">Uses the configured AI translation provider. Generated translations are saved as drafts.</span>
      </form>`
    : "";
  return `<form class="card form-grid" method="post" action="${action}" enctype="multipart/form-data">
    ${error}
    ${translateAction}
    <h3 style="margin:0;color:#0f172a">English Source</h3>
    <div>
      <label for="title">Title</label>
      <input id="title" name="title" value="${escapeHtml(en.title || post.title || "")}" required>
    </div>
    <div>
      <label for="slug">Slug</label>
      <input id="slug" name="slug" value="${escapeHtml(en.slug || post.slug || "")}" placeholder="auto-generated-from-title">
      <div class="help">Lowercase URL path, for example: cnc-machining-tolerance-control</div>
    </div>
    <div>
      <label for="status">English Status</label>
      <select id="status" name="status">
        <option value="published" ${(en.status || post.status || "published") !== "draft" ? "selected" : ""}>Published</option>
        <option value="draft" ${(en.status || post.status) === "draft" ? "selected" : ""}>Draft</option>
      </select>
    </div>
    <div>
      <label for="date">Date</label>
      <input id="date" name="date" type="date" value="${escapeHtml(formatDate(post.date || new Date().toISOString()))}">
    </div>
    <div>
      <label for="excerpt">Excerpt</label>
      <textarea id="excerpt" name="excerpt" style="min-height:90px;font-family:Arial,sans-serif">${escapeHtml(en.excerpt || post.excerpt || "")}</textarea>
    </div>
    <div>
      <label for="cover">Cover Image</label>
      <input id="cover" name="cover" type="file" accept=".jpg,.jpeg,.png,.webp,.gif">
      ${post.coverImage ? `<div class="help">Current: <a href="${escapeHtml(post.coverImage)}" target="_blank">${escapeHtml(post.coverImage)}</a></div>` : ""}
    </div>
    <div>
      <label for="content">Markdown Content</label>
      <textarea id="content" name="content" required>${escapeHtml(en.content || post.content || "")}</textarea>
      <div class="help">Supports headings (#), bullet lists, **bold**, *italic*, links, and paragraphs.</div>
    </div>
    ${renderTranslationFields("ja", "Japanese", ja)}
    ${renderTranslationFields("zh", "Chinese", zh)}
    <div class="actions">
      <button class="button" type="submit">Save Post</button>
      <a class="button secondary" href="/admin/blog">Cancel</a>
    </div>
  </form>`;
}

function renderTranslationFields(locale: Locale, label: string, translation: BlogTranslation) {
  return `<fieldset style="border:1px solid #dbe3ef;padding:16px;margin:8px 0">
    <legend style="padding:0 8px;font-weight:700;color:#0f172a">${label} Translation</legend>
    <div class="form-grid" style="box-shadow:none;border:0;padding:0">
      <div>
        <label for="${locale}Title">Title</label>
        <input id="${locale}Title" name="${locale}Title" value="${escapeHtml(translation.title || "")}">
      </div>
      <div>
        <label for="${locale}Slug">Slug</label>
        <input id="${locale}Slug" name="${locale}Slug" value="${escapeHtml(translation.slug || "")}" placeholder="can reuse English slug">
      </div>
      <div>
        <label for="${locale}Status">Status</label>
        <select id="${locale}Status" name="${locale}Status">
          <option value="draft" ${translation.status !== "published" ? "selected" : ""}>Draft</option>
          <option value="published" ${translation.status === "published" ? "selected" : ""}>Published</option>
        </select>
      </div>
      <div>
        <label for="${locale}Excerpt">Excerpt</label>
        <textarea id="${locale}Excerpt" name="${locale}Excerpt" style="min-height:90px;font-family:Arial,sans-serif">${escapeHtml(translation.excerpt || "")}</textarea>
      </div>
      <div>
        <label for="${locale}Content">Markdown Content</label>
        <textarea id="${locale}Content" name="${locale}Content">${escapeHtml(translation.content || "")}</textarea>
      </div>
    </div>
  </fieldset>`;
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
    const locale = normalizeLocale(req.query.lang);
    res.json(getPublishedBlogPosts(locale).map((post) => getPublicBlogSummary(post, locale)));
  });

  app.get("/api/blog/posts/:slug", (req, res) => {
    const locale = normalizeLocale(req.query.lang);
    const post = findPublishedBlogPostBySlug(req.params.slug, locale);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(getPublicBlogPost(post, locale));
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
        (post) => {
          const en = getAdminBlogTranslation(post, "en");
          const ja = getAdminBlogTranslation(post, "ja");
          const zh = getAdminBlogTranslation(post, "zh");
          return `<tr>
          <td>${post.coverImage ? `<img src="${escapeHtml(post.coverImage)}" alt="" style="width:88px;height:56px;object-fit:cover">` : ""}</td>
          <td><strong>${escapeHtml(en.title || post.title || "")}</strong><br><span>/blog/${escapeHtml(en.slug || post.slug || "")}</span></td>
          <td>${escapeHtml(post.date)}</td>
          <td>EN: ${escapeHtml(en.status || post.status || "published")}<br>JA: ${escapeHtml(ja.status || "missing")}<br>ZH: ${escapeHtml(zh.status || "missing")}</td>
          <td class="actions">
            <a class="button secondary" href="/admin/blog/${post.id}/edit">Edit</a>
            <form method="post" action="/admin/blog/${post.id}/delete" onsubmit="return confirm('Delete this post?')" style="margin:0">
              <button class="button danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>`;
        }
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
      const { translations, enSlug } = buildBlogTranslations(fields, posts);

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
        slug: enSlug,
        date: formatDate(fields.date),
        excerpt: translations.en.excerpt,
        content: fields.content,
        coverImage,
        status: translations.en.status || "published",
        translations,
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

      const { translations, enSlug } = buildBlogTranslations(fields, posts, req.params.id);

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
        slug: enSlug,
        date: formatDate(fields.date),
        excerpt: translations.en.excerpt,
        content: fields.content,
        status: translations.en.status || "published",
        translations,
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

  app.post("/admin/blog/:id/translate", async (req, res) => {
    if (!requireAdmin(req, res)) return;

    const posts = readBlogPosts();
    const index = posts.findIndex((item) => item.id === req.params.id);
    if (index < 0) {
      res.status(404).type("html").send(renderAdminLayout("Post Not Found", "blog", '<div class="empty">Post not found.</div>'));
      return;
    }

    try {
      const drafts = await generateBlogTranslationDrafts(posts[index]);
      const en = getAdminBlogTranslation(posts[index], "en");
      const existingTranslations = posts[index].translations || {};
      posts[index] = {
        ...posts[index],
        translations: {
          ...existingTranslations,
          en,
          ja: {
            title: drafts.ja?.title || "",
            slug: existingTranslations.ja?.slug || en.slug || posts[index].slug,
            excerpt: drafts.ja?.excerpt || "",
            content: drafts.ja?.content || "",
            status: "draft",
          },
          zh: {
            title: drafts.zh?.title || "",
            slug: existingTranslations.zh?.slug || en.slug || posts[index].slug,
            excerpt: drafts.zh?.excerpt || "",
            content: drafts.zh?.content || "",
            status: "draft",
          },
        },
        updatedAt: new Date().toISOString(),
      };
      writeBlogPosts(posts);
      res.redirect(`/admin/blog/${req.params.id}/edit`);
    } catch (error: any) {
      const post = { ...posts[index], formError: error.message || "Failed to generate translation drafts." };
      res
        .status(500)
        .type("html")
        .send(renderAdminLayout("Edit Blog Post", "blog", renderBlogForm(post, `/admin/blog/${post.id}/edit`)));
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

    app.get("/blog", (req, res) => {
      const rendered = renderDynamicBlogIndex(distPath, "en");
      res.status(rendered.status).type("html").send(rendered.html);
    });

    app.get("/:locale/blog", (req, res, next) => {
      if (!locales.includes(req.params.locale as Locale)) {
        next();
        return;
      }
      const rendered = renderDynamicBlogIndex(distPath, normalizeLocale(req.params.locale));
      res.status(rendered.status).type("html").send(rendered.html);
    });

    app.get("/blog/:slug", (req, res) => {
      const rendered = renderDynamicBlogPost(distPath, req.params.slug, "en");
      res.status(rendered.status).type("html").send(rendered.html);
    });

    app.get("/:locale/blog/:slug", (req, res, next) => {
      if (!locales.includes(req.params.locale as Locale)) {
        next();
        return;
      }
      const rendered = renderDynamicBlogPost(distPath, req.params.slug, normalizeLocale(req.params.locale));
      res.status(rendered.status).type("html").send(rendered.html);
    });

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
