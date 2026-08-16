import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Retraso en ms, para escalonar elementos de una misma fila */
  delay?: number
  className?: string
  /** 'abajo' sube al aparecer · 'zoom' entra con escala */
  modo?: 'abajo' | 'zoom'
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Aparición al hacer scroll. Usa IntersectionObserver y solo agrega una clase,
 * así que no cuesta nada en rendimiento. Respeta prefers-reduced-motion desde el CSS.
 */
export default function Reveal({ children, delay = 0, className = '', modo = 'abajo', as = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    obs.observe(el)

    // Red de seguridad: si el observer nunca dispara (navegador raro, pestaña
    // en segundo plano), el contenido igual aparece. Nada puede quedar invisible.
    const respaldo = window.setTimeout(() => setVisible(true), 1500)

    return () => {
      obs.disconnect()
      window.clearTimeout(respaldo)
    }
  }, [])

  const Tag = as as 'div'

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`revelable revelable-${modo} ${visible ? 'revelado' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
