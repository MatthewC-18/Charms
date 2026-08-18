/**
 * Opciones de la figura de muestra.
 *
 * Vive aparte del componente para que la paleta se pueda leer desde cualquier
 * página sin arrastrar el dibujo. Los tonos son los que el taller usa de
 * verdad: la figura final se modela a mano a partir de las fotos.
 */

export const PIELES = [
  { id: 'clara', label: 'Clara', hex: '#f7d9bd' },
  { id: 'media', label: 'Media', hex: '#eab88f' },
  { id: 'trigueña', label: 'Trigueña', hex: '#cb9165' },
  { id: 'morena', label: 'Morena', hex: '#9c6440' },
  { id: 'oscura', label: 'Oscura', hex: '#6f4227' },
] as const

export const CABELLOS = [
  { id: 'negro', label: 'Negro', hex: '#221c28' },
  { id: 'castaño', label: 'Castaño', hex: '#4b2f1d' },
  { id: 'claro', label: 'Castaño claro', hex: '#8a5a2b' },
  { id: 'rubio', label: 'Rubio', hex: '#d8a95c' },
  { id: 'colorado', label: 'Colorado', hex: '#a83c22' },
  { id: 'canoso', label: 'Canoso', hex: '#b9b3bd' },
] as const

export const OJOS = [
  { id: 'cafe', label: 'Café', hex: '#5b3418' },
  { id: 'negro', label: 'Negro', hex: '#2b2331' },
  { id: 'miel', label: 'Miel', hex: '#a8712a' },
  { id: 'verde', label: 'Verde', hex: '#3f7a52' },
  { id: 'celeste', label: 'Celeste', hex: '#4a86b8' },
] as const

export const ROPAS = [
  { id: 'turquesa', label: 'Turquesa', hex: '#2ec3df' },
  { id: 'lila', label: 'Lila', hex: '#9370de' },
  { id: 'rosa', label: 'Rosa', hex: '#f291c2' },
  { id: 'rojo', label: 'Rojo', hex: '#e0413f' },
  { id: 'azul', label: 'Azul', hex: '#2f5bd0' },
  { id: 'verde', label: 'Verde', hex: '#3d9c6b' },
  { id: 'amarillo', label: 'Amarillo', hex: '#f0b93b' },
  { id: 'blanco', label: 'Blanco', hex: '#eef0f4' },
] as const

export const PEINADOS = [
  { id: 'largo', label: 'Largo' },
  { id: 'ondulado', label: 'Ondulado' },
  { id: 'recogido', label: 'Recogido' },
  { id: 'corto', label: 'Corto' },
] as const

/** Los formatos que más sale el taller, para que la muestra se parezca al pedido */
export const TIPOS = [
  { id: 'individual', label: 'Figura de pie', hint: 'Una persona sobre base con nombre' },
  { id: 'pareja', label: 'Pareja', hint: 'Dos figuras tomadas de la mano' },
  { id: 'graduacion', label: 'Graduación', hint: 'Toga, birrete y diploma' },
  { id: 'mascota', label: 'Con mascota', hint: 'La figura y su perrito' },
] as const

export type Peinado = (typeof PEINADOS)[number]['id']
export type TipoFigura = (typeof TIPOS)[number]['id']

export interface Apariencia {
  piel: string
  cabello: string
  ojos: string
  ropa: string
  peinado: Peinado
  estilo: 'ella' | 'el'
  tipo: TipoFigura
}

export const aparienciaInicial: Apariencia = {
  piel: PIELES[1].hex,
  cabello: CABELLOS[1].hex,
  ojos: OJOS[0].hex,
  ropa: ROPAS[0].hex,
  peinado: 'largo',
  estilo: 'ella',
  tipo: 'individual',
}

const etiqueta = (lista: readonly { label: string; hex: string }[], hex: string) =>
  (lista.find((x) => x.hex === hex)?.label ?? hex).toLowerCase()

/** Texto legible de la configuración, para el mensaje de WhatsApp */
export function describirApariencia(a: Apariencia) {
  const peinado = PEINADOS.find((p) => p.id === a.peinado)?.label.toLowerCase() ?? a.peinado
  const tipo = TIPOS.find((t) => t.id === a.tipo)?.label.toLowerCase() ?? a.tipo
  return [
    tipo,
    `piel ${etiqueta(PIELES, a.piel)}`,
    `cabello ${peinado} ${etiqueta(CABELLOS, a.cabello)}`,
    `ojos ${etiqueta(OJOS, a.ojos)}`,
    `ropa ${etiqueta(ROPAS, a.ropa)}`,
  ].join(', ')
}

/**
 * Mezcla un color hex hacia negro o blanco.
 * Sirve para las sombras y los brillos del dibujo sin declarar cada tono a mano.
 */
export function tono(hex: string, factor: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  const canal = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    factor < 0 ? Math.round(c * (1 + factor)) : Math.round(c + (255 - c) * factor),
  )
  return `#${canal.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}
