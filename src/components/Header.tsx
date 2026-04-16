import cx from '../lib/cx.tsx';
import { useBlogConfig } from '../react/config.tsx';
import HomeLink from './HomeLink.tsx';

export default function Header({ className }: { className?: string }) {
  const config = useBlogConfig();

  return (
    <header>
      <div className="name mx-auto my-2 max-w-(--breakpoint-md) px-4 text-center">
        <span
          className={cx(
            'header-text colorful inline-block px-6 text-2xl tracking-wide whitespace-nowrap sm:text-3xl',
            className,
          )}
        >
          {config.site.name}
        </span>
      </div>
      <HomeLink className="fixed top-0 left-0 z-100 hidden p-4 pl-4 lg:block" />
    </header>
  );
}
