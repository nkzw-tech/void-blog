declare module 'void-blog/blog-config' {
  import type { BlogConfig } from 'void-blog';

  const config: BlogConfig;
  export default config;
}

declare module 'void-blog/pinned-post' {
  import type { BlogPostWithContent } from 'void-blog';

  const post: BlogPostWithContent | null;
  export default post;
}

declare module 'void-blog/posts' {
  import type { BlogPost } from 'void-blog';

  const posts: ReadonlyArray<BlogPost>;
  export default posts;
}
