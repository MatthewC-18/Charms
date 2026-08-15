export type IconName =
  | 'whatsapp'
  | 'instagram'
  | 'chat'
  | 'camera'
  | 'sketch'
  | 'hands'
  | 'check'
  | 'truck'
  | 'star'
  | 'heart'
  | 'arrow'
  | 'menu'
  | 'close'
  | 'shield'
  | 'clock'
  | 'sparkles'
  | 'mail'
  | 'pin'
  | 'plus'
  | 'minus'
  | 'building'

const paths: Record<IconName, React.ReactNode> = {
  whatsapp: (
    <path
      fill="currentColor"
      d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2m0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.09.81.83-3.01-.2-.31a8.24 8.24 0 0 1-1.26-4.4c0-4.55 3.7-8.26 8.26-8.26 2.2 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.23-8.3 8.23m4.52-6.16c-.25-.13-1.47-.72-1.69-.81s-.39-.12-.56.13-.64.8-.79.97-.29.19-.54.06a6.7 6.7 0 0 1-3.35-2.93c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31s-.87.85-.87 2.07.89 2.4 1.02 2.57 1.76 2.67 4.25 3.75c1.58.68 2.2.74 2.99.62.48-.07 1.47-.6 1.68-1.18s.2-1.08.14-1.18-.23-.19-.48-.31"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" />
    </>
  ),
  chat: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.5A8 8 0 1 1 21 12Z"
    />
  ),
  camera: (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        d="M3 9a2 2 0 0 1 2-2h2l1.5-2h7L17 7h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
      />
      <circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  sketch: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="m14.5 3.5 6 6L9 21H3v-6ZM12 6l6 6"
    />
  ),
  hands: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v5a5 5 0 0 1-5 5h-1.6a5 5 0 0 1-4.2-2.3L4 15.5a1.6 1.6 0 0 1 2.6-1.8L8 15.5"
    />
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="m8 12.5 2.6 2.6L16 9.5" />
    </>
  ),
  truck: (
    <>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  star: (
    <path
      fill="currentColor"
      d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9Z"
    />
  ),
  heart: (
    <path
      fill="currentColor"
      d="M12 20.7 4.6 13.5a4.8 4.8 0 0 1 0-6.9 5 5 0 0 1 7 0l.4.4.4-.4a5 5 0 0 1 7 0 4.8 4.8 0 0 1 0 6.9Z"
    />
  ),
  arrow: <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />,
  menu: <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />,
  close: <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />,
  shield: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M12 3l7 3v6c0 4.3-2.9 7.7-7 9-4.1-1.3-7-4.7-7-9V6Z"
    />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 7v5.3l3.3 2" />
    </>
  ),
  sparkles: (
    <path
      fill="currentColor"
      d="M12 2.5 13.7 8l5.5 1.7-5.5 1.7L12 17l-1.7-5.6L4.8 9.7 10.3 8Zm6.6 10.4.9 2.8 2.8.9-2.8.9-.9 2.8-.9-2.8-2.8-.9 2.8-.9ZM5 14l.7 2.2 2.3.8-2.3.8L5 20l-.7-2.2-2.3-.8 2.3-.8Z"
    />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="m4 7.5 8 5.5 8-5.5" />
    </>
  ),
  pin: (
    <>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  plus: <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" d="M12 5v14M5 12h14" />,
  minus: <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" d="M5 12h14" />,
  building: (
    <>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 21V9h3a2 2 0 0 1 2 2v10M2 21h20" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 7h3M8 11h3M8 15h3" />
    </>
  ),
}

interface Props {
  name: IconName
  className?: string
}

export default function Icon({ name, className = 'w-5 h-5' }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  )
}
