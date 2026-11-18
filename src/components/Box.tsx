import { Gap, VStack } from '@nkzw/stack';
import { ReactNode, RefObject } from 'react';
import cx from '../lib/cx.tsx';

export default function Box({
  children,
  className,
  gap,
  href,
  ref,
}: {
  children?: ReactNode;
  className?: string;
  gap?: Gap;
  href?: string;
  ref?: RefObject<HTMLElement | null>;
}) {
  const element = href
    ? {
        as: 'a' as const,
        href,
        ref: ref as RefObject<HTMLAnchorElement | null>,
      }
    : { as: 'div' as const, ref: ref as RefObject<HTMLDivElement | null> };
  return (
    <VStack
      {...element}
      className={cx(
        'box overflow-hidden rounded-[32px] border p-4 text-ellipsis shadow-md backdrop-blur-xl transition-shadow duration-250 [corner-shape:squircle] hover:shadow-lg',
        className,
      )}
      gap={gap}
    >
      {children}
    </VStack>
  );
}
