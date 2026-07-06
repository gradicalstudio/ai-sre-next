const ROTATION = {
  right: "rotate-0",
  left: "rotate-180",
  down: "rotate-90",
  up: "-rotate-90",
};

export function ChevronIcon({ className = "", direction = "right" }) {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${ROTATION[direction]} ${className}`}
    >
      <path d="M2.66666 13.3327H0V10.666H2.66666V13.3327Z" fill="currentColor" />
      <path d="M5.33464 10.6667H2.66797V8H5.33464V10.6667Z" fill="currentColor" />
      <path d="M7.9987 7.9987H5.33203V5.33203H7.9987V7.9987Z" fill="currentColor" />
      <path d="M5.33464 5.33268H2.66797V2.66602H5.33464V5.33268Z" fill="currentColor" />
      <path d="M2.66666 2.66667H0V0H2.66666V2.66667Z" fill="currentColor" />
    </svg>
  );
}