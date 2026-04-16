import { describe, expect, test } from 'vite-plus/test';
import { defineBlog, toGeneratedConfig } from './lib/config.ts';
import type { BlogPost } from './lib/Types.ts';
import {
  createBlogHeadMiddleware,
  createBlogMarkdownAssetMiddleware,
  createHomeLoader,
  createPostHead,
  createPostLoader,
} from './server.ts';

const createPost = (slug: string, post: Partial<BlogPost> = {}): BlogPost => ({
  date: '2026-01-01T00:00:00Z',
  description: `${slug} description.`,
  lastUpdateDate: null,
  minutes: 1,
  published: true,
  slug,
  title: slug,
  words: 100,
  ...post,
});

const createConfig = (input: Partial<Parameters<typeof defineBlog>[0]> = {}) =>
  toGeneratedConfig(
    defineBlog({
      site: {
        description: 'A blog.',
        name: 'Example',
        url: 'https://example.com',
      },
      ...input,
    }),
  );

describe('server loaders', () => {
  test('picks pinned posts from published posts', () => {
    const draft = createPost('draft', { pinned: true, published: false });
    const published = createPost('published');
    const loader = createHomeLoader({ posts: [draft, published] });

    expect(loader({} as never)).toEqual({
      pinnedPost: null,
      posts: [published],
    });
  });

  test('loads drafts by slug so they can be shared directly', () => {
    const draft = createPost('draft', { published: false });
    const loader = createPostLoader({ posts: [draft], slug: draft.slug });

    expect(loader({} as never)).toEqual({
      post: draft,
      relatedPosts: [],
    });
  });
});

describe('createBlogHeadMiddleware', () => {
  test('adds the shared blog head defaults', async () => {
    type HeadDefaults = {
      link?: Array<{ href: string; rel: string }>;
      script?: Array<{ innerHTML: string }>;
    };
    let headDefaults: HeadDefaults = {
      link: [{ href: '/existing.css', rel: 'stylesheet' }],
    };
    let nextCalled = false;
    const middleware = createBlogHeadMiddleware({
      style: '/src/styles.css',
    });

    await middleware(
      {
        get: () => headDefaults,
        set: (_key: string, value: typeof headDefaults) => {
          headDefaults = value;
        },
      } as never,
      async () => {
        nextCalled = true;
      },
    );

    expect(nextCalled).toBe(true);
    expect(headDefaults.link).toContainEqual({
      href: '/existing.css',
      rel: 'stylesheet',
    });
    expect(headDefaults.link).toContainEqual({
      href: '/src/styles.css',
      rel: 'stylesheet',
    });
    expect(headDefaults.script).toContainEqual(
      expect.objectContaining({
        innerHTML: expect.stringContaining('dragstart'),
      }),
    );
  });
});

describe('createBlogMarkdownAssetMiddleware', () => {
  test('serves generated markdown assets for post markdown requests', async () => {
    const raw = new Request('https://example.com/posts/example.md');
    const markdownResponse = new Response('# Example');
    let fetchedRequest: Request | null = null;
    const c = {
      env: {
        ASSETS: {
          fetch: async (request: Request) => {
            fetchedRequest = request;
            return markdownResponse;
          },
        },
      },
      req: {
        path: '/posts/example.md',
        raw,
      },
      res: new Response('Not Found', { status: 404 }),
    };
    const middleware = createBlogMarkdownAssetMiddleware();

    await middleware(c as never, async () => {});

    expect(fetchedRequest).toBe(raw);
    expect(c.res).toBe(markdownResponse);
  });

  test('ignores non-markdown requests', async () => {
    let nextCalled = false;
    const c = {
      req: {
        path: '/posts/example',
      },
    };
    const middleware = createBlogMarkdownAssetMiddleware();

    await middleware(c as never, async () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });
});

describe('createPostHead', () => {
  test('falls back to the site social image when generated OG images are disabled', () => {
    const post = createPost('post');
    const head = createPostHead(
      createConfig({
        ogImage: false,
        site: {
          description: 'A blog.',
          name: 'Example',
          socialImage: 'https://example.com/social.png',
          url: 'https://example.com',
        },
      }),
    );

    expect(head({} as never, { post })?.meta).toContainEqual({
      content: 'https://example.com/social.png',
      property: 'og:image',
    });
  });

  test('omits og:image without an explicit image or enabled generated image', () => {
    const post = createPost('post');
    const head = createPostHead(createConfig({ ogImage: false }));

    expect(head({} as never, { post })?.meta).not.toContainEqual(
      expect.objectContaining({ property: 'og:image' }),
    );
  });
});
