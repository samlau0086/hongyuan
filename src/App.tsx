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

export { PrerenderMemoryRouter };

export function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
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

