import type { Options } from '@mdx-js/rollup';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { transformerMetaHighlight } from '@shikijs/transformers';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import smartypants from 'remark-smartypants';
import { createHighlighter, type ThemeRegistrationResolved } from 'shiki';
import remarkInlineNotes from './remarkInlineNotes.ts';
import shikiTransformerCodeTitle from './shikiTransformerCodeTitle.ts';
import Dunkel from './themes/dunkel.json' with { type: 'json' };
import Licht from './themes/licht.json' with { type: 'json' };

const highlighter = await createHighlighter({
  langs: ['bash', 'json', 'fish', 'ini', 'css', 'js', 'ts', 'tsx'],
  themes: [
    Licht as unknown as ThemeRegistrationResolved,
    Dunkel as unknown as ThemeRegistrationResolved,
  ],
});

const mdxOptions: Options = {
  rehypePlugins: [
    [
      rehypeShikiFromHighlighter,
      highlighter,
      {
        themes: {
          dark: 'Dunkel',
          light: 'Licht',
        },
        transformers: [shikiTransformerCodeTitle(), transformerMetaHighlight()],
      },
    ],
    rehypeSlug,
    rehypeExtractToc,
    withTocExport,
  ],
  remarkPlugins: [
    remarkInlineNotes,
    smartypants,
    remarkGfm,
    remarkFrontmatter,
    remarkMdxFrontmatter,
  ],
};

export default mdxOptions;
