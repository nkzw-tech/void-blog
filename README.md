# void-blog

A Void-native blogging framework for MDX blogs.

`void-blog` provides:

- a Vite plugin that scans `posts/*.mdx` and generates Void page files
- a configurable MDX dialect with syntax highlighting, frontmatter, inline notes, table of contents export, and smart typography
- Void server helpers for home/post loaders and post `<head>` metadata
- a small default React theme that can be styled or replaced
- RSS, sitemap, Markdown mirrors, `llms.txt`, and Open Graph image generation

## Install

During the Void private preview, keep using the Void package aliases and registry setup:

```ini
# .npmrc
@void-sdk:registry=https://npm.pkg.github.com
```

```sh
pnpm add void-blog
```

## Configure

```ts
// blog.config.ts
import { defineBlog } from 'void-blog';

export default defineBlog({
  site: {
    description: 'Concise docs for building MDX blogs on Void.',
    name: 'Void Blog Docs',
    url: 'http://localhost:4010',
  },
});
```

```ts
// vite.config.ts
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { voidReact } from '@void/react/plugin';
import { defineConfig } from 'vite-plus';
import { voidPlugin } from 'void';
import blogConfig from './blog.config.ts';
import mdxOptions from 'void-blog/mdx';
import { voidBlog } from 'void-blog/vite';

export default defineConfig({
  plugins: [
    voidBlog(blogConfig),
    ...voidPlugin(),
    mdx(mdxOptions),
    ...tailwindcss(),
    ...voidReact({ viewTransitions: true }),
  ],
});
```

To replace the default post design, point the plugin at your own route
component:

```ts
voidBlog(blogConfig, {
  routes: {
    post: 'src/blog/PostRoute.tsx',
  },
});
```

```tsx
// src/blog/PostRoute.tsx
import {
  BlogConfigProvider,
  BlogPostBody,
  type BlogPostRouteProps,
} from 'void-blog/react';

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
      <main>
        <h1>{post.title}</h1>
        <BlogPostBody
          {...post}
          content={content}
          tableOfContents={tableOfContents}
        />
      </main>
    </BlogConfigProvider>
  );
}
```

```tsx
// pages/layout.tsx
import 'void-blog/styles.css';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
```

## Scripts

The `voidBlog()` Vite plugin generates blog routes and metadata during
`vp dev` and `vp build`. A Vite+ app only needs these scripts:

```json
{
  "scripts": {
    "build": "vp build",
    "dev": "vp dev"
  }
}
```

If your blog config includes local MDX components, keep it in the conventional
`blog.config.ts` file. The generated post pages will import that app config
automatically.

## Example

Run the example app from this repository:

```sh
vp run void-blog-example#dev
```

The example uses the local workspace copy of `void-blog` and doubles as concise
product documentation for setup, configuration, MDX authoring, generated
outputs, and design customization.

## Frontmatter

Required:

```md
---
title: Hello World
date: 2026-01-01T00:00:00Z
description: A post about the topic in one sentence.
published: true
---
```

Supported optional fields include `category`, `type`, `pinned`, `image`, `tags`, and `youtube`.
