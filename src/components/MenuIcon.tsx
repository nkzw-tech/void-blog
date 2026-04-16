export default function MenuIcon({
  height = 24,
  width = 24,
}: {
  height?: number;
  width?: number;
}) {
  return (
    <svg aria-hidden="true" height={height} viewBox="0 0 30 30" width={width}>
      <path
        d="M4 7h22M4 15h22M4 23h22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="1.2"
      />
    </svg>
  );
}
