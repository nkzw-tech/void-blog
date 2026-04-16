import { Link } from '@void/react';
import cx from '../lib/cx.tsx';
import { useBlogConfig } from '../react/config.tsx';

export default function HomeLink({ className }: { className?: string }) {
  const config = useBlogConfig();

  return (
    <Link
      className={cx(
        'group cursor-pointer no-underline hover:underline',
        className,
      )}
      href="/"
      prefetch
    >
      <span className="inline-block translate-x-0 transition-transform duration-300 group-hover:-translate-x-1">
        ‹
      </span>{' '}
      {config.text.homeLink}
    </Link>
  );
}
