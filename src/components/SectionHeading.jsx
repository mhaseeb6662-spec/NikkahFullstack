"use client";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}) {
  const alignCls = align === "left" ? "items-start text-left" : "items-center text-center";
  return (
    <div className={`flex flex-col ${alignCls} gap-3 mb-10 md:mb-14`}>
      {eyebrow && (
        <span
          className={`text-xs md:text-sm font-bold tracking-[0.25em] uppercase ${
            light ? "text-gold-400" : "text-rose-500"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight ${
          light ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl text-base md:text-lg ${
            light ? "text-white/70" : "text-ink-600"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div className={`ornament-divider w-40 mt-1 ${align === "left" ? "!justify-start" : ""}`}>
        <span
          className={`w-1.5 h-1.5 rotate-45 ${light ? "bg-gold-400" : "bg-gold-500"}`}
        />
      </div>
    </div>
  );
}
