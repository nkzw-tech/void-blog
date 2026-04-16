import { defineHandler } from 'void';
import type { BlogPostLoaderProps } from 'void-blog/server';

export type Props = BlogPostLoaderProps;

export const loader = defineHandler<Props>((c) => c.text('Not Found', 404));
