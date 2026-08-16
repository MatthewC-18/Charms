/**
 * Procesa los assets originales (fotos del taller, logo y stickers de la mascota)
 * y genera las versiones optimizadas que consume el sitio.
 *
 *   node scripts/procesar-assets.mjs inspeccionar <carpeta>
 *   node scripts/procesar-assets.mjs mascota <carpeta-con-1..4.png>
 *   node scripts/procesar-assets.mjs logo <ruta-logo.jpg>
 *   node scripts/procesar-assets.mjs fotos <carpeta-origen>
 *
 * Requiere: npm i -D sharp
 */
import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const OUT_MARCA = 'public/marca'
const OUT_FOTOS = 'public/productos'

const ensure = (dir) => mkdirSync(dir, { recursive: true })

/** Vuelve transparente el fondo uniforme, propagando desde los bordes (flood fill). */
async function quitarFondo(input, { tolerancia = 26, color = null } = {}) {
  const img = sharp(input).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  const ref = color ?? [data[0], data[1], data[2]]
  const cerca = (i) =>
    Math.abs(data[i] - ref[0]) <= tolerancia &&
    Math.abs(data[i + 1] - ref[1]) <= tolerancia &&
    Math.abs(data[i + 2] - ref[2]) <= tolerancia

  const visto = new Uint8Array(width * height)
  const pila = []
  for (let x = 0; x < width; x++) {
    pila.push([x, 0], [x, height - 1])
  }
  for (let y = 0; y < height; y++) {
    pila.push([0, y], [width - 1, y])
  }

  while (pila.length) {
    const [x, y] = pila.pop()
    if (x < 0 || y < 0 || x >= width || y >= height) continue
    const p = y * width + x
    if (visto[p]) continue
    const i = p * channels
    if (!cerca(i)) continue
    visto[p] = 1
    data[i + 3] = 0
    pila.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  return sharp(data, { raw: { width, height, channels } }).png()
}

const comandos = {
  async inspeccionar(dir) {
    for (const f of readdirSync(dir)) {
      const m = await sharp(path.join(dir, f)).metadata()
      console.log(f, `${m.width}x${m.height}`, m.format, 'alpha:', m.hasAlpha)
    }
  },

  /** Stickers de la dueña: fondo transparente + recorte del texto para el avatar limpio. */
  async mascota(dir) {
    ensure(OUT_MARCA)
    const mapa = [
      { file: '4.png', nombre: 'mascota-hola', recorteTexto: 0.76 },
      { file: '2.png', nombre: 'mascota-listo', recorteTexto: 0.7 },
      { file: '3.png', nombre: 'mascota-camino', recorteTexto: 0.68 },
      { file: '1.png', nombre: 'mascota-pago', recorteTexto: 0.66 },
    ]

    for (const { file, nombre, recorteTexto } of mapa) {
      const origen = path.join(dir, file)
      const limpio = await quitarFondo(origen, { tolerancia: 22 })

      // sharp aplica trim antes que extract dentro de un mismo pipeline,
      // así que se recorta en pasadas separadas.
      const recortado = await limpio.trim({ threshold: 1 }).png().toBuffer()
      const meta = await sharp(recortado).metadata()

      // Sticker completo (conserva el texto dibujado)
      await sharp(recortado)
        .resize({ width: 700, withoutEnlargement: true })
        .webp({ quality: 88 })
        .toFile(path.join(OUT_MARCA, `${nombre}.webp`))

      // Versión sin texto: corta la franja inferior donde está la tipografía
      const sinTexto = await sharp(recortado)
        .extract({
          left: 0,
          top: 0,
          width: meta.width,
          height: Math.round(meta.height * recorteTexto),
        })
        .png()
        .toBuffer()

      await sharp(sinTexto)
        .trim({ threshold: 1 })
        .resize({ width: 700, withoutEnlargement: true })
        .webp({ quality: 88 })
        .toFile(path.join(OUT_MARCA, `${nombre}-limpio.webp`))

      console.log('✓', nombre, `${meta.width}x${meta.height}`)
    }
  },

  /** Logo: versión cuadrada + cola de sirena recortada sin el fondo turquesa. */
  async logo(ruta) {
    ensure(OUT_MARCA)
    await sharp(ruta).resize(512, 512, { fit: 'cover' }).webp({ quality: 92 }).toFile(path.join(OUT_MARCA, 'logo-charms.webp'))
    await sharp(ruta).resize(256, 256, { fit: 'cover' }).png().toFile(path.join(OUT_MARCA, 'logo-charms.png'))

    const sinFondo = await quitarFondo(ruta, { tolerancia: 34 })
    await sinFondo
      .trim({ threshold: 1 })
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 92 })
      .toFile(path.join(OUT_MARCA, 'logo-charms-transparente.webp'))
    console.log('✓ logo')
  },

  /**
   * Cola de sirena sola (sin el lettering), para usarla como sello decorativo.
   * Borra el bloque donde va la palabra "Charms" y recorta el sobrante.
   */
  async cola(ruta = path.join(OUT_MARCA, 'logo-charms-transparente.webp')) {
    ensure(OUT_MARCA)
    const meta = await sharp(ruta).metadata()
    const { data, info } = await sharp(ruta).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

    // Región del lettering, en proporción del alto/ancho del original
    const x0 = Math.round(info.width * 0.45)
    const y0 = Math.round(info.height * 0.31)
    const y1 = Math.round(info.height * 0.6)

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < info.width; x++) {
        data[(y * info.width + x) * info.channels + 3] = 0
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .png()
      .toFile(path.join(OUT_MARCA, 'cola-sirena.png'))

    await sharp(path.join(OUT_MARCA, 'cola-sirena.png'))
      .trim({ threshold: 1 })
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 92 })
      .toFile(path.join(OUT_MARCA, 'cola-sirena.webp'))

    console.log('✓ cola', `${meta.width}x${meta.height}`)
  },

  /** Fotos del taller: renombra a slug legible y exporta webp optimizado. */
  async fotos(dir) {
    ensure(OUT_FOTOS)
    const mapa = {
      'SaveClip.App_484313301_18050993252186416_4308562913928636489_n': 'cuadro-columpio-familia',
      'SaveClip.App_671136121_18092570165186416_5588971022583127736_n': 'retrovisor-pareja-auto',
      'SaveClip.App_671184275_18091402838186416_7072422613516895094_n': 'retrovisor-familia-audi',
      'SaveClip.App_683435725_18091402958186416_3331392796602073252_n': 'retrovisor-individual',
      'SaveClip.App_683590335_18091400759186416_3976919382337258160_n': 'cuadro-columpio-pareja',
      'SaveClip.App_684687932_18091402940186416_8598820623147741031_n': 'retrovisor-familia-bebe',
      'SaveClip.App_687722288_18091402907186416_5558595783151365764_n': 'retrovisor-familia-hyundai',
      'SaveClip.App_744782115_18098590952186416_7935600480122128315_n': 'cuadro-4d-familia-mascotas',
      'SaveClip.App_747795599_18099046001186416_2531860675777610391_n': 'corporativo-pronaca',
      'SaveClip.App_754057787_18099596540186416_6141350616182761170_n': 'figura-de-pie-mujer',

      // Segunda tanda (WhatsApp, 15 ago 2026)
      'WhatsApp Image 2026-08-15 at 23.12.39': 'taza-graduacion',
      'WhatsApp Image 2026-08-15 at 23.12.39 (1)': 'taza-feliz-retiro',
      'WhatsApp Image 2026-08-15 at 23.12.39 (2)': 'taza-medico',
      'WhatsApp Image 2026-08-15 at 23.12.40': 'porta-llaves-familia',
      'WhatsApp Image 2026-08-15 at 23.12.40 (1)': 'lote-corporativo-cajas',
      'WhatsApp Image 2026-08-15 at 23.12.40 (2)': 'cuadro-4d-familia-grande',
      'WhatsApp Image 2026-08-15 at 23.12.41': 'retrovisor-pareja-chevrolet',
      'WhatsApp Image 2026-08-15 at 23.12.41 (1)': 'cuadro-4d-gatos',
      'WhatsApp Image 2026-08-15 at 23.12.42': 'cuadro-4d-familia-jardin',
      'WhatsApp Image 2026-08-15 at 23.12.42 (1)': 'taza-mascota',
      'WhatsApp Image 2026-08-15 at 23.12.42 (2)': 'figuras-aguacates',
      'WhatsApp Image 2026-08-15 at 23.12.43': 'figura-odontologo',
      'WhatsApp Image 2026-08-15 at 23.12.43 (1)': 'llaveros-personajes',
      'WhatsApp Image 2026-08-15 at 23.12.43 (2)': 'figura-nino-mascotas',
      'WhatsApp Image 2026-08-15 at 23.12.43 (3)': 'figura-graduacion-bebe',
      'WhatsApp Image 2026-08-15 at 23.12.44': 'taller-artista',
      'WhatsApp Image 2026-08-15 at 23.12.44 (1)': 'taller-produccion',
    }

    for (const f of readdirSync(dir)) {
      const base = path.parse(f).name
      const destino = mapa[base]
      if (!destino) continue
      await sharp(path.join(dir, f))
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(OUT_FOTOS, `${destino}.webp`))
      console.log('✓', destino)
    }
  },
}

