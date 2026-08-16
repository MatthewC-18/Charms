import * as THREE from 'three'
import { crearCabeza } from './personaje'

/**
 * Sirena completa construida desde cero: cabeza con la cara pintada, torso,
 * brazos y la cola tornasol del logo.
 *
 * La cola es una superficie paramétrica (anillos de radio decreciente a lo
 * largo de una curva) más dos lóbulos de aleta, con un shader propio: la onda
 * de nado ocurre en el vertex shader y las escamas iridiscentes se calculan en
 * el fragment shader, sin texturas.
 *
 * El grupo queda de pie: origen en la cintura, cola hacia abajo, cabeza arriba
 * y cara hacia +Z.
 */

/** Construye una malla a partir de una función (u, v) → posición. */
function construirMalla(
  filas: number,
  columnas: number,
  fn: (u: number, v: number, destino: THREE.Vector3) => void,
  avance: (u: number) => number,
) {
  const posiciones: number[] = []
  const uvs: number[] = []
  const avances: number[] = []
  const indices: number[] = []
  const p = new THREE.Vector3()

  for (let i = 0; i <= filas; i++) {
    const u = i / filas
    for (let j = 0; j <= columnas; j++) {
      const v = j / columnas
      fn(u, v, p)
      posiciones.push(p.x, p.y, p.z)
      uvs.push(u, v)
      avances.push(avance(u))
    }
  }

  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const a = i * (columnas + 1) + j
      const b = a + columnas + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(posiciones, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setAttribute('aAvance', new THREE.Float32BufferAttribute(avances, 1))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/** Curva que recorre la cola, de la cintura a la aleta (en +X) */
function puntoCurva(u: number, destino: THREE.Vector3) {
  // curva en S: la cadera cae recta, el tramo medio se arquea y la punta
  // vuelve, como una cola de sirena en pleno nado
  destino.set(u * 2.95, Math.sin(u * Math.PI * 1.15) * 0.52 - u * 0.05, Math.sin(u * Math.PI) * 0.12)
}

/** Radio del cuerpo: ancho en la cadera, delgado antes de la aleta */
function radio(u: number) {
  return 0.5 * Math.pow(1 - u, 0.78) + 0.05
}

function cuerpoCola() {
  const centro = new THREE.Vector3()
  const siguiente = new THREE.Vector3()
  const tangente = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const binormal = new THREE.Vector3(0, 0, 1)

  return construirMalla(
    76,
    28,
    (u, v, destino) => {
      puntoCurva(u, centro)
      puntoCurva(Math.min(1, u + 0.01), siguiente)
      tangente.subVectors(siguiente, centro).normalize()
      normal.crossVectors(tangente, binormal).normalize()

      const ang = v * Math.PI * 2
      const r = radio(u)
      destino
        .copy(centro)
        .addScaledVector(normal, Math.cos(ang) * r)
        .addScaledVector(binormal, Math.sin(ang) * r * 0.74)
    },
    (u) => u,
  )
}

/** Un lóbulo de la aleta */
function loboAleta(direccion: number) {
  const base = new THREE.Vector3()
  puntoCurva(1, base)
  const angulo = direccion * 0.75
  const largo = 1.75

  return construirMalla(
    24,
    16,
    (u, v, destino) => {
      const s = u
      const w = (v - 0.5) * 2
      const ancho = Math.pow(Math.sin(Math.min(1, s * 1.02) * Math.PI), 0.55) * 0.78 + 0.04

      destino.set(
        base.x + Math.cos(angulo) * s * largo - Math.abs(w) * 0.1,
        base.y + Math.sin(angulo) * s * largo + w * ancho * 0.5,
        w * ancho * 0.92 + Math.pow(s, 2) * w * 0.2,
      )
    },
    (u) => 1 + u * 0.5,
  )
}

const vertexShader = /* glsl */ `
  uniform float uTiempo;
  uniform float uEnergia;
  attribute float aAvance;
  varying float vAvance;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vVista;

  void main() {
    vAvance = aAvance;
    vUv = uv;

    vec3 p = position;
    float fase = aAvance * 3.0 - uTiempo * 2.3;
    float amp = pow(aAvance, 1.8) * (0.14 + uEnergia * 0.2);
    p.y += sin(fase) * amp;
    p.z += cos(fase * 0.9) * amp * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vVista = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTiempo;
  uniform float uOpacidad;
  uniform vec3 cTurquesa;
  uniform vec3 cLila;
  uniform vec3 cRosa;
  uniform vec3 cMenta;

  varying float vAvance;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vVista;

  void main() {
    vec3 n = normalize(vNormal);
    float fresnel = pow(1.0 - max(dot(n, normalize(vVista)), 0.0), 2.2);

    float t = fract(vAvance * 0.62 + fresnel * 0.4 + uTiempo * 0.035);
    vec3 col = mix(cTurquesa, cLila, smoothstep(0.0, 0.34, t));
    col = mix(col, cRosa, smoothstep(0.34, 0.62, t));
    col = mix(col, cMenta, smoothstep(0.62, 0.9, t));
    col = mix(col, cTurquesa, smoothstep(0.9, 1.0, t));

    // escamas: celdas grandes, con borde oscuro y brillo arriba
    vec2 rejilla = vec2(vUv.x * 14.0, vUv.y * 8.0);
    rejilla.y += step(1.0, mod(floor(rejilla.x), 2.0)) * 0.5;
    vec2 celda = fract(rejilla) - 0.5;
    float d = length(celda * vec2(1.0, 1.15));
    float cuerpoEscama = smoothstep(0.5, 0.42, d);
    float borde = smoothstep(0.52, 0.44, d) - smoothstep(0.44, 0.36, d);
    col *= 0.9 + 0.2 * cuerpoEscama;
    col -= borde * 0.22;
    col += smoothstep(0.2, 0.0, length((celda - vec2(0.0, 0.16)) * vec2(1.0, 1.6))) * 0.28;

    float luz = 0.6 + 0.4 * max(dot(n, normalize(vec3(0.35, 0.85, 0.55))), 0.0);
    col *= luz;
    col += fresnel * vec3(0.55, 0.75, 0.95) * 0.45;

    gl_FragColor = vec4(col, uOpacidad);
  }
`

export interface Sirena {
  grupo: THREE.Group
  material: THREE.ShaderMaterial
  /** Alto total del modelo en unidades locales, para escalarlo desde afuera */
  alto: number
  liberar: () => void
}

export function crearSirena(): Sirena {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTiempo: { value: 0 },
      uEnergia: { value: 0 },
      uOpacidad: { value: 1 },
      cTurquesa: { value: new THREE.Color('#5fd7ef') },
      cLila: { value: new THREE.Color('#b79bf0') },
      cRosa: { value: new THREE.Color('#f8bcdb') },
      cMenta: { value: new THREE.Color('#a5e7d2') },
    },
  })

  const geometrias: THREE.BufferGeometry[] = []
  const materiales: THREE.Material[] = [material]

  const nuevoMat = (o: THREE.MeshStandardMaterialParameters) => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.05, ...o })
    materiales.push(m)
    return m
  }

  const matPiel = nuevoMat({ color: '#f3cfae' })
  const matConcha = nuevoMat({ color: '#8fdff0', roughness: 0.25, metalness: 0.2 })

  const grupo = new THREE.Group()

  // ---------- cola (apunta hacia abajo) ----------
  const cola = new THREE.Group()
  for (const g of [cuerpoCola(), loboAleta(1), loboAleta(-1)]) {
    geometrias.push(g)
    cola.add(new THREE.Mesh(g, material))
  }
  cola.rotation.z = -Math.PI / 2 // el eje +X del modelo pasa a mirar hacia abajo
  grupo.add(cola)

  const agregar = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number]) => {
    geometrias.push(geo)
    const m = new THREE.Mesh(geo, mat)
    m.position.set(...pos)
    grupo.add(m)
    return m
  }

  // ---------- torso ----------
  const torso = agregar(new THREE.CapsuleGeometry(0.34, 0.55, 10, 24), matPiel, [0, 0.42, 0])
  torso.scale.set(1, 1, 0.82)

  // top de conchas
  for (const lado of [-1, 1]) {
    const concha = agregar(new THREE.SphereGeometry(0.21, 20, 16), matConcha, [lado * 0.19, 0.6, 0.2])
    concha.scale.set(1, 0.85, 0.62)
  }

  // ---------- brazos ----------
  for (const lado of [-1, 1]) {
    const brazo = agregar(new THREE.CapsuleGeometry(0.11, 0.5, 8, 16), matPiel, [lado * 0.42, 0.5, 0.02])
    brazo.rotation.z = lado * 0.22
    agregar(new THREE.SphereGeometry(0.12, 16, 12), matPiel, [lado * 0.55, 0.18, 0.04])
  }

  // ---------- cabeza ----------
  const cabeza = crearCabeza({
    piel: '#f3cfae',
    ojos: '#7a6bb5',
    cabello: '#8f6fd8',
    peinado: 'largo',
    estilo: 'ella',
  })
  cabeza.grupo.scale.setScalar(0.56)
  cabeza.grupo.position.set(0, 1.28, 0)
  grupo.add(cabeza.grupo)

  return {
    grupo,
    material,
    alto: 6.25, // medido: de la punta de la aleta (-4.23) a la coronilla (+2.01)
    liberar: () => {
      cabeza.liberar()
      for (const g of geometrias) g.dispose()
      for (const m of materiales) m.dispose()
    },
  }
}
