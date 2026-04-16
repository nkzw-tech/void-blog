import { VStack } from '@nkzw/stack';
import { useEffect, useRef } from 'react';
import cx from '../lib/cx.tsx';
import { TableOfContents as ToCType } from '../lib/Types.ts';
import Box from './Box.tsx';
import CloseIcon from './CloseIcon.tsx';
import HomeLink from './HomeLink.tsx';
import MenuIcon from './MenuIcon.tsx';

const Items = ({
  active,
  activeClassName,
  level,
  toc,
}: {
  active: string | null;
  activeClassName: string;
  level: number;
  toc: ToCType;
}) => (
  <>
    {toc.map((item) => {
      const { id, value } = item;
      const isActive = id === active;
      return (
        <div
          className="truncate"
          key={id}
          style={{
            paddingLeft: `${level * 0.4}rem`,
          }}
        >
          <a
            className={cx(
              'no-underline transition-colors duration-200 hover:underline',
              {
                [activeClassName]: isActive,
              },
            )}
            href={`#${id}`}
          >
            <span
              className={cx({
                invisible: !isActive,
              })}
            >
              ›{' '}
            </span>
            {value}
          </a>
          {item.children?.length ? (
            <Items
              active={active}
              activeClassName={activeClassName}
              level={level + 1}
              toc={item.children}
            />
          ) : null}
        </div>
      );
    })}
  </>
);

export default function TableOfContents({
  active,
  className,
  color,
  tableOfContents,
}: {
  active: string | null;
  className?: string;
  color?: string | null;
  tableOfContents: ToCType;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const show = () => menuRef.current?.classList.remove('-translate-x-full');
  const hide = () => menuRef.current?.classList.add('-translate-x-full');
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.transitionDuration = '';
    }

    const listener = (event: MouseEvent) => {
      if (menuRef.current?.classList.contains('-translate-x-full')) {
        return;
      }

      let target: ParentNode | null = event.target as ParentNode;
      while (target) {
        if (target === menuRef.current) {
          return;
        }
        target = target.parentNode;
      }
      hide();
    };
    document.addEventListener('click', listener, true);
    return () => document.removeEventListener('click', listener, true);
  }, []);

  return (
    <div className={className}>
      <div
        className={cx(
          'void-blog-pressable text-cblue fixed top-0 z-30 cursor-pointer p-1 px-2 pt-3 transition-all duration-300 sm:p-2 sm:px-3 sm:pt-4 lg:hidden',
          color,
        )}
        onClick={show}
      >
        <MenuIcon />
      </div>
      <div
        className="fixed top-0 bottom-0 left-0 z-30 -translate-x-full bg-(--background-color) p-4 text-base drop-shadow-lg transition-transform duration-300 lg:top-18 lg:translate-x-0 lg:border-none lg:bg-transparent lg:text-sm lg:drop-shadow-none lg:duration-0 xl:text-base dark:border-r dark:border-neutral-600 dark:drop-shadow-none"
        ref={menuRef}
        style={{
          maxWidth: 'var(--toc-max-width)',
          transitionDuration: '0ms',
          width: 'var(--toc-width)',
        }}
      >
        <div
          className="void-blog-pressable absolute top-3 right-2 cursor-pointer p-2 text-cblue transition-all duration-300 hover:text-gray-500 lg:hidden dark:hover:text-gray-400"
          onClick={hide}
        >
          <CloseIcon />
        </div>
        <HomeLink className="lg:hidden" />
        <Box className="mt-12 lg:mt-0" gap={16}>
          <div className="pl-2 font-bold">Table of Contents</div>
          <VStack gap={4}>
            <Items
              active={active}
              activeClassName={color || 'text-gray-500 dark:text-gray-400'}
              level={0}
              toc={tableOfContents}
            />
          </VStack>
        </Box>
      </div>
    </div>
  );
}
