export default function VideoFlashIcon({ icon }) {
  if (icon === "play")
    return (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="white">
        <path d="M5 3.5l12 6.5-12 6.5V3.5z" />
      </svg>
    );
  if (icon === "pause")
    return (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="white">
        <rect x="4" y="3" width="4" height="14" rx="1" />
        <rect x="12" y="3" width="4" height="14" rx="1" />
      </svg>
    );
  if (icon === "rewind")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        <text
          x="12"
          y="14"
          textAnchor="middle"
          fontSize="5"
          fill="white"
          fontWeight="bold"
        >
          5
        </text>
      </svg>
    );
  if (icon === "forward")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
        <text
          x="12"
          y="14"
          textAnchor="middle"
          fontSize="5"
          fill="white"
          fontWeight="bold"
        >
          5
        </text>
      </svg>
    );
  return null;
}
