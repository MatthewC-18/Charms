/**
 * Paleta del visor 3D. Vive aparte de `three/muneco.ts` a propósito:
 * así la interfaz puede importar los colores sin arrastrar Three.js al
 * paquete principal (Three se carga solo cuando el visor entra en pantalla).
 */

export const PIELES = [
  { id: 'clara', label: 'Clara', hex: '#f6d6b8' },
  { id: 'media', label: 'Media', hex: '#e8b38a' },
  { id: 'trigueña', label: 'Trigueña', hex: '#c98d61' },
  { id: 'oscura', label: 'Oscura', hex: '#8c5a3c' },
] as const

export const CABELLOS = [
  { id: 'negro', label: 'Negro', hex: '#1c1a1c' },
  { id: 'castaño', label: 'Castaño', hex: '#4b2f1d' },
  { id: 'claro', label: 'Castaño claro', hex: '#8a5a2b' },
  { id: 'rubio', label: 'Rubio', hex: '#d8a95c' },
  { id: 'colorado', label: 'Colorado', hex: '#a83c22' },
] as const

export const ROPAS = [
  { id: 'turquesa', label: 'Turquesa', hex: '#2ec3df' },
  { id: 'lila', label: 'Lila', hex: '#9370de' },
  { id: 'rosa', label: 'Rosa', hex: '#f291c2' },
  { id: 'rojo', label: 'Rojo', hex: '#e0413f' },
  { id: 'azul', label: 'Azul', hex: '#2f5bd0' },
  { id: 'blanco', label: 'Blanco', hex: '#f4f6f8' },
] as const

export interface ColoresMuneco {
  piel: string
  cabello: string
  ropa: string
}

export const coloresIniciales: ColoresMuneco = {
  piel: PIELES[1].hex,
  cabello: CABELLOS[0].hex,
  ropa: ROPAS[0].hex,
}

/** Texto legible de los tonos elegidos, para el mensaje de WhatsApp */
export function describirColores(c: ColoresMuneco) {
  const piel = PIELES.find((p) => p.hex === c.piel)?.label ?? c.piel
  const cabello = CABELLOS.find((p) => p.hex === c.cabello)?.label ?? c.cabello
  const ropa = ROPAS.find((p) => p.hex === c.ropa)?.label ?? c.ropa
  return `piel ${piel.toLowerCase()}, cabello ${cabello.toLowerCase()}, ropa ${ropa.toLowerCase()}`
}
