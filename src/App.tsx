import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Personalizar from './pages/Personalizar'
import Empresas from './pages/Empresas'
import ComoFunciona from './pages/ComoFunciona'
import Contacto from './pages/Contacto'

function NotFound() {
  return (
    <section className="container-x py-24 text-center">
      <h1 className="text-5xl">Página no encontrada</h1>
      <p className="mt-3 text-ink-500">El enlace que seguiste ya no existe.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Volver al inicio
      </Link>
    </section>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="producto/:slug" element={<Producto />} />
          <Route path="personalizar" element={<Personalizar />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="como-funciona" element={<ComoFunciona />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
