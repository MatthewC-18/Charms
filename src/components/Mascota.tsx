import type { ReactNode } from 'react'

export type MascotaVariant = 'hola' | 'listo' | 'camino' | 'pago'

const alt: Record<MascotaVariant, string> = {
  hola: 'La artista de Charms saludando',
  listo: 'La artista de Charms con los pulgares arriba',
  camino: 'La artista de Charms abrazando un cuaderno de pedidos',
  pago: 'La artista de Charms señalando hacia abajo',
}

interface Props {
  variant?: MascotaVariant
  /** true = usa el sticker original con el texto dibujado (¡Hola!, ¡Listo tu pedido!, etc.) */
  conTexto?: boolean
  /** Texto del globo de diálogo. Si se pasa, se muestra sobre la figura. */
  burbuja?: ReactNode
  /** Clases para el tamaño de la imagen (ej. 'w-40 sm:w-56') */
  className?: string
  /** Deja de flotar (para bloques densos) */
  quieta?: boolean
}

/**
 * Mascota del sitio: el avatar 3D de la dueña del taller.
 * Los recortes salen de los stickers originales, procesados con
 * scripts/procesar-assets.mjs (fondo transparente + versión sin texto).
 */
export default function Mascota({
  variant = 'hola',
  conTexto = false,
  burbuja,
  className = 'w-40',
  quieta = false,
}: Props) {
  const src = `./marca/mascota-${variant}${conTexto ? '' : '-limpio'}.webp`

  return (
    <div className="flex flex-col items-start gap-2">
      {burbuja && (
        <p className="burbuja max-w-xs text-sm font-bold leading-snug text-ink-900">{burbuja}</p>
      )}
      <img
        src={src}
        alt={alt[variant]}
        loading="lazy"
        className={`${className} h-auto select-none object-contain drop-shadow-[0_16px_24px_rgba(22,35,63,0.18)] ${
          quieta ? '' : variant === 'hola' ? 'anim-saludo' : 'anim-float-slow'
        }`}
      />
    </div>
  )
}
