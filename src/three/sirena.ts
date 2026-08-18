import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Charmy, la sirena de la marca.
 *
 * El modelo se esculpe y se pinta en Blender y se exporta a glTF binario con
 * las texturas incrustadas (`public/modelos/sirena.glb`). Aquí se carga, se
 * normaliza (centrado en el origen y alto 1, para que quien lo use lo escale
 * con una sola cifra) y se le da vida moviendo los huesos del esqueleto que ya
 * trae: la cadena de la cola ondula como una ola que viaja hacia la aleta, el
 * cabello flota con retraso y los brazos cambian de pose según lo que Charmy
 * esté diciendo.
 *
 * El grupo queda de pie, mirando hacia +Z.
 */

const RUTA_MODELO = new URL(`${import.meta.env.BASE_URL}modelos/sirena.glb`, document.baseURI).href

/** Vaivén lateral: girar sobre Z desplaza la punta en X */
const EJE_VAIVEN = new THREE.Vector3(0, 0, 1)
/** Flote adelante/atrás: girar sobre X desplaza la punta en Z */
const EJE_FLOTE = new THREE.Vector3(1, 0, 0)

/** Huesos del esqueleto original (nombres tal como salen del rig) */
const COLA = ['waist_a_029', 'waist_b_030', 'waist_c_031', 'waist_d_032', 'waist_e_033', 'waist_f_034']
const ALETAS = ['fin_L_035', 'fin_R_036']
const CABELLO = ['hair_a_026', 'hair_b_027', 'hair_c_028']
const BRAZO_IZQ = 'arm_L_a_06'
const BRAZO_DER = 'arm_R_a_016'
const CABEZA = 'head_025'

/**
 * Poses de brazos y cabeza. Girando sobre +Z, un ángulo positivo sube el brazo
 * izquierdo (+X) y baja el derecho (−X): de ahí los signos cruzados.
 */
export type Pose = 'nadando' | 'saludo' | 'presentar' | 'idea' | 'celebrar'

interface Ajuste {
  reposo: number
  amplitud: number
  velocidad?: number
}

const POSES: Record<Pose, Record<string, Ajuste>> = {
  // brazos caídos a los costados, respirando
  nadando: {
    [BRAZO_IZQ]: { reposo: -0.42, amplitud: 0.06, velocidad: 1.3 },
    [BRAZO_DER]: { reposo: 0.42, amplitud: -0.06, velocidad: 1.3 },
    [CABEZA]: { reposo: 0, amplitud: 0.035, velocidad: 0.9 },
  },
  // mano izquierda arriba, agitándose
  saludo: {
    [BRAZO_IZQ]: { reposo: 0.92, amplitud: 0.32, velocidad: 5.4 },
    [BRAZO_DER]: { reposo: 0.34, amplitud: -0.05, velocidad: 1.3 },
    [CABEZA]: { reposo: 0.11, amplitud: 0.05, velocidad: 1.6 },
  },
  // un brazo abierto, como mostrando algo
  presentar: {
    [BRAZO_IZQ]: { reposo: -0.12, amplitud: 0.09, velocidad: 1.5 },
    [BRAZO_DER]: { reposo: 0.66, amplitud: -0.07, velocidad: 1.5 },
    [CABEZA]: { reposo: -0.09, amplitud: 0.04, velocidad: 1.1 },
  },
  // mano cerca de la cara, cabeza inclinada
  idea: {
    [BRAZO_IZQ]: { reposo: 0.58, amplitud: 0.05, velocidad: 1.2 },
    [BRAZO_DER]: { reposo: 0.2, amplitud: -0.04, velocidad: 1.2 },
    [CABEZA]: { reposo: 0.15, amplitud: 0.03, velocidad: 0.8 },
  },
  // los dos brazos arriba
  celebrar: {
    [BRAZO_IZQ]: { reposo: 1.02, amplitud: 0.14, velocidad: 3.6 },
    [BRAZO_DER]: { reposo: -1.02, amplitud: -0.14, velocidad: 3.6 },
    [CABEZA]: { reposo: 0, amplitud: 0.08, velocidad: 2.4 },
  },
}

