import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Mascota from '../components/Mascota'
import PieceArt from '../components/PieceArt'
import ProductCard from '../components/ProductCard'
import { categories, categoryPriceFrom, products } from '../data/products'
import {
  faqs,
  galeria,
  logistics,
  occasions,
  site,
  steps,
  testimonials,
  trustStats,
  videos,
  waUrl,
} from '../data/site'
import { money } from '../lib/quote'

const differentiators = [
  {
    icon: 'sketch' as const,
    title: 'Boceto antes de producir',
    text: 'Apruebas cómo va a quedar antes de que empecemos. Si algo no te convence, se ajusta sin costo.',
    tono: 'bg-brand-100 text-brand-800',
  },
  {
    icon: 'camera' as const,
    title: 'Fotos reales antes del envío',
    text: 'Te mandamos fotos de tu pieza terminada. Recién ahí sale del taller.',
    tono: 'bg-lila-100 text-lila-500',
  },
  {
    icon: 'shield' as const,
    title: 'Empaque anti-golpes',
    text: 'Caja rígida, espuma y sellado. Si llega dañada por el transporte, la reponemos.',
    tono: 'bg-menta-200 text-brand-800',
  },
  {
    icon: 'truck' as const,
    title: 'Envíos a las 24 provincias',
    text: 'Entrega a domicilio en Quito y courier con número de guía al resto del país.',
    tono: 'bg-rosa-200 text-ink-900',
  },
]

