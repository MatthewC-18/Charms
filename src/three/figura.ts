import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { ColoresMuneco } from '../data/muneco'

/**
 * Visor de la figura coleccionable.
 *
 * El modelo (`public/modelos/figura.glb`) viene de un escaneo esculpido: una
 * sola cáscara, sin UVs ni materiales, así que no se puede pintar por partes en
 * la malla. En su lugar, las zonas se resuelven en el fragment shader a partir
 * de la posición de cada píxel: el contorno del rostro está calcado del modelo
 * y el resto son cuerpos simples (elipsoides y cortes) ajustados a la figura.
 *
 * Ventaja de hacerlo en el shader y no por materiales: el borde entre pelo y
 * piel queda limpio aunque la malla esté decimada a 31 mil triángulos, y
 * cambiar un color es cambiar un uniform, sin tocar la geometría.
 *
 * Coordenadas: el glTF viene con Y arriba, el modelo se esculpió con Z arriba.
 * Dentro del shader se vuelve a las del modelo: (x, −z, y).
 */

const RUTA_MODELO = new URL(`${import.meta.env.BASE_URL}modelos/figura.glb`, document.baseURI).href

/** Alto que ocupa la figura en la escena del visor */
const ALTO_ESCENA = 3.6
/** Centro vertical: la cámara del visor mira a esta altura */
const CENTRO_Y = 0.35

/**
 * Contorno del rostro en el plano frontal (x, z) del modelo, calcado del
 * render: baja por el flequillo, abre en el pómulo y cierra en el mentón.
 */
const CARA_MEDIA: [number, number][] = [
  [0.0, 0.695],
  [0.116, 0.664],
  [0.207, 0.596],
  [0.274, 0.503],
  [0.313, 0.395],
  [0.298, 0.286],
  [0.237, 0.209],
  [0.116, 0.163],
  [0.0, 0.154],
]
const CARA: [number, number][] = [
  ...CARA_MEDIA,
  ...CARA_MEDIA.slice(1, -1)
    .reverse()
    .map(([x, z]) => [-x, z] as [number, number]),
]

/** Test punto-en-polígono desenrollado: evita arreglos en GLSL ES 1.0 */
function glslDentroCara() {
  const f = (n: number) => n.toFixed(4)
  const cruces = CARA.map((a, i) => {
    const b = CARA[(i + CARA.length - 1) % CARA.length]
    return `  if (((${f(a[1])} > p.y) != (${f(b[1])} > p.y)) && (p.x < (${f(b[0])} - ${f(a[0])}) * (p.y - ${f(a[1])}) / (${f(b[1])} - ${f(a[1])}) + ${f(a[0])})) d = !d;`
  }).join('\n')
  return `bool dentroCara(vec2 p) {\n  bool d = false;\n${cruces}\n  return d;\n}`
}

const ZONAS = /* glsl */ `
vec3 colorFigura(vec3 g) {
  // de vuelta a las coordenadas en que se esculpió (Z arriba, frente en -Y)
  float x = g.x;
  float y = -g.z;
  float z = g.y;
  float ax = abs(x);

  if (z < -0.78) return uBotas;                       // botas
  if (z < -0.72) return ax < 0.28 ? uPiel : uRopa;    // piernas / vuelo de la falda

  if (z > 0.14) {                                      // cabeza
    if (y < -0.12 && dentroCara(vec2(x, z))) {
      vec2 izq = vec2((x + 0.190) / 0.095, (z - 0.440) / 0.075);
      vec2 der = vec2((x - 0.190) / 0.095, (z - 0.440) / 0.075);
      if (dot(izq, izq) <= 1.0 || dot(der, der) <= 1.0) return uOjos;
      return uPiel;
    }
    return uPelo;
  }

  if (y < -0.08) {                                     // lo que se ve de frente
    if (ax > 0.26 && ax < 0.48 && z >= -0.64 && z < -0.28) return uPiel;   // antebrazo y mano
    if (ax > 0.18 && ax < 0.38 && z >= -0.28 && z <= -0.05) return uRopa;  // manga
  }

  if (ax > 0.315 - 0.12 * y && z > -0.36) return uPelo;  // mechones laterales
  vec3 nuca = vec3(x / 0.50, (y - 0.24) / 0.28, (z + 0.05) / 0.45);
  if (dot(nuca, nuca) <= 1.0) return uPelo;              // melena por la espalda

  return uRopa;
}
`

export interface Figura {
  grupo: THREE.Group
  aplicar: (c: ColoresMuneco) => void
  liberar: () => void
}

export async function crearFigura(colores: ColoresMuneco): Promise<Figura> {
  const gltf = await new GLTFLoader().loadAsync(RUTA_MODELO)
  const modelo = gltf.scene

  const uniformes = {
    uPiel: { value: new THREE.Color(colores.piel) },
    uPelo: { value: new THREE.Color(colores.cabello) },
    uOjos: { value: new THREE.Color(colores.ojos) },
    uRopa: { value: new THREE.Color(colores.ropa) },
    uBotas: { value: new THREE.Color('#3b3340') },
  }

  const material = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0 })
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniformes)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vFig;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFig = position;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        [
          '#include <common>',
          'varying vec3 vFig;',
          'uniform vec3 uPiel;',
          'uniform vec3 uPelo;',
          'uniform vec3 uOjos;',
          'uniform vec3 uRopa;',
          'uniform vec3 uBotas;',
          glslDentroCara(),
          ZONAS,
        ].join('\n'),
      )
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = colorFigura(vFig);')
  }
  // Sin esto three compila un programa por instancia del material
  material.customProgramCacheKey = () => 'charms-figura'

  const geometrias = new Set<THREE.BufferGeometry>()
  modelo.traverse((o) => {
    const malla = o as THREE.Mesh
    if (!malla.isMesh) return
    geometrias.add(malla.geometry)
    malla.material = material
  })

  // Centrada en el origen y escalada al alto que espera el visor
  const caja = new THREE.Box3().setFromObject(modelo)
  const medida = caja.getSize(new THREE.Vector3())
  const centro = caja.getCenter(new THREE.Vector3())
  const escala = ALTO_ESCENA / medida.y

  const grupo = new THREE.Group()
  const pivote = new THREE.Group()
  pivote.scale.setScalar(escala)
  pivote.position.copy(centro).multiplyScalar(-escala)
  pivote.position.y += CENTRO_Y
  pivote.add(modelo)
  grupo.add(pivote)

  return {
    grupo,
    aplicar: (c) => {
      uniformes.uPiel.value.set(c.piel)
      uniformes.uPelo.value.set(c.cabello)
      uniformes.uOjos.value.set(c.ojos)
      uniformes.uRopa.value.set(c.ropa)
    },
    liberar: () => {
      for (const g of geometrias) g.dispose()
      material.dispose()
    },
  }
}
