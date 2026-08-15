import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import PieceArt from '../components/PieceArt'
import { logistics, site, waUrl } from '../data/site'
import { money, volumeDiscountPct } from '../lib/quote'

const useCases = [
  {
    icon: 'star' as const,
    title: 'Años de servicio',
    text: 'Reconocimientos 5, 10, 20 años con el uniforme real del colaborador y su nombre en placa.',
  },
  {
    icon: 'building' as const,
    title: 'Aniversario institucional',
    text: 'Pieza conmemorativa con el logotipo modelado en relieve y los colores corporativos.',
  },
  {
    icon: 'hands' as const,
    title: 'Jubilaciones y despedidas',
    text: 'La figura de la persona con los objetos que la representan en la empresa.',
  },
  {
    icon: 'sparkles' as const,
    title: 'Fin de año y campañas',
    text: 'Detalles de marca para clientes clave: llaveros, tazas o mini figuras con tu identidad.',
  },
]

const tiers = [10, 25, 50, 100]

export default function Empresas() {
  const [form, setForm] = useState({
    empresa: '',
    contacto: '',
    unidades: '25',
    fecha: '',
    idea: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const message = [
    '¡Hola Charms! Escribo por un pedido corporativo. 🏢',
    '',
    form.empresa ? `*Empresa:* ${form.empresa}` : null,
    form.contacto ? `*Contacto:* ${form.contacto}` : null,
    `*Unidades estimadas:* ${form.unidades}`,
    form.fecha ? `*Fecha de entrega requerida:* ${form.fecha}` : null,
    form.idea ? `*Qué necesitamos:* ${form.idea}` : null,
    '',
    'Quedo atento(a) a la cotización y al cronograma. Gracias.',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <>
      <section className="bg-ink-900 text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="chip bg-white/10 text-brand-200">
              <Icon name="building" className="h-4 w-4" /> Charms para empresas
            </span>
            <h1 className="mt-4 text-4xl text-white sm:text-5xl">
              Reconocimientos hechos a mano, con la cara de tu gente
            </h1>
            <p className="mt-4 max-w-xl text-white/70">
              Producimos lotes de 10 a 200 piezas con un diseño base común y personalización individual.
              Cronograma cerrado por escrito, avances por foto y factura.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="btn btn-wa" href={waUrl(message)} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" className="h-5 w-5" /> Pedir cotización
              </a>
              <Link to="/catalogo?cat=corporativo" className="btn btn-ghost">
                Ver modelos corporativos
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden rounded-[var(--radius-blob)]">
            <PieceArt art="plaque" label="Reconocimiento corporativo" className="w-full" />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <h2 className="text-3xl sm:text-4xl">En qué momentos nos contratan</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u) => (
            <div key={u.title} className="card p-6">
              <span className="inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700">
                <Icon name={u.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">{u.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl sm:text-4xl">Descuento por volumen</h2>
            <p className="mt-2 text-ink-500">
              Se aplica automáticamente en el cotizador y en la propuesta formal.
            </p>
            <div className="card mt-6 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-clay-100 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-5 py-3">Unidades</th>
                    <th className="px-5 py-3">Descuento</th>
                    <th className="px-5 py-3">Ejemplo sobre {money(44)}</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((t) => {
                    const pct = volumeDiscountPct(t)
                    return (
                      <tr key={t} className="border-t border-clay-200">
                        <td className="px-5 py-3 font-bold">{t}+</td>
                        <td className="px-5 py-3 text-brand-700 font-extrabold">{pct}%</td>
                        <td className="px-5 py-3 tabular-nums text-ink-500">
                          {money(44 - (44 * pct) / 100)} c/u
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-ink-700">
              <li className="flex gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                Anticipo del {logistics.depositPct}% para iniciar producción; saldo contra entrega.
              </li>
              <li className="flex gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                Muestra física previa aprobada antes de producir el lote completo.
              </li>
              <li className="flex gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                Emitimos factura y coordinamos entrega en una sola dirección o por colaborador.
              </li>
              <li className="flex gap-2">
                <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" />
                Para lotes grandes, planifica con 4 a 6 semanas de anticipación.
              </li>
            </ul>
          </div>

          <div className="card p-7">
            <h2 className="text-2xl">Cuéntanos qué necesitas</h2>
            <p className="mt-1.5 text-sm text-ink-500">
              Completa y se abre WhatsApp con el mensaje listo. También puedes escribir a {site.email}.
            </p>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="label" htmlFor="empresa">
                  Empresa
                </label>
                <input id="empresa" className="field" value={form.empresa} onChange={set('empresa')} />
              </div>
              <div>
                <label className="label" htmlFor="contacto">
                  Persona de contacto
                </label>
                <input id="contacto" className="field" value={form.contacto} onChange={set('contacto')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="unidades">
                    Unidades estimadas
                  </label>
                  <input
                    id="unidades"
                    type="number"
                    min={1}
                    className="field"
                    value={form.unidades}
                    onChange={set('unidades')}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="fechaCorp">
                    Fecha de entrega
                  </label>
                  <input id="fechaCorp" type="date" className="field" value={form.fecha} onChange={set('fecha')} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="idea">
                  Qué tienen en mente
                </label>
                <textarea
                  id="idea"
                  className="field min-h-28"
                  value={form.idea}
                  onChange={set('idea')}
                  placeholder="Ej. 30 reconocimientos por 15 años de servicio, con uniforme azul y logo en relieve."
                />
              </div>
              <a className="btn btn-wa w-full" href={waUrl(message)} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" className="h-5 w-5" /> Enviar solicitud
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
