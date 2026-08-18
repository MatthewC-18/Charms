import { useEffect, useRef, useState } from 'react'
import { useMotionOk } from '../hooks/useMotionOk'
import { categoryPriceFrom } from '../data/products'
import { money } from '../lib/quote'
import type { Pose } from '../three/sirena'

/**
 * Charmy, la sirena que acompaña la lectura.
 *
 * Canvas fijo a pantalla completa (sin capturar clics). Charmy nada por el
 * margen lateral —nunca por encima del texto— y cada tanto se cambia de lado
 * cruzando por abajo, girando hacia donde va y ladeándose en la curva. Mientras
 * tanto va diciendo cosas: cambia de pose y aparece un globo anclado sobre su
 * cabeza.
 *
 * Three.js y el modelo se cargan en un chunk aparte y solo si el equipo puede
 * con WebGL y el visitante no pidió reducir movimiento.
 */

interface Dialogo {
  texto: string
  pose: Pose
}

/** Lo que dice Charmy, en orden. Los precios salen del catálogo, no a mano. */
const guion: Dialogo[] = [
  { texto: '¡Hola! 👋✨ Soy Charmy 🧜‍♀️', pose: 'saludo' },
  { texto: '💖 Bienvenido a Charms Ecuador 🇪🇨', pose: 'presentar' },
  { texto: '🎨 Todo lo hacemos a mano, en porcelana fría 🙌', pose: 'presentar' },
  { texto: '👀 ¿Ya viste el catálogo? Sigue bajando ⬇️', pose: 'idea' },
  { texto: `🚗 Colgantes de retrovisor desde ${money(categoryPriceFrom('retrovisor'))} 💫`, pose: 'presentar' },
  { texto: '💕 El cuadro columpio es el más pedido 🌷', pose: 'idea' },
  { texto: '📸 Mándanos una foto y la volvemos figura ✨', pose: 'presentar' },
  { texto: '🚚 Enviamos a todo el Ecuador 📦', pose: 'celebrar' },
  { texto: '💬 ¿Tienes dudas? Escríbenos por WhatsApp 💚', pose: 'saludo' },
  { texto: '🥰 Gracias por llegar hasta acá ✨🐚', pose: 'celebrar' },
]

/** Ritmo del guion, en segundos */
const ESPERA_INICIAL = 0.8
const DURACION = 4.2
const PAUSA = 1.6

/** Carril lateral donde vive Charmy, como fracción del semiancho visible */
const CARRIL = 0.78
/** Cada cuántos segundos se cambia de lado */
const CAMBIO_LADO = 15

