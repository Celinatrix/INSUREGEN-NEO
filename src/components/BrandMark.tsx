export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="var(--navy)" />
      <path
        d="M8 17.5 16 10l8 7.5V24a1 1 0 0 1-1 1h-4.5v-5h-5v5H9a1 1 0 0 1-1-1v-6.5Z"
        fill="none"
        stroke="var(--navy-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16.5" r="2" fill="var(--card-accent)" />
    </svg>
  );
}
