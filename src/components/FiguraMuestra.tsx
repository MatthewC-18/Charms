import {
  CABELLOS,
  OJOS,
  PEINADOS,
  PIELES,
  ROPAS,
  TIPOS,
  tono,
  type Apariencia,
  type Peinado,
} from '../data/figuras'

export {
  aparienciaInicial,
  describirApariencia,
  type Apariencia,
  type TipoFigura,
} from '../data/figuras'

/**
 * Figura de muestra, dibujada en SVG.
 *
 * Es una referencia de tonos, no un render del pedido: sirve para que el
 * visitante nos diga piel, cabello, ojos y ropa antes de escribir. Cada formato
 * (de pie, pareja, graduación, con mascota) es uno de los que más sale del
 * taller, así la muestra se parece a lo que va a recibir.
 *
 * Todo el color entra por props y las sombras salen de `tono()`, así que
 * agregar un tono a la paleta no obliga a tocar el dibujo.
 */

interface PersonajeProps {
  piel: string
  cabello: string
  ojos: string
  ropa: string
  peinado: Peinado
  estilo: 'ella' | 'el'
  toga?: boolean
  birrete?: boolean
  diploma?: boolean
}

/** Melena que cae por detrás: solo la tienen los peinados largos */
function PeloTrasero({ cabello, peinado }: { cabello: string; peinado: Peinado }) {
  if (peinado === 'corto') return <ellipse cx="0" cy="62" rx="50" ry="48" fill={cabello} />
  if (peinado === 'recogido')
    return (
      <>
        <ellipse cx="0" cy="63" rx="50" ry="48" fill={cabello} />
        <circle cx="0" cy="15" r="19" fill={cabello} />
        <circle cx="0" cy="15" r="19" fill={tono(cabello, 0.16)} opacity="0.5" />
      </>
    )
  const ondas = peinado === 'ondulado'
  const izq = ondas
    ? 'M-52 58 Q-64 118 -50 150 Q-62 176 -46 196 Q-28 204 -18 190 Q-34 150 -28 64 Z'
    : 'M-52 58 Q-58 128 -46 192 Q-30 202 -19 189 Q-31 124 -28 64 Z'
  const der = ondas
    ? 'M52 58 Q64 118 50 150 Q62 176 46 196 Q28 204 18 190 Q34 150 28 64 Z'
    : 'M52 58 Q58 128 46 192 Q30 202 19 189 Q31 124 28 64 Z'
  return (
    <>
      <path d={izq} fill={cabello} />
      <path d={der} fill={cabello} />
      <ellipse cx="0" cy="63" rx="51" ry="49" fill={cabello} />
    </>
  )
}

/** Flequillo y brillo, encima de la cara */
function PeloFrontal({ cabello, peinado }: { cabello: string; peinado: Peinado }) {
  const d =
    peinado === 'recogido'
      ? 'M-47 64 Q-44 20 0 17 Q44 20 47 64 Q40 40 0 37 Q-40 40 -47 64 Z'
      : 'M-47 68 Q-46 18 0 16 Q46 18 47 68 Q40 38 18 36 Q4 50 -10 38 Q-36 36 -47 68 Z'
  return (
    <>
      <path d={d} fill={cabello} />
      <path
        d="M-27 31 Q-6 20 17 27"
        stroke={tono(cabello, 0.4)}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </>
  )
}

