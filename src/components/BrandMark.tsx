// Logo Family Reconnect: hai nét đỏ chéo tạo chữ F và một chấm trắng, trên nền xanh navy.
export const LOGO_RED = "#C22938";

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--navy)" />
      <path d="M21 7.6 10.6 15.4M21 15.2l-6.4 5" stroke={LOGO_RED} strokeWidth="4.8" strokeLinecap="round" fill="none" />
      <circle cx="19.2" cy="24" r="2.4" fill="#FFFFFF" />
    </svg>
  );
}
