import type { OccasionId } from './site'

export type CategoryId =
  | 'retrovisor'
  | 'cuadros'
  | 'figuras'
  | 'tazas'
  | 'llaveros'
  | 'corporativo'

export interface Category {
  id: CategoryId
  name: string
  short: string
  description: string
  /** Foto real de portada */
  photo: string
}

export const categories: Category[] = [
  {
    id: 'retrovisor',
    name: 'Para retrovisor',
    short: 'Van colgados en el espejo del carro',
    description:
      'La pieza estrella: tu familia, tu pareja o tus mascotas sobre el carro, colgando del retrovisor. Base liviana, cordón reforzado y placa con nombre o dedicatoria.',
    photo: './productos/retrovisor-pareja-auto.webp',
  },
  {
    id: 'cuadros',
    name: 'Cuadros y marcos',
    short: 'Columpio, 4D y escenas en relieve',
    description:
      'Escenas completas dentro de un marco: el columpio con la frase que elijas, fondos texturizados 4D, mascotas, corazones y paisajes. Para colgar en la pared o parar sobre un mueble.',
    photo: './productos/cuadro-columpio-pareja.webp',
  },
  {
    id: 'figuras',
    name: 'Figuras de pie',
    short: 'Profesiones, hobbies y momentos',
    description:
      'Una figura individual sobre base con nombre: médicos, militares, abogados, docentes, deportistas, graduados. El regalo típico de jubilación, ascenso o grado.',
    photo: './productos/figura-de-pie-mujer.webp',
  },
  {
    id: 'tazas',
    name: 'Tazas decoradas',
    short: 'Cerámica + figura modelada en relieve',
    description:
      'Taza de cerámica intervenida a mano con una figura en porcelana fría. Uso decorativo o de uso suave: se lava a mano, no va a microondas.',
    photo: './productos/taza-graduacion.webp',
  },
  {
    id: 'llaveros',
    name: 'Llaveros y porta llaves',
    short: 'Mini figuras y tableros de pared',
    description:
      'Mini versiones para llevar contigo, y porta llaves de pared con figuras y ganchos. Ideal para recuerdos de evento y detalles pequeños.',
    photo: './productos/llaveros-personajes.webp',
  },
  {
    id: 'corporativo',
    name: 'Regalos corporativos',
    short: 'Reconocimientos y aniversarios',
    description:
      'Placas y figuras con logotipo, uniforme institucional y texto grabado. Reconocimientos por años de servicio, jubilaciones y regalos de fin de año desde 10 unidades.',
    photo: './productos/corporativo-pronaca.webp',
  },
]

export interface Product {
  id: string
  slug: string
  name: string
  category: CategoryId
  /** Foto real (obligatoria): ver public/productos/LEEME.md */
  photo: string
  /** Fotos adicionales para la ficha del producto */
  gallery?: string[]
  blurb: string
  description: string
  /** Precio real "desde" de la lista del taller, en USD (lista de ago 2026) */
  priceFrom: number
  figuresIncluded: number
  size: string
  occasions: OccasionId[]
  highlights: string[]
  popular?: boolean
  isNew?: boolean
}

