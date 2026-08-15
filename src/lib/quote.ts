import { logistics } from '../data/site'
import type { Product } from '../data/products'

/**
 * Motor de cotización referencial.
 * Los valores son estimados: el precio final siempre se confirma por WhatsApp
 * después del boceto. Cambiar montos aquí y en data/products.ts.
 */

export interface AddOn {
  id: string
  label: string
  price: number
  hint?: string
}

export const addOns: AddOn[] = [
  { id: 'frase', label: 'Frase o dedicatoria en banderín', price: 5, hint: 'Hasta 60 caracteres' },
  { id: 'fondo', label: 'Fondo personalizado (paisaje, ciudad, foto)', price: 9 },
  { id: 'led', label: 'Luces LED en la base o el marco', price: 14 },
  { id: 'logo', label: 'Logotipo modelado en relieve', price: 12, hint: 'Ideal para empresas' },
  { id: 'caja', label: 'Caja de regalo con lazo', price: 6 },
  { id: 'tarjeta', label: 'Tarjeta escrita a mano', price: 2 },
]

export interface QuoteInput {
  product: Product
  figures: number
  pets: number
  addOnIds: string[]
  rush: boolean
  shippingZone: string
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
  shipping: number
  total: number
  deposit: number
  unitPrice: number
  volumeDiscount: number
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
  const { product, figures, pets, addOnIds, rush, shippingZone, units } = input

  const lines: QuoteLine[] = [
    {
      label: `${product.name} (incluye ${product.figuresIncluded} ${
        product.figuresIncluded === 1 ? 'figura' : 'figuras'
      })`,
      amount: product.priceFrom,
    },
  ]

  const extraFigures = Math.max(0, figures - product.figuresIncluded)
  if (extraFigures > 0) {
    lines.push({
      label: `${extraFigures} figura(s) adicional(es) × $${product.extraFigure}`,
      amount: extraFigures * product.extraFigure,
    })
  }

  if (pets > 0 && product.extraPet > 0) {
    lines.push({
      label: `${pets} mascota(s) × $${product.extraPet}`,
      amount: pets * product.extraPet,
    })
  }

  for (const id of addOnIds) {
    const add = addOns.find((a) => a.id === id)
    if (add) lines.push({ label: add.label, amount: add.price })
  }

  const unitBase = lines.reduce((sum, l) => sum + l.amount, 0)
  const discountPct = volumeDiscountPct(units)
  const volumeDiscount = round2((unitBase * units * discountPct) / 100)
  const subtotal = round2(unitBase * units - volumeDiscount)

  const rushFee = rush ? round2((subtotal * logistics.rushSurchargePct) / 100) : 0
  const shipping = logistics.shipping.find((s) => s.zone === shippingZone)?.price ?? 0
  const total = round2(subtotal + rushFee + shipping)

  return {
    lines,
    subtotal,
    rushFee,
    shipping,
    total,
    deposit: round2((total * logistics.depositPct) / 100),
    unitPrice: round2(unitBase),
    volumeDiscount,
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
}) {
  const l = [
    '¡Hola Charms! 👋 Quiero cotizar una pieza:',
    '',
    `*Producto:* ${input.product.name}`,
    `*Figuras:* ${input.figures}${input.pets ? ` · *Mascotas:* ${input.pets}` : ''}`,
    input.units > 1 ? `*Cantidad:* ${input.units} unidades` : null,
    input.addOnIds.length
      ? `*Extras:* ${input.addOnIds
          .map((id) => addOns.find((a) => a.id === id)?.label)
          .filter(Boolean)
          .join(', ')}`
      : null,
    input.rush ? '*Entrega express:* sí' : null,
    `*Envío:* ${input.shippingZone}`,
    extra.occasion ? `*Ocasión:* ${extra.occasion}` : null,
    extra.deadline ? `*La necesito para:* ${extra.deadline}` : null,
    extra.notes ? `*Detalles:* ${extra.notes}` : null,
    '',
    `*Estimado del sitio web:* ${money(quote.total)} (referencial)`,
    extra.name ? `*Mi nombre:* ${extra.name}` : null,
    '',
    'Ya tengo las fotos listas para enviarles. 📸',
  ]
  return l.filter(Boolean).join('\n')
}
