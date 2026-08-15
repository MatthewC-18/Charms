import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import PieceArt from '../components/PieceArt'
import { logistics, site, waUrl } from '../data/site'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', ciudad: '', mensaje: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const message = [
    '¡Hola Charms! 👋',
    form.nombre ? `Soy ${form.nombre}${form.ciudad ? `, de ${form.ciudad}` : ''}.` : null,
    form.mensaje || 'Quisiera más información sobre sus piezas personalizadas.',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <>
      <section className="bg-porcelain">
        <div className="container-x py-12">
          <h1 className="text-4xl sm:text-5xl">Hablemos</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            La forma más rápida es WhatsApp: ahí mismo mandas las fotos y te damos el valor el mismo día.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <a
            href={waUrl('¡Hola Charms! Quiero información sobre sus piezas 😊')}
            target="_blank"
            rel="noreferrer"
            className="card flex items-center gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="rounded-2xl bg-[#25d366]/15 p-3 text-[#128c48]">
              <Icon name="whatsapp" className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-lg font-extrabold">WhatsApp</span>
              <span className="block text-sm text-ink-500">{site.whatsappDisplay} · respuesta el mismo día</span>
            </span>
          </a>

          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="card flex items-center gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="rounded-2xl bg-brand-100 p-3 text-brand-700">
              <Icon name="instagram" className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-lg font-extrabold">Instagram</span>
              <span className="block text-sm text-ink-500">@{site.instagram} · +900 piezas publicadas</span>
            </span>
          </a>

          <div className="card flex items-center gap-4 p-6">
            <span className="rounded-2xl bg-clay-100 p-3 text-ink-700">
              <Icon name="mail" className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-lg font-extrabold">Correo</span>
              <span className="block text-sm text-ink-500">{site.email} · para empresas y facturación</span>
            </span>
          </div>

          <div className="card flex items-center gap-4 p-6">
            <span className="rounded-2xl bg-clay-100 p-3 text-ink-700">
              <Icon name="pin" className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-lg font-extrabold">Taller</span>
              <span className="block text-sm text-ink-500">
                {site.city} · retiro con cita previa. {site.hours}
              </span>
            </span>
          </div>
        </div>

        <div className="card p-7">
          <h2 className="text-2xl">Escríbenos</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Al enviar se abre WhatsApp con tu mensaje escrito. No guardamos tus datos en el sitio.
          </p>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="nombreC">
                  Tu nombre
                </label>
                <input id="nombreC" className="field" value={form.nombre} onChange={set('nombre')} />
              </div>
              <div>
                <label className="label" htmlFor="ciudadC">
                  Ciudad
                </label>
                <input
                  id="ciudadC"
                  className="field"
                  value={form.ciudad}
                  onChange={set('ciudad')}
                  placeholder="Ej. Guayaquil"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="mensajeC">
                Mensaje
              </label>
              <textarea
                id="mensajeC"
                className="field min-h-32"
                value={form.mensaje}
                onChange={set('mensaje')}
                placeholder="Cuéntanos qué pieza tienes en mente, para cuándo la necesitas y a qué ciudad iría."
              />
            </div>
            <a className="btn btn-wa w-full" href={waUrl(message)} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" className="h-5 w-5" /> Enviar por WhatsApp
            </a>
          </div>

          <div className="mt-7 rounded-2xl bg-brand-50 p-5">
            <h3 className="font-extrabold text-brand-900">Antes de escribir, ten a mano:</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-brand-900/80">
              <li>· Las fotos de las personas y mascotas.</li>
              <li>· La fecha en que necesitas la pieza.</li>
              <li>· La ciudad de entrega (envíos desde {logistics.shipping[0].price === 0 ? 'gratis' : '$3.50'}).</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="card overflow-hidden rounded-[var(--radius-blob)]">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl">¿Ya sabes qué quieres?</h2>
              <p className="mt-2 text-ink-500">
                Usa el cotizador: eliges la pieza, las figuras y los extras, y te da un estimado al instante.
              </p>
              <Link className="btn btn-primary mt-5" to="/personalizar">
                Ir al cotizador <Icon name="arrow" className="h-5 w-5" />
              </Link>
            </div>
            <PieceArt art="frame4d" label="Cuadro 4D familiar" className="w-full rounded-3xl" />
          </div>
        </div>
      </section>
    </>
  )
}
