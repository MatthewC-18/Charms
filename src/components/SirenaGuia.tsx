import { useEffect, useRef } from 'react'
import { useMotionOk } from '../hooks/useMotionOk'

/**
 * La sirena que acompaña la lectura.
 *
 * Canvas fijo a pantalla completa (sin capturar clics) donde nada la cola 3D:
 * baja por el costado a medida que avanzas y se agita más rápido cuando haces
 * scroll rápido. Three.js se carga en un chunk aparte y solo si el equipo puede
 * con WebGL y el visitante no pidió reducir movimiento.
 */
export default function SirenaGuia() {
  const contenedor = useRef<HTMLDivElement>(null)
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

      const movil = window.matchMedia('(max-width: 767px)').matches
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, movil ? 1.5 : 2))
      host.appendChild(canvas)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'

      const escena = new THREE.Scene()
      const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camara.position.z = 7

      const sirena = crearSirena()
      escena.add(sirena.grupo)

      const medir = () => {
        const w = host.clientWidth
        const h = host.clientHeight
        renderer.setSize(w, h, false)
        camara.aspect = w / h
        camara.updateProjectionMatrix()
      }
      medir()

      // Alto y ancho visibles en el plano z = 0
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

      let raf = 0
      const reloj = new THREE.Clock()

      const dibujar = () => {
        raf = requestAnimationFrame(dibujar)
        if (document.hidden) return

        const t = reloj.getElapsedTime()

        // Suavizado del scroll: la sirena persigue la posición, no salta
        avanceSuave += (avance - avanceSuave) * 0.06
        const velocidad = Math.abs(avanceSuave - ultimoAvance)
        ultimoAvance = avanceSuave
        energia += (Math.min(1, velocidad * 90) - energia) * 0.08

        const anchoMovil = window.innerWidth < 768
        const escala = anchoMovil ? 0.42 : 0.62
        const h = alturaVisible()
        const w = anchoVisible()

        // Recorrido: baja por el costado derecho serpenteando
        const sx = (anchoMovil ? 0.72 : 0.8) + Math.sin(avanceSuave * 7.5) * 0.1
        const sy = 0.82 - avanceSuave * 1.64

        sirena.grupo.position.set((sx * w) / 2, (sy * h) / 2, 0)
        sirena.grupo.scale.setScalar(escala)

        // Se orienta hacia donde nada y cabecea suave
        const pendiente = Math.cos(avanceSuave * 7.5) * 0.75
        sirena.grupo.rotation.z = -1.15 - pendiente * 0.28
        sirena.grupo.rotation.y = Math.sin(t * 0.6) * 0.25 - 0.4
        sirena.grupo.rotation.x = Math.sin(t * 0.45) * 0.12

        sirena.material.uniforms.uTiempo.value = t
        sirena.material.uniforms.uEnergia.value = energia
        sirena.material.uniforms.uOpacidad.value = 0.92

        renderer.render(escena, camara)
      }

      dibujar()

      window.addEventListener('scroll', leerScroll, { passive: true })
      window.addEventListener('resize', medir)

      limpiar = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('scroll', leerScroll)
        window.removeEventListener('resize', medir)
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
    <div
      ref={contenedor}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
    />
  )
}