export default function SirenaGuia() {
  const contenedor = useRef<HTMLDivElement>(null)
  const globo = useRef<HTMLDivElement>(null)
  const [linea, setLinea] = useState<string | null>(null)
  const motionOk = useMotionOk()

  useEffect(() => {
    if (!motionOk) return
    const host = contenedor.current
    if (!host) return

    let vivo = true
    let limpiar: (() => void) | undefined

    const iniciar = async () => {
      const THREE = await import('three')
      const { crearSirena } = await import('../three/sirena')
      if (!vivo) return

      const canvas = document.createElement('canvas')
      let renderer: import('three').WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        })
      } catch {
        return // sin WebGL: la página sigue igual, solo sin sirena
      }

      const esMovil = () => window.innerWidth < 768
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, esMovil() ? 1.5 : 2))
      host.prepend(canvas)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'

      const escena = new THREE.Scene()
      const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camara.position.z = 7

      // Luz suave y pareja: el modelo ya trae su color en las texturas, así que
      // la luz solo tiene que dar volumen sin apagarle la cara.
      escena.add(new THREE.HemisphereLight(0xdcf8fd, 0xf0eafe, 2.0))
      const clave = new THREE.DirectionalLight(0xffffff, 1.5)
      clave.position.set(2.5, 4, 5)
      escena.add(clave)
      const relleno = new THREE.DirectionalLight(0xb79bf0, 0.6)
      relleno.position.set(-3, 1, 2)
      escena.add(relleno)

      let sirena: Awaited<ReturnType<typeof crearSirena>>
      try {
        sirena = await crearSirena()
      } catch {
        renderer.dispose()
        canvas.remove()
        return // el modelo no cargó: la página sigue igual
      }
      if (!vivo) {
        sirena.liberar()
        renderer.dispose()
        canvas.remove()
        return
      }
      escena.add(sirena.grupo)

      const medir = () => {
        const w = host.clientWidth
        const h = host.clientHeight
        renderer.setSize(w, h, false)
        camara.aspect = w / h
        camara.updateProjectionMatrix()
      }
      medir()

      const alturaVisible = () => 2 * Math.tan((camara.fov * Math.PI) / 360) * camara.position.z
      const anchoVisible = () => alturaVisible() * camara.aspect

      let avance = 0
      let avanceSuave = 0
      let energia = 0
      let ultimoAvance = 0

      const leerScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        avance = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0
      }
      leerScroll()
      avanceSuave = avance

      // Lado del carril: +1 derecha, −1 izquierda. `ladoSuave` lo persigue, y su
      // velocidad es la que hace que Charmy gire y se ladee al cruzar.
      let lado = 1
      let ladoSuave = 1
      let velLado = 0
      let proximoCambio = CAMBIO_LADO

      // Guion
      let indice = -1
      let ocultarEn = 0
      let siguienteEn = ESPERA_INICIAL
      let hablando = false

      let raf = 0
      let ultimoT = 0
      const reloj = new THREE.Clock()
      const ancla = new THREE.Vector3()
      const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

      const dibujar = () => {
        raf = requestAnimationFrame(dibujar)
        if (document.hidden) return

        const t = reloj.getElapsedTime()
        const dt = Math.min(0.05, Math.max(0.001, t - ultimoT))
        ultimoT = t

        avanceSuave += (avance - avanceSuave) * 0.06
        const velocidad = Math.abs(avanceSuave - ultimoAvance)
        ultimoAvance = avanceSuave
        energia += (Math.min(1, velocidad * 90) - energia) * 0.08

        const movil = esMovil()
        const h = alturaVisible()
        const w = anchoVisible()

        // Ocupa una fracción del alto de la pantalla, no un tamaño fijo
        const escala = (h * (movil ? 0.18 : 0.22)) / sirena.alto
        sirena.grupo.scale.setScalar(escala)

        const medioAlto = (sirena.alto / 2) * escala
        const medioAncho = sirena.medioAncho * escala
        const margen = 0.25

        // ---------- recorrido ----------
        if (t > proximoCambio) {
          lado = -lado
          proximoCambio = t + CAMBIO_LADO
        }
        const anterior = ladoSuave
        // seguimiento amortiguado: el cruce dura ~1.5 s y no tiene esquinas
        ladoSuave += (lado - ladoSuave) * (1 - Math.exp(-dt * 1.9))
        velLado = (ladoSuave - anterior) / dt

        // Nada por el carril lateral con una deriva suave; al cruzar baja un
        // poco para no pasar por encima de lo que se está leyendo.
        const cruce = 1 - Math.abs(ladoSuave)
        const objetivoX = ladoSuave * CARRIL + Math.sin(t * 0.37) * 0.05
        const objetivoY = 0.7 - avanceSuave * 1.45 + Math.sin(t * 0.55) * 0.05 - cruce * 0.42

        const x = limitar((objetivoX * w) / 2, -(w / 2 - medioAncho - margen), w / 2 - medioAncho - margen)
        const y = limitar((objetivoY * h) / 2, -(h / 2 - medioAlto - margen), h / 2 - medioAlto - margen)
        // El coletazo la empuja: un vaivén corto, en fase con la cola
        sirena.grupo.position.set(x, y + Math.sin(t * 2.6) * 0.03 * escala, 0)

        // Mira al centro cuando está quieta y hacia donde va cuando cruza
        const girar = limitar(velLado * 0.9, -1, 1)
        sirena.grupo.rotation.y = -ladoSuave * 0.5 + girar * 0.55 + Math.sin(t * 0.4) * 0.07
        sirena.grupo.rotation.z = -girar * 0.3 + Math.sin(t * 0.8) * 0.05
        sirena.grupo.rotation.x = Math.sin(t * 0.45) * 0.05

        // ---------- diálogo ----------
        if (!hablando && t > siguienteEn) {
          indice = (indice + 1) % guion.length
          const d = guion[indice]
          sirena.pose(d.pose)
          setLinea(d.texto)
          hablando = true
          ocultarEn = t + DURACION
        } else if (hablando && t > ocultarEn) {
          sirena.pose('nadando')
          setLinea(null)
          hablando = false
          siguienteEn = t + PAUSA
        }

        sirena.actualizar(t, energia)
        renderer.render(escena, camara)

        // El globo se ancla sobre la cabeza: se proyecta la punta del modelo
        const burbuja = globo.current
        if (burbuja) {
          burbuja.style.opacity = hablando ? '1' : '0'
          if (hablando) {
            ancla.set(0, 0.52, 0).applyMatrix4(sirena.grupo.matrixWorld).project(camara)
            const px = limitar((ancla.x * 0.5 + 0.5) * host.clientWidth, 96, host.clientWidth - 96)
            const py = (-ancla.y * 0.5 + 0.5) * host.clientHeight - 14
            burbuja.style.transform = `translate(-50%, -100%) translate(${px}px, ${py}px)`
          }
        }
      }

      dibujar()

      window.addEventListener('scroll', leerScroll, { passive: true })
      window.addEventListener('resize', medir)

      limpiar = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('scroll', leerScroll)
        window.removeEventListener('resize', medir)
        setLinea(null)
        sirena.liberar()
        renderer.dispose()
        canvas.remove()
      }
    }

    iniciar()

    return () => {
      vivo = false
      limpiar?.()
    }
  }, [motionOk])

  if (!motionOk) return null

  return (
    <div ref={contenedor} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <div
        ref={globo}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-200 will-change-transform"
      >
        <div className="relative max-w-[11rem] rounded-2xl bg-white/95 px-3.5 py-2 text-center text-xs font-extrabold leading-snug text-ink-900 shadow-[var(--shadow-soft)] ring-1 ring-brand-200 sm:max-w-[15rem] sm:px-4 sm:py-2.5 sm:text-sm">
          {linea}
          <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 rounded-[2px] bg-white/95" />
        </div>
      </div>
    </div>
  )
}