export const products: Product[] = [
  // ---------------- RETROVISOR ----------------
  {
    id: 'p-retro-pareja-auto',
    slug: 'pareja-sobre-auto-retrovisor',
    name: 'Pareja sobre el auto',
    category: 'retrovisor',
    photo: './productos/retrovisor-pareja-auto.webp',
    gallery: ['./productos/retrovisor-pareja-chevrolet.webp', './productos/retrovisor-individual.webp'],
    blurb: 'Ustedes dos sentados sobre su carro, con la placa real.',
    description:
      'Réplica del carro de la pareja (color y modelo aproximados) con las dos figuras sentadas sobre el capó. Incluye placa con el número real del vehículo o una frase corta, y cordón para colgar del retrovisor.',
    priceFrom: 11,
    figuresIncluded: 2,
    size: 'Aprox. 10 × 7 cm',
    occasions: ['aniversario', 'cumpleanos', 'boda'],
    highlights: ['Placa personalizada', 'Color del carro a elección', 'Cordón reforzado'],
    popular: true,
  },
  {
    id: 'p-retro-familia-auto',
    slug: 'familia-sobre-auto-retrovisor',
    name: 'Familia sobre el auto',
    category: 'retrovisor',
    photo: './productos/retrovisor-familia-hyundai.webp',
    gallery: ['./productos/retrovisor-familia-audi.webp', './productos/retrovisor-familia-bebe.webp'],
    blurb: 'Toda la familia arriba del carro, mascotas incluidas.',
    description:
      'La versión familiar del clásico de retrovisor: hasta tres figuras sobre el vehículo, con espacio para sumar hijos o mascotas. Base con dedicatoria en la parte frontal.',
    priceFrom: 11,
    figuresIncluded: 3,
    size: 'Aprox. 12 × 7 cm',
    occasions: ['aniversario', 'padre', 'madre', 'mascotas'],
    highlights: ['Hasta 6 figuras', 'Dedicatoria en la base', 'Peso liviano'],
    popular: true,
  },

  // ---------------- CUADROS ----------------
  {
    id: 'p-cuadro-columpio',
    slug: 'cuadro-columpio-pareja',
    name: 'Cuadro columpio',
    category: 'cuadros',
    photo: './productos/cuadro-columpio-pareja.webp',
    gallery: ['./productos/cuadro-columpio-familia.webp'],
    blurb: 'El más pedido: dos figuras en un columpio y tu frase arriba.',
    description:
      'Marco de madera con las figuras sentadas en un columpio colgante, banderín superior con la frase que elijas y placa inferior con la fecha. Fondo a elección: jardín, atardecer, flores o liso.',
    priceFrom: 30.5,
    figuresIncluded: 2,
    size: 'Marco 25 × 25 cm',
    occasions: ['aniversario', 'boda', 'cumpleanos'],
    highlights: ['Frase en el banderín', 'Fecha en la placa', 'Fondo a elección'],
    popular: true,
  },
  {
    id: 'p-cuadro-4d-familia',
    slug: 'cuadro-4d-familia',
    name: 'Cuadro 4D familiar',
    category: 'cuadros',
    photo: './productos/cuadro-4d-familia-mascotas.webp',
    gallery: ['./productos/cuadro-4d-gatos.webp'],
    blurb: 'Fondo texturizado con la familia completa en relieve.',
    description:
      'Escena en relieve sobre fondo texturizado, con las figuras de cuerpo entero, nombres sobre cada una, corazones y mascotas. El formato que mejor funciona para familias de 4 o más.',
    priceFrom: 16,
    figuresIncluded: 4,
    size: 'Marco 30 × 40 cm',
    occasions: ['madre', 'padre', 'nacimiento', 'mascotas'],
    highlights: ['Nombres individuales', 'Fondo texturizado', 'Mascotas incluidas'],
    popular: true,
  },
  {
    id: 'p-cuadro-amigas',
    slug: 'cuadro-grupo-amigas',
    name: 'Cuadro de grupo',
    category: 'cuadros',
    photo: './productos/cuadro-4d-familia-grande.webp',
    gallery: ['./productos/cuadro-4d-familia-jardin.webp'],
    blurb: 'Familias grandes, amigas o compañeros de trabajo, en fila.',
    description:
      'Escena horizontal con 4 a 8 figuras de pie, cada una con su ropa y peinado, sobre un fondo impreso a elección. Banderín inferior con la frase del grupo. El formato para familias grandes, despedidas de oficina y promociones.',
    priceFrom: 22.5,
    figuresIncluded: 4,
    size: 'Marco 40 × 25 cm',
    occasions: ['amistad', 'grado', 'empresa'],
    highlights: ['Hasta 8 figuras', 'Ropa individual', 'Frase de grupo'],
    isNew: true,
  },

  // ---------------- FIGURAS ----------------
  {
    id: 'p-figura-profesion',
    slug: 'figura-profesion',
    name: 'Figura de profesión',
    category: 'figuras',
    photo: './productos/corporativo-pronaca.webp',
    gallery: ['./productos/figura-odontologo.webp', './productos/figura-de-pie-mujer.webp'],
    blurb: 'Uniforme, herramientas del oficio y base con nombre.',
    description:
      'Figura individual de pie sobre base redonda, con el uniforme y los accesorios de la profesión: bata y estetoscopio, toga y balanza, uniforme militar o policial, casco, mandil, lo que necesites.',
    priceFrom: 16,
    figuresIncluded: 1,
    size: 'Alto aprox. 14 cm',
    occasions: ['profesion', 'grado', 'jubilacion'],
    highlights: ['Uniforme real', 'Accesorios del oficio', 'Nombre en la base'],
    popular: true,
  },
  {
    id: 'p-figura-grado',
    slug: 'figura-graduacion',
    name: 'Figura de graduación',
    category: 'figuras',
    photo: './productos/figura-graduacion-bebe.webp',
    blurb: 'Toga, birrete y diploma, con la fecha del grado.',
    description:
      'Figura con toga y birrete del color de la institución, diploma en la mano y base con el nombre, la carrera y la fecha de graduación.',
    priceFrom: 16,
    figuresIncluded: 1,
    size: 'Alto aprox. 14 cm',
    occasions: ['grado'],
    highlights: ['Colores de la institución', 'Diploma modelado', 'Fecha grabada'],
  },
  {
    id: 'p-figura-numero',
    slug: 'figura-numero-cumpleanos',
    name: 'Figura con número',
    category: 'figuras',
    photo: './productos/figura-de-pie-mujer.webp',
    blurb: 'La edad en grande, junto a la figura del festejado.',
    description:
      'Figura de pie acompañada del número de la edad en relieve (15, 30, 50, 80). Se usa como recuerdo y también como topper decorativo del pastel.',
    priceFrom: 16,
    figuresIncluded: 1,
    size: 'Alto aprox. 15 cm',
    occasions: ['cumpleanos'],
    highlights: ['Número a elección', 'Sirve de topper', 'Base con nombre'],
  },
  {
    id: 'p-figura-mascota',
    slug: 'figura-mascota',
    name: 'Figura de mascota',
    category: 'figuras',
    photo: './productos/figura-nino-mascotas.webp',
    blurb: 'Tu perro o gato modelado según su pelaje real.',
    description:
      'Retrato de tu mascota en porcelana fría, trabajando manchas, textura de pelaje y color de ojos según las fotos que envíes. Base con su nombre.',
    priceFrom: 11,
    figuresIncluded: 1,
    size: 'Alto aprox. 9 cm',
    occasions: ['mascotas', 'cumpleanos'],
    highlights: ['Pelaje trabajado a mano', 'Nombre en la base', 'También en memoriam'],
  },

  {
    id: 'p-figura-kawaii',
    slug: 'figuras-decorativas',
    name: 'Figuras decorativas',
    category: 'figuras',
    photo: './productos/figuras-aguacates.webp',
    gallery: ['./productos/figura-nino-mascotas.webp'],
    blurb: 'Personajes, parejas de frutas y piezas kawaii de repisa.',
    description:
      'Piezas decorativas que no son retrato: parejas de aguacates, animalitos, personajes de series y videojuegos. Se modelan igual, a mano, y funcionan como detalle pequeño o adorno de escritorio.',
    priceFrom: 11,
    figuresIncluded: 2,
    size: 'Alto aprox. 8 cm c/u',
    occasions: ['aniversario', 'amistad', 'cumpleanos'],
    highlights: ['Diseño libre', 'Ideal para repisa', 'También por encargo de personajes'],
    isNew: true,
  },

  // ---------------- TAZAS ----------------
  {
    id: 'p-taza-figura',
    slug: 'taza-con-figura',
    name: 'Taza con figura',
    category: 'tazas',
    photo: './productos/taza-graduacion.webp',
    gallery: [
      './productos/taza-feliz-retiro.webp',
      './productos/taza-medico.webp',
      './productos/taza-mascota.webp',
    ],
    blurb: 'Taza cerámica con una figura modelada al frente.',
    description:
      'Taza blanca de cerámica con una figura en relieve adherida al frente y el nombre o mensaje en la parte inferior. Uso decorativo, lavado a mano.',
    priceFrom: 11,
    figuresIncluded: 1,
    size: 'Taza de 11 oz',
    occasions: ['cumpleanos', 'profesion', 'jubilacion', 'empresa'],
    highlights: ['Cerámica de 11 oz', 'Figura en relieve', 'Mensaje incluido'],
  },

  // ---------------- LLAVEROS ----------------
  {
    id: 'p-llavero-mini',
    slug: 'llavero-mini-figura',
    name: 'Llavero mini figura',
    category: 'llaveros',
    photo: './productos/llaveros-personajes.webp',
    blurb: 'Versión mini para llevar en las llaves o la mochila.',
    description:
      'Mini figura de 5 cm con argolla reforzada. El más pedido como recuerdo de evento por cantidad, y como detalle pequeño de cumpleaños.',
    priceFrom: 11,
    figuresIncluded: 1,
    size: 'Alto aprox. 5 cm',
    occasions: ['cumpleanos', 'amistad', 'empresa'],
    highlights: ['Desde 1 unidad', 'Descuento por 10+', 'Argolla reforzada'],
  },
  {
    id: 'p-portallaves',
    slug: 'porta-llaves-pared',
    name: 'Porta llaves de pared',
    category: 'llaveros',
    photo: './productos/porta-llaves-familia.webp',
    blurb: 'Tablero con las figuras de la casa y ganchos.',
    description:
      'Tablero de madera con las figuras de quienes viven en la casa, apellido en relieve y ganchos metálicos. Regalo típico de estreno de departamento.',
    priceFrom: 20,
    figuresIncluded: 2,
    size: 'Tablero 30 × 15 cm',
    occasions: ['boda', 'nacimiento', 'madre'],
    highlights: ['Apellido en relieve', '4 ganchos metálicos', 'Listo para colgar'],
  },

  // ---------------- CORPORATIVO ----------------
  {
    id: 'p-corp-placa',
    slug: 'placa-reconocimiento',
    name: 'Placa de reconocimiento',
    category: 'corporativo',
    photo: './productos/corporativo-pronaca.webp',
    blurb: 'Figura con uniforme institucional y logo en relieve.',
    description:
      'Reconocimiento por años de servicio: figura con el uniforme de la empresa, logotipo modelado en relieve con los colores de marca y placa con nombre, cargo y fecha.',
    priceFrom: 22.5,
    figuresIncluded: 1,
    size: 'Base 12 × 8 cm',
    occasions: ['empresa', 'jubilacion'],
    highlights: ['Logotipo en relieve', 'Uniforme institucional', 'Desde 10 unidades'],
    popular: true,
  },
  {
    id: 'p-corp-lote',
    slug: 'lote-corporativo',
    name: 'Lote corporativo',
    category: 'corporativo',
    photo: './productos/lote-corporativo-cajas.webp',
    gallery: ['./productos/taller-produccion.webp'],
    blurb: 'Producción por volumen con diseño unificado.',
    description:
      'Pedido de 10 a 200 piezas con un diseño base común y personalización individual por nombre. Cotización por volumen, cronograma de entrega y factura.',
    priceFrom: 16,
    figuresIncluded: 1,
    size: 'A definir según diseño',
    occasions: ['empresa'],
    highlights: ['Desde 10 unidades', 'Precio por volumen', 'Emitimos factura'],
    isNew: true,
  },
]

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)

export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!

/** Rango de precio mostrado en las tarjetas de categoría */
export const categoryPriceFrom = (id: CategoryId) =>
  Math.min(...products.filter((p) => p.category === id).map((p) => p.priceFrom))
