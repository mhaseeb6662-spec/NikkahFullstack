"use client";

export default function LegalPage({ title, updated, sections }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-rose-500">Legal</span>
        <h1 className="font-display text-4xl font-semibold text-ink-900 mt-2">{title}</h1>
        <p className="text-ink-400 text-sm mt-2">Last updated: {updated}</p>
      </div>
      <div className="bg-white rounded-2xl border border-ink-900/5 shadow-sm p-6 sm:p-10 space-y-8">
        {sections.map(({ heading, body }) => (
          <div key={heading}>
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">{heading}</h2>
            <p className="text-sm text-ink-600 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
