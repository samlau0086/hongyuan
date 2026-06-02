import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
}

export default function SEO({ title, description, keywords }: SEOProps) {
  const siteName = "Precision Machining Solutions";
  const defaultTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{defaultTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
