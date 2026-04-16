import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import cx from '../lib/cx.tsx';

type Props = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  hasVariants?: boolean;
};

export default function Image({ className, hasVariants, ...props }: Props) {
  if (!props.src) {
    return null;
  }

  const parts = props.src.split('.');
  const extension = parts.pop();
  const image = (
    <img
      className={cx('rounded-[32px] [corner-shape:squircle]', className)}
      loading="lazy"
      {...props}
    />
  );
  return hasVariants === false ? (
    image
  ) : (
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcSet={[...parts, 'dark', extension].join('.')}
      />
      <source
        media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
        srcSet={props.src}
      />
      {image}
    </picture>
  );
}
