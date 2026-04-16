import cx from '../lib/cx.tsx';

export default function Video({
  className,
  src,
  style,
}: {
  className?: string;
  src: string;
  style?: React.CSSProperties;
}) {
  const dotIndex = src.lastIndexOf('.');
  const extension = src.slice(Math.max(0, dotIndex + 1));
  return (
    <video
      autoPlay
      className={cx(
        'mx-auto block w-full rounded-[32px] drop-shadow-lg [corner-shape:squircle]',
        className,
      )}
      loop
      muted
      playsInline
      style={style}
    >
      <source src={src} type={`video/${extension}`} />
      <source
        src={`${src.slice(0, Math.max(0, dotIndex))}.mp4`}
        type="video/mp4"
      />
    </video>
  );
}
