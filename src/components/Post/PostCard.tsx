import { Link } from '@void/react';
import cx from '../../lib/cx.tsx';
import getPostTypeColor from '../../lib/getPostTypeColor.ts';
import { Post } from '../../lib/Types.ts';
import { useBlogConfig } from '../../react/config.tsx';
import Box from '../Box.tsx';

export default function PostCard({
  slug,
  title,
  type,
}: Pick<Post, 'slug' | 'title' | 'type'>) {
  const config = useBlogConfig();
  const color = getPostTypeColor(type ?? null, config);
  return (
    <Box
      className={cx(
        'void-blog-pressable group relative m-0 block h-26 w-[calc(50%-16px)] cursor-pointer p-4 no-underline shadow-md hover:bg-(--background-color) hover:underline sm:h-32 sm:w-[calc(33.33%-16px)]',
        color || 'text-cblue',
        { 'hover:text-cblue': !color },
      )}
    >
      <div className="line-clamp-2 sm:line-clamp-3">{title}</div>
      <div className="post-card-gradient absolute inset-0 -bottom-px"></div>
      <div
        className={cx(
          'absolute right-4 bottom-4 text-sm italic',
          !type && 'text-gray-500 dark:text-gray-400',
        )}
      >
        {type || config.text.articleFallbackType}
      </div>
      <Link
        aria-label={title}
        className="absolute inset-0"
        href={`${config.routeBase}/${slug}`}
        prefetch
      />
    </Box>
  );
}