/**
 * Videos del taller: reels y TikToks.
 * Recomprime a 720p vertical con h264 (compatible con todos los navegadores)
 * y saca una miniatura del segundo 1.
 * Requiere ffmpeg en el PATH.
 */
comandos.videos = async (dir) => {
  const { execFileSync } = await import('node:child_process')
  const OUT_VIDEOS = 'public/videos'
  ensure(OUT_VIDEOS)

  // nombre original -> [slug de salida, segundo del que se saca la miniatura]
  const mapa = {
    'WhatsApp Video 2026-08-15 at 23.20.41': ['figura-dragon', 1],
    'WhatsApp Video 2026-08-15 at 23.20.41 (1)': ['taza-mario', 1],
    'WhatsApp Video 2026-08-15 at 23.20.42': ['cuadro-4d-detalle', 6],
    'WhatsApp Video 2026-08-15 at 23.21.28': ['capibara-paso-a-paso', 1],
  }

  for (const f of readdirSync(dir)) {
    const base = path.parse(f).name
    const entrada = path.join(dir, f)
    if (!mapa[base]) continue
    const [destino, segundo] = mapa[base]

    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-i', entrada,
        '-vf', "scale='min(720,iw)':-2",
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '30',
        '-c:a', 'aac',
        '-b:a', '96k',
        '-movflags', '+faststart',
        path.join(OUT_VIDEOS, `${destino}.mp4`),
      ],
      { stdio: 'ignore' },
    )

    execFileSync(
      'ffmpeg',
      ['-y', '-ss', String(segundo), '-i', entrada, '-frames:v', '1', '-vf', "scale='min(720,iw)':-2", path.join(OUT_VIDEOS, `${destino}.jpg`)],
      { stdio: 'ignore' },
    )

    await sharp(path.join(OUT_VIDEOS, `${destino}.jpg`))
      .webp({ quality: 78 })
      .toFile(path.join(OUT_VIDEOS, `${destino}.webp`))

    console.log('✓', destino)
  }
}

const [cmd, arg] = process.argv.slice(2)
if (!comandos[cmd]) {
  console.error('Comandos: inspeccionar | mascota | logo | fotos')
  process.exit(1)
}
await comandos[cmd](arg)
