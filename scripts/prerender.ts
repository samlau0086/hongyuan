import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

type StoredPost = {
  id?: string;
  title?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
  coverImage?: string;
  content?: string;
  status?: string;
};

type BlogSummary = {
  id?: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  img?: string;
};

type BlogPostData = BlogSummary & {
  content?: string;
  contentHtml?: string;
};

type BlogInitialData = {
  posts?: BlogSummary[];
  post?: BlogPostData | null;
};

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');
const blogDataDir = process.env.BLOG_DATA_DIR || path.join(rootDir, 'data', 'blog');
const blogPostsPath = path.join(blogDataDir, 'posts.json');

const staticRoutes = ['/', '/about', '/capabilities', '/quality', '/contact', '/blog'];

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(markdown: string) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let paragraph: string[] = [];
  let listOpen = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listOpen) {
      html.push('</ul>');
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
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(listItem[1])}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  return html.join('\n');
}

function readBlogPosts(): StoredPost[] {
  if (!fs.existsSync(blogPostsPath)) return [];

  try {
    const posts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.warn(`Failed to read blog posts from ${blogPostsPath}:`, error);
    return [];
  }
}

function getPublishedPosts() {
  return readBlogPosts()
    .filter((post) => post.status !== 'draft' && post.title && post.slug)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

function toSummary(post: StoredPost): BlogSummary {
  return {
    id: post.id,
    title: String(post.title || ''),
    slug: String(post.slug || ''),
    date: String(post.date || new Date().toISOString()),
    excerpt: post.excerpt,
    img: post.coverImage || '',
  };
}

function toPostData(post: StoredPost): BlogPostData {
  return {
    ...toSummary(post),
    content: post.content || '',
    contentHtml: markdownToHtml(post.content || ''),
  };
}

function serializeData(data: BlogInitialData) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function routeToOutputPath(route: string) {
  if (route === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, route.replace(/^\/+|\/+$/g, ''), 'index.html');
}

function renderRoute(
  template: string,
  route: string,
  blogInitialData: BlogInitialData,
  AppProviders: React.ComponentType<any>,
  AppRoutes: React.ComponentType,
  MemoryRouterComponent: React.ComponentType<any>,
) {
  const helmetContext: Record<string, any> = {};
  const appHtml = renderToString(
    React.createElement(
      AppProviders,
      { blogInitialData, helmetContext },
      React.createElement(
        MemoryRouterComponent,
        { initialEntries: [route] },
        React.createElement(AppRoutes),
      ),
    ),
  );

  const helmet = helmetContext.helmet;
  const headTagPattern = /<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>/g;
  const appHeadTags = appHtml.match(headTagPattern) || [];
  const bodyHtml = appHtml.replace(headTagPattern, '');
  const headTags = [
    helmet?.title?.toString() || '',
    helmet?.meta?.toString() || '',
    helmet?.link?.toString() || '',
    ...appHeadTags,
  ].join('\n');

  const dataScript = `<script>window.__BLOG_INITIAL_DATA__=${serializeData(blogInitialData)};</script>`;

  return template
    .replace(/<title>.*?<\/title>/s, '')
    .replace('</head>', `${headTags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>\n${dataScript}`);
}

function writeRoute(route: string, html: string) {
  const outputPath = routeToOutputPath(route);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log(`Prerendered ${route} -> ${path.relative(rootDir, outputPath)}`);
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`Missing build template: ${templatePath}. Run vite build before prerender.`);
}

const template = fs.readFileSync(templatePath, 'utf8');
const publishedPosts = getPublishedPosts();
const summaries = publishedPosts.map(toSummary);
const baseBlogData: BlogInitialData = { posts: summaries };

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const { AppProviders, AppRoutes, PrerenderMemoryRouter } = await vite.ssrLoadModule('/src/App.tsx');

  for (const route of staticRoutes) {
    writeRoute(route, renderRoute(template, route, baseBlogData, AppProviders, AppRoutes, PrerenderMemoryRouter));
  }

  for (const post of publishedPosts) {
    const route = `/blog/${post.slug}`;
    writeRoute(
      route,
      renderRoute(
        template,
        route,
        { posts: summaries, post: toPostData(post) },
        AppProviders,
        AppRoutes,
        PrerenderMemoryRouter,
      ),
    );
  }
} finally {
  await vite.close();
}
