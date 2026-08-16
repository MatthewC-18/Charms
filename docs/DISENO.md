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

### Utilidades de fondo

- `.bg-tornasol` — degradado turquesa → lila → rosa. Para heroes y bloques de cierre.
- `.bg-escamas` — patrón sutil de escamas de la cola. Para la galería.
- `bg-ink-900` — bloque marino, para la sección corporativa (contrasta con el resto).

## 2. Tipografía

- **Baloo 2** (800) para títulos: redondeada, coincide con el lettering del logo.
- **Nunito** para texto corrido: legible, con buen soporte de acentos en español.
- Ambas cargan desde Google Fonts en `index.html`.

## 3. Mascota

El avatar 3D de la dueña es la mascota del sitio. Detalles de uso y archivos en
`public/marca/LEEME.md`.

Criterios:

- **Una sola mascota por pantalla.** Si aparece en todos lados deja de ser simpática.
- Se usa donde hay que dar confianza o guiar: hero, envíos, pagos, cierre del cotizador,
  estado vacío del catálogo.
- **No** se usa dentro de las tarjetas de producto ni en la ficha: ahí manda la pieza.
- La versión "limpia" (sin texto dibujado) permite cambiar el mensaje desde el código.
- La animación es leve (`anim-saludo`, `anim-float-slow`) y se desactiva sola con
  `prefers-reduced-motion`.

## 4. Fotografía

Las fotos del taller son el activo más fuerte del sitio: fondo real (jardín, carro,
pared), pieza en mano, marca de agua propia. Se recortan en 1:1 en el catálogo.

Evitar mezclar fotos con las ilustraciones SVG dentro de una misma fila cuando se pueda:
la foto siempre gana y la ilustración se ve como un hueco. Las ilustraciones quedan
solo en los modelos que aún no tienen foto (tazas, llaveros, casita, grupo, corazón).

---

## 5. Recomendaciones pendientes

Ordenadas por lo que más mueve la aguja.

### Alto impacto

1. **Fotos de las 5 categorías que faltan** (tazas, llaveros, porta llaves, cuadro casita,
   cuadro de grupo). Hoy se dibujan; con foto el catálogo queda 100 % real.
2. **Foto de la dueña trabajando** (manos modelando, taller). El "hecho a mano" se
   demuestra con una foto de proceso; la mascota lo insinúa, la foto lo prueba.
3. **Un video corto de 10-15 s** del proceso en el hero o en "Cómo funciona". Ya existe
   material en los reels de Instagram.
4. **Fotos en contexto**, no solo en mano: el cuadro colgado en una pared, la pieza en el
   retrovisor de un carro real. Ayuda a imaginar el regalo puesto.

### Medio impacto

5. **Unificar el fondo de las fotos por categoría** (por ejemplo, todas las de retrovisor
   dentro del carro). Da ritmo visual a la grilla.
6. **Micro-animación al hacer scroll** (aparecer suave de tarjetas). Con moderación.
7. **Modo de contraste alto**: si la dueña quiere aún más pastel, subir la saturación solo
   en botones y precios para que no se pierdan.
8. **Segundo tipo de tarjeta** para el catálogo cuando haya más de 30 modelos: grilla más
   compacta, con filtro fijo lateral.

### Detalles finos

9. Marca de agua propia en tamaño consistente (algunas fotos la tienen grande, otras
   pequeña).
10. Favicon: hoy usa el logo cuadrado con fondo turquesa; se ve bien, pero una versión
    solo con la cola (sin fondo) se lee mejor en pestañas pequeñas.
11. Definir el **nombre de la mascota**. Hoy se la nombra como "la artista de Charms".
    Si tiene nombre propio, el sitio gana personalidad de golpe.

### Lo que conviene NO hacer

- No poner el texto en turquesa o lila sobre blanco: se pierde.
- No usar rojo fuera de los corazones: compite con la marca.
- No llenar de degradados; el tornasol funciona porque se usa en pocos bloques.
