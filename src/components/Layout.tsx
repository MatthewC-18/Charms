import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from './Logo'
import ProgresoSirena from './ProgresoSirena'
import SirenaGuia from './SirenaGuia'
import Icon from './Icon'
import { site, waUrl, logistics } from '../data/site'
import { categories } from '../data/products'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/personalizar', label: 'Personalizar' },
  { to: '/empresas', label: 'Empresas' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/contacto', label: 'Contacto' },
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? 'bg-white/90 shadow-[0_6px_24px_-18px_rgba(20,32,43,.5)] backdrop-blur' : 'bg-clay-50'
      }`}
    >
      <div className="bg-brand-800 text-white">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-1.5 text-[0.72rem] font-bold sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="truck" className="h-3.5 w-3.5" /> Envíos a todo el Ecuador
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Icon name="clock" className="h-3.5 w-3.5" /> Producción {logistics.productionDays}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="heart" className="h-3.5 w-3.5" /> Hechos a mano
          </span>
        </div>
      </div>

      <div className="container-x flex items-center justify-between py-3">
        <Link to="/" aria-label="Ir al inicio">
          <Logo className="h-11 sm:h-12" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-bold transition ${
                  isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-700 hover:bg-clay-100'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="btn btn-wa hidden text-sm sm:inline-flex"
            href={waUrl('¡Hola Charms! Quiero pedir una pieza personalizada 😊')}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" className="h-4.5 w-4.5" />
            Pedir por WhatsApp
          </a>
          <button
            type="button"
            className="rounded-full border-2 border-clay-200 p-2 text-ink-900 lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-clay-200 bg-white lg:hidden">
          <div className="container-x grid gap-1 py-3">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 font-bold ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-700'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <a
              className="btn btn-wa mt-2"
              href={waUrl('¡Hola Charms! Quiero pedir una pieza personalizada 😊')}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" className="h-5 w-5" /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-clay-200 bg-white">
      {/* Sello de marca: la cola de sirena, muy tenue */}
      <img
        src="./marca/cola-sirena.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-10 w-80 opacity-10 lg:w-[28rem]"
      />

      <div className="container-x relative grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo className="h-12" />
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            {site.tagline}. {site.claim}. Piezas únicas modeladas a mano en {site.city}.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border-2 border-clay-200 p-2 text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              <Icon name="instagram" />
            </a>
            <a
              href={waUrl('¡Hola Charms!')}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="rounded-full border-2 border-clay-200 p-2 text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              <Icon name="whatsapp" />
            </a>
            <a
              href={site.atomBioUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Todos nuestros enlaces"
              title="Todos nuestros enlaces"
              className="rounded-full border-2 border-clay-200 p-2 text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              <Icon name="link" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">Catálogo</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            {categories.map((c) => (
              <li key={c.id}>
                <Link className="transition hover:text-brand-600" to={`/catalogo?cat=${c.id}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">Ayuda</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>
              <Link className="transition hover:text-brand-600" to="/como-funciona">
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand-600" to="/como-funciona#envios">
                Envíos y tiempos
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand-600" to="/como-funciona#faq">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand-600" to="/como-funciona#cuidados">
                Cuidados de la pieza
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand-600" to="/empresas">
                Pedidos corporativos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li className="flex items-center gap-2">
              <Icon name="whatsapp" className="h-4 w-4 text-brand-600" /> {site.whatsappDisplay}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 text-brand-600" /> {site.email}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="pin" className="h-4 w-4 text-brand-600" /> {site.city}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 text-brand-600" /> {site.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-clay-200">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Todas las piezas son artesanales; pueden existir
            variaciones mínimas respecto a las fotos.
          </p>
          <a className="font-bold text-brand-600" href={site.builtBy.url} target="_blank" rel="noreferrer">
            {site.builtBy.label}
          </a>
        </div>
      </div>
    </footer>
  )
}

function WhatsappFab() {
  return (
    <a
      href={waUrl('¡Hola Charms! Vi su sitio web y quiero cotizar una pieza 😊')}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3.5 font-extrabold text-[#04331a] shadow-lg transition hover:scale-105"
      aria-label="Escribir por WhatsApp"
    >
      <Icon name="whatsapp" className="h-6 w-6" />
      <span className="hidden sm:inline">Cotiza gratis</span>
    </a>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <ProgresoSirena />
      <SirenaGuia />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsappFab />
    </div>
  )
}
