import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'
import Mascota from '../components/Mascota'
import Reveal from '../components/Reveal'
import { categories, products } from '../data/products'
import { occasions, waUrl } from '../data/site'

type SortKey = 'destacados' | 'precio-asc' | 'precio-desc'

export default function Catalogo() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') ?? ''
  const oc = params.get('oc') ?? ''
  const q = params.get('q') ?? ''
  const sort = (params.get('sort') as SortKey) ?? 'destacados'

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = products.filter((p) => {
      if (cat && p.category !== cat) return false
      if (oc && !p.occasions.includes(oc as never)) return false
      if (term && !`${p.name} ${p.blurb} ${p.description}`.toLowerCase().includes(term)) return false
      return true
    })

    if (sort === 'precio-asc') list = [...list].sort((a, b) => a.priceFrom - b.priceFrom)
    else if (sort === 'precio-desc') list = [...list].sort((a, b) => b.priceFrom - a.priceFrom)
    else list = [...list].sort((a, b) => Number(!!b.popular) - Number(!!a.popular))

    return list
  }, [cat, oc, q, sort])

  const activeCategory = categories.find((c) => c.id === cat)
  const hasFilters = Boolean(cat || oc || q)

  return (
    <>
      <section className="bg-tornasol">
        <div className="container-x py-12">
          <h1 className="text-4xl sm:text-5xl">{activeCategory ? activeCategory.name : 'Catálogo'}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            {activeCategory
              ? activeCategory.description
              : 'Todo se personaliza: cantidad de figuras, ropa, mascotas, frases y fondos. Los precios mostrados son referenciales para la configuración base.'}
          </p>
        </div>
      </section>

      <section className="container-x py-10">
        {/* Filtros */}
        <div className="card mb-8 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <input
                className="field pl-10"
                type="search"
                placeholder="Buscar: columpio, taza, mascota…"
                value={q}
                onChange={(e) => setParam('q', e.target.value)}
                aria-label="Buscar en el catálogo"
              />
              <Icon name="sparkles" className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-brand-400" />
            </div>

            <select
              className="field w-auto"
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              aria-label="Ordenar"
            >
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>

            {hasFilters && (
              <button type="button" className="btn btn-ghost py-2.5 text-sm" onClick={() => setParams({})}>
                <Icon name="close" className="h-4 w-4" /> Limpiar filtros
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setParam('cat', '')}
              className={`chip border-2 px-3.5 py-2 ${
                !cat ? 'border-brand-500 bg-brand-100 text-brand-800' : 'border-clay-200 bg-white text-ink-700'
              }`}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setParam('cat', c.id === cat ? '' : c.id)}
                className={`chip border-2 px-3.5 py-2 ${
                  cat === c.id
                    ? 'border-brand-500 bg-brand-100 text-brand-800'
                    : 'border-clay-200 bg-white text-ink-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {occasions.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setParam('oc', o.id === oc ? '' : o.id)}
                className={`chip px-3 py-1.5 text-xs ${
                  oc === o.id ? 'bg-coral-500 text-white' : 'bg-clay-100 text-ink-700'
                }`}
              >
                <span aria-hidden>{o.emoji}</span> {o.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-5 text-sm font-semibold text-ink-500">
          {filtered.length} {filtered.length === 1 ? 'modelo' : 'modelos'}
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 70} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center p-10 text-center">
            <Mascota variant="hola" className="w-28" />
            <h2 className="mt-4 text-2xl">No encontramos ese modelo</h2>
            <p className="mx-auto mt-2 max-w-md text-ink-500">
              La mayoría de nuestros pedidos son diseños que el cliente imagina y no están en el catálogo.
              Cuéntanos tu idea y la cotizamos igual.
            </p>
            <a
              className="btn btn-wa mt-5"
              href={waUrl('¡Hola Charms! Tengo una idea que no vi en el catálogo, ¿la pueden hacer?')}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" className="h-5 w-5" /> Contar mi idea
            </a>
          </div>
        )}
      </section>
    </>
  )
}
