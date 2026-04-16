import Stack, { VStack } from '@nkzw/stack';
import H1 from '../components/H1.tsx';
import PostCard from '../components/Post/PostCard.tsx';
import getCategoryName from '../lib/getCategoryName.ts';
import groupByCategory from '../lib/groupByCategory.ts';
import type { BlogPost } from '../lib/Types.ts';
import { useBlogConfig } from '../react/config.tsx';

export default function PostsByCategory({
  posts,
  showPinned,
}: {
  posts: ReadonlyArray<BlogPost>;
  showPinned?: boolean;
}) {
  const config = useBlogConfig();
  const postsByCategory = groupByCategory(posts);

  return Object.keys(postsByCategory).map(
    (category) =>
      category !== 'uncategorized' &&
      postsByCategory[category].some(({ pinned }) => !pinned) && (
        <VStack gap key={category}>
          <H1 className="pl-4">{getCategoryName(category, config)}</H1>
          <Stack gap={16} wrap>
            {postsByCategory[category].map(
              (post, index) =>
                (showPinned || !post.pinned) && (
                  <PostCard key={index} {...post} />
                ),
            )}
          </Stack>
        </VStack>
      ),
  );
}
