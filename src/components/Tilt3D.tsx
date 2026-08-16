import { useRef, type ReactNode } from 'react'
import { useMotionOk } from '../hooks/useMotionOk'

interface Props {
  children: ReactNode
  className?: string
  /** Grados máximos de inclinación */
  max?: number
  /** Muestra el reflejo tornasol que sigue al mouse */
  brillo?: boolean
}

/**
 * Inclinación 3D siguiendo el mouse, con reflejo tornasol.
 * Solo se activa con mouse fino y si el visitante no pidió reducir movimiento;
 * en táctil y en modo reducido el contenido queda plano y normal.
 *
 * Todo se resuelve con variables CSS y `transform`, así que el navegador lo
 * anima en la GPU sin re-renderizar React en cada movimiento.
 */
export default function Tilt3D({ children, className = '', max = 9, brillo = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const activo = useMotionOk(true)

  const mover = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || !activo) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height

    el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
    el.style.setProperty('--brillo', '1')
  }

  const salir = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--brillo', '0')
  }

  return (
    <div
      ref={ref}
      onPointerMove={mover}
      onPointerLeave={salir}
      className={`tilt3d ${activo ? 'tilt3d-activo' : ''} ${className}`}
    >
      <div className="tilt3d-cara">
        {children}
        {brillo && activo && <span className="tilt3d-brillo" aria-hidden="true" />}
      </div>
    </div>
  )
}
