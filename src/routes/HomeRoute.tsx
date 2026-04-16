import { Link } from '@void/react';
import type { CSSProperties, ReactNode } from 'react';
import type {
  BlogConfig,
  BlogPost,
  BlogPostWithContent,
} from '../lib/Types.ts';
import { BlogConfigProvider } from '../react/config.tsx';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const formatPostDate = (date: string) => dateFormatter.format(new Date(date));

function PostMeta({ config, post }: { config: BlogConfig; post: BlogPost }) {
  const label =
    post.category && config.categoryLabels[post.category]
      ? config.categoryLabels[post.category]
      : (post.type ?? config.text.articleFallbackType);

  return (
    <p className="void-blog-post-meta">
      <span>{label}</span>
      <span>{formatPostDate(post.date)}</span>
      <span>{post.minutes} min read</span>
    </p>
  );
}

function FeaturedPost({
  config,
  post,
}: {
  config: BlogConfig;
  post: BlogPost;
}) {
  return (
    <section
      aria-labelledby="void-blog-featured"
      className="void-blog-featured"
    >
      <p className="void-blog-eyebrow" id="void-blog-featured">
        {config.text.latestArticle}
      </p>
      <Link
        className="void-blog-featured-link"
        href={`${config.routeBase}/${post.slug}`}
      >
        <span>{post.title}</span>
        <svg aria-hidden="true" height="20" viewBox="0 0 20 20" width="20">
          <path
            d="M6 4l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </Link>
      <p className="void-blog-featured-description">{post.description}</p>
      <PostMeta config={config} post={post} />
    </section>
  );
}

function PostRow({ config, post }: { config: BlogConfig; post: BlogPost }) {
  return (
    <article className="void-blog-post-row">
      <div>
        <PostMeta config={config} post={post} />
        <h2>
          <Link href={`${config.routeBase}/${post.slug}`}>{post.title}</Link>
        </h2>
      </div>
      <p>{post.description}</p>
    </article>
  );
}

function SiteFooter({ config }: { config: BlogConfig }) {
  const links = config.site.footerLinks ?? [];

  if (links.length === 0) {
    return null;
  }

  return (
    <footer className="void-blog-footer">
      {links.map((link) => (
        <a href={link.href} key={link.href}>
          {link.label}
        </a>
      ))}
    </footer>
  );
}

export default function HomeRoute({
  config,
  intro,
  pinnedPost,
  pinnedPostWithContent,
  posts,
}: {
  config: BlogConfig;
  intro?: ReactNode;
  pinnedPost: BlogPost | null;
  pinnedPostWithContent?: BlogPostWithContent | null;
  posts: ReadonlyArray<BlogPost>;
}) {
  const featuredPost = pinnedPostWithContent ?? pinnedPost ?? posts[0] ?? null;
  const listedPosts = featuredPost
    ? posts.filter(({ slug }) => slug !== featuredPost.slug)
    : posts;
  const headerImage = config.site.headerImages?.[0];
  const heroStyle = headerImage
    ? ({
        '--void-blog-header-image': `url('${headerImage}')`,
      } as CSSProperties)
    : undefined;

  return (
    <BlogConfigProvider config={config}>
      <main className="void-blog-page">
        <header className="void-blog-hero" style={heroStyle}>
          <div className="void-blog-hero-content">
            <p className="void-blog-kicker">Void Blog</p>
            <h1>{config.site.name}</h1>
            <p>{config.site.description}</p>
          </div>
        </header>

        <div className="void-blog-home-grid">
          {(intro ?? config.intro) && (
            <section aria-label="About this blog" className="void-blog-intro">
              {intro ?? config.intro}
            </section>
          )}

          {featuredPost && <FeaturedPost config={config} post={featuredPost} />}

          <section
            aria-labelledby="void-blog-latest"
            className="void-blog-posts"
          >
            <div className="void-blog-section-heading">
              <p className="void-blog-eyebrow" id="void-blog-latest">
                Latest posts
              </p>
              {config.feed && <a href="/feed.xml">RSS</a>}
            </div>
            {listedPosts.map((post) => (
              <PostRow config={config} key={post.slug} post={post} />
            ))}
          </section>
        </div>

        <SiteFooter config={config} />
      </main>
    </BlogConfigProvider>
  );
}
