# Charms Ecuador — estrategia del sitio

Documento de trabajo. Sirve para dos cosas: guiar el desarrollo y sustentar la propuesta al cliente.

---

## 1. Qué se ve en el Instagram (diagnóstico)

Lo observado en `@charms.ecuador` (942 publicaciones, 17 mil seguidores):

| Señal | Lectura |
|---|---|
| Todo pedido pasa por WhatsApp (link en bio) | El sitio **no necesita carrito**: necesita llevar el pedido armado al chat |
| Destacados: *Para retrovisor · Figuras en 4D · Clientes felices · Porta llaves · Tazas* | Esas son las categorías reales del negocio, no hay que inventarlas |
| Cada pieza lleva nombre, fecha o frase | La personalización es el producto; el formato es solo el soporte |
| Aparecen empresas (PRONACA 20 años, uniformes institucionales) | Hay una línea **B2B** que vale más por ticket y por volumen |
| Muchas piezas de profesiones (médico, militar, abogada, comandante) | Nicho fuerte: grados, ascensos, jubilaciones |
| Mascotas presentes en cuadros familiares | Es un *upsell* natural, no un producto aparte |
| Reels con el proceso (masa, modelado) | El "hecho a mano" es el diferencial emocional: hay que mostrarlo, no solo decirlo |

**Problemas que resuelve el sitio:**

1. Instagram no responde "cuánto cuesta" ni "en cuánto tiempo llega" — y esa es la primera pregunta de todos.
2. El feed no está ordenado por categoría ni por ocasión: el cliente no encuentra lo que busca.
3. Los chats empiezan desde cero cada vez ("¿qué quieres?", "¿cuántas figuras?", "¿para cuándo?").
4. No hay presencia buscable en Google. Hoy solo llega quien ya conoce la cuenta.

---

## 2. Decisión de arquitectura: WhatsApp-first

**No se construye e-commerce con carrito.** Cada pieza es a medida, el precio depende de figuras,
mascotas y extras, y siempre hay una conversación con fotos de por medio. Un checkout tradicional
agregaría fricción y devoluciones.

El sitio hace de **filtro y formulario**: educa, muestra precios de referencia, arma la configuración
y entrega al taller un mensaje de WhatsApp con todo escrito. El chat sigue siendo el cierre, pero
empieza en el minuto 5 de la conversación en vez del minuto 0.

Ventaja secundaria: cero backend, cero base de datos, cero costo mensual de hosting.

---

## 3. Lo que ya está construido (v1)

- **Home** con propuesta de valor, categorías, más pedidos, proceso de 6 pasos, ocasiones,
  diferenciadores, testimonios, bloque corporativo y FAQ.
- **Catálogo** de 18 modelos en 6 categorías, con filtros por categoría, ocasión, búsqueda y orden.
- **Ficha de producto** con precio base, costo de figura/mascota adicional, medidas y ocasiones.
- **Cotizador de 4 pasos** con estimado en vivo: figuras, mascotas, cantidad, extras, express,
  zona de envío, descuento por volumen, anticipo del 50% y vista previa del mensaje.
- **Empresas**: casos de uso, tabla de descuentos por volumen y formulario de solicitud.
- **Cómo funciona**: proceso, qué fotos enviar, tiempos, envíos, pagos, cuidados y FAQ completo.
- **Contacto** con todos los canales y formulario que abre WhatsApp.
- **Identidad real aplicada**: logo de la cola de sirena, paleta pastel tornasol tomada
  del logo y el avatar 3D de la dueña como mascota del sitio (ver `DISENO.md`).
- **10 fotos reales** del taller en catálogo, fichas y galería de inicio.
- Ilustraciones SVG propias como respaldo en los 8 modelos que aún no tienen foto.

---

## 4. Ideas priorizadas (qué sigue)

Ordenadas por impacto sobre esfuerzo.

### Prioridad alta — antes de mostrarlo como sitio en producción

| Idea | Por qué | Esfuerzo |
|---|---|---|
| **Fotos de las 5 categorías que faltan** (tazas, llaveros, porta llaves, casita, grupo) | Ya hay 10 fotos reales cargadas; con estas el catálogo queda 100 % real | Bajo (del cliente) |
| **Galería "Clientes felices"** con reacciones reales | El destacado que más mira la gente en su IG | Bajo |
| **Validar precios y tiempos** con la dueña | Todo el cotizador depende de estos números | Bajo |
| **SEO local**: `schema.org` LocalBusiness + Product, títulos por página, sitemap | Para aparecer en "regalos personalizados Quito", "porcelana fría Ecuador" | Medio |
| **Ficha de Google Business** enlazada desde el sitio | Búsquedas con intención de compra local | Bajo |
| **Analítica** (Plausible o GA4) con evento en cada clic a WhatsApp | Sin esto no se sabe si el sitio funciona | Bajo |
| **Términos, privacidad y política de cambios** | Piezas a medida: conviene dejar por escrito qué sí y qué no se corrige | Bajo |

