import type { ArtKey } from '../data/products'

/**
 * Ilustraciones SVG de respaldo.
 *
 * Se usan mientras no haya fotos reales del producto. Cuando existan,
 * basta con poner la ruta en `photo` dentro de data/products.ts
 * (ver public/productos/LEEME.md) y estas ilustraciones dejan de mostrarse.
 */

const SKIN = ['#f3c9a4', '#e0aa7f', '#c98b5f', '#f7d9bd']
const HAIR = ['#2b2118', '#4b3222', '#8a5a2b', '#1a1512']
const CLOTHES = ['#14b8c4', '#ef4444', '#3b6fd4', '#f4a261', '#8e6bd1', '#2f9e6f']

interface FigureProps {
  x: number
  y: number
  scale?: number
  seed?: number
  seated?: boolean
}

function Figure({ x, y, scale = 1, seed = 0, seated = false }: FigureProps) {
  const skin = SKIN[seed % SKIN.length]
  const hair = HAIR[(seed + 1) % HAIR.length]
  const shirt = CLOTHES[seed % CLOTHES.length]
  const pants = seed % 2 === 0 ? '#3b6fd4' : '#2b3440'

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* piernas */}
      {seated ? (
        <>
          <rect x="-9" y="16" width="7" height="16" rx="3.5" fill={pants} />
          <rect x="2" y="16" width="7" height="16" rx="3.5" fill={pants} />
          <rect x="-10" y="30" width="9" height="5" rx="2.5" fill="#fff" />
          <rect x="1" y="30" width="9" height="5" rx="2.5" fill="#fff" />
        </>
      ) : (
        <>
          <rect x="-8" y="15" width="7" height="20" rx="3.5" fill={pants} />
          <rect x="1" y="15" width="7" height="20" rx="3.5" fill={pants} />
          <rect x="-9" y="33" width="9" height="5" rx="2.5" fill="#fff" />
          <rect x="0" y="33" width="9" height="5" rx="2.5" fill="#fff" />
        </>
      )}
      {/* torso */}
      <path d="M-11 -2 h22 a4 4 0 0 1 4 4 v13 a4 4 0 0 1 -4 4 h-22 a4 4 0 0 1 -4 -4 v-13 a4 4 0 0 1 4 -4 z" fill={shirt} />
      {/* brazos */}
      <rect x="-17" y="0" width="6" height="15" rx="3" fill={shirt} />
      <rect x="11" y="0" width="6" height="15" rx="3" fill={shirt} />
      <circle cx="-14" cy="16" r="3.2" fill={skin} />
      <circle cx="14" cy="16" r="3.2" fill={skin} />
      {/* cabeza */}
      <circle cx="0" cy="-14" r="12" fill={skin} />
      <path d="M-12 -16 a12 12 0 0 1 24 0 q-6 -6 -12 -4 q-7 -1 -12 4 z" fill={hair} />
      <circle cx="-4.2" cy="-13" r="1.9" fill="#1a1512" />
      <circle cx="4.2" cy="-13" r="1.9" fill="#1a1512" />
      <circle cx="-3.6" cy="-13.7" r="0.6" fill="#fff" />
      <circle cx="4.8" cy="-13.7" r="0.6" fill="#fff" />
      <path d="M-3.5 -7.5 q3.5 3.2 7 0" stroke="#b0563f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="-8.5" cy="-8.5" r="2.2" fill="#ff9b9b" opacity="0.55" />
      <circle cx="8.5" cy="-8.5" r="2.2" fill="#ff9b9b" opacity="0.55" />
    </g>
  )
}

function Pet({ x, y, scale = 1, seed = 0 }: { x: number; y: number; scale?: number; seed?: number }) {
  const fur = ['#8a5a2b', '#3c3c44', '#d8b98c', '#f0efe9'][seed % 4]
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="6" rx="9" ry="7" fill={fur} />
      <circle cx="0" cy="-4" r="7" fill={fur} />
      <path d="M-7 -8 l-2 -7 l6 3 z" fill={fur} />
      <path d="M7 -8 l2 -7 l-6 3 z" fill={fur} />
      <circle cx="-2.6" cy="-4.5" r="1.3" fill="#1a1512" />
      <circle cx="2.6" cy="-4.5" r="1.3" fill="#1a1512" />
      <ellipse cx="0" cy="-1" rx="1.8" ry="1.3" fill="#1a1512" />
    </g>
  )
}

function Heart({ x, y, s = 1, fill = '#ef4444' }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 6 C -7 0 -8 -5 -4.5 -7 C -2 -8.4 0 -6.6 0 -4.6 C 0 -6.6 2 -8.4 4.5 -7 C 8 -5 7 0 0 6 Z"
      fill={fill}
    />
  )
}

