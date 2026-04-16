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
  const as = href ? 'a' : 'div';
  return (
    <VStack
      as={as}
      className={cx(
        'box overflow-hidden rounded-[32px] border p-4 text-ellipsis shadow-md backdrop-blur-xl transition-shadow duration-250 [corner-shape:squircle] hover:shadow-lg',
        className,
      )}
      gap={gap}
      // @ts-expect-error
      href={href}
      ref={ref as RefObject<HTMLAnchorElement | null>}
    >
      {children}
    </VStack>
  );
}