/** Un hueso con su pose de reposo y el vaivén que se le suma encima */
interface HuesoAnimado {
  hueso: THREE.Object3D
  base: THREE.Quaternion
  eje: THREE.Vector3
  /** Valores actuales: persiguen a los destino para que la pose no salte */
  reposo: number
  amplitud: number
  velocidad: number
  reposoDestino: number
  amplitudDestino: number
  velocidadDestino: number
  /** Fase acumulada: así cambiar la velocidad no produce saltos */
  fase: number
  /** Cuánto crece la amplitud cuando el visitante hace scroll rápido */
  respuesta: number
}

export interface Sirena {
  grupo: THREE.Group
  /** Alto del modelo ya normalizado: siempre 1, el tamaño se pone desde afuera */
  alto: number
  /** Medio ancho del modelo, en las mismas unidades que `alto` */
  medioAncho: number
  /** Cambia la pose de brazos y cabeza; la transición es progresiva */
  pose: (nombre: Pose) => void
  /** Anima cola, cabello y brazos. `energia` 0..1 = intensidad del aleteo */
  actualizar: (t: number, energia: number) => void
  liberar: () => void
}

/**
 * Expresa un eje del modelo en el espacio del padre del hueso, que es donde
 * three.js aplica `hueso.quaternion`. Se calcula una sola vez, en la pose de
 * reposo: el vaivén es pequeño y no vale la pena recalcularlo por cuadro.
 */
function ejeEnPadre(hueso: THREE.Object3D, raiz: THREE.Object3D, ejeRaiz: THREE.Vector3) {
  const padre = hueso.parent ?? raiz
  const m = new THREE.Matrix4().copy(raiz.matrixWorld).invert().multiply(padre.matrixWorld)
  const pos = new THREE.Vector3()
  const rot = new THREE.Quaternion()
  const esc = new THREE.Vector3()
  m.decompose(pos, rot, esc)
  return ejeRaiz.clone().applyQuaternion(rot.invert()).normalize()
}

