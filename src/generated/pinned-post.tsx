import type { BlogPostWithContent } from '../lib/Types.ts';

const getPinnedPost = (): BlogPostWithContent | null => {
  throw new Error(
    '`void-blog/pinned-post` is a virtual module. Add `voidBlog()` from `void-blog/vite` to your Vite config.',
  );
};

export default getPinnedPost();
