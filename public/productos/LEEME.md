# Fotos de producto

Las fotos reales del taller viven en esta carpeta en formato `.webp`, ya optimizadas.
Los originales sin procesar están en `assets-originales/fotos/`.

## Agregar fotos nuevas

1. Copia los originales a `assets-originales/fotos/`.
2. Agrega el nombre del archivo y el slug de destino en el mapa `fotos` de
   `scripts/procesar-assets.mjs`.
3. Ejecuta el procesamiento (redimensiona a 1200 px y convierte a webp):

```bash
node scripts/procesar-assets.mjs fotos assets-originales/fotos
```

4. Enlaza la foto en `src/data/products.ts`:

```ts
{
  id: 'p-cuadro-columpio',
  // ...
  photo: './productos/cuadro-columpio-pareja.webp',
  gallery: ['./productos/cuadro-columpio-familia.webp'],
}
```

5. Si quieres que aparezca en la sección "Piezas que ya entregamos" del inicio,
   agrégala también a `galeria` en `src/data/site.ts`.

## Recomendaciones para las fotos

- Encuadre cuadrado o vertical: las tarjetas del catálogo recortan a 1:1.
- La pieza centrada, con fondo real (jardín, carro, pared) — se ve mejor que fondo blanco.
- Buena luz natural, sin flash directo.
- La marca de agua de Charms puede quedarse; da confianza y evita robos de foto.
- Nombra los archivos con el slug del producto: `cuadro-columpio-pareja.webp`.

## Derechos

Usa solo fotos propias del taller. Si en la foto aparece el nombre o el rostro de un
cliente (muy común en estas piezas), pide autorización antes de publicarla.
