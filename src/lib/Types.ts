import type { ComponentType, ReactNode } from 'react';

export type BlogOGImageTheme =
  | 'blue'
  | 'dark'
  | 'emerald'
  | 'fuchsia'
  | 'light'
  | 'pink'
  | 'purple';

export type BlogLink = Readonly<{
  href: string;
  label: string;
}>;

export type BlogSiteConfig = Readonly<{
  description: string;
  email?: string;
  footerLinks?: ReadonlyArray<BlogLink>;
  headerImages?: ReadonlyArray<string>;
  language?: string;
  name: string;
  socialImage?: string;
  title?: string;
  url: string;
}>;

export type BlogGeneratedConfig = Readonly<{
  categoryLabels: Readonly<Record<string, string>>;
  contentDir: string;
  feed: boolean;
  llmsTxt: boolean;
  markdown: boolean;
  ogImage: boolean;
  postTypeColors: Readonly<Record<string, BlogOGImageTheme>>;
  routeBase: string;
  site: BlogSiteConfig;
  sitemap: boolean;
  text: Readonly<{
    articleFallbackType: string;
    homeLink: string;
    latestArticle: string;
    postFooter: string;
    relatedPosts: string;
  }>;
}>;

export type BlogPublicConfig = BlogGeneratedConfig;

export type BlogGenerateContentOptions = Readonly<{
  config: BlogConfig;
  configImport?: string;
  log?: boolean;
  root: string;
  routeComponentImports?: BlogRouteComponentImports;
}>;

export type BlogRouteComponentImports = Readonly<{
  post?: string;
}>;

export type BlogConfig = BlogGeneratedConfig &
  Readonly<{
    intro?: ReactNode;
    mdxComponents?: BlogMdxComponents;
  }>;

export type BlogConfigInput = Readonly<
  Partial<
    Omit<
      BlogConfig,
      | 'categoryLabels'
      | 'contentDir'
      | 'postTypeColors'
      | 'routeBase'
      | 'site'
      | 'text'
    >
  > & {
    categoryLabels?: Readonly<Record<string, string>>;
    contentDir?: string;
    postTypeColors?: Readonly<Record<string, BlogOGImageTheme>>;
    routeBase?: string;
    site: BlogSiteConfig;
    text?: Partial<BlogGeneratedConfig['text']>;
  }
>;

export type BlogMdxComponents = Readonly<
  Record<
    string,
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentType<any>
  >
>;

export type BlogPostContent = ComponentType<{
  components: BlogMdxComponents;
}>;

type BlogTableOfContentsItem = Readonly<{
  children?: BlogTableOfContents;
  depth: number;
  id: string;
  value: string;
}>;

export type BlogTableOfContents = ReadonlyArray<BlogTableOfContentsItem>;

export type BlogPost = Readonly<{
  category?: string;
  date: string;
  description: string;
  image?: string;
  lastUpdateDate: string | null;
  minutes: number;
  pinned?: boolean;
  published?: boolean;
  slug: string;
  tags?: ReadonlyArray<string>;
  title: string;
  type?: string | null;
  words: number;
  youtube?: string;
}> &
  Readonly<Record<string, unknown>>;

export type BlogPostWithContent = BlogPost & {
  content: BlogPostContent;
  tableOfContents: BlogTableOfContents | null;
};

export type BlogPostRouteProps = Readonly<{
  config: BlogConfig;
  content: BlogPostContent;
  post?: BlogPost;
  relatedPosts?: ReadonlyArray<BlogPost>;
  tableOfContents: BlogTableOfContents | null;
}>;

export type Category = string;
export type Post = BlogPost;
export type PostContent = BlogPostContent;
export type PostType = string;
export type PostWithContent = BlogPostWithContent;
export type TableOfContents = BlogTableOfContents;
