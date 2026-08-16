interface Props {
  /** Alto del logo en clases de Tailwind (ej. 'h-12') */
  className?: string
  /** 'lockup' = cola + palabra Charms · 'iso' = solo el círculo del perfil */
  variant?: 'lockup' | 'iso'
}

/**
 * Logo real de la marca (cola de sirena tornasol).
 * Los archivos se generan con scripts/procesar-assets.mjs a partir del original.
 */
export default function Logo({ className = 'h-12', variant = 'lockup' }: Props) {
  if (variant === 'iso') {
    return (
      <img
        src="./marca/logo-charms.webp"
        alt="Charms Ecuador"
        className={`${className} aspect-square w-auto rounded-full object-cover`}
        width={512}
        height={512}
      />
    )
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="./marca/logo-charms-transparente.webp"
        alt="Charms Ecuador — regalos personalizados en porcelana fría"
        className="h-full w-auto object-contain"
        width={800}
        height={731}
      />
    </span>
  )
}
