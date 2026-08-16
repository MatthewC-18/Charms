/**
 * Configuración central de la marca.
 * Todo lo editable sin tocar componentes vive aquí.
 */

export const site = {
  name: 'Charms Ecuador',
  shortName: 'Charms',
  tagline: 'Regalos personalizados en porcelana fría',
  claim: 'Hechos a mano con amor',
  instagram: 'charms.ecuador',
  instagramUrl: 'https://instagram.com/charms.ecuador',
  threadsUrl: 'https://www.threads.net/@charms.ecuador',
  tiktokUrl: '',
  /** Número en formato internacional sin "+" (wa.me) */
  whatsapp: '593964170013',
  whatsappDisplay: '+593 96 417 0013',
  email: 'hola@charmsecuador.com',
  city: 'Quito, Ecuador',
  /** Horario de atención mostrado en el footer y en contacto */
  hours: 'Lun a Sáb · 9h00 – 19h00',
  currency: 'USD',
  /** Sello visible en el pie: quién construyó el sitio */
  builtBy: {
    label: 'Sitio por Matthew Cedeño',
    url: 'https://github.com/MatthewC-18',
  },
} as const

export const waUrl = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`

export interface ShippingOption {
  zone: string
  price: number
  eta: string
}

/** Tiempos y logística — se muestran en varias páginas */
export const logistics: {
  productionDays: string
  rushDays: string
  rushSurchargePct: number
  shipping: ShippingOption[]
  depositPct: number
} = {
  productionDays: '7 a 12 días laborables',
  rushDays: '3 a 5 días laborables',
  rushSurchargePct: 25,
  shipping: [
    { zone: 'Quito (entrega a domicilio)', price: 3.5, eta: '24 a 48 horas' },
    { zone: 'Guayaquil, Cuenca, Ambato y capitales', price: 5, eta: '2 a 3 días' },
    { zone: 'Resto del país (Servientrega)', price: 6.5, eta: '3 a 5 días' },
    { zone: 'Retiro en taller (Quito)', price: 0, eta: 'Coordinado por WhatsApp' },
  ],
  depositPct: 50,
}

export const trustStats = [
  { value: '+900', label: 'piezas publicadas' },
  { value: '17 mil', label: 'seguidores en Instagram' },
  { value: '+8 años', label: 'modelando a mano' },
  { value: '24 prov.', label: 'con envíos realizados' },
] as const

export const steps = [
  {
    n: 1,
    title: 'Cuéntanos la idea',
    text: 'Eliges el tipo de pieza y nos escribes por WhatsApp con la ocasión y cuántas figuras quieres.',
    icon: 'chat',
  },
  {
    n: 2,
    title: 'Envías las fotos',
    text: 'Una foto de rostro de cada persona (y de las mascotas). Con eso definimos peinados, ropa y detalles.',
    icon: 'camera',
  },
  {
    n: 3,
    title: 'Aprobamos el boceto',
    text: 'Te mandamos la propuesta y el valor final. Con el 50% de anticipo entra a taller.',
    icon: 'sketch',
  },
  {
    n: 4,
    title: 'Modelado a mano',
    text: 'Cada figura se modela pieza por pieza en porcelana fría, se seca, se pinta y se sella.',
    icon: 'hands',
  },
  {
    n: 5,
    title: 'Fotos antes de enviar',
    text: 'Te enviamos fotos reales de tu pieza terminada para tu visto bueno.',
    icon: 'check',
  },
  {
    n: 6,
    title: 'Empaque y envío',
    text: 'Empaque anti-golpes y envío a todo el Ecuador con número de guía.',
    icon: 'truck',
  },
] as const

/**
 * Trabajos reales del taller (fotos con marca de agua propia).
 * Para sumar más: procesar con `node scripts/procesar-assets.mjs fotos <carpeta>`
 * y agregar la entrada aquí.
 */
export const galeria = [
  {
    src: './productos/cuadro-columpio-pareja.webp',
    alt: 'Cuadro columpio con pareja, corazón rojo y fecha de aniversario',
    pie: 'Cuadro columpio · aniversario',
  },
  {
    src: './productos/cuadro-4d-familia-mascotas.webp',
    alt: 'Cuadro 4D con pareja, tres perros y nombres de cada uno',
    pie: 'Cuadro 4D · familia con mascotas',
  },
  {
    src: './productos/retrovisor-pareja-auto.webp',
    alt: 'Pieza de retrovisor con pareja sobre un auto celeste',
    pie: 'Retrovisor · pareja',
  },
  {
    src: './productos/retrovisor-familia-hyundai.webp',
    alt: 'Pieza de retrovisor con cuatro figuras sobre un auto blanco',
    pie: 'Retrovisor · 4 figuras',
  },
  {
    src: './productos/corporativo-pronaca.webp',
    alt: 'Figura con uniforme institucional sobre base con logotipo en relieve',
    pie: 'Corporativo · 20 años de servicio',
  },
  {
    src: './productos/cuadro-columpio-familia.webp',
    alt: 'Cuadro columpio con papá, hija y mamá',
    pie: 'Cuadro columpio · familia',
  },
  {
    src: './productos/figura-de-pie-mujer.webp',
    alt: 'Figura de pie de una mujer con chaqueta azul y falda a cuadros',
    pie: 'Figura de pie · cumpleaños',
  },
  {
    src: './productos/retrovisor-familia-bebe.webp',
    alt: 'Pieza de retrovisor con mamá, bebé y papá sobre un auto gris',
    pie: 'Retrovisor · con bebé',
  },
  {
    src: './productos/retrovisor-familia-audi.webp',
    alt: 'Pieza de retrovisor con tres figuras sobre un auto blanco',
    pie: 'Retrovisor · familia',
  },
  {
    src: './productos/retrovisor-individual.webp',
    alt: 'Pieza de retrovisor con una figura sobre un auto gris',
    pie: 'Retrovisor · individual',
  },
] as const

export const testimonials = [
  {
    name: 'Andrea M.',
    city: 'Quito',
    text: 'Pedí el cuadro del columpio para mi aniversario y quedó idéntico a nosotros. Mi esposo lloró cuando lo abrió.',
    piece: 'Cuadro columpio · 2 figuras',
  },
  {
    name: 'Julio S.',
    city: 'Guayaquil',
    text: 'Hicieron 20 placas para los 20 años de la empresa. Cumplieron la fecha y todos quedaron encantados.',
    piece: 'Regalo corporativo · 20 piezas',
  },
  {
    name: 'Michelle C.',
    city: 'Cuenca',
    text: 'Incluyeron a mis dos perritas en el cuadro 4D. El nivel de detalle en el pelaje es una locura.',
    piece: 'Cuadro 4D · 1 figura + 2 mascotas',
  },
  {
    name: 'Comandante César P.',
    city: 'Manta',
    text: 'La figura del uniforme quedó exacta, hasta los galones. Fue el regalo de jubilación perfecto.',
    piece: 'Figura de pie · profesión',
  },
] as const

export const faqs = [
  {
    q: '¿Cuánto se demora una pieza?',
    a: `El tiempo normal de producción es de ${logistics.productionDays} desde que apruebas el boceto y confirmas el anticipo. Si la necesitas antes, tenemos entrega express en ${logistics.rushDays} con un recargo del ${logistics.rushSurchargePct}%.`,
  },
  {
    q: '¿Qué fotos necesito enviar?',
    a: 'Una foto frontal del rostro de cada persona, con buena luz y sin gorra ni lentes de sol (a menos que quieras que la figura los lleve). Si quieres una vestimenta específica, mándanos también una foto de cuerpo entero o la referencia de la ropa.',
  },
  {
    q: '¿Se parecen de verdad a la persona?',
    a: 'Trabajamos un parecido tipo caricatura cariñosa: peinado, tono de piel, color de ojos, lentes, barba, tatuajes visibles y la ropa que nos pidas. No es un retrato hiperrealista, es una versión tierna y reconocible.',
  },
  {
    q: '¿Es frágil?',
    a: 'La porcelana fría es resistente al uso normal, pero no es indestructible: no la dejes bajo sol directo por horas, ni en lugares muy húmedos, y límpiala con un pincel seco o un paño suave. Los envíos van con empaque anti-golpes.',
  },
  {
    q: '¿Hacen pedidos al por mayor o para empresas?',
    a: 'Sí. Trabajamos reconocimientos, aniversarios institucionales y regalos de fin de año desde 10 unidades, con logotipo y placa personalizada. Escríbenos para una cotización por volumen.',
  },
  {
    q: '¿Cómo se paga?',
    a: `Con ${logistics.depositPct}% de anticipo para entrar a producción y el saldo antes del envío. Aceptamos transferencia bancaria, Deuna y efectivo en el taller.`,
  },
  {
    q: '¿Hacen envíos a todo el país?',
    a: 'Sí, a las 24 provincias. En Quito hacemos entrega a domicilio; al resto del país enviamos por courier con número de guía para que rastrees tu pedido.',
  },
  {
    q: '¿Puedo pedir un diseño que no está en el catálogo?',
    a: 'Claro. El catálogo es una base de referencia; la mayoría de pedidos son ideas propias del cliente. Cuéntanos qué imaginas y lo cotizamos.',
  },
] as const

export const occasions = [
  { id: 'aniversario', label: 'Aniversario', emoji: '❤️' },
  { id: 'cumpleanos', label: 'Cumpleaños', emoji: '🎂' },
  { id: 'madre', label: 'Día de la Madre', emoji: '💐' },
  { id: 'padre', label: 'Día del Padre', emoji: '🧔' },
  { id: 'grado', label: 'Graduación', emoji: '🎓' },
  { id: 'jubilacion', label: 'Jubilación', emoji: '🏅' },
  { id: 'boda', label: 'Boda', emoji: '💍' },
  { id: 'nacimiento', label: 'Nacimiento', emoji: '🍼' },
  { id: 'mascotas', label: 'Mascotas', emoji: '🐾' },
  { id: 'empresa', label: 'Empresarial', emoji: '🏢' },
  { id: 'profesion', label: 'Profesiones', emoji: '👩‍⚕️' },
  { id: 'amistad', label: 'Amistad', emoji: '🤝' },
] as const

export type OccasionId = (typeof occasions)[number]['id']
