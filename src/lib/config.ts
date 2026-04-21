import type {
  BlogConfig,
  BlogConfigInput,
  BlogGeneratedConfig,
} from './Types.ts';

const defaultText = {
  articleFallbackType: 'article',
  homeLink: 'home',
  latestArticle: 'Latest Article',
  postFooter: 'Thank you for reading, and have a great day!',
  relatedPosts: 'Ready for another article?',
} satisfies BlogGeneratedConfig['text'];

const defaultPostTypeColors = {
  ai: 'pink',
  guide: 'purple',
  principles: 'fuchsia',
  'starter pack': 'emerald',
} satisfies BlogGeneratedConfig['postTypeColors'];

const defaultCategoryLabels = {
  engineering: 'Engineering',
  essentials: 'Essentials',
  leadership: 'Management & Leadership',
  me: 'About',
  uncategorized: 'Uncategorized',
} satisfies BlogGeneratedConfig['categoryLabels'];

const normalizeBase = (base: string) => {
  const normalized = `/${base.replaceAll(/^\/+|\/+$/g, '')}`;
  return normalized === '/' ? '' : normalized;
};

const normalizeContentDir = (contentDir: string) =>
  contentDir.replace(/^\.?\/*/, '').replaceAll(/\/+$/g, '') || 'posts';

export function defineBlog(config: BlogConfigInput): BlogConfig {
  return {
    categoryLabels: {
      ...defaultCategoryLabels,
      ...(config.categoryLabels ?? {}),
    },
    contentDir: normalizeContentDir(config.contentDir ?? 'posts'),
    feed: config.feed ?? true,
    intro: config.intro,
    markdown: config.markdown ?? true,
    mdxComponents: config.mdxComponents,
    ogImage: config.ogImage ?? true,
    postTypeColors: {
      ...defaultPostTypeColors,
      ...(config.postTypeColors ?? {}),
    },
    routeBase: normalizeBase(config.routeBase ?? '/posts'),
    site: {
      ...config.site,
      language: config.site.language ?? 'en-US',
      title: config.site.title ?? config.site.name,
      url: config.site.url.replaceAll(/\/+$/g, ''),
    },
    sitemap: config.sitemap ?? true,
    text: {
      ...defaultText,
      ...(config.text ?? {}),
    },
  };
}

export function toGeneratedConfig(config: BlogConfig): BlogGeneratedConfig {
  return {
    categoryLabels: config.categoryLabels,
    contentDir: config.contentDir,
    feed: config.feed,
    markdown: config.markdown,
    ogImage: config.ogImage,
    postTypeColors: config.postTypeColors,
    routeBase: config.routeBase,
    site: config.site,
    sitemap: config.sitemap,
    text: config.text,
  };
}
