import * as THREE from 'three'

/**
 * Muñeco de porcelana fría armado desde cero con primitivas.
 *
 * No hay modelo importado: cada parte es una esfera, cápsula o cilindro
 * colocado a mano, con las proporciones de las figuras del taller (cabeza
 * grande, cuerpo pequeño, base redonda con el nombre).
 */

import type { ColoresMuneco } from '../data/muneco'
export type { ColoresMuneco }

/** Sombra de contacto: textura degradada dibujada en un canvas 2D */
function texturaSombra() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
  g.addColorStop(0, 'rgba(22,35,63,0.42)')
  g.addColorStop(0.6, 'rgba(22,35,63,0.14)')
  g.addColorStop(1, 'rgba(22,35,63,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

/** Corazón en la mano, como el de las piezas reales */
function geometriaCorazon() {
  const f = new THREE.Shape()
  f.moveTo(0, -0.28)
  f.bezierCurveTo(0.36, 0.02, 0.24, 0.34, 0, 0.2)
  f.bezierCurveTo(-0.24, 0.34, -0.36, 0.02, 0, -0.28)
  return new THREE.ExtrudeGeometry(f, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 18 })
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

  const nuevoMat = (opciones: THREE.MeshStandardMaterialParameters) => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.52, metalness: 0.02, ...opciones })
    materiales.push(m)
    return m
  }

  const matPiel = nuevoMat({ color: colores.piel })
  const matCabello = nuevoMat({ color: colores.cabello, roughness: 0.38 })
  const matRopa = nuevoMat({ color: colores.ropa })
  const matBase = nuevoMat({ color: '#f3f7fa', roughness: 0.62 })
  const matOscuro = nuevoMat({ color: '#1a1a22', roughness: 0.3 })
  const matBlanco = nuevoMat({ color: '#ffffff', roughness: 0.25 })
  const matRubor = nuevoMat({ color: '#ff9db5', roughness: 0.7, transparent: true, opacity: 0.75 })
  const matCorazon = nuevoMat({ color: '#e5322f', roughness: 0.25 })
  const matBoca = nuevoMat({ color: '#b8465a', roughness: 0.4 })

  const agregar = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number]) => {
    geometrias.push(geo)
    const m = new THREE.Mesh(geo, mat)
    m.position.set(...pos)
    grupo.add(m)
    return m
  }

  // ---- base redonda con el nombre ----
  agregar(new THREE.CylinderGeometry(1.05, 1.12, 0.2, 48), matBase, [0, -1.62, 0])

  // ---- piernas y zapatos ----
  for (const lado of [-1, 1]) {
    agregar(new THREE.CapsuleGeometry(0.17, 0.45, 6, 16), matRopa, [lado * 0.24, -1.16, 0])
    agregar(new THREE.SphereGeometry(0.21, 20, 14), matOscuro, [lado * 0.24, -1.48, 0.06])
  }

  // ---- cuerpo ----
  agregar(new THREE.CylinderGeometry(0.42, 0.56, 0.82, 32), matRopa, [0, -0.52, 0])
  agregar(new THREE.SphereGeometry(0.42, 28, 20), matRopa, [0, -0.12, 0])

  // ---- brazos: manga de ropa + mano de piel ----
  for (const lado of [-1, 1]) {
    const brazo = agregar(new THREE.CapsuleGeometry(0.13, 0.34, 6, 14), matRopa, [lado * 0.5, -0.28, 0.02])
    brazo.rotation.z = lado * 0.35
    agregar(new THREE.SphereGeometry(0.15, 18, 14), matPiel, [lado * 0.62, -0.62, 0.06])
  }

  // corazón que sostiene con las dos manos
  const corazon = agregar(geometriaCorazon(), matCorazon, [0, -0.55, 0.42])
  corazon.scale.setScalar(0.85)
  corazon.rotation.x = -0.25

  // ---- cabeza ----
  const cabeza = agregar(new THREE.SphereGeometry(0.78, 40, 30), matPiel, [0, 0.62, 0])
  cabeza.scale.set(1, 0.98, 0.94)

  // pelo: casquete + melena + mechones laterales
  const casquete = agregar(new THREE.SphereGeometry(0.8, 40, 26, 0, Math.PI * 2, 0, Math.PI * 0.62), matCabello, [0, 0.64, -0.02])
  casquete.scale.set(1.02, 1.06, 1.02)

  const melena = agregar(new THREE.SphereGeometry(0.74, 32, 24), matCabello, [0, 0.5, -0.28])
  melena.scale.set(1.0, 1.05, 0.72)

  for (const lado of [-1, 1]) {
    const mechon = agregar(new THREE.CapsuleGeometry(0.16, 0.5, 6, 14), matCabello, [lado * 0.66, 0.38, -0.02])
    mechon.rotation.z = lado * 0.12
    mechon.scale.set(1, 1, 0.7)
  }

  // ---- cara ----
  for (const lado of [-1, 1]) {
    // ojo grande estilo Charms
    const ojo = agregar(new THREE.SphereGeometry(0.15, 20, 16), matOscuro, [lado * 0.27, 0.64, 0.66])
    ojo.scale.set(1, 1.15, 0.5)

    const brillo = agregar(new THREE.SphereGeometry(0.05, 12, 10), matBlanco, [lado * 0.23, 0.71, 0.73])
    brillo.scale.set(1, 1, 0.4)

    const ceja = agregar(new THREE.CapsuleGeometry(0.032, 0.19, 4, 10), matCabello, [lado * 0.28, 0.88, 0.66])
    ceja.rotation.z = Math.PI / 2 + lado * 0.12

    const rubor = agregar(new THREE.SphereGeometry(0.14, 16, 12), matRubor, [lado * 0.46, 0.45, 0.58])
    rubor.scale.set(1, 0.72, 0.22)
  }

  const boca = agregar(new THREE.SphereGeometry(0.1, 18, 14), matBoca, [0, 0.36, 0.7])
  boca.scale.set(1.3, 0.72, 0.35)

  const nariz = agregar(new THREE.SphereGeometry(0.07, 14, 12), matPiel, [0, 0.52, 0.75])
  nariz.scale.set(1, 0.85, 0.8)

  // ---- sombra de contacto ----
  const texSombra = texturaSombra()
  const sombraGeo = new THREE.PlaneGeometry(3.4, 3.4)
  geometrias.push(sombraGeo)
  const sombraMat = new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false })
  materiales.push(sombraMat)
  const sombra = new THREE.Mesh(sombraGeo, sombraMat)
  sombra.rotation.x = -Math.PI / 2
  sombra.position.y = -1.71
  grupo.add(sombra)

  return {
    grupo,
    aplicar: (c) => {
      matPiel.color.set(c.piel)
      matCabello.color.set(c.cabello)
      matRopa.color.set(c.ropa)
    },
    liberar: () => {
      for (const g of geometrias) g.dispose()
      for (const m of materiales) m.dispose()
      texSombra.dispose()
    },
  }
}
