import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PieceArt from '../components/PieceArt'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'
import { getCategory, getProduct, products } from '../data/products'
import { logistics, occasions, waUrl } from '../data/site'
import { money } from '../lib/quote'

export default function Producto() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  const fotos = product?.photo ? [product.photo, ...(product.gallery ?? [])] : []
  const [activa, setActiva] = useState(0)

  if (!product) {
    return (
      <section className="container-x py-24 text-center">
        <h1 className="text-4xl">Ese modelo no existe</h1>
        <p className="mt-3 text-ink-500">Puede que haya cambiado de nombre. Mira el catálogo completo.</p>
        <Link to="/catalogo" className="btn btn-primary mt-6">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  const category = getCategory(product.category)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <>
      <section className="container-x py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-500" aria-label="Migas de pan">
          <Link to="/catalogo" className="font-semibold hover:text-brand-600">
            Catálogo
          </Link>
          <span aria-hidden>/</span>
          <Link to={`/catalogo?cat=${category.id}`} className="font-semibold hover:text-brand-600">
            {category.name}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink-900">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="card overflow-hidden rounded-[var(--radius-blob)]">
              {fotos.length > 0 ? (
                <img
                  src={fotos[activa]}
                  alt={`${product.name} — foto ${activa + 1}`}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <PieceArt art={product.art} label={product.name} className="w-full" />
              )}
            </div>

            {fotos.length > 1 && (
              <div className="mt-3 flex gap-3">
                {fotos.map((f, i) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiva(i)}
                    className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition ${
                      i === activa ? 'border-brand-500' : 'border-clay-200 hover:border-brand-300'
                    }`}
                    aria-label={`Ver foto ${i + 1} de ${product.name}`}
                    aria-pressed={i === activa}
                  >
                    <img src={f} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {product.popular && <span className="chip bg-coral-500 text-white">Más pedido</span>}
              {product.isNew && <span className="chip bg-brand-500 text-white">Nuevo</span>}
              <span className="chip bg-clay-100 text-ink-700">{product.size}</span>
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-700">{product.description}</p>

            <div className="mt-6 flex items-end gap-3">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-ink-500">Desde</span>
                <span className="text-4xl font-extrabold text-brand-700">{money(product.priceFrom)}</span>
              </div>
              <span className="pb-2 text-sm text-ink-500">
                incluye {product.figuresIncluded} {product.figuresIncluded === 1 ? 'figura' : 'figuras'}
              </span>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
                  <Icon name="check" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                  {h}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-ink-700">
                <Icon name="check" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                Figura adicional: {money(product.extraFigure)}
              </li>
              {product.extraPet > 0 && (
                <li className="flex items-start gap-2 text-sm text-ink-700">
                  <Icon name="check" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                  Mascota adicional: {money(product.extraPet)}
                </li>
              )}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={`/personalizar?p=${product.slug}`} className="btn btn-primary text-base">
                Personalizar y cotizar <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <a
                className="btn btn-wa text-base"
                href={waUrl(`¡Hola Charms! Me interesa el modelo *${product.name}*. ¿Me ayudan con la cotización?`)}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" className="h-5 w-5" /> Preguntar por WhatsApp
              </a>
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl bg-brand-50 p-5 text-sm text-brand-900 sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Icon name="clock" className="h-4.5 w-4.5" /> Producción {logistics.productionDays}
              </p>
              <p className="flex items-center gap-2">
                <Icon name="truck" className="h-4.5 w-4.5" /> Envíos a todo el país
              </p>
              <p className="flex items-center gap-2">
                <Icon name="camera" className="h-4.5 w-4.5" /> Fotos antes de enviar
              </p>
              <p className="flex items-center gap-2">
                <Icon name="shield" className="h-4.5 w-4.5" /> Empaque anti-golpes
              </p>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Ideal para</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.occasions.map((id) => {
                  const o = occasions.find((x) => x.id === id)
                  if (!o) return null
                  return (
                    <Link key={id} to={`/catalogo?oc=${id}`} className="chip bg-clay-100 text-ink-700">
                      <span aria-hidden>{o.emoji}</span> {o.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-14">
          <h2 className="mb-6 text-3xl">También de {category.name.toLowerCase()}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
