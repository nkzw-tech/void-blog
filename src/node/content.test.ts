import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vite-plus/test';
import { defineBlog, toGeneratedConfig } from '../lib/config.ts';
import {
  generateBlogConfigModule,
  generateContent,
  generatePinnedPostModule,
} from './content.ts';

const createRoot = () => mkdtempSync(join(tmpdir(), 'void-blog-'));

const writePost = (
  root: string,
  slug: string,
  frontmatter: string,
  body = '# Hello',
) =>
  writeFileSync(
    join(root, 'posts', `${slug}.mdx`),
    `---
title: ${slug}
date: 2026-01-01T00:00:00Z
description: ${slug} description.
${frontmatter}
---

${body}
`,
  );

describe('generateContent', () => {
  test('generates metadata, pages, markdown, feed, sitemap, and llms files', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    mkdirSync(join(root, 'pages'), { recursive: true });
    mkdirSync(join(root, 'public'), { recursive: true });
    writeFileSync(
      join(root, 'posts', 'hello-world.mdx'),
      `---
title: Hello World
date: 2026-01-01T00:00:00Z
description: A first post.
published: true
pinned: true
category: notes
type: guide
---

# Hello

This is a post with some words.
`,
    );

    const config = toGeneratedConfig(
      defineBlog({
        categoryLabels: { notes: 'Notes' },
        site: {
          description: 'A blog.',
          name: 'Example',
          url: 'https://example.com',
        },
      }),
    );

    const { publishedPosts } = generateContent({ config, log: false, root });

    expect(publishedPosts).toHaveLength(1);
    expect(existsSync(join(root, 'src/posts/AllPosts.ts'))).toBe(false);
    expect(existsSync(join(root, 'src/posts/BlogConfig.ts'))).toBe(false);
    expect(existsSync(join(root, 'src/posts/PinnedPost.tsx'))).toBe(false);
    expect(existsSync(join(root, 'pages/posts/[slug].tsx'))).toBe(true);
    expect(existsSync(join(root, 'pages/posts/[slug].server.ts'))).toBe(true);
    expect(existsSync(join(root, 'pages/posts/hello-world.tsx'))).toBe(false);
    expect(existsSync(join(root, 'pages/posts/hello-world.server.ts'))).toBe(
      false,
    );
    expect(
      readFileSync(join(root, 'pages/posts/[slug].server.ts'), 'utf8'),
    ).toContain('export function getPrerenderPaths()');
    expect(
      readFileSync(join(root, 'pages/posts/[slug].server.ts'), 'utf8'),
    ).toContain('export const revalidate = 0;');
    expect(
      readFileSync(join(root, 'pages/posts/[slug].server.ts'), 'utf8'),
    ).not.toContain('export const prerender = true;');
    expect(existsSync(join(root, 'public/posts/hello-world.md'))).toBe(true);
    expect(readFileSync(join(root, 'public/feed.xml'), 'utf8')).toContain(
      '<title>Example</title>',
    );
    expect(readFileSync(join(root, 'public/sitemap.xml'), 'utf8')).toContain(
      'https://example.com/posts/hello-world',
    );
    expect(readFileSync(join(root, 'public/llms.txt'), 'utf8')).toContain(
      '[Hello World](https://example.com/posts/hello-world.md)',
    );
  });

  test('can generate pages that import the app blog config', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    mkdirSync(join(root, 'pages'), { recursive: true });
    mkdirSync(join(root, 'public'), { recursive: true });
    writeFileSync(
      join(root, 'posts', 'custom-mdx.mdx'),
      `---
title: Custom MDX
date: 2026-01-01T00:00:00Z
description: A post with app components.
published: true
---

# Hello
`,
    );

    const config = defineBlog({
      mdxComponents: {
        CustomBlock: () => null,
      },
      site: {
        description: 'A blog.',
        name: 'Example',
        url: 'https://example.com',
      },
    });

    const { config: generatedConfig } = generateContent({
      config,
      configImport: 'blog.config.ts',
      log: false,
      root,
    });

    expect(generateBlogConfigModule(generatedConfig)).not.toContain(
      'CustomBlock',
    );
    expect(
      readFileSync(join(root, 'pages/posts/[slug].tsx'), 'utf8'),
    ).toContain("import blogConfig from '../../blog.config.ts';");
    expect(
      readFileSync(join(root, 'pages/posts/[slug].server.ts'), 'utf8'),
    ).toContain("import blogConfig from 'void-blog/blog-config';");
  });

  test('rejects non-importable configs with MDX components', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    mkdirSync(join(root, 'pages'), { recursive: true });
    mkdirSync(join(root, 'public'), { recursive: true });
    writePost(root, 'custom-mdx', 'published: true');

    const config = defineBlog({
      mdxComponents: {
        CustomBlock: () => null,
      },
      site: {
        description: 'A blog.',
        name: 'Example',
        url: 'https://example.com',
      },
    });

    expect(() => generateContent({ config, log: false, root })).toThrow(
      'must be importable',
    );
  });

  test('can generate pages that import a custom post route component', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    mkdirSync(join(root, 'pages'), { recursive: true });
    mkdirSync(join(root, 'public'), { recursive: true });
    writeFileSync(
      join(root, 'posts', 'custom-route.mdx'),
      `---
title: Custom Route
date: 2026-01-01T00:00:00Z
description: A post with a custom route.
published: true
---

# Hello
`,
    );

    const config = defineBlog({
      site: {
        description: 'A blog.',
        name: 'Example',
        url: 'https://example.com',
      },
    });

    generateContent({
      config,
      configImport: 'blog.config.ts',
      log: false,
      root,
      routeComponentImports: {
        post: 'src/blog/PostRoute.tsx',
      },
    });

    expect(
      readFileSync(join(root, 'pages/posts/[slug].tsx'), 'utf8'),
    ).toContain("import BlogPostRoute from '../../src/blog/PostRoute.tsx';");
  });

  test('generates draft routes but excludes drafts from public artifacts', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    mkdirSync(join(root, 'pages'), { recursive: true });
    mkdirSync(join(root, 'public'), { recursive: true });
    writePost(root, 'published-post', 'published: true');
    writePost(root, 'draft-post', 'published: false\npinned: true');

    const config = defineBlog({
      site: {
        description: 'A blog.',
        name: 'Example',
        url: 'https://example.com',
      },
    });

    const { config: generatedConfig, publishedPosts } = generateContent({
      config,
      log: false,
      root,
    });

    expect(existsSync(join(root, 'pages/posts/[slug].tsx'))).toBe(true);
    expect(existsSync(join(root, 'pages/posts/[slug].server.ts'))).toBe(true);
    expect(
      readFileSync(join(root, 'pages/posts/[slug].server.ts'), 'utf8'),
    ).toContain('allPosts.map(({ slug }) => ({ slug }))');
    expect(existsSync(join(root, 'public/posts/published-post.md'))).toBe(true);
    expect(existsSync(join(root, 'public/posts/draft-post.md'))).toBe(false);
    expect(readFileSync(join(root, 'public/feed.xml'), 'utf8')).not.toContain(
      'draft-post',
    );
    expect(
      readFileSync(join(root, 'public/sitemap.xml'), 'utf8'),
    ).not.toContain('draft-post');
    expect(readFileSync(join(root, 'public/llms.txt'), 'utf8')).not.toContain(
      'draft-post',
    );
    expect(
      generatePinnedPostModule({
        config: generatedConfig,
        pinnedPost: publishedPosts.find((post) => post.pinned),
        root,
      }),
    ).toContain('export default null');
  });

  test('generates root route posts under the pages root', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    mkdirSync(join(root, 'pages'), { recursive: true });
    mkdirSync(join(root, 'public'), { recursive: true });
    writePost(root, 'root-post', 'published: true');

    const config = defineBlog({
      routeBase: '/',
      site: {
        description: 'A blog.',
        name: 'Example',
        url: 'https://example.com',
      },
    });

    generateContent({ config, log: false, root });

    expect(existsSync(join(root, 'pages/[slug].tsx'))).toBe(true);
    expect(existsSync(join(root, 'pages/[slug].server.ts'))).toBe(true);
    expect(existsSync(join(root, 'pages/root-post.tsx'))).toBe(false);
    expect(existsSync(join(root, 'pages/root-post.server.ts'))).toBe(false);
    expect(existsSync(join(root, 'pages/posts/root-post.tsx'))).toBe(false);
  });

  test('omits markdown URLs and removes markdown mirrors when disabled', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    mkdirSync(join(root, 'pages'), { recursive: true });
    mkdirSync(join(root, 'public'), { recursive: true });
    writePost(root, 'hello-world', 'published: true');

    const baseConfig = {
      site: {
        description: 'A blog.',
        name: 'Example',
        url: 'https://example.com',
      },
    };

    generateContent({
      config: defineBlog(baseConfig),
      log: false,
      root,
    });

    expect(existsSync(join(root, 'public/posts/hello-world.md'))).toBe(true);

    generateContent({
      config: defineBlog({
        ...baseConfig,
        markdown: false,
      }),
      log: false,
      root,
    });

    const llms = readFileSync(join(root, 'public/llms.txt'), 'utf8');

    expect(existsSync(join(root, 'public/posts/hello-world.md'))).toBe(false);
    expect(llms).not.toContain('Markdown Posts');
    expect(llms).not.toContain('hello-world.md');
    expect(llms).toContain(
      '[hello-world](https://example.com/posts/hello-world)',
    );
  });
});
