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

## 4. El 3D del sitio

Todo el 3D está **construido desde cero con geometría**, sin modelos descargados ni
visores de terceros. Son dos piezas, ambas en `src/three/`:

### La sirena que guía (`three/sirena.ts`)

La cola del logo, ahora en tres dimensiones: el cuerpo es una superficie paramétrica
(anillos de radio decreciente a lo largo de una curva) y la aleta son dos lóbulos
generados con la misma función de malla. El nado y las escamas viven en un shader propio:

- **Vertex shader**: onda de nado que crece hacia la punta; se agita más fuerte cuando
  haces scroll rápido (uniform `uEnergia`).
- **Fragment shader**: tornasol turquesa → lila → rosa → menta mezclado según posición,
  ángulo de vista (fresnel) y tiempo, con escamas procedurales dibujadas en el propio
  shader (no hay textura).

Nada por el costado derecho siguiendo tu scroll, de arriba a abajo de la página.

### La cara (`three/cara.ts`)

Los ojos enormes con pestañas, iris, brillo y rubor no se pueden hacer con esferas:
quedan como puntos negros. Se pintan en un canvas 2D y esa imagen se envuelve sobre la
esfera de la cabeza. Como es un dibujo, se repinta al instante cuando cambian el tono de
piel, de ojos o de cabello, y de ahí sale el parecido con las figuras del taller.

### El muñeco configurable (`three/muneco.ts`)

Armado con primitivas (esferas, cápsulas, cilindros) con las proporciones reales de las
figuras del taller: cabeza grande, ojos enormes, base redonda, corazón en las manos.
Se gira arrastrando, cambia de piel, cabello y ropa en vivo, y esa elección viaja en el
mensaje de WhatsApp.

### Banco de pruebas

`test3d.html` (solo en desarrollo) arma las escenas, captura el lienzo y lo guarda en
`capturas/` mediante un plugin de Vite. Sirve para revisar el modelado sin depender de
capturas de pantalla manuales. Ejecutar `npm run dev` y abrir `/test3d.html`.

Cuidados: Three.js se carga en un chunk aparte y solo cuando el visor se acerca a la
pantalla; el render se detiene si el bloque no está a la vista o la pestaña está oculta;
si el equipo no tiene WebGL, sale un aviso y el sitio sigue funcionando igual.

## 5. Movimiento e interacción

Además del 3D, la capa de movimiento en CSS. Todo con `transform`, sin librerías de
animación: el peso del JS no sube y funciona igual en un teléfono de gama media.

| Efecto | Dónde | Componente |
|---|---|---|
| **Sirena 3D que acompaña el scroll** | Todo el sitio | `SirenaGuia.tsx` + `three/sirena.ts` |
| **Visor 3D del muñeco** | Inicio y paso 2 del cotizador | `Muneco3D.tsx` + `three/muneco.ts` |
| **Barra de progreso tornasol** | Fija arriba | `ProgresoSirena.tsx` |
| **Collage 3D que sigue al mouse** | Hero: el cuadro, el retrovisor y la taza en capas de profundidad | `Tilt3D.tsx` + `.capa-frente` / `.capa-media` |
| **Inclinación + reflejo tornasol** | Cada tarjeta de producto | `Tilt3D.tsx` |
| **Burbujas que suben** | Hero y bloque de cierre | `Burbujas.tsx` |
| **Aparición al hacer scroll** | Categorías, productos, galería, pasos | `Reveal.tsx` |
| **Números que cuentan** | Estadísticas del hero | `Contador.tsx` |
| **Degradado que respira** | Fondos `.bg-vivo` | CSS |
| **Brillo iridiscente** | Cola de sirena decorativa (`.anim-tornasol`) | CSS |

Reglas que se respetan siempre:

- **`prefers-reduced-motion`**: todo se apaga desde el CSS, incluidas las burbujas y el
  tilt. Nadie se marea.
- **El tilt solo con mouse fino** (`hover: hover and pointer: fine`): en táctil no aplica,
  porque ahí no hay hover y solo estorbaría al hacer scroll.
- **Nada bloquea el contenido**: si `IntersectionObserver` no dispara, un temporizador de
  respaldo muestra el bloque igual. El texto nunca queda invisible.
- **Sin librerías de animación**: el paquete principal sigue por debajo de 105 KB gzip y
  Three.js viaja en un chunk aparte que solo se descarga si hace falta.

## 6. Fotografía

Las fotos del taller son el activo más fuerte del sitio: fondo real (jardín, carro,
pared), pieza en mano, marca de agua propia. Se recortan en 1:1 en el catálogo.

**Todo el catálogo va con foto real.** Se eliminaron las ilustraciones SVG de respaldo y
los modelos que no tenían foto: mezclar dibujo y foto en una misma grilla hacía que el
dibujo se viera como un hueco. Si vuelve un modelo al catálogo, entra con foto o no entra.
Por eso `photo` es obligatorio en el tipo `Product`: el compilador no deja publicar un
producto sin foto.

---

## 7. Recomendaciones pendientes

Ordenadas por lo que más mueve la aguja.

### Alto impacto

1. **Recuperar los 3 modelos retirados** cuando haya foto: dúo de tazas, cuadro casita y
   corazón colgante para retrovisor. Están descritos en el historial de git.
2. **Fotos en contexto**: el cuadro colgado en una pared, la pieza puesta en el retrovisor.
   Hoy casi todas son en mano; ayuda a imaginar el regalo ya entregado.
3. **Un clip sin marca de agua** de TikTok/Instagram para el hero. Los actuales sirven,
   pero la marca de agua ajena se nota.

### Medio impacto

4. **Unificar el fondo de las fotos por categoría** (por ejemplo, todas las de retrovisor
   dentro del carro). Da ritmo visual a la grilla.
5. **Reels verticales en el hero** en vez de la foto fija, con el video en silencio.
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
