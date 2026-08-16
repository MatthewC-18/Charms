# Videos del taller

Reels y TikToks recomprimidos para web: 720p vertical, h264, con miniatura webp.
Los originales están en `assets-originales/videos/`.

## Agregar un video nuevo

1. Copia el original a `assets-originales/videos/`.
2. Agrega la entrada al mapa `videos` de `scripts/procesar-assets.mjs`, con el slug de
   salida y el segundo del que se saca la miniatura:

```js
'WhatsApp Video 2026-08-15 at 23.20.41': ['figura-dragon', 1],
```

3. Ejecuta (requiere ffmpeg en el PATH):

```bash
node scripts/procesar-assets.mjs videos assets-originales/videos
```

4. Enlázalo en `videos` dentro de `src/data/site.ts`. La sección "Así se hace" del
   inicio aparece sola cuando ese array tiene al menos un elemento.

## Criterios

- **Peso**: apunta a menos de 3 MB por video. Si uno queda muy pesado, súbele el `-crf`
  (32-34) o córtalo antes con `-t 15`.
- **Duración**: 10 a 20 segundos. Los tutoriales largos van mejor en TikTok, no en el sitio.
- **Sin autoplay**: los videos cargan con `preload="none"` y solo se reproducen al tocarlos.
  Así el inicio no se vuelve lento en datos móviles.
- **Marca de agua**: los clips traen la de TikTok/Instagram. Si consigues los originales
  sin marca, mejor: se ven más limpios en el sitio.

## Nota sobre personajes de terceros

Dos de los videos muestran piezas basadas en personajes con derechos de autor (Mario,
Shenlong). Ya están publicados en el TikTok de la marca, así que se mantienen como muestra
de técnica, pero conviene **no** convertirlos en producto de catálogo con precio fijo.
