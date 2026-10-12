export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? 'brand-mark brand-mark--compact' : 'brand-mark'} aria-label="Crewami">
      <svg viewBox="0 0 44 44" role="img" aria-hidden="true">
        <path d="M13.1 13.8c0-3.5 2.8-6.3 6.3-6.3s6.3 2.8 6.3 6.3-2.8 6.3-6.3 6.3-6.3-2.8-6.3-6.3Z" />
        <path d="M23.9 18.8c.7-3.8 4.4-6.3 8.2-5.6 3.8.7 6.3 4.4 5.6 8.2-.7 3.8-4.4 6.3-8.2 5.6" />
        <path d="M7 35.5c.9-7.3 5-11 12.3-11 6.7 0 10.7 3.2 12 9.6" />
      </svg>
    </span>
  );
}
