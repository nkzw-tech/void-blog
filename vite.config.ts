import nkzw from '@nkzw/oxlint-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'generated/blog-config': 'src/generated/blog-config.ts',
        'generated/pinned-post': 'src/generated/pinned-post.tsx',
        'generated/posts': 'src/generated/posts.ts',
        index: 'src/index.ts',
        mdx: 'src/mdx/index.ts',
        node: 'src/node/content.ts',
        react: 'src/react.ts',
        server: 'src/server.ts',
        vite: 'src/vite.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^@mdx-js\//,
        /^@nkzw\//,
        /^@resvg\//,
        /^@shikijs\//,
        /^node:/,
        /^react($|\/)/,
        /^remark-/,
        /^rehype-/,
        '@stefanprobst/rehype-extract-toc',
        '@tailwindcss/vite',
        '@void/react',
        'clsx',
        'date-fns',
        'gray-matter',
        'reading-time',
        'satori',
        'shiki',
        'tailwind-merge',
        'tippy.js',
        'unist-util-visit',
        'vite',
        'void',
      ],
    },
  },
  fmt: {
    experimentalSortImports: {
      newlinesBetween: false,
    },
    experimentalSortPackageJson: {
      sortScripts: true,
    },
    experimentalTailwindcss: {
      stylesheet: 'src/styles.css',
    },
    ignorePatterns: ['lib'],
    printWidth: 80,
    singleQuote: true,
  },
  lint: {
    env: {
      browser: true,
      builtin: true,
      es2024: true,
      node: true,
    },
    extends: [nkzw],
    ignorePatterns: [
      'coverage',
      'dist',
      '.void',
      'example/.void',
      'example/.wrangler',
      'example/dist',
      'lib',
      'vite.config.ts.timestamp-*',
    ],
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ['src/node/**/*.{ts,tsx}', 'src/vite.ts'],
        rules: {
          'no-console': 'off',
        },
      },
    ],
    rules: {
      'react/display-name': 'off',
    },
  },
  run: {
    tasks: {
      'test:all': {
        command: 'vp run void-blog-example#build && vp check && vp test',
      },
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    environment: 'node',
  },
});
