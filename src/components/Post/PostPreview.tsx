import { Link } from '@void/react';
import cx from '../../lib/cx.tsx';
import getPostTypeColor from '../../lib/getPostTypeColor.ts';
import { PostWithContent } from '../../lib/Types.ts';
import { useBlogConfig } from '../../react/config.tsx';
import Box from '../Box.tsx';
import H1 from '../H1.tsx';
import PostBody from './PostBody.tsx';
import PostMetadata from './PostMetadata.tsx';

const InlineLink = ({
  ariaLabel,
  children,
  className,
  slug,
}: {
  ariaLabel?: string;
  children?: React.ReactNode;
  className: string;
  slug: string;
}) => {
  const config = useBlogConfig();

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      href={`${config.routeBase}/${slug}`}
      prefetch
    >
      {children}
    </Link>
  );
};

export default function PostPreview({
  content,
  date,
  slug,
  title,
  type,
}: PostWithContent) {
  const config = useBlogConfig();

  return (
    <Box className="void-blog-pressable group relative h-[50vh] cursor-pointer hover:bg-white hover:dark:bg-neutral-800">
      <H1 className={cx('my-0 pb-2', getPostTypeColor(type ?? null, config))}>
        <InlineLink
          className={cx(
            'group-hover:underline',
            getPostTypeColor(type ?? null, config),
          )}
          slug={slug}
        >
          {title}
        </InlineLink>
      </H1>
      <PostMetadata date={date} />
      {content && <PostBody content={content} />}
      <div className="post-gradient absolute inset-0 -bottom-px"></div>
      <span className="read-more colorful-hover absolute bottom-3 text-cblue italic">
        Read More…
      </span>
      <InlineLink
        aria-label={title}
        className="absolute top-0 right-0 bottom-0 left-0"
        slug={slug}
      />
    </Box>
  );
}
