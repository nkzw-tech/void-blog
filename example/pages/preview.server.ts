import { createPreviewHead } from 'void-blog/server';
import blogConfig from '../blog.config.ts';

export const revalidate = 0;
export const head = createPreviewHead(blogConfig);
