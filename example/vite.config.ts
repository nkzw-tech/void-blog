import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { voidReact } from '@void/react/plugin';
import { defineConfig } from 'vite-plus';
import { voidPlugin } from 'void';
import mdxOptions from 'void-blog/mdx';
import { voidBlog } from 'void-blog/vite';
import blogConfig from './blog.config.ts';

const optimizedDeps = [
  '@nkzw/stack',
  '@void/react',
  'react',
  'react-dom',
  'react-error-boundary',
  'react/jsx-dev-runtime',
  'react/jsx-runtime',
  'void/pages-client',
  'void/pages-prefetch',
  'void-blog/react',
];

export default defineConfig({
  optimizeDeps: {
    include: optimizedDeps,
  },
  plugins: [
    voidBlog(blogConfig),
    ...voidPlugin(),
    mdx(mdxOptions),
    ...tailwindcss(),
    ...voidReact({
      prefetch: { hoverDelay: 150 },
      viewTransitions: true,
    }),
  ],
  resolve: {
    conditions: ['@nkzw/source'],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 4010,
  },
  ssr: {
    optimizeDeps: {
      include: optimizedDeps,
    },
  },
});
