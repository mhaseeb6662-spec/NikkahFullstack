"use client";

import { Link } from "@/lib/router-compat";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
const variants = {
  primary:
    "bg-maroon-500 text-white hover:bg-maroon-600 shadow-lg shadow-maroon-500/20 hover:shadow-xl hover:shadow-maroon-500/30 hover:-translate-y-0.5",
  outline:
    "border-2 border-maroon-500 text-maroon-500 hover:bg-maroon-500 hover:text-white",
  ghost: "text-ink-900 hover:bg-blush-200",
  gold: "bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-500/20",
  white: "bg-white text-maroon-500 hover:bg-blush-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};
const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm md:text-base",
  lg: "px-8 py-4 text-base md:text-lg",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
