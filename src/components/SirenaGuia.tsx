import { useEffect, useRef } from 'react'
import { useMotionOk } from '../hooks/useMotionOk'

/**
 * La sirena que acompaña la lectura.
 *
 * Canvas fijo a pantalla completa (sin capturar clics) donde nada la sirena 3D
 * completa: desciende por el costado a medida que avanzas y aletea más fuerte
 * cuando haces scroll rápido. La posición se recorta contra el borde visible
 * para que nunca se le corte la cola.
 *
 * Three.js se carga en un chunk aparte y solo si el equipo puede con WebGL y
 * el visitante no pidió reducir movimiento.
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

      const esMovil = () => window.innerWidth < 768
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, esMovil() ? 1.5 : 2))
      host.appendChild(canvas)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'

      const escena = new THREE.Scene()
      const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camara.position.z = 7

      // Luz para el cuerpo y la cabeza (la cola se ilumina en su propio shader)
      escena.add(new THREE.HemisphereLight(0xdcf8fd, 0xf0eafe, 2.2))
      const clave = new THREE.DirectionalLight(0xffffff, 1.8)
      clave.position.set(2.5, 4, 5)
      escena.add(clave)
      const relleno = new THREE.DirectionalLight(0xb79bf0, 0.7)
      relleno.position.set(-3, 1, 2)
      escena.add(relleno)

      const sirena = crearSirena()
      escena.add(sirena.grupo)

      // El pivote está en la cintura, no en el centro del modelo. Estas medidas
      // salen de la caja envolvente real (banco de pruebas en test3d.html).
      const desplazamientoCentroY = 1.11
      const desplazamientoCentroX = 0.28
      const medioAnchoLocal = 1.35

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

      let raf = 0
      const reloj = new THREE.Clock()
      const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

      const dibujar = () => {
        raf = requestAnimationFrame(dibujar)
        if (document.hidden) return

        const t = reloj.getElapsedTime()

        avanceSuave += (avance - avanceSuave) * 0.06
        const velocidad = Math.abs(avanceSuave - ultimoAvance)
        ultimoAvance = avanceSuave
        energia += (Math.min(1, velocidad * 90) - energia) * 0.08

        const movil = esMovil()
        const h = alturaVisible()
        const w = anchoVisible()

        // Ocupa una fracción del alto de la pantalla, no un tamaño fijo
        const escala = (h * (movil ? 0.2 : 0.26)) / sirena.alto
        sirena.grupo.scale.setScalar(escala)

        const medioAlto = (sirena.alto / 2) * escala
        const medioAncho = medioAnchoLocal * escala
        const margen = 0.25

        // Recorrido: baja por el costado derecho, serpenteando suave
        const objetivoX = (movil ? 0.74 : 0.82) + Math.sin(avanceSuave * 6) * 0.06
        const objetivoY = 0.78 - avanceSuave * 1.56

        const x = limitar((objetivoX * w) / 2, -(w / 2 - medioAncho - margen), w / 2 - medioAncho - margen)
        const y = limitar((objetivoY * h) / 2, -(h / 2 - medioAlto - margen), h / 2 - medioAlto - margen)

        sirena.grupo.position.set(
          x + desplazamientoCentroX * escala,
          y + desplazamientoCentroY * escala,
          0,
        )

        // Se balancea al nadar y mira ligeramente hacia el contenido
        sirena.grupo.rotation.z = Math.sin(t * 0.9) * 0.07 - Math.cos(avanceSuave * 6) * 0.12
        sirena.grupo.rotation.y = -0.5 + Math.sin(t * 0.5) * 0.18
        sirena.grupo.rotation.x = Math.sin(t * 0.4) * 0.06

        sirena.material.uniforms.uTiempo.value = t
        sirena.material.uniforms.uEnergia.value = energia
        sirena.material.uniforms.uOpacidad.value = 0.95

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

  return <div ref={contenedor} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30" />
}
