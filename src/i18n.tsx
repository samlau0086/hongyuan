import React, { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

export const locales = ['en', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

const localeSet = new Set<string>(locales);

export function isLocale(value: string | undefined): value is Locale {
  return !!value && localeSet.has(value);
}

export function parseLocalizedPath(pathname: string): { locale: Locale; barePath: string; hasLocalePrefix: boolean } {
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0];
  const hasLocalePrefix = isLocale(first);
  const locale = hasLocalePrefix ? first : 'en';
  const barePath = hasLocalePrefix ? `/${parts.slice(1).join('/')}` : pathname;

  return {
    locale,
    barePath: barePath === '/' || barePath === '' ? '/' : barePath.replace(/\/+$/, ''),
    hasLocalePrefix,
  };
}

export function localizedPath(path: string, locale: Locale) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return normalized === '/' ? '/en' : `/en${normalized}`;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

export function localizedBlogPostPath(slug: string, locale: Locale) {
  return localizedPath(`/blog/${slug}`, locale);
}

type LocaleContextValue = {
  locale: Locale;
  barePath: string;
  localizedPath: (path: string, localeOverride?: Locale) => string;
  switchPath: (locale: Locale) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  barePath: '/',
  localizedPath: (path, locale: Locale = 'en') => localizedPath(path, locale),
  switchPath: (locale) => localizedPath('/', locale),
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const parsed = parseLocalizedPath(location.pathname);
  const value: LocaleContextValue = {
    locale: parsed.locale,
    barePath: parsed.barePath,
    localizedPath: (path, localeOverride) => localizedPath(path, localeOverride || parsed.locale),
    switchPath: (locale) => {
      const next = localizedPath(parsed.barePath, locale);
      return `${next}${location.search}${location.hash}`;
    },
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export const siteCopy = {
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      capabilities: 'Capabilities',
      quality: 'Quality',
      blog: 'Blog',
      contact: 'Contact Us',
      cta: 'UPLOAD DRAWINGS & RFQ',
      mobileCta: 'Request Quote',
      menu: 'Open main menu',
    },
    seoSiteName: 'Precision Machining Solutions',
    footer: {
      intro:
        'Precision Machining with Japanese Quality Discipline. We help engineers reduce sourcing complexity and control machining quality from prototype to batch production.',
      quickLinks: 'Quick Links',
      capabilities: 'Capabilities',
      contact: 'Contact Us',
      qualityControl: 'Quality Control',
      technicalBlog: 'Technical Blog',
      productionOnline: 'Production Online',
      industriesServed: 'Industries Served:',
      industries: ['AUTOMOTIVE', 'SEMICONDUCTOR', 'AUTOMATION', 'FOOD MACHINERY', 'INDUSTRIAL EQUIPMENT'],
    },
    blog: {
      title: 'Technical Blog',
      description: 'Insights on precision machining, quality control, and engineering best practices.',
      empty: 'No blog posts have been published yet.',
      loadIssue: 'Blog Load Issue:',
      notFound: 'Post Not Found',
      notFoundBody: "The article you're looking for doesn't exist or has been removed.",
      back: 'Back to Blog',
      fallbackDescription: 'Read about precision manufacturing, CNC machining and insights.',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      about: '会社概要',
      capabilities: '加工能力',
      quality: '品質管理',
      blog: 'ブログ',
      contact: 'お問い合わせ',
      cta: '図面アップロード・見積依頼',
      mobileCta: '見積依頼',
      menu: 'メニューを開く',
    },
    seoSiteName: '精密加工ソリューション',
    footer: {
      intro:
        '日本品質の管理思想と深センの製造スピードで、試作から量産まで調達負担を減らし、加工品質を安定させます。',
      quickLinks: 'クイックリンク',
      capabilities: '加工能力',
      contact: 'お問い合わせ',
      qualityControl: '品質管理',
      technicalBlog: '技術ブログ',
      productionOnline: '生産対応中',
      industriesServed: '対応業界:',
      industries: ['自動車', '半導体', '自動化', '食品機械', '産業設備'],
    },
    blog: {
      title: '技術ブログ',
      description: '精密加工、品質管理、エンジニアリングの実務に関する情報を発信します。',
      empty: '公開済みの記事はまだありません。',
      loadIssue: 'ブログ読み込みエラー:',
      notFound: '記事が見つかりません',
      notFoundBody: 'お探しの記事は存在しないか、削除されています。',
      back: 'ブログへ戻る',
      fallbackDescription: '精密製造、CNC加工、品質管理に関する記事です。',
    },
  },
  zh: {
    nav: {
      home: '首页',
      about: '关于我们',
      capabilities: '加工能力',
      quality: '品质管理',
      blog: '博客',
      contact: '联系我们',
      cta: '上传图纸并询价',
      mobileCta: '请求报价',
      menu: '打开主菜单',
    },
    seoSiteName: '精密加工解决方案',
    footer: {
      intro: '以日本品质管理标准结合深圳制造速度，帮助工程团队降低采购复杂度，从样件到批量生产稳定控制加工品质。',
      quickLinks: '快速链接',
      capabilities: '加工能力',
      contact: '联系我们',
      qualityControl: '品质管理',
      technicalBlog: '技术博客',
      productionOnline: '生产在线',
      industriesServed: '服务行业:',
      industries: ['汽车', '半导体', '自动化', '食品机械', '工业设备'],
    },
    blog: {
      title: '技术博客',
      description: '关于精密加工、品质控制和工程实践的经验分享。',
      empty: '目前还没有已发布的博客文章。',
      loadIssue: '博客加载问题:',
      notFound: '文章未找到',
      notFoundBody: '您查找的文章不存在或已被移除。',
      back: '返回博客',
      fallbackDescription: '阅读关于精密制造、CNC加工和品质管理的文章。',
    },
  },
} as const;

export function useSiteCopy() {
  const { locale } = useLocale();
  return siteCopy[locale];
}
