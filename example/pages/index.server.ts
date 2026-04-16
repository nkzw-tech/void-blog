import { createHomeLoader, type BlogHomeLoaderProps } from 'void-blog/server';
import allPosts from '../src/posts/AllPosts.ts';

export type Props = BlogHomeLoaderProps;
export const prerender = true;
export const loader = createHomeLoader({ posts: allPosts });
