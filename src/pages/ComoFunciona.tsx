import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { faqs, logistics, site, steps, waUrl } from '../data/site'
import { money } from '../lib/quote'

const cuidados = [
  'Evita el sol directo por horas: los colores se pueden aclarar con el tiempo.',
  'No la dejes en ambientes muy húmedos ni en el baño; la porcelana fría absorbe humedad.',
  'Límpiala con un pincel suave o un paño seco. Nunca la sumerjas en agua.',
  'Las tazas decoradas se lavan a mano y no van al microondas ni a la lavavajillas.',
  'Si es para el retrovisor, retírala si vas a dejar el carro cerrado al sol muchas horas.',
]

export default function ComoFunciona() {
  return (
    <>
      <section className="bg-porcelain">
        <div className="container-x py-12">
          <h1 className="text-4xl sm:text-5xl">Cómo funciona</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            Todo lo que necesitas saber antes de pedir: el proceso, los tiempos, los envíos, la forma de pago
            y cómo cuidar tu pieza.
          </p>
        </div>
      </section>

      {/* PROCESO */}
      <section className="container-x py-14">
        <h2 className="text-3xl">El proceso, paso a paso</h2>
        <ol className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="card relative p-6">
              <span className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-extrabold text-white">
                {s.n}
              </span>
              <Icon name={s.icon} className="mt-2 h-7 w-7 text-brand-600" />
              <h3 className="mt-3 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FOTOS */}
      <section className="bg-white py-14">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">Qué fotos enviarnos</h2>
            <p className="mt-2 text-ink-500">
              Mientras mejor sea la foto, más se parece la figura. No necesitas fotos profesionales.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-700">
              {[
                'Una foto frontal del rostro de cada persona, con buena luz.',
                'Sin gorra, gafas de sol ni filtros que cambien la cara.',
                'Si quieres una ropa específica, manda una foto de cuerpo entero o la referencia.',
                'Para mascotas: una foto de frente y una de perfil, para ver el pelaje.',
                'Si tienes una foto del carro (para retrovisor), mándala con la placa visible.',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-clay-50 p-7">
            <h3 className="text-xl font-extrabold">Tiempos de producción</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-clay-200 pb-3">
                <dt className="text-ink-500">Producción normal</dt>
                <dd className="font-extrabold">{logistics.productionDays}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-clay-200 pb-3">
                <dt className="text-ink-500">Entrega express (+{logistics.rushSurchargePct}%)</dt>
                <dd className="font-extrabold">{logistics.rushDays}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-clay-200 pb-3">
                <dt className="text-ink-500">Lotes corporativos (10+)</dt>
                <dd className="font-extrabold">4 a 6 semanas</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Temporadas altas (mayo, diciembre)</dt>
                <dd className="font-extrabold">Reservar con 3 semanas</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              El conteo empieza cuando apruebas el boceto y se registra el anticipo, no cuando escribes por
              primera vez.
            </p>
          </div>
        </div>
      </section>

      {/* ENVÍOS */}
      <section id="envios" className="container-x scroll-mt-28 py-14">
        <h2 className="text-3xl">Envíos y pagos</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-clay-100 text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-5 py-3">Destino</th>
                  <th className="px-5 py-3">Costo</th>
                  <th className="px-5 py-3">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {logistics.shipping.map((s) => (
                  <tr key={s.zone} className="border-t border-clay-200">
                    <td className="px-5 py-3 font-semibold text-ink-900">{s.zone}</td>
                    <td className="px-5 py-3 tabular-nums font-bold text-brand-700">
                      {s.price === 0 ? 'Sin costo' : money(s.price)}
                    </td>
                    <td className="px-5 py-3 text-ink-500">{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-7">
            <h3 className="text-xl font-extrabold">Formas de pago</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
              <li className="flex gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                Anticipo del {logistics.depositPct}% para entrar a producción.
              </li>
              <li className="flex gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                Saldo antes del envío o contra entrega en Quito.
              </li>
              <li className="flex gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                Transferencia bancaria, Deuna o efectivo en el taller.
              </li>
              <li className="flex gap-2">
                <Icon name="shield" className="h-5 w-5 shrink-0 text-brand-600" />
                Si la pieza llega dañada por el transporte, la reponemos sin costo (envíanos foto del
                empaque y de la pieza el mismo día que la recibas).
              </li>
            </ul>
            <p className="mt-4 rounded-2xl bg-brand-50 p-4 text-xs leading-relaxed text-brand-900">
              Al ser piezas hechas a la medida no aplican devoluciones por cambio de opinión. Sí corregimos
              cualquier detalle que no coincida con el boceto aprobado.
            </p>
          </div>
        </div>
      </section>

      {/* CUIDADOS */}
      <section id="cuidados" className="bg-white scroll-mt-28 py-14">
        <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl">Cuidados de la pieza</h2>
            <p className="mt-2 text-ink-500">
              Con cuidados básicos, una pieza de porcelana fría dura años en buen estado.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {cuidados.map((c) => (
              <li key={c} className="card flex gap-3 p-5 text-sm text-ink-700">
                <Icon name="sparkles" className="h-5 w-5 shrink-0 text-brand-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-x scroll-mt-28 py-14">
        <h2 className="text-3xl">Preguntas frecuentes</h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {faqs.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-ink-900">
                {f.q}
                <Icon name="plus" className="h-5 w-5 shrink-0 text-brand-600 group-open:hidden" />
                <Icon name="minus" className="hidden h-5 w-5 shrink-0 text-brand-600 group-open:block" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="card bg-porcelain mt-10 flex flex-col items-center gap-4 rounded-[var(--radius-blob)] p-10 text-center">
          <h3 className="text-2xl">¿Te quedó otra duda?</h3>
          <p className="max-w-lg text-ink-500">
            Escríbenos y te respondemos en horario de atención ({site.hours}).
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a className="btn btn-wa" href={waUrl('¡Hola Charms! Tengo una consulta 🙂')} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" className="h-5 w-5" /> Preguntar por WhatsApp
            </a>
            <Link to="/personalizar" className="btn btn-primary">
              Cotizar mi pieza
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
