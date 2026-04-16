export default function CloseIcon({
  height = 16,
  width = 16,
}: {
  height?: number;
  width?: number;
}) {
  return (
    <svg height={height} viewBox="0 0 15 15" width={width}>
      <g strokeWidth="1.2">
        <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25" stroke="currentColor" />
      </g>
    </svg>
  );
}
