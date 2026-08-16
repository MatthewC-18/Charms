import { useEffect, useRef } from 'react'

/**
 * Barra de progreso de lectura con la cola de sirena nadando sobre ella.
 * Es el detalle de marca más visible del sitio y no estorba: 4 px arriba de todo.
 *
 * El scroll se lee dentro de requestAnimationFrame y solo escribe variables CSS,
 * así que no dispara renders de React.
 */
export default function ProgresoSirena() {
  const barra = useRef<HTMLDivElement>(null)
  const cola = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let pedido = 0

    const pintar = () => {
      pedido = 0
      const alto = document.documentElement.scrollHeight - window.innerHeight
      const avance = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0

      if (barra.current) barra.current.style.transform = `scaleX(${avance})`
      if (cola.current) {
        cola.current.style.left = `${avance * 100}%`
        // se inclina un poco según avanza, como si nadara
        cola.current.style.transform = `translate(-50%, -42%) rotate(${-8 + avance * 16}deg)`
        cola.current.style.opacity = avance > 0.01 ? '1' : '0'
      }
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
      <img
        ref={cola}
        src="./marca/cola-sirena.webp"
        alt=""
        className="absolute top-0 h-7 w-auto opacity-0 transition-opacity duration-300 drop-shadow-[0_2px_6px_rgba(22,35,63,0.25)]"
        style={{ left: '0%', transform: 'translate(-50%, -42%)' }}
      />
    </div>
  )
}
