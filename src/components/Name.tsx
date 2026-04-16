import cx from '../lib/cx.tsx';

export default function Name({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="text-center">
      <h1
        className={cx(
          'colorful inline-block py-2 text-center text-3xl sm:text-4xl',
          className,
        )}
      >
        {children}
      </h1>
    </div>
  );
}
