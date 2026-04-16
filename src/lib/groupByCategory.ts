import type { Post } from './Types.ts';

export default function groupByCategory(
  posts: ReadonlyArray<Post>,
): Record<string, Array<Post>> {
  const groups: Record<string, Array<Post>> = {};

  for (const post of posts) {
    const category = post.category ?? 'uncategorized';
    (groups[category] || (groups[category] = [])).push(post);
  }

  return groups;
}
