# Charms Ecuador — sitio web

Sitio comercial para **Charms Ecuador** (`@charms.ecuador`), taller de regalos personalizados en
porcelana fría. El objetivo del sitio no es vender con carrito: es **capturar el pedido y llevarlo a
WhatsApp con toda la información ya escrita**, que es como el negocio realmente cierra.

- Catálogo navegable con filtros por categoría, ocasión, búsqueda y orden por precio.
- **Cotizador en 4 pasos** con precio estimado en vivo (figuras, mascotas, extras, express, envío,
  descuento por volumen) que arma el mensaje de WhatsApp completo.
- Página de **regalos corporativos** con tabla de descuentos y formulario de solicitud.
- Página de ayuda: proceso, qué fotos enviar, tiempos, envíos, pagos, cuidados y FAQ.
- Sin backend, sin base de datos, sin costo de hosting.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router (HashRouter).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Estructura

```
src/
├── data/
│   ├── site.ts       ← marca, WhatsApp, envíos, pasos, testimonios, FAQ, ocasiones, galería
│   └── products.ts   ← categorías y catálogo (precios, figuras incluidas, extras, fotos)
├── lib/quote.ts      ← motor de cotización + armado del mensaje de WhatsApp
├── components/       ← Layout, Logo, Mascota, Icon, ProductCard, PieceArt
└── pages/            ← Home, Catalogo, Producto, Personalizar, Empresas, ComoFunciona, Contacto
public/productos/     ← fotos reales del taller en webp (ver LEEME.md)
public/marca/         ← logo y stickers de la mascota (ver LEEME.md)
assets-originales/    ← originales sin procesar (no se publican)
scripts/              ← procesar-assets.mjs: optimiza fotos, logo y mascota
docs/                 ← ESTRATEGIA.md (negocio) y DISENO.md (paleta y criterios)
```

## Qué se edita y dónde

| Quiero cambiar… | Archivo |
|---|---|
| Número de WhatsApp, correo, ciudad, horario | `src/data/site.ts` → `site` |
| Costos y tiempos de envío, anticipo, express | `src/data/site.ts` → `logistics` |
| Preguntas frecuentes, testimonios, pasos | `src/data/site.ts` |
| Productos, precios, figuras incluidas | `src/data/products.ts` |
| Extras del cotizador (LED, caja, logo…) | `src/lib/quote.ts` → `addOns` |
| Descuentos por volumen | `src/lib/quote.ts` → `volumeDiscountPct` |
| Colores y tipografía de marca | `src/index.css` → bloque `@theme` (ver `docs/DISENO.md`) |
| Fotos de producto | `public/productos/` + campo `photo` en `products.ts` |
| Galería "piezas que ya entregamos" | `src/data/site.ts` → `galeria` |
| Mascota (avatar de la dueña) | `src/components/Mascota.tsx` + `public/marca/` |

## Assets

El logo real, las fotos del taller y los stickers de la mascota se procesan con:

```bash
node scripts/procesar-assets.mjs fotos assets-originales/fotos
```

El script quita fondos, recorta y exporta a webp. Detalles en `public/marca/LEEME.md`
y `public/productos/LEEME.md`.

## Estado del contenido

- ✅ Logo, fotos de 10 piezas reales y mascota de la marca ya integrados.
- ⏳ Faltan fotos de tazas, llaveros, porta llaves, cuadro casita y cuadro de grupo:
  esos modelos todavía muestran una ilustración SVG de respaldo.
- ⚠️ **Precios, testimonios y correo son de ejemplo** y deben confirmarse con la dueña
  del negocio antes de publicar (lista completa en `docs/ESTRATEGIA.md`).

## Deploy

El sitio es estático con rutas relativas (`base: './'`) y `HashRouter`, así que funciona igual en
GitHub Pages, Netlify, Vercel o cualquier hosting.

**GitHub Pages**: el workflow `.github/workflows/deploy.yml` publica `dist/` en cada push a `main`.
Solo hay que activar Pages en *Settings → Pages → Source: GitHub Actions*.
