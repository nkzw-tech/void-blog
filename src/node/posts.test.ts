import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vite-plus/test';
import { defineBlog, toGeneratedConfig } from '../lib/config.ts';
import { readPosts } from './posts.ts';

const createRoot = () => mkdtempSync(join(tmpdir(), 'void-blog-'));

describe('readPosts', () => {
  test('reads mdx frontmatter and derives metadata', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    writeFileSync(
      join(root, 'posts', 'hello-world.mdx'),
      `---
title: Hello World
date: 2026-01-01T00:00:00Z
description: A first post.
published: true
category: notes
---

# Hello

This is a post with some words.
`,
    );

    const config = toGeneratedConfig(
      defineBlog({
        site: {
          description: 'A blog.',
          name: 'Example',
          url: 'https://example.com',
        },
      }),
    );
    const posts = readPosts({ config, root });

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      category: 'notes',
      description: 'A first post.',
      lastUpdateDate: null,
      published: true,
      slug: 'hello-world',
      title: 'Hello World',
    });
    expect(posts[0]?.minutes).toBeGreaterThan(0);
    expect(posts[0]?.words).toBeGreaterThan(0);
  });

  test('rejects invalid slugs', () => {
    const root = createRoot();
    mkdirSync(join(root, 'posts'));
    writeFileSync(
      join(root, 'posts', 'Hello.mdx'),
      `---
title: Hello
date: 2026-01-01T00:00:00Z
description: A first post.
---
`,
    );

    const config = toGeneratedConfig(
      defineBlog({
        site: {
          description: 'A blog.',
          name: 'Example',
          url: 'https://example.com',
        },
      }),
    );

    expect(() => readPosts({ config, root })).toThrow('Invalid post slug');
  });
});
