"use client";

export function Field({ label, children, hint }) {
  return (
    <label className="block mb-4">
      {label && (
        <span className="block text-sm font-semibold text-ink-800 mb-1.5">{label}</span>
      )}
      {children}
      {hint && <span className="block text-xs text-ink-400 mt-1">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full px-4 py-2.5 rounded-xl border border-ink-900/10 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/40 focus:border-maroon-500 transition-all";

export function Input({ className = "", ...props }) {
  return <input className={`${inputBase} ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${inputBase} appearance-none bg-no-repeat bg-right pr-10 ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...props }) {
  return <textarea className={`${inputBase} min-h-28 resize-y ${className}`} {...props} />;
}
