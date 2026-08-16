import * as THREE from 'three'

/**
 * La cara se pinta en un canvas 2D y se envuelve sobre la esfera de la cabeza.
 *
 * Es la única forma de conseguir los ojos enormes con pestañas, brillo y iris
 * que caracterizan a las figuras de Charms: hacerlos con geometría los deja
 * como puntos negros. Al ser textura, además se repinta al instante cuando el
 * visitante cambia el tono de piel o de ojos.
 *
 * Mapeo de la esfera de Three: el frente (+Z) cae en u = 0.25, y v va de 0
 * (polo norte) a 1 (polo sur). Por eso la cara se dibuja centrada en x = 25 %
 * del ancho del lienzo.
 */

export interface RasgosCara {
  piel: string
  ojos: string
  cabello: string
  /** Pestañas y boca más marcadas */
  estilo: 'ella' | 'el'
}

const TAM = 1024

function ojo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  lado: number,
  rasgos: RasgosCara,
) {
  const rx = 46
  const ry = 58

  // blanco del ojo
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  ctx.fill()

  // iris
  ctx.fillStyle = rasgos.ojos
  ctx.beginPath()
  ctx.ellipse(cx, cy + 4, 36, 42, 0, 0, Math.PI * 2)
  ctx.fill()

  // anillo exterior del iris, un poco más oscuro
  ctx.strokeStyle = 'rgba(20,16,30,0.45)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.ellipse(cx, cy + 4, 36, 42, 0, 0, Math.PI * 2)
  ctx.stroke()

  // pupila
  ctx.fillStyle = '#17131c'
  ctx.beginPath()
  ctx.ellipse(cx, cy + 6, 16, 20, 0, 0, Math.PI * 2)
  ctx.fill()

  // brillos
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.ellipse(cx - 14 * lado, cy - 16, 14, 16, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 15 * lado, cy + 22, 7, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  // línea de pestañas superior
  ctx.strokeStyle = '#171219'
  ctx.lineCap = 'round'
  ctx.lineWidth = rasgos.estilo === 'ella' ? 15 : 11
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx + 2, ry + 2, 0, Math.PI * 1.08, Math.PI * 1.92)
  ctx.stroke()

  if (rasgos.estilo === 'ella') {
    // pestañas del extremo exterior
    ctx.lineWidth = 9
    for (let i = 0; i < 3; i++) {
      const ang = Math.PI * (1.72 + i * 0.09)
      const px = cx + Math.cos(ang) * (rx + 2) * lado
      const py = cy + Math.sin(ang) * (ry + 2)
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px + 20 * lado, py - 16 - i * 3)
      ctx.stroke()
    }
  }

  // ceja: fina y bien separada de las pestañas
  ctx.strokeStyle = rasgos.cabello
  ctx.lineWidth = rasgos.estilo === 'ella' ? 8 : 12
  ctx.beginPath()
  ctx.ellipse(cx, cy - 46, 40, 30, 0, Math.PI * 1.16, Math.PI * 1.84)
  ctx.stroke()
}

/** Dibuja la cara completa sobre el lienzo */
export function pintarCara(ctx: CanvasRenderingContext2D, rasgos: RasgosCara) {
  // base: todo el lienzo del color de la piel
  ctx.fillStyle = rasgos.piel
  ctx.fillRect(0, 0, TAM, TAM)

  const cx = TAM * 0.25
  const cyOjos = TAM * 0.45

  // rubor
  for (const lado of [-1, 1]) {
    const g = ctx.createRadialGradient(cx + lado * 122, cyOjos + 58, 4, cx + lado * 122, cyOjos + 58, 62)
    g.addColorStop(0, 'rgba(255,140,160,0.55)')
    g.addColorStop(1, 'rgba(255,140,160,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx + lado * 122, cyOjos + 58, 62, 0, Math.PI * 2)
    ctx.fill()
  }

  ojo(ctx, cx - 66, cyOjos, -1, rasgos)
  ojo(ctx, cx + 66, cyOjos, 1, rasgos)

  // naricita: solo una sombra suave
  const gn = ctx.createRadialGradient(cx, cyOjos + 62, 2, cx, cyOjos + 62, 16)
  gn.addColorStop(0, 'rgba(150,90,60,0.35)')
  gn.addColorStop(1, 'rgba(150,90,60,0)')
  ctx.fillStyle = gn
  ctx.beginPath()
  ctx.arc(cx, cyOjos + 62, 16, 0, Math.PI * 2)
  ctx.fill()

  // boca: sonrisa pequeña, con lengua si es la versión "ella"
  const by = cyOjos + 108
  if (rasgos.estilo === 'ella') {
    ctx.fillStyle = '#c05070'
    ctx.beginPath()
    ctx.ellipse(cx, by, 30, 22, 0, 0, Math.PI)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(cx, by + 1, 26, 7, 0, 0, Math.PI)
    ctx.fill()
    ctx.fillStyle = '#e78096'
    ctx.beginPath()
    ctx.ellipse(cx, by + 20, 13, 8, 0, Math.PI, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.strokeStyle = '#8a3d4e'
    ctx.lineWidth = 9
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.ellipse(cx, by - 12, 30, 26, 0, Math.PI * 0.18, Math.PI * 0.82)
    ctx.stroke()
  }
}

export interface TexturaCara {
  textura: THREE.CanvasTexture
  repintar: (rasgos: RasgosCara) => void
  liberar: () => void
}

export function crearTexturaCara(rasgos: RasgosCara): TexturaCara {
  const lienzo = document.createElement('canvas')
  lienzo.width = lienzo.height = TAM
  const ctx = lienzo.getContext('2d')!

  pintarCara(ctx, rasgos)

  const textura = new THREE.CanvasTexture(lienzo)
  textura.colorSpace = THREE.SRGBColorSpace
  textura.anisotropy = 4

  return {
    textura,
    repintar: (nuevos) => {
      pintarCara(ctx, nuevos)
      textura.needsUpdate = true
    },
    liberar: () => textura.dispose(),
  }
}
