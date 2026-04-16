import cx from '../lib/cx.tsx';

export default function H1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cx('text-2xl tracking-wide sm:text-3xl', className)}>
      {children}
    </h1>
  );
}
