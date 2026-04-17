import type { BlogConfig } from '../lib/Types.ts';

const getBlogConfig = (): BlogConfig => {
  throw new Error(
    '`void-blog/blog-config` is a virtual module. Add `voidBlog()` from `void-blog/vite` to your Vite config.',
  );
};

export default getBlogConfig();
