interface Props {
  className?: string
  withWordmark?: boolean
}

/** Isotipo: círculo turquesa con cola de sirena, inspirado en el perfil de Instagram. */
export default function Logo({ className = 'h-11', withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-full w-auto" role="img" aria-label="Charms Ecuador">
        <defs>
          <linearGradient id="charms-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ee3ec" />
            <stop offset="100%" stopColor="#14b8c4" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#charms-ring)" />
        <circle cx="32" cy="32" r="26" fill="#eefdfd" />
        <path
          d="M14 40c6-1 8-7 14-7 5 0 6 4 11 4 4 0 6-2 8-4 1 7-4 13-11 13-4 0-6-2-10-2-4 0-8 2-12-4Z"
          fill="#14b8c4"
        />
        <path
          d="M40 18c4-3 9-3 12 1-3 1-5 3-6 6-2-3-4-5-6-7Z"
          fill="#0e93a3"
        />
        <path d="M18 26c4-4 10-6 16-4-5 1-9 3-12 7Z" fill="#33cddb" />
        <circle cx="27" cy="27" r="2.4" fill="#117585" />
      </svg>
      {withWordmark && (
        <span className="font-display text-xl font-extrabold leading-none tracking-tight text-ink-900">
          Charms
          <span className="block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand-600">
            Ecuador
          </span>
        </span>
      )}
    </span>
  )
}
