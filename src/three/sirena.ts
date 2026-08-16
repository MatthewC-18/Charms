import * as THREE from 'three'

/**
 * Cola de sirena construida desde cero: no hay modelo descargado.
 *
 * El cuerpo es una superficie paramétrica (anillos con radio decreciente a lo
 * largo de una curva) y la aleta son dos lóbulos generados con la misma función
 * de malla. El movimiento de nado y las escamas tornasol viven en el shader,
 * así que la animación corre entera en la GPU.
 */

/** Construye una malla a partir de una función (u, v) → posición. */
function construirMalla(
  filas: number,
  columnas: number,
  fn: (u: number, v: number, destino: THREE.Vector3) => void,
  /** Valor de avance longitudinal (0 = cintura, 1+ = punta de la aleta) */
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

/** Curva que recorre la cola, de la cintura a la aleta */
function puntoCurva(u: number, destino: THREE.Vector3) {
  destino.set(u * 3.1, Math.sin(u * Math.PI * 0.55) * 0.42 - u * 0.15, 0)
}

/** Radio del cuerpo: ancho en la cintura, delgado antes de la aleta */
function radio(u: number) {
  return 0.42 * Math.pow(1 - u, 0.82) + 0.045
}

function cuerpo() {
  const centro = new THREE.Vector3()
  const siguiente = new THREE.Vector3()
  const tangente = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const binormal = new THREE.Vector3(0, 0, 1)

  return construirMalla(
    72,
    26,
    (u, v, destino) => {
      puntoCurva(u, centro)
      puntoCurva(Math.min(1, u + 0.01), siguiente)
      tangente.subVectors(siguiente, centro).normalize()
      normal.crossVectors(tangente, binormal).normalize()

      const ang = v * Math.PI * 2
      const r = radio(u)
      // sección ligeramente aplanada, como una cola real
      destino
        .copy(centro)
        .addScaledVector(normal, Math.cos(ang) * r)
        .addScaledVector(binormal, Math.sin(ang) * r * 0.72)
    },
    (u) => u,
  )
}

/** Un lóbulo de la aleta: superficie plana con curvatura y borde festoneado */
function loboAleta(direccion: number) {
  const base = new THREE.Vector3()
  puntoCurva(1, base)

  const angulo = direccion * 0.62
  const largo = 1.5

  return construirMalla(
    26,
    18,
    (u, v, destino) => {
      const s = u
      const w = (v - 0.5) * 2

      // ancho del lóbulo: nace fino, se abre y vuelve a cerrar en la punta
      const ancho = Math.pow(Math.sin(Math.min(1, s * 1.05) * Math.PI), 0.62) * 0.62 + 0.03

      const x = base.x + Math.cos(angulo) * s * largo - Math.abs(w) * 0.12
      const y = base.y + Math.sin(angulo) * s * largo + w * ancho * 0.55
      const z = w * ancho * 0.95 + Math.pow(s, 2) * w * 0.22

      destino.set(x, y, z)
    },
    (u) => 1 + u * 0.55,
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

    // Onda de nado: casi nula en la cintura, amplia en la aleta
    float fase = aAvance * 3.2 - uTiempo * 2.4;
    float amp = pow(aAvance, 1.7) * (0.16 + uEnergia * 0.22);
    p.y += sin(fase) * amp;
    p.z += cos(fase * 0.9) * amp * 0.45;

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

    // Tornasol: la mezcla se corre según la posición, el ángulo y el tiempo
    float t = fract(vAvance * 0.62 + fresnel * 0.4 + uTiempo * 0.035);
    vec3 col = mix(cTurquesa, cLila, smoothstep(0.0, 0.34, t));
    col = mix(col, cRosa, smoothstep(0.34, 0.62, t));
    col = mix(col, cMenta, smoothstep(0.62, 0.9, t));
    col = mix(col, cTurquesa, smoothstep(0.9, 1.0, t));

    // Escamas procedurales
    vec2 rejilla = vec2(vUv.x * 30.0, vUv.y * 13.0);
    rejilla.y += step(1.0, mod(floor(rejilla.x), 2.0)) * 0.5;
    vec2 celda = fract(rejilla) - 0.5;
    float d = length(celda * vec2(1.0, 1.25));
    float escama = smoothstep(0.48, 0.3, d);
    col *= 0.84 + 0.24 * escama;
    col += pow(escama, 7.0) * 0.3;

    // Luz suave y brillo del borde
    float luz = 0.6 + 0.4 * max(dot(n, normalize(vec3(0.35, 0.85, 0.55))), 0.0);
    col *= luz;
    col += fresnel * vec3(0.55, 0.75, 0.95) * 0.45;

    gl_FragColor = vec4(col, uOpacidad);
  }
`

export interface Sirena {
  grupo: THREE.Group
  material: THREE.ShaderMaterial
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

  const grupo = new THREE.Group()
  const geometrias = [cuerpo(), loboAleta(1), loboAleta(-1)]
  for (const g of geometrias) grupo.add(new THREE.Mesh(g, material))

  // El pivote queda en la cintura para que la cola "cuelgue" al girar
  grupo.position.x = -1.2

  const contenedor = new THREE.Group()
  contenedor.add(grupo)

  return {
    grupo: contenedor,
    material,
    liberar: () => {
      for (const g of geometrias) g.dispose()
      material.dispose()
    },
  }
}
