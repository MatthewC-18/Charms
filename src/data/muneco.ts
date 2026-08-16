/**
 * Opciones del visor 3D. Vive aparte de `three/muneco.ts` a propósito:
 * así la interfaz puede importar la paleta sin arrastrar Three.js al paquete
 * principal (Three se carga solo cuando el visor entra en pantalla).
 */

export const PIELES = [
  { id: 'clara', label: 'Clara', hex: '#f7d9bd' },
  { id: 'media', label: 'Media', hex: '#eab88f' },
  { id: 'trigueña', label: 'Trigueña', hex: '#cb9165' },
  { id: 'morena', label: 'Morena', hex: '#9c6440' },
  { id: 'oscura', label: 'Oscura', hex: '#6f4227' },
] as const

export const CABELLOS = [
  { id: 'negro', label: 'Negro', hex: '#171419' },
  { id: 'castaño', label: 'Castaño', hex: '#4b2f1d' },
  { id: 'claro', label: 'Castaño claro', hex: '#8a5a2b' },
  { id: 'rubio', label: 'Rubio', hex: '#d8a95c' },
  { id: 'colorado', label: 'Colorado', hex: '#a83c22' },
] as const

export const OJOS = [
  { id: 'cafe', label: 'Café', hex: '#5b3418' },
  { id: 'negro', label: 'Negro', hex: '#241d28' },
  { id: 'miel', label: 'Miel', hex: '#a8712a' },
  { id: 'verde', label: 'Verde', hex: '#3f7a52' },
  { id: 'lila', label: 'Lila', hex: '#7a6bb5' },
] as const

export const ROPAS = [
  { id: 'turquesa', label: 'Turquesa', hex: '#2ec3df' },
  { id: 'lila', label: 'Lila', hex: '#9370de' },
  { id: 'rosa', label: 'Rosa', hex: '#f291c2' },
  { id: 'rojo', label: 'Rojo', hex: '#e0413f' },
  { id: 'azul', label: 'Azul', hex: '#2f5bd0' },
  { id: 'blanco', label: 'Blanco', hex: '#f4f6f8' },
] as const

export const PEINADOS = [
  { id: 'largo', label: 'Cabello largo' },
  { id: 'recogido', label: 'Recogido' },
  { id: 'corto', label: 'Corto' },
] as const

export type Peinado = (typeof PEINADOS)[number]['id']

export interface ColoresMuneco {
  piel: string
  cabello: string
  ojos: string
  ropa: string
  peinado: Peinado
  estilo: 'ella' | 'el'
}

export const coloresIniciales: ColoresMuneco = {
  piel: PIELES[1].hex,
  cabello: CABELLOS[0].hex,
  ojos: OJOS[0].hex,
  ropa: ROPAS[0].hex,
  peinado: 'largo',
  estilo: 'ella',
}

const etiqueta = (lista: readonly { label: string; hex: string }[], hex: string) =>
  (lista.find((x) => x.hex === hex)?.label ?? hex).toLowerCase()

/** Texto legible de la configuración, para el mensaje de WhatsApp */
export function describirColores(c: ColoresMuneco) {
  const peinado = PEINADOS.find((p) => p.id === c.peinado)?.label.toLowerCase() ?? c.peinado
  return [
    `piel ${etiqueta(PIELES, c.piel)}`,
    `${peinado} ${etiqueta(CABELLOS, c.cabello)}`,
    `ojos ${etiqueta(OJOS, c.ojos)}`,
    `ropa ${etiqueta(ROPAS, c.ropa)}`,
  ].join(', ')
}
