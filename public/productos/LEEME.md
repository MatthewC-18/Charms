# Fotos de producto

Mientras no haya fotos reales, el sitio dibuja una ilustración SVG por cada modelo
(`src/components/PieceArt.tsx`). Para reemplazarla por una foto:

1. Guarda la imagen en esta carpeta, por ejemplo `columpio-01.jpg`.
2. Abre `src/data/products.ts` y agrega el campo `photo` al producto:

```ts
{
  id: 'p-cuadro-columpio',
  // ...
  photo: './productos/columpio-01.jpg',
}
```

## Recomendaciones para las fotos

- Formato: `.webp` de preferencia (o `.jpg` de buena calidad).
- Tamaño: 1200 × 800 px aproximadamente, orientación horizontal.
- Peso: menos de 250 KB por imagen para que el sitio cargue rápido.
- Encuadre: la pieza centrada, fondo neutro o del ambiente real (jardín, carro).
- Sin marcas de agua grandes ni capturas de Instagram con la interfaz visible.
- Nómbralas con el slug del producto para no perderse: `pareja-sobre-auto-retrovisor-01.webp`.

## Derechos

Usa solo fotos propias del taller. Si en la foto aparece una pieza con el nombre o el
rostro de un cliente, pide autorización antes de publicarla en el sitio.
