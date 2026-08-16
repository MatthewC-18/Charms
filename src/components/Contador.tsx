import { useEffect, useRef, useState } from 'react'
import { useMotionOk } from '../hooks/useMotionOk'

/**
 * Cuenta hacia arriba el primer número que encuentre en el texto
 * ("+900 piezas" → anima el 900) cuando el bloque entra en pantalla.
 */
export default function Contador({ valor, className = '' }: { valor: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionOk = useMotionOk()
  const [texto, setTexto] = useState(valor)

  useEffect(() => {
    const partes = valor.match(/^(\D*)(\d+)(.*)$/)
    if (!partes || !motionOk) {
      setTexto(valor)
      return
    }

    const [, antes, numeroTxt, despues] = partes
    const objetivo = Number(numeroTxt)
    setTexto(`${antes}0${despues}`)

    const el = ref.current
    if (!el) return

    let raf = 0
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        obs.disconnect()

        const inicio = performance.now()
        const dur = 1100

        const paso = (ahora: number) => {
          const t = Math.min(1, (ahora - inicio) / dur)
          // easing suave al final
          const v = Math.round(objetivo * (1 - Math.pow(1 - t, 3)))
          setTexto(`${antes}${v}${despues}`)
          if (t < 1) raf = requestAnimationFrame(paso)
        }

        raf = requestAnimationFrame(paso)
      },
      { threshold: 0.4 },
    )

    obs.observe(el)

    // Si el observer no dispara, se muestra el número final igual
    const respaldo = window.setTimeout(() => setTexto(valor), 2500)

    return () => {
      obs.disconnect()
      window.clearTimeout(respaldo)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [valor, motionOk])

  return (
    <span ref={ref} className={className}>
      {texto}
    </span>
  )
}