function Banner({ x, y, w = 120, label }: { x: number; y: number; w?: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M${-w / 2} -10 h${w} l-8 10 l8 10 h${-w} l8 -10 z`}
        fill="#fdfaf6"
        stroke="#e6cdb0"
        strokeWidth="1.5"
      />
      <text
        x="0"
        y="4"
        textAnchor="middle"
        fontSize="10"
        fontFamily="Nunito, system-ui, sans-serif"
        fontWeight="700"
        fill="#117585"
      >
        {label}
      </text>
    </g>
  )
}

const scenes: Record<ArtKey, (label: string) => React.ReactNode> = {
  car: () => (
    <g>
      <ellipse cx="200" cy="215" rx="120" ry="12" fill="#164e5b" opacity="0.12" />
      <Figure x={160} y={126} scale={1.05} seed={0} seated />
      <Figure x={240} y={126} scale={1.05} seed={2} seated />
      <path
        d="M96 190 q10 -34 34 -38 h140 q24 4 34 38 a10 10 0 0 1 -10 12 H106 a10 10 0 0 1 -10 -12 z"
        fill="#8fd3ea"
        stroke="#5aa9c6"
        strokeWidth="2"
      />
      <path d="M132 160 q8 -18 26 -20 h84 q18 2 26 20 z" fill="#dff3fb" opacity="0.85" />
      <circle cx="136" cy="202" r="15" fill="#22303a" />
      <circle cx="136" cy="202" r="6" fill="#cfd8dd" />
      <circle cx="264" cy="202" r="15" fill="#22303a" />
      <circle cx="264" cy="202" r="6" fill="#cfd8dd" />
      <rect x="168" y="186" width="64" height="13" rx="4" fill="#fdfaf6" stroke="#e6cdb0" />
      <text x="200" y="196" textAnchor="middle" fontSize="9" fontWeight="700" fill="#117585">
        TU PLACA
      </text>
      <path d="M200 34 v22" stroke="#22303a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="30" r="7" fill="#22303a" />
    </g>
  ),
  swing: () => (
    <g>
      <rect x="52" y="34" width="296" height="184" rx="10" fill="#d7b18b" />
      <rect x="68" y="50" width="264" height="152" rx="6" fill="#eaf8fb" />
      <circle cx="120" cy="92" r="30" fill="#ffe9a8" opacity="0.7" />
      <path d="M68 168 q60 -22 132 -6 q70 16 132 -4 v44 H68 z" fill="#bfe6b4" />
      <path d="M148 56 v56 M252 56 v56" stroke="#a97c4e" strokeWidth="3" />
      <rect x="136" y="112" width="128" height="9" rx="4" fill="#c99a63" />
      <Figure x={172} y={86} scale={0.95} seed={1} seated />
      <Figure x={228} y={86} scale={0.95} seed={3} seated />
      <Heart x={200} y={98} s={1.1} />
      <Banner x={200} y={58} w={150} label="TU FRASE AQUÍ" />
      <rect x="150" y="182" width="100" height="16" rx="5" fill="#fdfaf6" stroke="#e6cdb0" />
      <text x="200" y="193" textAnchor="middle" fontSize="9" fontWeight="700" fill="#117585">
        FECHA ESPECIAL
      </text>
    </g>
  ),
  frame4d: () => (
    <g>
      <rect x="44" y="26" width="312" height="200" rx="8" fill="#e6cdb0" />
      <rect x="58" y="40" width="284" height="172" rx="4" fill="#f4efe6" />
      <g opacity="0.5" stroke="#e0d5c4" strokeWidth="2">
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M${64 + i * 32} 40 q16 24 0 48 q-16 24 0 48 q16 24 0 48 v28`} fill="none" />
        ))}
      </g>
      <Heart x={200} y={58} s={1.4} />
      <Heart x={112} y={70} s={1} />
      <Heart x={288} y={70} s={1} />
      <Figure x={116} y={150} scale={0.9} seed={0} />
      <Figure x={172} y={150} scale={0.9} seed={2} />
      <Figure x={228} y={150} scale={0.9} seed={4} />
      <Pet x={286} y={168} scale={1} seed={1} />
      {[116, 172, 228].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 26} y={96} width="52" height="14" rx="4" fill="#fff" stroke="#e6cdb0" />
          <text x={cx} y={106} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#117585">
            {['NOMBRE', 'NOMBRE', 'NOMBRE'][i]}
          </text>
        </g>
      ))}
    </g>
  ),
  standing: () => (
    <g>
      <ellipse cx="200" cy="212" rx="86" ry="12" fill="#164e5b" opacity="0.1" />
      <Figure x={200} y={118} scale={2.05} seed={2} />
      <ellipse cx="200" cy="196" rx="72" ry="18" fill="#f9f1e7" stroke="#e6cdb0" strokeWidth="2" />
      <ellipse cx="200" cy="190" rx="72" ry="18" fill="#fdfaf6" stroke="#e6cdb0" strokeWidth="2" />
      <text x="200" y="194" textAnchor="middle" fontSize="12" fontWeight="700" fill="#117585">
        Nombre
      </text>
    </g>
  ),
  mug: () => (
    <g>
      <ellipse cx="196" cy="214" rx="84" ry="11" fill="#164e5b" opacity="0.1" />
      <path d="M280 92 a34 34 0 0 1 0 62" stroke="#dfe6ea" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M112 74 h168 v106 a24 24 0 0 1 -24 24 H136 a24 24 0 0 1 -24 -24 z" fill="#ffffff" stroke="#dfe6ea" strokeWidth="3" />
      <ellipse cx="196" cy="74" rx="84" ry="12" fill="#f2f6f8" stroke="#dfe6ea" strokeWidth="3" />
      <Figure x={196} y={122} scale={1.5} seed={0} />
      <rect x="140" y="176" width="112" height="16" rx="5" fill="#eefdfd" stroke="#a9f0f5" />
      <text x="196" y="188" textAnchor="middle" fontSize="10" fontWeight="700" fill="#117585">
        TU MENSAJE
      </text>
    </g>
  ),
  keychain: () => (
    <g>
      <circle cx="200" cy="44" r="16" fill="none" stroke="#9aa7ae" strokeWidth="5" />
      <path d="M200 60 v18" stroke="#9aa7ae" strokeWidth="4" />
      <rect x="130" y="78" width="140" height="132" rx="26" fill="#eefdfd" stroke="#a9f0f5" strokeWidth="3" />
      <Figure x={200} y={136} scale={1.5} seed={3} />
      <rect x="152" y="182" width="96" height="16" rx="5" fill="#fff" stroke="#e6cdb0" />
      <text x="200" y="194" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#117585">
        NOMBRE
      </text>
    </g>
  ),
  plaque: () => (
    <g>
      <ellipse cx="200" cy="214" rx="100" ry="12" fill="#164e5b" opacity="0.1" />
      <Figure x={200} y={112} scale={1.85} seed={0} />
      <path d="M104 176 h192 a10 10 0 0 1 10 10 v20 a10 10 0 0 1 -10 10 H104 a10 10 0 0 1 -10 -10 v-20 a10 10 0 0 1 10 -10 z" fill="#ef4444" />
      <text x="200" y="199" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" letterSpacing="1">
        TU EMPRESA
      </text>
      <rect x="146" y="156" width="108" height="16" rx="5" fill="#fdfaf6" stroke="#e6cdb0" />
      <text x="200" y="168" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#117585">
        20 AÑOS · NOMBRE
      </text>
    </g>
  ),
  house: () => (
    <g>
      <path d="M200 22 L344 108 h-24 v110 H80 V108 H56 z" fill="#d7b18b" />
      <rect x="98" y="112" width="204" height="94" rx="6" fill="#f7f2e9" />
      <Heart x={162} y={82} s={1.1} />
      <Heart x={200} y={72} s={1.3} />
      <Heart x={238} y={82} s={1.1} />
      <Figure x={172} y={150} scale={1} seed={1} />
      <Figure x={228} y={150} scale={1} seed={4} />
      <Heart x={200} y={140} s={0.8} />
    </g>
  ),
  heartbase: () => (
    <g>
      <path d="M200 40 v20" stroke="#22303a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="36" r="7" fill="#22303a" />
      <path
        transform="translate(200 150) scale(11)"
        d="M0 6 C -7 0 -8 -5 -4.5 -7 C -2 -8.4 0 -6.6 0 -4.6 C 0 -6.6 2 -8.4 4.5 -7 C 8 -5 7 0 0 6 Z"
        fill="#ffd9d9"
        stroke="#ffb3b3"
        strokeWidth="0.25"
      />
      <Figure x={172} y={110} scale={0.95} seed={2} seated />
      <Figure x={228} y={110} scale={0.95} seed={5} seated />
      <Heart x={200} y={118} s={0.9} />
      <text x="200" y="186" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b8404f">
        Nombres
      </text>
    </g>
  ),
  group: () => (
    <g>
      <rect x="34" y="40" width="332" height="172" rx="8" fill="#e6cdb0" />
      <rect x="48" y="54" width="304" height="144" rx="4" fill="#f7f2e9" />
      <Banner x={200} y={76} w={190} label="LA FRASE DEL GRUPO" />
      {[92, 148, 204, 260, 316].map((cx, i) => (
        <Figure key={cx} x={cx} y={152} scale={0.88} seed={i} />
      ))}
    </g>
  ),
}

interface PieceArtProps {
  art: ArtKey
  label?: string
  className?: string
}

export default function PieceArt({ art, label = '', className = '' }: PieceArtProps) {
  return (
    <svg
      viewBox="0 0 400 240"
      className={className}
      role="img"
      aria-label={label || 'Ilustración referencial de la pieza'}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`bg-${art}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dcf8fd" />
          <stop offset="100%" stopColor="#f0eafe" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#bg-${art})`} />
      {scenes[art](label)}
    </svg>
  )
}
