import type { ReactNode } from 'react'
import { site } from '../data/site'

export type MascotaVariant = 'hola' | 'listo' | 'camino' | 'pago'

const nombre = site.mascota.name

const alt: Record<MascotaVariant, string> = {
  hola: `${nombre}, ${site.mascota.rol}, saludando`,
  listo: `${nombre} con los pulgares arriba`,
  camino: `${nombre} abrazando el cuaderno de pedidos`,
  pago: `${nombre} señalando hacia abajo`,
}

interface Props {
  variant?: MascotaVariant
  /** true = usa el sticker original con el texto dibujado (¡Hola!, ¡Listo tu pedido!, etc.) */
  conTexto?: boolean
  /** Texto del globo de diálogo. Si se pasa, se muestra junto a la figura. */
  burbuja?: ReactNode
  /** 'arriba' = globo sobre la figura · 'lado' = globo a la derecha, en fila */
  burbujaPos?: 'arriba' | 'lado'
  /** Clases para el tamaño de la imagen (ej. 'w-40 sm:w-56') */
  className?: string
  /** Deja de flotar (para bloques densos) */
  quieta?: boolean
}

/**
 * Charmy: la mascota del sitio, basada en el avatar 3D de la dueña del taller.
 * Los recortes salen de los stickers originales, procesados con
 * scripts/procesar-assets.mjs (fondo transparente + versión sin texto).
 */
export default function Mascota({
  variant = 'hola',
  conTexto = false,
  burbuja,
  burbujaPos = 'arriba',
  className = 'w-40',
  quieta = false,
}: Props) {
  const src = `./marca/mascota-${variant}${conTexto ? '' : '-limpio'}.webp`

  const figura = (
    <img
      src={src}
      alt={alt[variant]}
      loading="lazy"
      className={`${className} h-auto select-none object-contain drop-shadow-[0_16px_24px_rgba(22,35,63,0.18)] ${
        quieta ? '' : variant === 'hola' ? 'anim-saludo' : 'anim-float-slow'
      }`}
    />
  )

  if (!burbuja) return figura

  if (burbujaPos === 'lado') {
    return (
      <div className="flex items-center gap-3">
        {figura}
        <p className="burbuja burbuja-izq max-w-[15rem] text-sm font-bold leading-snug text-ink-900">
          {burbuja}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="burbuja max-w-xs text-sm font-bold leading-snug text-ink-900">{burbuja}</p>
      {figura}
    </div>
  )
}