export async function crearSirena(): Promise<Sirena> {
  const gltf = await new GLTFLoader().loadAsync(RUTA_MODELO)
  const modelo = gltf.scene

  const geometrias = new Set<THREE.BufferGeometry>()
  const materiales = new Set<THREE.Material>()

  modelo.traverse((o) => {
    const malla = o as THREE.Mesh
    if (!malla.isMesh) return

    // Las mallas con esqueleto se deforman fuera de su caja original: sin esto
    // desaparecen al acercarse al borde de la pantalla.
    malla.frustumCulled = false
    geometrias.add(malla.geometry)

    for (const mat of Array.isArray(malla.material) ? malla.material : [malla.material]) {
      materiales.add(mat)
      const std = mat as THREE.MeshStandardMaterial
      if (!std.isMeshStandardMaterial) continue
      std.metalness = 0
      std.roughness = 0.62
      if (std.map) std.map.anisotropy = 4
      // Ojos y boca son planos pegados a la cara: sin sesgo parpadean contra ella
      if (/eye|mouth/i.test(std.name)) {
        std.polygonOffset = true
        std.polygonOffsetFactor = -2
        std.polygonOffsetUnits = -2
      }
    }
  })

  // ---------- normalizar: centrado en el origen y alto 1 ----------
  const caja = new THREE.Box3().setFromObject(modelo)
  const medida = caja.getSize(new THREE.Vector3())
  const centro = caja.getCenter(new THREE.Vector3())
  const escala = 1 / medida.y

  const grupo = new THREE.Group()
  const pivote = new THREE.Group()
  pivote.scale.setScalar(escala)
  pivote.position.copy(centro).multiplyScalar(-escala)
  pivote.add(modelo)
  grupo.add(pivote)
  grupo.updateMatrixWorld(true)

  // ---------- huesos ----------
  const huesos = new Map<string, THREE.Object3D>()
  modelo.traverse((o) => {
    if ((o as THREE.Bone).isBone) huesos.set(o.name, o)
  })
  /** El exportador puede sanear nombres; se acepta también el prefijo */
  const buscar = (nombre: string) =>
    huesos.get(nombre) ?? [...huesos.values()].find((h) => h.name.startsWith(nombre))

  const animados: HuesoAnimado[] = []
  const porNombre = new Map<string, HuesoAnimado>()

  const animar = (
    nombre: string,
    eje: THREE.Vector3,
    opciones: { reposo?: number; amplitud: number; fase: number; velocidad: number; respuesta?: number },
  ) => {
    const hueso = buscar(nombre)
    if (!hueso) return
    const a: HuesoAnimado = {
      hueso,
      base: hueso.quaternion.clone(),
      eje: ejeEnPadre(hueso, modelo, eje),
      reposo: opciones.reposo ?? 0,
      amplitud: opciones.amplitud,
      velocidad: opciones.velocidad,
      reposoDestino: opciones.reposo ?? 0,
      amplitudDestino: opciones.amplitud,
      velocidadDestino: opciones.velocidad,
      fase: opciones.fase,
      respuesta: opciones.respuesta ?? 1,
    }
    animados.push(a)
    porNombre.set(nombre, a)
  }

  // Cola: la onda nace en la cintura y viaja hacia la aleta, creciendo
  COLA.forEach((nombre, i) => {
    animar(nombre, EJE_VAIVEN, {
      amplitud: 0.045 + i * 0.026,
      fase: -i * 0.62,
      velocidad: 2.6,
      respuesta: 1.4,
    })
  })
  // La aleta cierra la onda, medio ciclo más tarde
  ALETAS.forEach((nombre, i) => {
    animar(nombre, EJE_VAIVEN, { amplitud: 0.14, fase: -3.9 + i * 0.15, velocidad: 2.6, respuesta: 1.4 })
  })
  // Cabello: flota más lento y más suelto, como bajo el agua
  CABELLO.forEach((nombre, i) => {
    animar(nombre, EJE_FLOTE, { amplitud: 0.06 + i * 0.02, fase: -i * 0.8, velocidad: 1.05, respuesta: 0.6 })
  })
  // Brazos y cabeza: arrancan en la pose de nado y los mueve `pose()`
  for (const [nombre, ajuste] of Object.entries(POSES.nadando)) {
    animar(nombre, EJE_VAIVEN, {
      reposo: ajuste.reposo,
      amplitud: ajuste.amplitud,
      fase: 0,
      velocidad: ajuste.velocidad ?? 1.3,
      respuesta: 0.4,
    })
  }

  const pose = (nombre: Pose) => {
    for (const [hueso, ajuste] of Object.entries(POSES[nombre])) {
      const a = porNombre.get(hueso)
      if (!a) continue
      a.reposoDestino = ajuste.reposo
      a.amplitudDestino = ajuste.amplitud
      a.velocidadDestino = ajuste.velocidad ?? a.velocidad
    }
  }

  const giro = new THREE.Quaternion()
  let ultimoT = 0

  const actualizar = (t: number, energia: number) => {
    const dt = Math.min(0.05, Math.max(0, t - ultimoT))
    ultimoT = t
    const fuerza = Math.min(1, Math.max(0, energia))
    // Suavizado independiente de los FPS: media transición en ~0.15 s
    const suavizado = 1 - Math.exp(-dt * 4.5)

    for (const a of animados) {
      a.reposo += (a.reposoDestino - a.reposo) * suavizado
      a.amplitud += (a.amplitudDestino - a.amplitud) * suavizado
      a.velocidad += (a.velocidadDestino - a.velocidad) * suavizado
      a.fase += dt * a.velocidad

      const angulo = a.reposo + Math.sin(a.fase) * a.amplitud * (1 + fuerza * a.respuesta)
      giro.setFromAxisAngle(a.eje, angulo)
      a.hueso.quaternion.copy(a.base).premultiply(giro)
    }
  }
  actualizar(0, 0)

  return {
    grupo,
    alto: 1,
    medioAncho: (medida.x * escala) / 2,
    pose,
    actualizar,
    liberar: () => {
      for (const g of geometrias) g.dispose()
      for (const m of materiales) {
        for (const valor of Object.values(m as unknown as Record<string, unknown>)) {
          if (valor && (valor as THREE.Texture).isTexture) (valor as THREE.Texture).dispose()
        }
        m.dispose()
      }
    },
  }
}