### Prioridad media — segunda versión

| Idea | Por qué |
|---|---|
| **Landings estacionales** (Día de la Madre, Navidad, San Valentín, grados) con cuenta regresiva y fecha límite de pedido | El negocio es estacional; una landing por temporada concentra la campaña de Instagram |
| **Cupos por semana** ("quedan 3 espacios para entregar antes del 10 de mayo") | Genera urgencia real y evita sobreventa en temporada alta |
| **Seguimiento de pedido** en `/pedido/:codigo` con estados: boceto → modelado → pintura → empaque → enviado | Elimina el "¿cómo va mi pedido?" que consume horas de chat |
| **Previsualización del personaje** en el cotizador (piel, cabello, ropa) que genera una imagen de referencia adjuntable al chat | Convierte el cotizador en algo que la gente comparte; reduce vueltas en el boceto |
| **Link de pago del anticipo** (Payphone, Kushki, De Una) | Cobrar el 50% en el momento en que el cliente está decidido |
| **CMS liviano** (Decap CMS o una hoja de Google → JSON en el build) | Que la dueña suba fotos y cambie precios sin depender de un desarrollador |
| **WhatsApp Business** con catálogo, respuestas rápidas y etiquetas por estado | Ordena el otro lado del proceso, no solo el sitio |

### Prioridad baja — cuando el resto ya funcione

- Programa de referidos con código de descuento.
- Recordatorio de fechas: el cliente registra el cumpleaños o aniversario y recibe un aviso un mes antes.
- Notas de contenido ("qué regalar en un primer aniversario") para tráfico orgánico.
- Versión en inglés para ecuatorianos en el exterior que envían regalos a familia en el país.
- Renders 3D de las piezas (Blender) para mostrar ángulos que la foto no da.

---

## 5. Roadmap sugerido

**Sprint 1 — contenido real.** Reemplazar ilustraciones por fotos, validar precios y tiempos,
ajustar textos con la dueña, publicar en GitHub Pages con dominio propio.

**Sprint 2 — captación.** SEO local, schema, analítica, Google Business, primera landing estacional.

**Sprint 3 — operación.** Seguimiento de pedido, link de pago del anticipo, CMS para autogestión.

---

## 6. Cómo presentarlo al cliente

El argumento no es "te hago una página web". Es:

> Hoy respondes el mismo cuestionario en cada chat y aun así muchos no compran porque no saben el
> precio. El sitio responde eso solo, y te entrega el pedido escrito y completo. Tú te dedicas a
> modelar, no a repetir precios.

Tres números que ayudan a sustentar la propuesta y que conviene medir desde el primer mes:
clics a WhatsApp, cotizaciones completadas y ticket promedio del pedido que llega por el sitio.

**Referencia de alcance y precio (mercado ecuatoriano, 2026):**

| Alcance | Rango referencial |
|---|---|
| Landing de una página + WhatsApp | USD 250 – 400 |
| Sitio de catálogo + cotizador (lo que ya está construido) | USD 600 – 900 |
| Lo anterior + CMS + pagos + seguimiento de pedido | USD 1.200 – 1.800 |
| Mantenimiento y cambios de temporada | USD 40 – 80 / mes |

Estos rangos son una referencia interna para negociar, no una cotización cerrada. Ajustar según
cuánto contenido entregue el cliente y qué tan seguido pida cambios.

---

## 7. Por confirmar con la dueña del negocio

- [ ] Precios reales por modelo y por figura adicional (hoy son estimaciones de mercado).
- [ ] Tiempos reales de producción normal y express.
- [ ] Costos de envío y courier con el que trabaja.
- [ ] Correo de contacto y si emite factura.
- [ ] Ciudad y modalidad del taller (¿recibe visitas con cita?).
- [ ] Autorización para publicar fotos donde aparecen nombres de clientes.
- [ ] Testimonios reales (los actuales son de ejemplo y deben reemplazarse).
- [ ] Si quiere dominio propio (`charmsecuador.com` o similar) y quién lo paga.
