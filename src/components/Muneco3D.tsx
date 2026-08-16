import { useEffect, useRef, useState } from 'react'
import { CABELLOS, OJOS, PEINADOS, PIELES, ROPAS, type ColoresMuneco } from '../data/muneco'

export { coloresIniciales, describirColores } from '../data/muneco'
export type { ColoresMuneco }

interface Props {
  colores: ColoresMuneco
  onCambio?: (c: ColoresMuneco) => void
  /** Muestra los selectores de color debajo del visor */
  conControles?: boolean
  className?: string
}

/**
 * Visor 3D del muñeco, armado con primitivas (ver three/muneco.ts).
 * Se arrastra para girarlo; sin interacción gira solo.
 *
 * Three.js se importa de forma diferida y solo cuando el visor entra en
 * pantalla, así el resto del sitio no carga con su peso.
 */
export default function Muneco3D({ colores, onCambio, conControles = true, className = '' }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const aplicarRef = useRef<((c: ColoresMuneco) => void) | null>(null)
  const [listo, setListo] = useState(false)
  const [falla, setFalla] = useState(false)

  // Monta la escena cuando el bloque se acerca a la pantalla
  useEffect(() => {
    const nodo = host.current
    if (!nodo) return

    let vivo = true
    let limpiar: (() => void) | undefined

    const montar = async () => {
      const THREE = await import('three')
      const { crearMuneco } = await import('../three/muneco')
      if (!vivo) return

      const canvas = document.createElement('canvas')
      let renderer: import('three').WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      } catch {
        setFalla(true)
        return
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'
      canvas.style.touchAction = 'pan-y'
      canvas.style.cursor = 'grab'
      nodo.appendChild(canvas)

      const escena = new THREE.Scene()
      const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
      camara.position.set(0, 0.35, 6.6)

      escena.add(new THREE.HemisphereLight(0xdcf8fd, 0xf0eafe, 1.5))

      const clave = new THREE.DirectionalLight(0xffffff, 2.1)
      clave.position.set(3.2, 5, 4.4)
      escena.add(clave)

      const relleno = new THREE.DirectionalLight(0xb79bf0, 0.9)
      relleno.position.set(-4, 1.5, 2)
      escena.add(relleno)

      const contra = new THREE.PointLight(0x5fd7ef, 1.4, 22)
      contra.position.set(-1.5, 2.5, -4)
      escena.add(contra)

      const muneco = crearMuneco(colores)
      escena.add(muneco.grupo)
      aplicarRef.current = muneco.aplicar

      const medir = () => {
        const w = nodo.clientWidth
        const h = nodo.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        camara.aspect = w / h
        camara.updateProjectionMatrix()
      }
      medir()
      const ro = new ResizeObserver(medir)
      ro.observe(nodo)

      // ---- arrastre para girar ----
      let giro = -0.35
      let giroObjetivo = -0.35
      let inclinacion = 0
      let arrastrando = false
      let ultimoX = 0
      let ultimoY = 0
      let ocioso = 0

      const abajo = (e: PointerEvent) => {
        arrastrando = true
        ocioso = 0
        ultimoX = e.clientX
        ultimoY = e.clientY
        canvas.style.cursor = 'grabbing'
        canvas.setPointerCapture(e.pointerId)
      }
      const mover = (e: PointerEvent) => {
        if (!arrastrando) return
        giroObjetivo += (e.clientX - ultimoX) * 0.01
        inclinacion = Math.max(-0.4, Math.min(0.4, inclinacion + (e.clientY - ultimoY) * 0.004))
        ultimoX = e.clientX
        ultimoY = e.clientY
      }
      const arriba = (e: PointerEvent) => {
        arrastrando = false
        canvas.style.cursor = 'grab'
        canvas.releasePointerCapture?.(e.pointerId)
      }

      canvas.addEventListener('pointerdown', abajo)
      canvas.addEventListener('pointermove', mover)
      canvas.addEventListener('pointerup', arriba)
      canvas.addEventListener('pointercancel', arriba)

      // ---- solo dibuja si está a la vista (se revisa cada 12 cuadros) ----
      let visible = true
      let cuadro = 0
      const revisarVisible = () => {
        const r = nodo.getBoundingClientRect()
        visible = r.bottom > 0 && r.top < window.innerHeight
      }

      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const reloj = new THREE.Clock()
      let raf = 0

      const dibujar = () => {
        raf = requestAnimationFrame(dibujar)
        if (++cuadro % 12 === 0) revisarVisible()
        if (!visible || document.hidden) return

        const dt = reloj.getDelta()
        if (!arrastrando) {
          ocioso += dt
          // vuelve a girar solo después de un momento sin tocarlo
          if (ocioso > 2.2 && !reducido) giroObjetivo += dt * 0.35
        }

        giro += (giroObjetivo - giro) * 0.12
        muneco.grupo.rotation.y = giro
        muneco.grupo.rotation.x = inclinacion
        muneco.grupo.position.y = reducido ? 0 : Math.sin(reloj.getElapsedTime() * 1.1) * 0.045

        renderer.render(escena, camara)
      }

      dibujar()
      setListo(true)

      limpiar = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        canvas.removeEventListener('pointerdown', abajo)
        canvas.removeEventListener('pointermove', mover)
        canvas.removeEventListener('pointerup', arriba)
        canvas.removeEventListener('pointercancel', arriba)
        muneco.liberar()
        renderer.dispose()
        canvas.remove()
        aplicarRef.current = null
      }
    }

    // Tres disparadores para que el visor nunca se quede en "Cargando":
    // el observer normal, un chequeo por scroll y, como último recurso, un
    // temporizador. El que llegue primero monta la escena.
    let montado = false
    const arrancar = () => {
      if (montado || !vivo) return
      montado = true
      io.disconnect()
      window.removeEventListener('scroll', alScroll)
      window.clearTimeout(respaldo)
      montar().catch(() => setFalla(true))
    }

    const cerca = () => {
      const r = nodo.getBoundingClientRect()
      return r.top < window.innerHeight * 1.8 && r.bottom > -window.innerHeight * 0.8
    }

    let pendiente = 0
    const alScroll = () => {
      if (pendiente) return
      pendiente = requestAnimationFrame(() => {
        pendiente = 0
        if (cerca()) arrancar()
      })
    }

    const io = new IntersectionObserver(([e]) => e.isIntersecting && arrancar(), { rootMargin: '300px' })
    io.observe(nodo)
    window.addEventListener('scroll', alScroll, { passive: true })
    const respaldo = window.setTimeout(arrancar, 6000)

    if (cerca()) arrancar()

    return () => {
      vivo = false
      io.disconnect()
      window.removeEventListener('scroll', alScroll)
      window.clearTimeout(respaldo)
      if (pendiente) cancelAnimationFrame(pendiente)
      limpiar?.()
    }
    // El muñeco se crea una sola vez; los colores se actualizan en el efecto de abajo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    aplicarRef.current?.(colores)
  }, [colores])

  const filaColor = (
    titulo: string,
    opciones: readonly { id: string; label: string; hex: string }[],
    clave: 'piel' | 'cabello' | 'ojos' | 'ropa',
  ) => (
    <div>
      <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-500">{titulo}</span>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            title={o.label}
            aria-label={`${titulo}: ${o.label}`}
            aria-pressed={colores[clave] === o.hex}
            onClick={() => onCambio?.({ ...colores, [clave]: o.hex })}
            className={`h-8 w-8 rounded-full border-2 transition ${
              colores[clave] === o.hex
                ? 'scale-110 border-ink-900 shadow-[var(--shadow-soft)]'
                : 'border-white hover:scale-105'
            }`}
            style={{ backgroundColor: o.hex }}
          />
        ))}
      </div>
    </div>
  )

  const filaOpciones = <T extends string>(
    titulo: string,
    opciones: readonly { id: T; label: string }[],
    activo: T,
    onElegir: (v: T) => void,
  ) => (
    <div>
      <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-500">{titulo}</span>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={activo === o.id}
            onClick={() => onElegir(o.id)}
            className={`chip border-2 px-3 py-1.5 ${
              activo === o.id
                ? 'border-brand-500 bg-brand-100 text-brand-800'
                : 'border-clay-200 bg-white text-ink-700'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={className}>
      <div className="bg-tornasol relative overflow-hidden rounded-[var(--radius-blob)] border border-clay-200">
        <div ref={host} className="aspect-square w-full" />

        {!listo && !falla && (
          <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-800">
            Cargando el visor 3D…
          </p>
        )}
        {falla && (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-bold text-brand-800">
            Tu navegador no puede mostrar el visor 3D, pero puedes seguir cotizando normalmente.
          </p>
        )}
        {listo && (
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-[0.7rem] font-bold text-ink-700 backdrop-blur">
            Arrástralo para girarlo
          </span>
        )}
      </div>

      {conControles && onCambio && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {filaColor('Piel', PIELES, 'piel')}
          {filaColor('Cabello', CABELLOS, 'cabello')}
          {filaColor('Ojos', OJOS, 'ojos')}
          {filaColor('Ropa', ROPAS, 'ropa')}
          {filaOpciones('Peinado', PEINADOS, colores.peinado, (peinado) =>
            onCambio({ ...colores, peinado }),
          )}
          {filaOpciones(
            'Rasgos',
            [
              { id: 'ella' as const, label: 'Femeninos' },
              { id: 'el' as const, label: 'Masculinos' },
            ],
            colores.estilo,
            (estilo) => onCambio({ ...colores, estilo }),
          )}
        </div>
      )}
    </div>
  )
}
