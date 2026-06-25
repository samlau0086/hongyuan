import React from 'react';
import { Helmet } from 'react-helmet-async';
import { locales, localizedPath, useLocale, useSiteCopy } from '../i18n';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
}

export default function SEO({ title, description, keywords }: SEOProps) {
  const { locale, barePath } = useLocale();
  const copy = useSiteCopy();
  const siteName = copy.seoSiteName;
  const defaultTitle = `${title} | ${siteName}`;
  const siteUrl = (((import.meta as any).env?.VITE_SITE_URL as string | undefined) || 'https://hongyuan-precision.com').replace(/\/+$/, '');
  const canonicalPath = localizedPath(barePath, locale);
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return (
    <Helmet>
      <html lang={locale} />
      <title>{defaultTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {locales.map((item) => (
        <link key={item} rel="alternate" hrefLang={item} href={`${siteUrl}${localizedPath(barePath, item)}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${localizedPath(barePath, 'en')}`} />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
