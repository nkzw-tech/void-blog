import { useEffect } from 'react';
import type { BlogConfig, BlogPost } from '../lib/Types.ts';
import HomeRoute from './HomeRoute.tsx';

export default function PreviewRoute({
  config,
  posts,
}: {
  config: BlogConfig;
  posts: ReadonlyArray<BlogPost>;
}) {
  useEffect(() => {
    document.documentElement.classList.add('dark');

    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return <HomeRoute config={config} pinnedPost={null} posts={posts} />;
}
