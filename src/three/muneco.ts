import * as THREE from 'three'
import { crearCabeza } from './personaje'
import type { ColoresMuneco } from '../data/muneco'

export type { ColoresMuneco }

/**
 * Figura de porcelana fría armada desde cero con primitivas, siguiendo las
 * proporciones reales del taller: cabeza enorme (casi la mitad del alto),
 * cuerpo corto y regordete, base redonda para el nombre y un corazón en las
 * manos. La cara va como textura (ver cara.ts) para lograr los ojos grandes
 * con pestañas y brillo, que es lo que hace reconocibles a estas piezas.
 */

/** Sombra de contacto: textura degradada dibujada en un canvas 2D */
function texturaSombra() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
  g.addColorStop(0, 'rgba(22,35,63,0.45)')
  g.addColorStop(0.55, 'rgba(22,35,63,0.16)')
  g.addColorStop(1, 'rgba(22,35,63,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

/** Corazón, igual al de las piezas reales */
export function geometriaCorazon() {
  const f = new THREE.Shape()
  f.moveTo(0, -0.3)
  f.bezierCurveTo(0.38, 0.04, 0.26, 0.36, 0, 0.2)
  f.bezierCurveTo(-0.26, 0.36, -0.38, 0.04, 0, -0.3)
  return new THREE.ExtrudeGeometry(f, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.05,
    bevelSegments: 3,
    curveSegments: 20,
  })
}

export interface Muneco {
  grupo: THREE.Group
  aplicar: (c: ColoresMuneco) => void
  liberar: () => void
}

export function crearMuneco(colores: ColoresMuneco): Muneco {
  const grupo = new THREE.Group()
  const geometrias: THREE.BufferGeometry[] = []
  const materiales: THREE.Material[] = []

  const nuevoMat = (o: THREE.MeshStandardMaterialParameters) => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.02, ...o })
    materiales.push(m)
    return m
  }

  const matPiel = nuevoMat({ color: colores.piel })
  const matRopa = nuevoMat({ color: colores.ropa })
  const matPantalon = nuevoMat({ color: '#2f4a7a' })
  const matBase = nuevoMat({ color: '#f2f6fa', roughness: 0.6 })
  const matZapato = nuevoMat({ color: '#22222c', roughness: 0.35 })
  const matCorazon = nuevoMat({ color: '#e5322f', roughness: 0.22 })

  const agregar = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number]) => {
    geometrias.push(geo)
    const m = new THREE.Mesh(geo, mat)
    m.position.set(...pos)
    grupo.add(m)
    return m
  }

  // ---------- base con reborde ----------
  agregar(new THREE.CylinderGeometry(1.26, 1.34, 0.22, 56), matBase, [0, -1.72, 0])
  agregar(new THREE.TorusGeometry(1.26, 0.055, 10, 56), matBase, [0, -1.61, 0]).rotation.x = Math.PI / 2

  // ---------- piernas cortas y zapatos ----------
  for (const lado of [-1, 1]) {
    agregar(new THREE.CapsuleGeometry(0.2, 0.34, 8, 18), matPantalon, [lado * 0.26, -1.2, 0])
    const zapato = agregar(new THREE.SphereGeometry(0.24, 22, 16), matZapato, [lado * 0.26, -1.5, 0.08])
    zapato.scale.set(1, 0.72, 1.25)
  }

  // ---------- cuerpo: torso corto y ancho ----------
  const torso = agregar(new THREE.CylinderGeometry(0.5, 0.62, 0.72, 36), matRopa, [0, -0.62, 0])
  torso.scale.set(1, 1, 0.9)
  const hombros = agregar(new THREE.SphereGeometry(0.5, 32, 22), matRopa, [0, -0.3, 0])
  hombros.scale.set(1, 0.78, 0.9)
  // cuello
  agregar(new THREE.CylinderGeometry(0.22, 0.26, 0.16, 20), matPiel, [0, -0.06, 0])

  // ---------- brazos hacia adelante, sosteniendo el corazón ----------
  for (const lado of [-1, 1]) {
    const brazo = agregar(new THREE.CapsuleGeometry(0.155, 0.46, 8, 16), matRopa, [lado * 0.5, -0.5, 0.2])
    brazo.rotation.set(-0.7, 0, lado * 0.42)

    const mano = agregar(new THREE.SphereGeometry(0.17, 20, 16), matPiel, [lado * 0.28, -0.78, 0.56])
    mano.scale.set(1, 0.88, 1)
  }

  const corazon = agregar(geometriaCorazon(), matCorazon, [0, -0.7, 0.6])
  corazon.scale.setScalar(0.78)
  corazon.rotation.x = -0.22

  // ---------- cabeza (esfera con la cara pintada) ----------
  const cabeza = crearCabeza({
    piel: colores.piel,
    ojos: colores.ojos,
    cabello: colores.cabello,
    peinado: colores.peinado,
    estilo: colores.estilo,
  })
  cabeza.grupo.scale.setScalar(0.92)
  cabeza.grupo.position.set(0, 0.78, 0)
  grupo.add(cabeza.grupo)

  // ---------- sombra ----------
  const texSombra = texturaSombra()
  const sombraGeo = new THREE.PlaneGeometry(4, 4)
  geometrias.push(sombraGeo)
  const sombraMat = new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false })
  materiales.push(sombraMat)
  const sombra = new THREE.Mesh(sombraGeo, sombraMat)
  sombra.rotation.x = -Math.PI / 2
  sombra.position.y = -1.82
  grupo.add(sombra)

  return {
    grupo,
    aplicar: (c) => {
      matPiel.color.set(c.piel)
      matRopa.color.set(c.ropa)
      cabeza.aplicar({
        piel: c.piel,
        ojos: c.ojos,
        cabello: c.cabello,
        peinado: c.peinado,
        estilo: c.estilo,
      })
    },
    liberar: () => {
      cabeza.liberar()
      for (const g of geometrias) g.dispose()
      for (const m of materiales) m.dispose()
      texSombra.dispose()
    },
  }
}