export default function Home() {
  const populares = products.filter((p) => p.popular).slice(0, 4)

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="bg-tornasol relative overflow-hidden">
        {/* Sello de marca: la cola de sirena del logo, como marca de agua */}
        <img
          src="./marca/cola-sirena.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-24 w-[26rem] opacity-15 sm:-left-16 lg:w-[34rem]"
        />

        <div className="container-x relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="chip bg-white text-brand-800 shadow-[var(--shadow-soft)]">
              <Icon name="sparkles" className="h-4 w-4 text-lila-400" /> Porcelana fría · hecho a mano en
              Ecuador
            </span>

            <h1 className="mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Convertimos tus fotos en
              <span className="text-brand-700"> figuras que se quedan para siempre</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">
              Cuadros, piezas para el retrovisor, tazas y reconocimientos modelados figura por figura, con
              el parecido de cada persona, sus mascotas y la frase que quieras decirles.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/personalizar" className="btn btn-primary text-base">
                Cotiza tu pieza en 1 minuto
                <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <Link to="/catalogo" className="btn btn-ghost text-base">
                Ver catálogo
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {trustStats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-extrabold text-brand-700">{s.value}</dt>
                  <dd className="text-xs font-semibold leading-tight text-ink-500">{s.label}</dd>
                </div>
              ))}
            </dl>

            {/* Charmy recibe a quien entra, al costado del texto (no encima de las fotos) */}
            <div className="mt-8">
              <Mascota
                variant="hola"
                className="w-24 sm:w-28"
                burbujaPos="lado"
                burbuja={
                  <>
                    ¡Hola! Soy {site.mascota.name}. Cuéntame a quién quieres regalar
                    <span aria-hidden> 💙</span>
                  </>
                }
              />
            </div>
          </div>

          <div className="relative">
            <div className="card anim-float overflow-hidden rounded-[var(--radius-blob)]">
              <img
                src="./productos/cuadro-columpio-pareja.webp"
                alt="Cuadro columpio personalizado con una pareja en porcelana fría"
                className="w-full object-cover"
                width={1200}
                height={1200}
              />
            </div>

            <div className="card absolute -bottom-8 -left-3 w-36 overflow-hidden rounded-3xl sm:-left-8 sm:w-48">
              <img
                src="./productos/retrovisor-pareja-auto.webp"
                alt="Pieza de retrovisor con una pareja sobre su auto"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="card absolute -bottom-12 right-2 flex items-center gap-2 rounded-full px-4 py-2.5">
              <Icon name="heart" className="h-4 w-4 text-coral-500" />
              <span className="text-xs font-extrabold text-ink-900">+900 piezas entregadas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORÍAS ---------------- */}
      <section className="container-x py-16 pt-24">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl">¿Qué quieres regalar?</h2>
            <p className="mt-2 text-ink-500">Seis formatos base. Todos se personalizan por completo.</p>
          </div>
          <Link to="/catalogo" className="btn btn-soft text-sm">
            Ver todo el catálogo <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/catalogo?cat=${c.id}`}
              className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-clay-100">
                {c.photo ? (
                  <img
                    src={c.photo}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <PieceArt
                    art={c.art}
                    label={c.name}
                    className="h-full w-full transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-extrabold">{c.name}</h3>
                  <span className="chip bg-brand-100 text-brand-800">
                    desde {money(categoryPriceFrom(c.id))}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-ink-500">{c.short}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- MÁS PEDIDOS ---------------- */}
      <section className="bg-white py-16">
        <div className="container-x">
          <header className="mb-8">
            <h2 className="text-3xl sm:text-4xl">Los más pedidos</h2>
            <p className="mt-2 text-ink-500">
              Lo que más sale del taller cada mes. Los precios son referenciales y se cierran contigo por
              WhatsApp.
            </p>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {populares.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- GALERÍA REAL ---------------- */}
      <section className="bg-escamas py-16">
        <div className="container-x">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl">Piezas que ya entregamos</h2>
              <p className="mt-2 max-w-xl text-ink-500">
                Fotos reales del taller, sin render ni montaje. Cada una salió de la foto que nos mandó un
                cliente.
              </p>
            </div>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
              <Icon name="instagram" className="h-4 w-4" /> Ver más en Instagram
            </a>
          </header>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {galeria.slice(0, 15).map((g) => (
              <figure
                key={g.src}
                className="group relative overflow-hidden rounded-2xl border border-clay-200 bg-white shadow-[var(--shadow-soft)]"
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/85 to-transparent px-3 pb-2.5 pt-8 text-[0.7rem] font-bold text-white">
                  {g.pie}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- QUIÉN HACE LAS PIEZAS ---------------- */}
      <section className="container-x py-16">
        <div className="card bg-tornasol relative overflow-hidden rounded-[var(--radius-blob)]">
          <img
            src="./marca/cola-sirena.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-12 w-72 opacity-20"
          />
          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <span className="chip bg-white text-brand-800">
                <Icon name="hands" className="h-4 w-4" /> Detrás del taller
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl">Una sola artista detrás de cada pieza</h2>
              <p className="mt-3 text-ink-700">
                {site.mascota.name} no es un personaje inventado: es {site.mascota.rol}, la misma persona
                que modela, pinta, empaca y te responde el WhatsApp. Por eso cada pedido pasa por boceto y
                por foto antes de salir.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Mascota variant="listo" className="w-20" quieta />
                <p className="text-sm font-bold text-brand-800">
                  Del primer mensaje a la entrega, siempre hablas con la misma persona.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="./productos/taller-artista.webp"
                alt="La artista de Charms junto a un lote de figuras empacadas"
                loading="lazy"
                className="aspect-[3/4] w-full rounded-3xl border border-white/60 object-cover shadow-[var(--shadow-soft)]"
              />
              <img
                src="./productos/taller-produccion.webp"
                alt="Mesa de trabajo con decenas de figuras corporativas en producción"
                loading="lazy"
                className="mt-8 aspect-[3/4] w-full rounded-3xl border border-white/60 object-cover shadow-[var(--shadow-soft)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- VIDEOS DEL TALLER ---------------- */}
      {videos.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-x">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl">Así se hace</h2>
                <p className="mt-2 max-w-xl text-ink-500">
                  Sin moldes ni impresión 3D: cada figura se modela a mano, pieza por pieza.
                </p>
              </div>
              <a href={site.atomBioUrl} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
                Ver todos nuestros enlaces
              </a>
            </header>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {videos.map((v) => (
                <figure key={v.src} className="card overflow-hidden">
                  <video
                    className="aspect-[9/16] w-full bg-clay-100 object-cover"
                    src={v.src}
                    poster={v.poster}
                    controls
                    playsInline
                    preload="none"
                  />
                  <figcaption className="p-4">
                    <h3 className="font-extrabold text-ink-900">{v.titulo}</h3>
                    {v.descripcion && <p className="mt-1 text-sm text-ink-500">{v.descripcion}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- PROCESO ---------------- */}
      <section className="container-x py-16">
        <header className="mb-10 text-center">
          <span className="chip bg-lila-100 text-lila-500">Del chat a tu casa</span>
          <h2 className="mt-3 text-3xl sm:text-4xl">Cómo se hace tu pieza</h2>
          <p className="mx-auto mt-2 max-w-2xl text-ink-500">
            Un proceso claro, sin sorpresas: apruebas el boceto, ves fotos reales antes del envío y sabes
            exactamente cuándo llega.
          </p>
        </header>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-brand-50 p-6 text-center">
          <p className="text-sm font-semibold text-brand-900">
            Producción normal: <strong>{logistics.productionDays}</strong> · Express:{' '}
            <strong>{logistics.rushDays}</strong> (+{logistics.rushSurchargePct}%)
          </p>
          <Link to="/como-funciona" className="btn btn-ghost text-sm">
            Ver detalles y envíos
          </Link>
        </div>
      </section>

      {/* ---------------- OCASIONES ---------------- */}
      <section className="bg-white py-16">
        <div className="container-x">
          <header className="mb-6">
            <h2 className="text-3xl sm:text-4xl">Para cada ocasión</h2>
            <p className="mt-2 text-ink-500">Filtra el catálogo por el momento que quieres celebrar.</p>
          </header>
          <div className="flex flex-wrap gap-2.5">
            {occasions.map((o) => (
              <Link
                key={o.id}
                to={`/catalogo?oc=${o.id}`}
                className="chip border-2 border-clay-200 bg-white px-4 py-2.5 text-sm text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
              >
                <span aria-hidden>{o.emoji}</span> {o.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- DIFERENCIADORES ---------------- */}
      <section className="container-x py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d) => (
            <div key={d.title} className="card p-6">
              <span className={`inline-flex rounded-2xl p-3 ${d.tono}`}>
                <Icon name={d.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">{d.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TESTIMONIOS ---------------- */}
      <section className="bg-white py-16">
        <div className="container-x">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl">Clientes felices</h2>
              <p className="mt-2 text-ink-500">Lo que nos escriben cuando abren la caja.</p>
            </div>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
              <Icon name="instagram" className="h-4 w-4" /> @{site.instagram}
            </a>
          </header>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <figure key={t.name} className="card flex flex-col p-6">
                <div className="flex gap-0.5 text-coral-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-4 border-t border-clay-200 pt-3">
                  <span className="block text-sm font-extrabold text-ink-900">
                    {t.name} · {t.city}
                  </span>
                  <span className="text-xs text-ink-500">{t.piece}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- EMPRESAS ---------------- */}
      <section className="container-x py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-[var(--radius-blob)] bg-ink-900 p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <span className="chip bg-white/10 text-brand-200">
              <Icon name="building" className="h-4 w-4" /> Regalos corporativos
            </span>
            <h2 className="mt-4 text-3xl text-white sm:text-4xl">
              Reconocimientos que nadie deja en el cajón
            </h2>
            <p className="mt-3 max-w-lg text-white/70">
              Figuras con el uniforme de tu empresa, logotipo modelado en relieve y placa con nombre y años
              de servicio. Desde 10 unidades, con cronograma de entrega y factura.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/empresas" className="btn btn-primary">
                Ver plan corporativo <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <a
                href={waUrl('¡Hola Charms! Necesito una cotización corporativa por volumen.')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-wa"
              >
                <Icon name="whatsapp" className="h-5 w-5" /> Cotizar por volumen
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <img
              src="./productos/corporativo-pronaca.webp"
              alt="Reconocimiento corporativo en porcelana fría por 20 años de servicio"
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ---------------- FAQ CORTO ---------------- */}
      <section className="bg-white py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl sm:text-4xl">Dudas rápidas</h2>
            <p className="mt-2 text-ink-500">
              Las tres que más nos preguntan. El resto está en la página de ayuda.
            </p>
            <Link to="/como-funciona#faq" className="btn btn-soft mt-5 text-sm">
              Ver todas las preguntas
            </Link>
            <Mascota variant="pago" className="mt-6 hidden w-40 lg:block" />
          </div>
          <div className="space-y-3">
            {faqs.slice(0, 3).map((f) => (
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
        </div>
      </section>

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="container-x py-16">
        <div className="bg-tornasol card grid items-center gap-6 rounded-[var(--radius-blob)] p-10 sm:grid-cols-[1fr_auto]">
          <div>
            <h2 className="max-w-2xl text-3xl sm:text-4xl">
              Mándanos la foto y te decimos hoy mismo cuánto cuesta
            </h2>
            <p className="mt-3 max-w-xl text-ink-700">
              Cotizar no cuesta nada y no te compromete. Respondemos en horario de atención: {site.hours}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waUrl('¡Hola Charms! Quiero cotizar una pieza personalizada 😊')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-wa text-base"
              >
                <Icon name="whatsapp" className="h-5 w-5" /> Escribir por WhatsApp
              </a>
              <Link to="/personalizar" className="btn btn-primary text-base">
                Armar mi pieza <Icon name="arrow" className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <Mascota variant="listo" conTexto className="w-44 sm:w-56" />
        </div>
      </section>
    </>
  )
}
