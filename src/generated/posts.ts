import type { BlogPost } from '../lib/Types.ts';

const getPosts = (): ReadonlyArray<BlogPost> => {
  throw new Error(
    '`void-blog/posts` is a virtual module. Add `voidBlog()` from `void-blog/vite` to your Vite config.',
  );
};

export default getPosts();
