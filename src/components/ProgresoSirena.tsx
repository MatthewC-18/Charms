import { useEffect, useRef } from 'react'

/**
 * Barra de progreso de lectura, en el degradado tornasol de la marca.
 * Va acompañada de la sirena 3D (SirenaGuia), que nada por el costado.
 *
 * El scroll se lee dentro de requestAnimationFrame y solo escribe variables CSS,
 * así que no dispara renders de React.
 */
export default function ProgresoSirena() {
  const barra = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let pedido = 0

    const pintar = () => {
      pedido = 0
      const alto = document.documentElement.scrollHeight - window.innerHeight
      const avance = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0

      if (barra.current) barra.current.style.transform = `scaleX(${avance})`
    }

    const alScroll = () => {
      if (!pedido) pedido = requestAnimationFrame(pintar)
    }

    pintar()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
      if (pedido) cancelAnimationFrame(pedido)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1" aria-hidden="true">
      <div
        ref={barra}
        className="h-full origin-left bg-gradient-to-r from-brand-300 via-lila-300 to-rosa-300"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
