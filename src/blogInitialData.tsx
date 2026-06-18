import React, { createContext, useContext } from 'react';

export type BlogSummary = {
  id?: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  img?: string;
};

export type BlogPostData = BlogSummary & {
  content?: string;
  contentHtml?: string;
};

export type BlogInitialData = {
  posts?: BlogSummary[];
  post?: BlogPostData | null;
};

const BlogInitialDataContext = createContext<BlogInitialData>({});

export function BlogInitialDataProvider({
  value,
  children,
}: {
  value?: BlogInitialData;
  children: React.ReactNode;
}) {
  return (
    <BlogInitialDataContext.Provider value={value || {}}>
      {children}
    </BlogInitialDataContext.Provider>
  );
}

export function useBlogInitialData() {
  return useContext(BlogInitialDataContext);
}

export function getBrowserBlogInitialData(): BlogInitialData {
  if (typeof window === 'undefined') return {};
  return window.__BLOG_INITIAL_DATA__ || {};
}

declare global {
  interface Window {
    __BLOG_INITIAL_DATA__?: BlogInitialData;
  }
}