function Cara({ piel, cabello, ojos }: { piel: string; cabello: string; ojos: string }) {
  const ceja = tono(cabello, -0.15)
  const ojo = (s: 1 | -1) => (
    <g key={s}>
      <path
        d={`M${s * 27} 52 Q${s * 17} 46 ${s * 9} 52`}
        stroke={ceja}
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx={s * 17} cy="70" rx="9.5" ry="11.5" fill={tono(ojos, -0.55)} />
      <ellipse cx={s * 17} cy="71" rx="7.4" ry="9.4" fill={ojos} />
      <ellipse cx={s * 17} cy="73" rx="4" ry="5" fill="#1d1822" />
      <circle cx={s * 20} cy="65" r="3.4" fill="#ffffff" />
      <circle cx={s * 13} cy="76" r="1.7" fill="#ffffff" opacity="0.85" />
    </g>
  )
  return (
    <>
      {[-1 as const, 1 as const].map(ojo)}
      <ellipse cx="-32" cy="83" rx="8.5" ry="5" fill="#ef8a95" opacity="0.42" />
      <ellipse cx="32" cy="83" rx="8.5" ry="5" fill="#ef8a95" opacity="0.42" />
      <ellipse cx="0" cy="80" rx="2.2" ry="1.5" fill={tono(piel, -0.2)} />
      <path
        d="M-7 88 Q0 95 7 88"
        stroke="#8a5240"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

function Personaje({ piel, cabello, ojos, ropa, peinado, estilo, toga, birrete, diploma }: PersonajeProps) {
  const sombraRopa = tono(ropa, -0.24)
  const pantalon = tono(ropa, -0.32)
  const zapato = '#4a3f52'

  return (
    <g>
      <PeloTrasero cabello={cabello} peinado={peinado} />

      {/* piernas y zapatos */}
      {estilo === 'ella' ? (
        <>
          <rect x="-19" y="192" width="15" height="38" rx="7" fill={piel} />
          <rect x="4" y="192" width="15" height="38" rx="7" fill={piel} />
        </>
      ) : (
        <>
          <rect x="-21" y="176" width="18" height="54" rx="8" fill={pantalon} />
          <rect x="3" y="176" width="18" height="54" rx="8" fill={pantalon} />
        </>
      )}
      <rect x="-25" y="220" width="24" height="17" rx="7" fill={zapato} />
      <rect x="1" y="220" width="24" height="17" rx="7" fill={zapato} />
      <rect x="-25" y="231" width="24" height="6" rx="3" fill={tono(zapato, -0.3)} />
      <rect x="1" y="231" width="24" height="6" rx="3" fill={tono(zapato, -0.3)} />

      {/* cuerpo */}
      {toga ? (
        <>
          <path d="M-29 114 Q-42 158 -44 202 L44 202 Q42 158 29 114 Z" fill={ropa} />
          <path d="M8 114 Q22 158 24 202 L44 202 Q42 158 29 114 Z" fill={sombraRopa} opacity="0.3" />
          <path d="M-29 114 Q0 148 29 114 L20 112 Q0 134 -20 112 Z" fill={tono(ropa, -0.35)} />
          <path d="M-17 116 Q-14 160 -11 200 L-3 200 Q-6 158 -8 116 Z" fill="#f6efe2" />
          <path d="M17 116 Q14 160 11 200 L3 200 Q6 158 8 116 Z" fill="#f6efe2" />
        </>
      ) : estilo === 'ella' ? (
        <>
          <path d="M-26 116 Q-29 152 -37 198 L37 198 Q29 152 26 116 Z" fill={ropa} />
          <ellipse cx="0" cy="198" rx="37" ry="6.5" fill={ropa} />
          <path d="M6 116 Q10 152 20 198 L37 198 Q29 152 26 116 Z" fill={sombraRopa} opacity="0.35" />
          <rect x="-26" y="150" width="52" height="9" rx="4.5" fill={sombraRopa} />
          <path d="M-14 116 Q0 130 14 116" fill={tono(ropa, 0.3)} />
        </>
      ) : (
        <>
          <rect x="-26" y="114" width="52" height="74" rx="13" fill={ropa} />
          <path d="M8 114 h18 v74 h-18 Z" fill={sombraRopa} opacity="0.3" />
          <path d="M-14 115 Q0 132 14 115" fill={tono(ropa, 0.3)} />
          <rect x="-26" y="180" width="52" height="9" rx="4" fill={sombraRopa} />
        </>
      )}

      {/* brazos, mangas y manos */}
      <path
        d="M-25 122 Q-46 146 -47 178"
        stroke={piel}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 122 Q46 146 47 178"
        stroke={piel}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M-25 122 Q-40 136 -42 150"
        stroke={ropa}
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 122 Q40 136 42 150"
        stroke={ropa}
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="-47" cy="182" r="9" fill={piel} />
      <circle cx="47" cy="182" r="9" fill={piel} />
      {diploma && (
        <g transform="rotate(-18 47 178)">
          <rect x="31" y="172" width="34" height="12" rx="6" fill="#fdf6e8" />
          <rect x="31" y="172" width="34" height="12" rx="6" fill="none" stroke="#e2d3bb" strokeWidth="1.4" />
          <rect x="44" y="169" width="7" height="18" rx="3.5" fill="#d94f5c" />
        </g>
      )}

      {/* cuello y cabeza */}
      <rect x="-9" y="100" width="18" height="22" rx="8" fill={tono(piel, -0.1)} />
      <ellipse cx="-46" cy="72" rx="8" ry="10" fill={piel} />
      <ellipse cx="46" cy="72" rx="8" ry="10" fill={piel} />
      <ellipse cx="0" cy="64" rx="47" ry="45" fill={piel} />
      <ellipse cx="-17" cy="44" rx="17" ry="9" fill="#ffffff" opacity="0.14" />
      <path d="M28 30 Q47 52 44 84 Q47 50 28 30 Z" fill={tono(piel, -0.25)} opacity="0.35" />

      <Cara piel={piel} cabello={cabello} ojos={ojos} />
      <PeloFrontal cabello={cabello} peinado={peinado} />

      {birrete && (
        <g transform="rotate(-7 0 20)">
          <path d="M0 12 Q26 18 28 42" stroke={tono(ropa, 0.3)} strokeWidth="3" fill="none" />
          <circle cx="28" cy="45" r="5" fill={tono(ropa, 0.3)} />
          <path d="M-22 22 Q0 30 22 22 L20 8 L-20 8 Z" fill="#2f2838" />
          <path d="M-38 8 L0 -2 L38 8 L0 18 Z" fill="#3a3247" />
          <circle cx="0" cy="8" r="3.6" fill={tono(ropa, 0.3)} />
        </g>
      )}
    </g>
  )
}

function Perrito() {
  const cuerpo = '#e8c9a0'
  const oscuro = '#c99a6a'
  return (
    <g>
      <rect x="-13" y="6" width="8" height="16" rx="4" fill={oscuro} />
      <rect x="5" y="6" width="8" height="16" rx="4" fill={oscuro} />
      <path d="M20 -4 Q31 -12 27 -23" stroke={cuerpo} strokeWidth="7" strokeLinecap="round" fill="none" />
      <ellipse cx="0" cy="0" rx="23" ry="16" fill={cuerpo} />
      <ellipse cx="-27" cy="-21" rx="6" ry="9" fill={oscuro} />
      <ellipse cx="-9" cy="-23" rx="6" ry="9" fill={oscuro} />
      <circle cx="-18" cy="-13" r="15" fill={cuerpo} />
      <circle cx="-23" cy="-15" r="2.4" fill="#2b2331" />
      <circle cx="-13" cy="-15" r="2.4" fill="#2b2331" />
      <ellipse cx="-18" cy="-7" rx="3.4" ry="2.4" fill="#2b2331" />
      <path d="M-22 -2 Q-18 1 -14 -2" stroke="#2b2331" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Peana de porcelana con la placa del nombre */
function Base({ ancho, ropa }: { ancho: number; ropa: string }) {
  return (
    <g>
      <ellipse cx="0" cy="252" rx={ancho} ry={ancho * 0.22} fill="#e3d3c2" />
      <ellipse cx="0" cy="247" rx={ancho} ry={ancho * 0.22} fill="#fbf3e9" />
      <rect x={-ancho * 0.5} y="240" width={ancho} height="13" rx="6" fill={tono(ropa, 0.62)} />
      <text
        x="0"
        y="249.5"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="800"
        letterSpacing="1"
        fill="#8a7c72"
      >
        TU NOMBRE
      </text>
    </g>
  )
}

function Escena({ a }: { a: Apariencia }) {
  const comun = { piel: a.piel, cabello: a.cabello, ojos: a.ojos, ropa: a.ropa }

  if (a.tipo === 'pareja') {
    return (
      <g>
        <Base ancho={92} ropa={a.ropa} />
        <g transform="translate(-46 24) scale(0.82)">
          <Personaje {...comun} peinado={a.peinado} estilo="ella" />
        </g>
        <g transform="translate(46 24) scale(0.82)">
          <Personaje {...comun} ropa={tono(a.ropa, -0.28)} peinado="corto" estilo="el" />
        </g>
        <g transform="translate(0 34) scale(1.15)">
          <path
            d="M0 16 C-12 6 -14 -6 -6 -10 C-2 -12 0 -9 0 -6 C0 -9 2 -12 6 -10 C14 -6 12 6 0 16 Z"
            fill="#e85a6d"
          />
          <path d="M-6 -6 C-8 -4 -8 0 -6 2" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
        </g>
      </g>
    )
  }

  if (a.tipo === 'mascota') {
    return (
      <g>
        <Base ancho={86} ropa={a.ropa} />
        <g transform="translate(-22 6) scale(0.94)">
          <Personaje {...comun} peinado={a.peinado} estilo={a.estilo} />
        </g>
        <g transform="translate(56 214) scale(0.92)">
          <Perrito />
        </g>
      </g>
    )
  }

  const graduacion = a.tipo === 'graduacion'
  return (
    <g>
      <Base ancho={74} ropa={a.ropa} />
      <g transform="translate(0 4)">
        <Personaje
          {...comun}
          peinado={a.peinado}
          estilo={a.estilo}
          toga={graduacion}
          birrete={graduacion}
          diploma={graduacion}
        />
      </g>
    </g>
  )
}

interface Props {
  colores: Apariencia
  onCambio?: (c: Apariencia) => void
  /** Muestra los selectores debajo del dibujo */
  conControles?: boolean
  className?: string
}

export default function FiguraMuestra({ colores, onCambio, conControles = true, className = '' }: Props) {
  const filaColor = (
    titulo: string,
    opciones: readonly { id: string; label: string; hex: string }[],
    clave: 'piel' | 'cabello' | 'ojos' | 'ropa',
  ) => (
    <div>
      <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-500">{titulo}</span>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            title={o.label}
            aria-label={`${titulo}: ${o.label}`}
            aria-pressed={colores[clave] === o.hex}
            onClick={() => onCambio?.({ ...colores, [clave]: o.hex })}
            className={`h-8 w-8 rounded-full border-2 transition ${
              colores[clave] === o.hex
                ? 'scale-110 border-ink-900 shadow-[var(--shadow-soft)]'
                : 'border-white hover:scale-105'
            }`}
            style={{ backgroundColor: o.hex }}
          />
        ))}
      </div>
    </div>
  )

  const filaOpciones = <T extends string>(
    titulo: string,
    opciones: readonly { id: T; label: string }[],
    activo: T,
    onElegir: (v: T) => void,
  ) => (
    <div>
      <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-500">{titulo}</span>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={activo === o.id}
            onClick={() => onElegir(o.id)}
            className={`chip border-2 px-3 py-1.5 ${
              activo === o.id
                ? 'border-brand-500 bg-brand-100 text-brand-800'
                : 'border-clay-200 bg-white text-ink-700'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={className}>
      <div className="bg-tornasol relative overflow-hidden rounded-[var(--radius-blob)] border border-clay-200">
        <svg
          viewBox="0 0 260 290"
          role="img"
          aria-label="Figura de muestra en los tonos elegidos"
          className="block w-full"
        >
          <g transform="translate(130 14)">
            <Escena a={colores} />
          </g>
        </svg>
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-[0.7rem] font-bold text-ink-700 backdrop-blur">
          Referencia de tonos
        </span>
      </div>

      {conControles && onCambio && (
        <div className="mt-4 grid gap-4">
          <div>
            <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-500">
              Tipo de figura
            </span>
            <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
              {TIPOS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={colores.tipo === t.id}
                  onClick={() => onCambio({ ...colores, tipo: t.id })}
                  className={`rounded-2xl border-2 p-3 text-left transition ${
                    colores.tipo === t.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-clay-200 bg-white hover:border-brand-300'
                  }`}
                >
                  <span className="block text-sm font-extrabold text-ink-900">{t.label}</span>
                  <span className="block text-xs text-ink-500">{t.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filaColor('Piel', PIELES, 'piel')}
            {filaColor('Cabello', CABELLOS, 'cabello')}
            {filaColor('Ojos', OJOS, 'ojos')}
            {filaColor('Ropa', ROPAS, 'ropa')}
            {filaOpciones('Peinado', PEINADOS, colores.peinado, (peinado) =>
              onCambio({ ...colores, peinado }),
            )}
            {filaOpciones(
              'Rasgos',
              [
                { id: 'ella' as const, label: 'Femeninos' },
                { id: 'el' as const, label: 'Masculinos' },
              ],
              colores.estilo,
              (estilo) => onCambio({ ...colores, estilo }),
            )}
          </div>

          <p className="text-xs leading-relaxed text-ink-500">
            Es una referencia para ponernos de acuerdo en los tonos. La pieza final se modela a mano con
            tus fotos, con la ropa, el peinado y los detalles reales de cada persona.
          </p>
        </div>
      )}
    </div>
  )
}
