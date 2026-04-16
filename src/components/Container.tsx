import { VStack } from '@nkzw/stack';
import { ReactNode } from 'react';
import cx from '../lib/cx.tsx';

export default function Container({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <VStack
      className={cx('relative mx-auto max-w-(--breakpoint-md) px-4', className)}
      gap={24}
    >
      {children}
    </VStack>
  );
}
