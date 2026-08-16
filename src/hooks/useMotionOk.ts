import { useEffect, useState } from 'react'

/**
 * true cuando conviene animar: el visitante no pidió reducir movimiento.
 * Con `soloPuntero`, además exige mouse (no táctil), para efectos de hover.
 */
export function useMotionOk(soloPuntero = false) {
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)')

    const evaluar = () => setOk(!reduce.matches && (!soloPuntero || fino.matches))
    evaluar()

    reduce.addEventListener('change', evaluar)
    fino.addEventListener('change', evaluar)
    return () => {
      reduce.removeEventListener('change', evaluar)
      fino.removeEventListener('change', evaluar)
    }
  }, [soloPuntero])

  return ok
}
