import { defineConfig } from 'void/config';

export default defineConfig({
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    link: [
      {
        href: '/favicon.svg',
        rel: 'icon',
      },
      {
        href: '/feed.xml',
        rel: 'alternate',
        type: 'application/rss+xml',
      },
    ],
    meta: [
      {
        // HTML requires the UTF-8 encoding label.
        // oxlint-disable-next-line unicorn/text-encoding-identifier-case
        charset: 'utf-8',
      },
      {
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        name: 'viewport',
      },
      {
        content: 'Concise docs for building MDX blogs on Void.',
        name: 'description',
      },
      {
        content: 'Void Blog Docs',
        property: 'og:title',
      },
      {
        content: 'Concise docs for building MDX blogs on Void.',
        property: 'og:description',
      },
      {
        content: 'http://localhost:4010/images/header.svg',
        property: 'og:image',
      },
    ],
    title: 'Void Blog Docs',
  },
  routing: {
    headers: {
      '/posts/*.md': ['Content-Type: text/markdown; charset=utf-8'],
    },
  },
  worker: {
    compatibility_date: '2025-12-17',
  },
});
