declare module '*.mdx' {
  import type { BlogPostContent, BlogTableOfContents } from './lib/Types.ts';

  export const tableOfContents: BlogTableOfContents | null;
  const content: BlogPostContent;
  export default content;
}
