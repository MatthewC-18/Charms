import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Mascota from '../components/Mascota'
import Muneco3D, { coloresIniciales, describirColores, type ColoresMuneco } from '../components/Muneco3D'
import { categories, products } from '../data/products'
import { logistics, occasions, site, waUrl } from '../data/site'
import { buildQuote, money, quoteToMessage, volumeDiscountPct } from '../lib/quote'

const stepLabels = ['Pieza', 'Figuras', 'Entrega', 'Datos']

function Counter({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-clay-200 bg-white p-4">
      <div>
        <p className="font-extrabold text-ink-900">{label}</p>
        {hint && <p className="text-xs text-ink-500">{hint}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full border-2 border-clay-200 p-2 text-ink-700 transition hover:border-brand-300 disabled:opacity-35"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Quitar ${label}`}
        >
          <Icon name="minus" className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-xl font-extrabold tabular-nums">{value}</span>
        <button
          type="button"
          className="rounded-full border-2 border-clay-200 p-2 text-ink-700 transition hover:border-brand-300 disabled:opacity-35"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Agregar ${label}`}
        >
          <Icon name="plus" className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function Personalizar() {
  const [params] = useSearchParams()
  const initial = products.find((p) => p.slug === params.get('p')) ?? products[0]

  const [step, setStep] = useState(params.get('p') ? 2 : 1)
  const [productId, setProductId] = useState(initial.id)
  const product = products.find((p) => p.id === productId)!

  const [figures, setFigures] = useState(initial.figuresIncluded)
  const [pets, setPets] = useState(0)
  const [units, setUnits] = useState(1)
  const [rush, setRush] = useState(false)
  const [shippingZone, setShippingZone] = useState(logistics.shipping[0].zone)

  const [colores, setColores] = useState<ColoresMuneco>(coloresIniciales)
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')

  const input = { product, figures, pets, rush, units }
  const quote = useMemo(() => buildQuote(input), [product, figures, pets, rush, units])

  const message = quoteToMessage(input, quote, {
    name,
    occasion,
    deadline,
    notes,
    shippingZone,
    apariencia: describirColores(colores),
  })
  const discountPct = volumeDiscountPct(units)

  const selectProduct = (id: string) => {
    const p = products.find((x) => x.id === id)!
    setProductId(id)
    setFigures(p.figuresIncluded)
  }

  return (
    <>
      <section className="bg-tornasol">
        <div className="container-x py-12">
          <span className="chip bg-white text-brand-700 shadow-[var(--shadow-soft)]">
            <Icon name="sparkles" className="h-4 w-4" /> Cotizador
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl">Arma tu pieza y mira el precio al instante</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            El valor que ves es un <strong>estimado referencial</strong>. Al final se envía todo el detalle a
            nuestro WhatsApp y confirmamos el precio exacto con el boceto.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-8 py-10 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          {/* Pasos */}
          <ol className="mb-7 flex flex-wrap gap-2">
            {stepLabels.map((label, i) => {
              const n = i + 1
              const state = n === step ? 'actual' : n < step ? 'hecho' : 'pendiente'
              return (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => setStep(n)}
                    className={`chip px-3.5 py-2 ${
                      state === 'actual'
                        ? 'bg-brand-500 text-white'
                        : state === 'hecho'
                          ? 'bg-brand-100 text-brand-800'
                          : 'bg-clay-100 text-ink-500'
                    }`}
                  >
                    <span className="tabular-nums">{n}</span> {label}
                  </button>
                </li>
              )
            })}
          </ol>

          {/* PASO 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl">1. Elige el tipo de pieza</h2>
              <p className="mt-1 text-sm text-ink-500">
                ¿No sabes cuál? El cuadro columpio y la pieza de retrovisor son los que más se regalan.
              </p>

              {categories.map((c) => {
                const items = products.filter((p) => p.category === c.id)
                if (!items.length) return null
                return (
                  <div key={c.id} className="mt-6">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink-500">{c.name}</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {items.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => selectProduct(p.id)}
                          className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                            productId === p.id
                              ? 'border-brand-500 bg-brand-50'
                              : 'border-clay-200 bg-white hover:border-brand-300'
                          }`}
                        >
                          <span className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-clay-100">
                            <img src={p.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-extrabold text-ink-900">{p.name}</span>
                            <span className="block truncate text-xs text-ink-500">{p.blurb}</span>
                            <span className="mt-0.5 block text-sm font-extrabold text-brand-700">
                              desde {money(p.priceFrom)}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div className="mt-8 flex justify-end">
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                  Continuar <Icon name="arrow" className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl">2. ¿Cuántas figuras van?</h2>
              <p className="mt-1 text-sm text-ink-500">
                {product.name} incluye {product.figuresIncluded}{' '}
                {product.figuresIncluded === 1 ? 'figura' : 'figuras'} en el precio desde{' '}
                {money(product.priceFrom)}. Las figuras adicionales se cotizan aparte, con el boceto.
              </p>

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink-500">
                    Vista previa 3D
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    Una referencia para que nos digas tonos y estilo. La figura final se modela a mano
                    a partir de tus fotos.
                  </p>
                  <Muneco3D colores={colores} onCambio={setColores} className="mt-3" />
                </div>

                <div className="grid content-start gap-3">
                <Counter
                  label="Personas"
                  hint="Adultos y niños, cada uno con su ropa y peinado"
                  value={figures}
                  min={1}
                  max={10}
                  onChange={setFigures}
                />
                <Counter
                  label="Mascotas"
                  hint="Perros, gatos u otros · se cotizan aparte"
                  value={pets}
                  min={0}
                  max={6}
                  onChange={setPets}
                />
                <Counter
                  label="Cantidad de piezas iguales"
                  hint={
                    discountPct
                      ? `Descuento por volumen aplicado: ${discountPct}%`
                      : 'Desde 10 unidades aplica descuento por volumen'
                  }
                  value={units}
                  min={1}
                  max={200}
                  onChange={setUnits}
                />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                  Atrás
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                  Continuar <Icon name="arrow" className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl">3. Entrega</h2>
              <p className="mt-1 text-sm text-ink-500">{logistics.shippingNote}</p>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => setRush((v) => !v)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    rush ? 'border-coral-500 bg-coral-400/10' : 'border-clay-200 bg-white hover:border-brand-300'
                  }`}
                  aria-pressed={rush}
                >
                  <span>
                    <span className="block font-bold text-ink-900">Entrega express ({logistics.rushDays})</span>
                    <span className="block text-xs text-ink-500">
                      Sujeto a disponibilidad del taller · normal: {logistics.productionDays}
                    </span>
                  </span>
                  <span className="shrink-0 font-extrabold text-coral-600">+{logistics.rushSurchargePct}%</span>
                </button>

                <div className="rounded-2xl border-2 border-clay-200 bg-white p-4">
                  <label className="label" htmlFor="zona">
                    Zona de envío
                  </label>
                  <select
                    id="zona"
                    className="field"
                    value={shippingZone}
                    onChange={(e) => setShippingZone(e.target.value)}
                  >
                    {logistics.shipping.map((s) => (
                      <option key={s.zone} value={s.zone}>
                        {s.zone} — {s.eta}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-ink-500">
                    El valor del envío se confirma por WhatsApp según el destino.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                  Atrás
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>
                  Continuar <Icon name="arrow" className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl">4. Últimos datos</h2>
              <p className="mt-1 text-sm text-ink-500">
                Con esto abrimos el chat con todo el pedido escrito. Las fotos las envías directo ahí.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="nombre">
                    Tu nombre
                  </label>
                  <input
                    id="nombre"
                    className="field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. María Torres"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="ocasion">
                    Ocasión
                  </label>
                  <select
                    id="ocasion"
                    className="field"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                  >
                    <option value="">Seleccionar…</option>
                    {occasions.map((o) => (
                      <option key={o.id} value={o.label}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="fecha">
                    ¿Para qué fecha la necesitas?
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    className="field"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="notas">
                    Cuéntanos los detalles
                  </label>
                  <textarea
                    id="notas"
                    className="field min-h-28"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Somos 2 adultos y un bebé. Él con camiseta de Barcelona SC, ella con vestido rojo. La frase del banderín: “Nuestro primer año”."
                  />
                </div>
              </div>

              <div className="card mt-6 bg-clay-50 p-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink-500">
                  Vista previa del mensaje
                </h3>
                <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap font-sans text-sm text-ink-700">
                  {message}
                </pre>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>
                  Atrás
                </button>
                <Mascota variant="listo" className="hidden w-24 sm:block" quieta />
                <a className="btn btn-wa text-base" href={waUrl(message)} target="_blank" rel="noreferrer">
                  <Icon name="whatsapp" className="h-5 w-5" /> Enviar pedido por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* RESUMEN */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden">
            <div className="aspect-[5/3] bg-clay-100">
              <img src={product.photo} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-extrabold">{product.name}</h2>
              <p className="text-xs text-ink-500">{product.size}</p>

              <ul className="mt-4 space-y-2 text-sm">
                {quote.lines.map((l, i) => (
                  <li key={`${l.label}-${i}`} className="flex justify-between gap-3 text-ink-700">
                    <span>{l.label}</span>
                    <span className="shrink-0 font-bold tabular-nums">{money(l.amount)}</span>
                  </li>
                ))}
                {units > 1 && (
                  <li className="flex justify-between gap-3 border-t border-clay-200 pt-2 text-ink-700">
                    <span>× {units} unidades</span>
                    <span className="shrink-0 font-bold tabular-nums">{money(quote.unitPrice * units)}</span>
                  </li>
                )}
                {quote.volumeDiscount > 0 && (
                  <li className="flex justify-between gap-3 text-brand-700">
                    <span>Descuento por volumen ({discountPct}%)</span>
                    <span className="shrink-0 font-bold tabular-nums">−{money(quote.volumeDiscount)}</span>
                  </li>
                )}
                {quote.rushFee > 0 && (
                  <li className="flex justify-between gap-3 text-coral-600">
                    <span>Recargo express</span>
                    <span className="shrink-0 font-bold tabular-nums">{money(quote.rushFee)}</span>
                  </li>
                )}
                {(quote.extraFigures > 0 || pets > 0) && (
                  <li className="flex justify-between gap-3 text-ink-500">
                    <span>
                      {quote.extraFigures > 0 && `${quote.extraFigures} figura(s) extra`}
                      {quote.extraFigures > 0 && pets > 0 && ' · '}
                      {pets > 0 && `${pets} mascota(s)`}
                    </span>
                    <span className="shrink-0 font-bold">Se cotiza aparte</span>
                  </li>
                )}
                <li className="flex justify-between gap-3 text-ink-700">
                  <span>Envío</span>
                  <span className="shrink-0 font-bold">Según destino</span>
                </li>
              </ul>

              <div className="mt-4 flex items-end justify-between border-t border-clay-200 pt-4">
                <span className="text-sm font-extrabold uppercase tracking-wider text-ink-500">Estimado</span>
                <span className="text-3xl font-extrabold text-brand-700 tabular-nums">{money(quote.total)}</span>
              </div>
              <p className="mt-1 text-right text-xs text-ink-500">
                Anticipo {logistics.depositPct}%: <strong>{money(quote.deposit)}</strong>
              </p>

              <a className="btn btn-wa mt-5 w-full" href={waUrl(message)} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" className="h-5 w-5" /> Enviar por WhatsApp
              </a>
              <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-ink-500">
                Valor referencial, sin envío. El precio final se confirma con el boceto aprobado.{' '}
                <Link to="/como-funciona" className="font-bold text-brand-600">
                  Ver condiciones
                </Link>
                .
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-ink-500">
            ¿Prefieres hablarlo? Escríbenos al {site.whatsappDisplay}
          </p>
        </aside>
      </section>
    </>
  )
}
