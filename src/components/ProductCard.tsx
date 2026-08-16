import { Link } from 'react-router-dom'
import PieceArt from './PieceArt'
import Icon from './Icon'
import { money } from '../lib/quote'
import type { Product } from '../data/products'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <Link to={`/producto/${product.slug}`} className="relative block">
        <div className="aspect-square w-full overflow-hidden bg-clay-100">
          {product.photo ? (
            <img
              src={product.photo}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <PieceArt art={product.art} label={product.name} className="h-full w-full" />
          )}
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.popular && (
            <span className="chip bg-coral-500 text-white">
              <Icon name="star" className="h-3.5 w-3.5" /> Más pedido
            </span>
          )}
          {product.isNew && <span className="chip bg-brand-500 text-white">Nuevo</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold text-ink-900">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-500">{product.blurb}</p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-ink-500">Desde</span>
            <span className="text-2xl font-extrabold text-brand-700">{money(product.priceFrom)}</span>
          </div>
          <Link
            to={`/personalizar?p=${product.slug}`}
            className="btn btn-primary px-4 py-2.5 text-sm"
            aria-label={`Cotizar ${product.name}`}
          >
            Cotizar
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
