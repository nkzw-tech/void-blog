import { BlogPreviewRoute } from 'void-blog/react';
import blogConfig from '../blog.config.ts';
import allPosts from '../src/posts/AllPosts.ts';

export default function PreviewPage() {
  return <BlogPreviewRoute config={blogConfig} posts={allPosts} />;
}
