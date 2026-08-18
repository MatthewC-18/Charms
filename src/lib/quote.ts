import { logistics } from '../data/site'
import type { Product } from '../data/products'

/**
 * Motor de cotización referencial.
 *
 * Solo suma lo que el taller tiene tarifado: el precio "desde" de la pieza por
 * la cantidad, el descuento por volumen y el recargo express. Las figuras
 * adicionales y el envío NO se calculan aquí a propósito — se cotizan aparte,
 * porque dependen del boceto y del destino. Precios en `data/products.ts`.
 */

export interface QuoteInput {
  product: Product
  figures: number
  pets: number
  rush: boolean
  units: number
}

export interface QuoteLine {
  label: string
  amount: number
}

export interface QuoteResult {
  lines: QuoteLine[]
  subtotal: number
  rushFee: number
  total: number
  deposit: number
  unitPrice: number
  volumeDiscount: number
  /** Figuras pedidas por encima de las que trae la pieza: se cotizan aparte */
  extraFigures: number
}

/** Descuento por volumen para pedidos corporativos */
export const volumeDiscountPct = (units: number) => {
  if (units >= 100) return 20
  if (units >= 50) return 15
  if (units >= 25) return 10
  if (units >= 10) return 7
  return 0
}

export function buildQuote(input: QuoteInput): QuoteResult {
  const { product, figures, rush, units } = input

  const lines: QuoteLine[] = [
    {
      label: `${product.name} (incluye ${product.figuresIncluded} ${
        product.figuresIncluded === 1 ? 'figura' : 'figuras'
      })`,
      amount: product.priceFrom,
    },
  ]

  const unitBase = lines.reduce((sum, l) => sum + l.amount, 0)
  const discountPct = volumeDiscountPct(units)
  const volumeDiscount = round2((unitBase * units * discountPct) / 100)
  const subtotal = round2(unitBase * units - volumeDiscount)

  const rushFee = rush ? round2((subtotal * logistics.rushSurchargePct) / 100) : 0
  const total = round2(subtotal + rushFee)

  return {
    lines,
    subtotal,
    rushFee,
    total,
    deposit: round2((total * logistics.depositPct) / 100),
    unitPrice: round2(unitBase),
    volumeDiscount,
    extraFigures: Math.max(0, figures - product.figuresIncluded),
  }
}

export const round2 = (n: number) => Math.round(n * 100) / 100

export const money = (n: number) =>
  n.toLocaleString('es-EC', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

/** Arma el mensaje de WhatsApp con todo el detalle del pedido */
export function quoteToMessage(input: QuoteInput, quote: QuoteResult, extra: {
  name: string
  occasion: string
  deadline: string
  notes: string
  shippingZone: string
  /** Tonos elegidos en la vista previa 3D */
  apariencia?: string
}) {
  const l = [
    '¡Hola Charms! 👋 Quiero cotizar una pieza:',
    '',
    `*Producto:* ${input.product.name} (desde ${money(input.product.priceFrom)})`,
    `*Figuras:* ${input.figures}${input.pets ? ` · *Mascotas:* ${input.pets}` : ''}`,
    quote.extraFigures > 0 || input.pets > 0
      ? '_Las figuras y mascotas adicionales se cotizan aparte._'
      : null,
    input.units > 1 ? `*Cantidad:* ${input.units} unidades` : null,
    input.rush ? '*Entrega express:* sí' : null,
    extra.apariencia ? `*Referencia de la vista previa 3D:* ${extra.apariencia}` : null,
    `*Entrega:* ${extra.shippingZone} (el envío se cobra según destino)`,
    extra.occasion ? `*Ocasión:* ${extra.occasion}` : null,
    extra.deadline ? `*La necesito para:* ${extra.deadline}` : null,
    extra.notes ? `*Detalles:* ${extra.notes}` : null,
    '',
    `*Estimado del sitio web:* ${money(quote.total)} (referencial, sin envío)`,
    extra.name ? `*Mi nombre:* ${extra.name}` : null,
    '',
    'Ya tengo las fotos listas para enviarles. 📸',
  ]
  return l.filter(Boolean).join('\n')
}
