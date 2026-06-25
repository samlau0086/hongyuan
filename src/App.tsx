import React from 'react';
import { BrowserRouter as Router, MemoryRouter as PrerenderMemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Capabilities from './pages/Capabilities';
import Quality from './pages/Quality';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import { BlogInitialData, BlogInitialDataProvider, getBrowserBlogInitialData } from './blogInitialData';
import { LocaleProvider } from './i18n';

export { PrerenderMemoryRouter };

export function AppRoutes() {
  return (
    <LocaleProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/en" element={<Home />} />
          <Route path="/ja" element={<Home />} />
          <Route path="/zh" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/en/about" element={<About />} />
          <Route path="/ja/about" element={<About />} />
          <Route path="/zh/about" element={<About />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/en/capabilities" element={<Capabilities />} />
          <Route path="/ja/capabilities" element={<Capabilities />} />
          <Route path="/zh/capabilities" element={<Capabilities />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/en/quality" element={<Quality />} />
          <Route path="/ja/quality" element={<Quality />} />
          <Route path="/zh/quality" element={<Quality />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/en/blog" element={<Blog />} />
          <Route path="/ja/blog" element={<Blog />} />
          <Route path="/zh/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/en/blog/:slug" element={<BlogPost />} />
          <Route path="/ja/blog/:slug" element={<BlogPost />} />
          <Route path="/zh/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/en/contact" element={<Contact />} />
          <Route path="/ja/contact" element={<Contact />} />
          <Route path="/zh/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </LocaleProvider>
  );
}

export function AppProviders({
  children,
  blogInitialData,
  helmetContext,
}: {
  children: React.ReactNode;
  blogInitialData?: BlogInitialData;
  helmetContext?: Record<string, unknown>;
}) {
  return (
    <HelmetProvider context={helmetContext}>
      <BlogInitialDataProvider value={blogInitialData}>
        {children}
      </BlogInitialDataProvider>
    </HelmetProvider>
  );
}

export default function App() {
  return (
    <AppProviders blogInitialData={getBrowserBlogInitialData()}>
      <Router>
        <AppRoutes />
      </Router>
    </AppProviders>
  );
}

