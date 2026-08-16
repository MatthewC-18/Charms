import * as THREE from 'three'
import { crearTexturaCara, type RasgosCara } from './cara'

/**
 * Cabeza compartida por el muñeco y la sirena: esfera con la cara pintada
 * como textura y el pelo armado con casquete, melena, mechones o moño.
 *
 * El casquete llega solo hasta un poco por encima de los ojos (theta 0.38π),
 * así el pelo nunca tapa la cara; el volumen largo va en una malla aparte,
 * detrás de la cabeza.
 */

export type Peinado = 'largo' | 'corto' | 'recogido'

export interface RasgosPersonaje extends RasgosCara {
  peinado: Peinado
}

export interface Cabeza {
  grupo: THREE.Group
  aplicar: (r: RasgosPersonaje) => void
  liberar: () => void
}

/** Radio base 1: el llamador escala el grupo al tamaño que necesite. */
export function crearCabeza(rasgos: RasgosPersonaje): Cabeza {
  const grupo = new THREE.Group()
  const geometrias: THREE.BufferGeometry[] = []
  const materiales: THREE.Material[] = []

  const cara = crearTexturaCara(rasgos)

  const matCara = new THREE.MeshStandardMaterial({ map: cara.textura, roughness: 0.5, metalness: 0.02 })
  const matPelo = new THREE.MeshStandardMaterial({ color: rasgos.cabello, roughness: 0.34, metalness: 0.03 })
  materiales.push(matCara, matPelo)

  const malla = (geo: THREE.BufferGeometry, mat: THREE.Material) => {
    geometrias.push(geo)
    const m = new THREE.Mesh(geo, mat)
    grupo.add(m)
    return m
  }

  // ---- cabeza ----
  const cabeza = malla(new THREE.SphereGeometry(1, 56, 40), matCara)
  cabeza.scale.set(1, 0.99, 0.94)

  // ---- casquete: cubre la coronilla y baja hasta encima de las cejas ----
  const casquete = malla(
    new THREE.SphereGeometry(1.035, 48, 28, 0, Math.PI * 2, 0, Math.PI * 0.345),
    matPelo,
  )
  casquete.scale.set(1, 1.03, 0.98)

  // raya al medio: el casquete baja un poco más por los costados y atrás
  const nuca = malla(new THREE.SphereGeometry(1.02, 40, 26, 0, Math.PI * 2, 0, Math.PI * 0.62), matPelo)
  nuca.scale.set(1, 1.02, 0.92)
  nuca.position.z = -0.18

  // ---- melena larga (detrás de los hombros) ----
  const melena = new THREE.Group()
  const cuerpoMelena = new THREE.Mesh(new THREE.SphereGeometry(0.98, 36, 26), matPelo)
  geometrias.push(cuerpoMelena.geometry)
  cuerpoMelena.scale.set(1.02, 1.12, 0.66)
  cuerpoMelena.position.set(0, -0.32, -0.3)
  melena.add(cuerpoMelena)

  for (const lado of [-1, 1]) {
    const mechon = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.72, 8, 18), matPelo)
    geometrias.push(mechon.geometry)
    mechon.position.set(lado * 0.86, -0.42, -0.02)
    mechon.rotation.z = lado * 0.1
    mechon.scale.set(1, 1, 0.72)
    melena.add(mechon)
  }
  grupo.add(melena)

  // ---- moño ----
  const mono = new THREE.Mesh(new THREE.SphereGeometry(0.44, 26, 20), matPelo)
  geometrias.push(mono.geometry)
  mono.position.set(0, 0.86, -0.62)
  grupo.add(mono)

  const aplicarPeinado = (p: Peinado) => {
    melena.visible = p === 'largo'
    mono.visible = p === 'recogido'
    nuca.visible = p !== 'corto'
  }
  aplicarPeinado(rasgos.peinado)

  return {
    grupo,
    aplicar: (r) => {
      cara.repintar(r)
      matPelo.color.set(r.cabello)
      aplicarPeinado(r.peinado)
    },
    liberar: () => {
      for (const g of geometrias) g.dispose()
      for (const m of materiales) m.dispose()
      cara.liberar()
    },
  }
}
