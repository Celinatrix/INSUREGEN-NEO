import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "on-dark";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-[#128a3e] focus-visible:outline-accent",
  secondary:
    "bg-primary text-white hover:bg-[#025a86] focus-visible:outline-primary",
  ghost:
    "bg-transparent text-primary border border-border hover:bg-muted",
  "on-dark":
    "bg-white text-navy hover:bg-neo-cyan/90",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 min-h-11 focus-visible:outline focus-visible:outline-offset-2";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
