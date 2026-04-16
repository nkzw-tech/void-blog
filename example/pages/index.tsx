import { BlogHomeRoute } from 'void-blog/react';
import blogConfig from '../blog.config.ts';
import Intro from '../src/components/Intro.tsx';
import allPosts from '../src/posts/AllPosts.ts';
import PinnedPost from '../src/posts/PinnedPost.tsx';
import type { Props } from './index.server.ts';

export default function HomePage(props: Props) {
  return (
    <BlogHomeRoute
      {...props}
      config={blogConfig}
      intro={<Intro />}
      pinnedPostWithContent={PinnedPost}
      posts={allPosts.filter(({ published }) => published)}
    />
  );
}
