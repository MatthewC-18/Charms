# Guía de diseño — Charms Ecuador

Todo sale del logo real: la cola de sirena tornasol sobre fondo turquesa, con el
lettering en azul marino. La paleta es pastel, pero el texto siempre va en marino
para que se pueda leer.

---

## 1. Paleta

Definida como tokens en `src/index.css` (bloque `@theme`). Cambiar un valor ahí
actualiza todo el sitio.

| Familia | Token | Hex | Uso |
|---|---|---|---|
| Turquesa (principal) | `brand-100` | `#dcf8fd` | Fondos suaves, chips |
| | `brand-300` | `#92e6f6` | Bordes activos, detalles |
| | `brand-500` | `#2ec3df` | Numeración de pasos, acentos |
| | `brand-700` | `#14829b` | Precios, títulos de acento |
| | `brand-800` | `#17677b` | Barra superior, texto sobre pastel |
| Lila (escamas) | `lila-100` / `lila-500` | `#f0eafe` / `#9370de` | Segundo acento, iconos |
| Menta | `menta-200` | `#cdf3e6` | Tercer acento |
| Rosa | `rosa-200` | `#fbdcec` | Cuarto acento, degradados |
| Durazno | `durazno-300` | `#fbd4a8` | Punta de la cola, detalles |
| Neutro frío | `clay-50` → `clay-400` | `#f8fcfd` → `#a5bcc9` | Fondo de página, bordes |
| Marino (texto) | `ink-900` | `#16233f` | Todo el texto y los títulos |
| Coral | `coral-500` | `#ef4444` | **Solo** corazones y "más pedido" |

**Regla del pastel:** los pasteles son **fondo**, nunca texto. Cualquier texto va en
`ink-900`, `ink-700` o `brand-800`. Así el sitio se ve suave sin volverse ilegible —
que es el error típico de las paletas pastel.

### Sello de marca

La **cola de sirena** (`public/marca/cola-sirena.webp`) es la esencia del logo y aparece
como marca de agua translúcida (opacidad 10-20 %) en el hero, el footer y el bloque
"Detrás del taller". Siempre detrás del contenido, nunca compitiendo con una foto.

### Utilidades de fondo

- `.bg-tornasol` — degradado turquesa → lila → rosa. Para heroes y bloques de cierre.
- `.bg-escamas` — patrón sutil de escamas de la cola. Para la galería.
- `bg-ink-900` — bloque marino, para la sección corporativa (contrasta con el resto).

## 2. Tipografía

- **Baloo 2** (800) para títulos: redondeada, coincide con el lettering del logo.
- **Nunito** para texto corrido: legible, con buen soporte de acentos en español.
- Ambas cargan desde Google Fonts en `index.html`.

## 3. Charmy, la mascota

**Charmy** es el avatar 3D de la dueña y la mascota del sitio. No es un personaje inventado:
representa a la persona real que modela, pinta y responde el WhatsApp, y así se cuenta en la
sección "Detrás del taller". Archivos y variantes en `public/marca/LEEME.md`.

Criterios:

- **Una sola mascota por pantalla.** Si aparece en todos lados deja de ser simpática.
- Se usa donde hay que dar confianza o guiar: hero, envíos, pagos, cierre del cotizador,
  estado vacío del catálogo.
- **No** se usa dentro de las tarjetas de producto ni en la ficha: ahí manda la pieza.
- **Nunca encima de una foto de producto.** Va al costado, en su propia columna: si se
  superpone, tapa justo lo que el cliente vino a ver.
- La versión "limpia" (sin texto dibujado) permite cambiar el mensaje desde el código.
- La animación es leve (`anim-saludo`, `anim-float-slow`) y se desactiva sola con
  `prefers-reduced-motion`.

## 4. Fotografía

Las fotos del taller son el activo más fuerte del sitio: fondo real (jardín, carro,
pared), pieza en mano, marca de agua propia. Se recortan en 1:1 en el catálogo.

Evitar mezclar fotos con las ilustraciones SVG dentro de una misma fila cuando se pueda:
la foto siempre gana y la ilustración se ve como un hueco. Las ilustraciones quedan
solo en los modelos que aún no tienen foto (dúo de tazas, cuadro casita, cuadro de grupo,
corazón colgante).

---

## 5. Recomendaciones pendientes

Ordenadas por lo que más mueve la aguja.

### Alto impacto

1. **Fotos de los 3 modelos que faltan** (dúo de tazas, cuadro casita, cuadro de grupo).
   El resto del catálogo ya está con foto real.
2. **Fotos en contexto**: el cuadro colgado en una pared, la pieza puesta en el retrovisor.
   Hoy casi todas son en mano; ayuda a imaginar el regalo ya entregado.
3. **Un clip sin marca de agua** de TikTok/Instagram para el hero. Los actuales sirven,
   pero la marca de agua ajena se nota.

### Medio impacto

4. **Unificar el fondo de las fotos por categoría** (por ejemplo, todas las de retrovisor
   dentro del carro). Da ritmo visual a la grilla.
5. **Micro-animación al hacer scroll** (aparecer suave de tarjetas). Con moderación.
6. **Modo de contraste alto**: si la dueña quiere aún más pastel, subir la saturación solo
   en botones y precios para que no se pierdan.
7. **Segundo tipo de tarjeta** para el catálogo cuando haya más de 30 modelos: grilla más
   compacta, con filtro fijo lateral.

### Detalles finos

8. Marca de agua propia en tamaño consistente (algunas fotos la tienen grande, otras
   pequeña).
9. Favicon: hoy usa el logo cuadrado con fondo turquesa; se ve bien, pero una versión
    solo con la cola (sin fondo) se lee mejor en pestañas pequeñas.
10. Sumar poses nuevas de Charmy según haga falta ("en producción", "últimos cupos").

### Lo que conviene NO hacer

- No poner el texto en turquesa o lila sobre blanco: se pierde.
- No usar rojo fuera de los corazones: compite con la marca.
- No llenar de degradados; el tornasol funciona porque se usa en pocos bloques.
