import { Link } from '@void/react';
import PostBody from '../components/Post/PostBody.tsx';
import PostMetadata from '../components/Post/PostMetadata.tsx';
import type { BlogPostRouteProps } from '../lib/Types.ts';
import { BlogConfigProvider } from '../react/config.tsx';

export default function PostRoute({
  config,
  content,
  post,
  tableOfContents,
}: BlogPostRouteProps) {
  if (!post) {
    return null;
  }

  return (
    <BlogConfigProvider config={config}>
      <main className="void-blog-page void-blog-post-page">
        <article className="void-blog-post-article">
          <Link className="void-blog-back-link" href="/">
            {config.text.homeLink}
          </Link>
          <header className="void-blog-post-header">
            <p className="void-blog-eyebrow">
              {post.category && config.categoryLabels[post.category]
                ? config.categoryLabels[post.category]
                : (post.type ?? config.text.articleFallbackType)}
            </p>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            <div className="void-blog-post-date">
              <PostMetadata {...post} withDay />
            </div>
          </header>
          <PostBody
            {...post}
            content={content}
            tableOfContents={tableOfContents}
          />
          <footer className="void-blog-post-footer">
            {config.text.postFooter}
          </footer>
        </article>
      </main>
    </BlogConfigProvider>
  );
}
