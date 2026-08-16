# Marca y mascota

## Logo

| Archivo | Uso |
|---|---|
| `logo-charms-transparente.webp` | Lockup completo (cola + palabra). Header y footer. |
| `logo-charms.webp` | Versión cuadrada con fondo turquesa, tipo avatar de Instagram. |
| `logo-charms.png` | Igual que la anterior, para favicon y apple-touch-icon. |

Original: `assets-originales/fotos/SaveClip.App_553591692_*.jpg`.

## Mascota

Es el avatar 3D de la dueña del taller. Cada sticker existe en dos versiones:

| Variante | Con texto | Sin texto | Dónde se usa |
|---|---|---|---|
| `hola` | `mascota-hola.webp` | `mascota-hola-limpio.webp` | Hero, contacto, catálogo vacío |
| `listo` | `mascota-listo.webp` | `mascota-listo-limpio.webp` | Cierre del cotizador, CTA final |
| `camino` | `mascota-camino.webp` | `mascota-camino-limpio.webp` | Sección de envíos |
| `pago` | `mascota-pago.webp` | `mascota-pago-limpio.webp` | Sección de formas de pago |

En código se usa el componente `<Mascota variant="hola" burbuja="…" />`
(`src/components/Mascota.tsx`). Sin `conTexto` toma la versión limpia, que permite
escribir el mensaje en HTML y cambiarlo cuando quieras.

## Regenerar los archivos

```bash
node scripts/procesar-assets.mjs mascota assets-originales/dueña
node scripts/procesar-assets.mjs logo assets-originales/fotos/SaveClip.App_553591692_18069330506186416_7641432740049678965_n.jpg
```

El script quita el fondo blanco/turquesa, recorta el sobrante y exporta webp.
Si un recorte deja cortada una mano, ajusta el valor `recorteTexto` de esa variante
dentro del script.

## Nuevas poses

Si la dueña genera más stickers (por ejemplo "En producción", "Gracias por tu compra",
"Últimos cupos"), guárdalos en `assets-originales/dueña/`, agrégalos al mapa del script
y suma la variante en `MascotaVariant`.
