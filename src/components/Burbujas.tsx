import { useMemo } from 'react'
import { useMotionOk } from '../hooks/useMotionOk'

interface Props {
  /** Cuántas burbujas (pocas: es decoración, no un acuario) */
  cantidad?: number
  className?: string
}

/**
 * Burbujas que suben lentamente, guiño al mundo de la sirena del logo.
 * Puramente decorativas: no reciben eventos y desaparecen con
 * prefers-reduced-motion.
 */
export default function Burbujas({ cantidad = 14, className = '' }: Props) {
  const motionOk = useMotionOk()

  const burbujas = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => {
        // Distribución determinista: mismo resultado en cada render
        const seed = (i * 9301 + 49297) % 233280
        const r = seed / 233280
        return {
          left: `${(i / cantidad) * 100 + r * 6}%`,
          size: 6 + Math.round(r * 26),
          delay: (r * 12).toFixed(2),
          dur: (11 + r * 12).toFixed(2),
          op: 0.16 + r * 0.28,
        }
      }),
    [cantidad],
  )

  if (!motionOk) return null

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {burbujas.map((b, i) => (
        <span
          key={i}
          className="burbuja-sube"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.op,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
    </div>
  )
}
