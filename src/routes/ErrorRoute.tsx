import { Link } from '@void/react';
import type { BlogConfig } from '../lib/Types.ts';
import { BlogConfigProvider } from '../react/config.tsx';

export default function ErrorRoute({ config }: { config: BlogConfig }) {
  return (
    <BlogConfigProvider config={config}>
      <main className="void-blog-page void-blog-error-page">
        <section className="void-blog-error">
          <p className="void-blog-eyebrow">{config.site.name}</p>
          <h1>Something went wrong.</h1>
          <Link className="void-blog-back-link" href="/">
            {config.text.homeLink}
          </Link>
        </section>
      </main>
    </BlogConfigProvider>
  );
}
