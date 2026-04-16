import { defineHandler, defineHead, defineMiddleware } from 'void';
import getOGImage from './lib/getOGImage.ts';
import type { BlogGeneratedConfig, BlogPost } from './lib/Types.ts';

export type BlogMiddleware = ReturnType<typeof defineMiddleware>;

export type BlogHeadMiddlewareOptions = Readonly<{
  style?: string;
}>;

export type BlogMarkdownAssetMiddlewareOptions = Readonly<{
  routeBase?: string;
}>;

export interface BlogPostLoaderProps {
  post: BlogPost;
  relatedPosts: ReadonlyArray<BlogPost>;
}

export interface BlogHomeLoaderProps {
  pinnedPost: BlogPost | null;
  posts: ReadonlyArray<BlogPost>;
}

export const getAllPublishedPosts = (posts: ReadonlyArray<BlogPost>) =>
  posts.filter(({ published }) => published);

const getRelatedPosts = (post: BlogPost, posts: ReadonlyArray<BlogPost>) =>
  getAllPublishedPosts(posts)
    .filter(({ category }) => category && category === post.category)
    .filter(({ slug }) => slug !== post.slug);

const getPostImage = (post: BlogPost, config: BlogGeneratedConfig) =>
  post.image ??
  (config.ogImage ? getOGImage(post.slug, config) : config.site.socialImage);

const escapeRegExp = (value: string) =>
  value.replaceAll(/[|\\{}()[\]^$+*?.]/g, String.raw`\$&`);

const disableAnchorDragScript = {
  innerHTML:
    "document.addEventListener('dragstart',function(event){const target=event.target;if(target&&'tagName'in target&&target.tagName==='A'){event.preventDefault();}});",
};

export function createBlogHeadMiddleware({
  style,
}: BlogHeadMiddlewareOptions = {}): BlogMiddleware {
  return defineMiddleware(async (c, next) => {
    const currentHead = c.get('headDefaults');
    const link = [...(currentHead?.link ?? [])];
    const script = [...(currentHead?.script ?? [])];

    if (import.meta.env.DEV && style) {
      link.push({ href: style, rel: 'stylesheet' });
    }

    script.push(disableAnchorDragScript);

    c.set('headDefaults', {
      ...currentHead,
      link,
      script,
    });

    await next();
  });
}

export function createBlogMarkdownAssetMiddleware({
  routeBase = '/posts',
}: BlogMarkdownAssetMiddlewareOptions = {}): BlogMiddleware {
  const markdownRoutePattern = new RegExp(
    `^${escapeRegExp(routeBase)}/[^/]+\\.md$`,
  );

  return defineMiddleware(async (c, next) => {
    if (!markdownRoutePattern.test(c.req.path)) {
      await next();
      return;
    }

    await next();

    if (c.res.status !== 404) {
      return;
    }

    const assets = (
      c.env as {
        ASSETS?: { fetch(request: Request): Promise<Response> };
      }
    ).ASSETS;

    if (!assets) {
      return;
    }

    const assetResponse = await assets.fetch(c.req.raw);

    if (assetResponse.status !== 404) {
      c.res = assetResponse;
    }
  });
}

export function createHomeLoader({
  posts,
}: {
  posts: ReadonlyArray<BlogPost>;
}) {
  return defineHandler<BlogHomeLoaderProps>(() => {
    const publishedPosts = getAllPublishedPosts(posts);

    return {
      pinnedPost: publishedPosts.find((post) => post.pinned) ?? null,
      posts: publishedPosts,
    };
  });
}

export function createPostLoader({
  posts,
  slug,
}: {
  posts: ReadonlyArray<BlogPost>;
  slug?: string;
}) {
  return defineHandler<BlogPostLoaderProps>((c) => {
    const postSlug = slug ?? c.req.param('slug');
    const post = posts.find((candidate) => candidate.slug === postSlug);

    if (!post) {
      return c.text('Not Found', 404);
    }

    return {
      post,
      relatedPosts: getRelatedPosts(post, posts),
    };
  });
}

export function createPostHead(config: BlogGeneratedConfig) {
  return defineHead<Partial<BlogPostLoaderProps>>((c, props) => {
    const post = props.post;

    if (!post) {
      return;
    }

    const postUrl = `${config.site.url}${config.routeBase}/${post.slug}`;
    const image = getPostImage(post, config);

    return {
      link: config.markdown
        ? [
            {
              href: `${postUrl}.md`,
              rel: 'alternate',
              type: 'text/markdown',
            },
          ]
        : undefined,
      meta: [
        {
          content: post.description,
          name: 'description',
        },
        ...(image
          ? [
              {
                content: image,
                property: 'og:image',
              },
            ]
          : []),
        {
          content: postUrl,
          property: 'og:url',
        },
        {
          content: post.title,
          property: 'og:title',
        },
        {
          content: post.description,
          property: 'og:description',
        },
      ],
      title: `${post.title} | ${config.site.title ?? config.site.name}`,
    };
  });
}

export function createPreviewHead(config: BlogGeneratedConfig) {
  return defineHead(() => ({
    htmlAttrs: { class: 'dark' },
    title: `Preview | ${config.site.title ?? config.site.name}`,
  }));
}
