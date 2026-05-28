export type Lang = 'en' | 'es'

export interface Client {
  name: string; contact: string; loc: string; status: string; value: number; last: string
}

export interface Supplier {
  name: string; contact: string; loc: string; status: string; cat: string; lead: string
}

export interface Banner {
  id: string; title: { en: string; es: string }; body: { en: string; es: string }
  cta: { en: string; es: string }; status: string; schedule: string; stripe?: string
}

export interface CMSPage {
  id: string; title: { en: string; es: string }; status: string; updated: string; slug: string
}

export interface Product {
  id: string
  name: { en: string; es: string }
  sku: string
  cat: string
  catEs: string
  price: number
  stripe: string
  colorChip: string
  colors: string[]
  sizes: string[]
  material: string
  new?: boolean
  stock: Record<string, number>
  description?: string
}

export const PRODUCTS: Product[] = [
  { id: 'M-01', name: { en: "Architect's Coat", es: 'Abrigo del arquitecto' }, sku: 'MO-AC-001', cat: 'Outerwear', catEs: 'Abrigos', price: 1240, stripe: 'stripes-dark', colorChip: '#0a0a0a', colors: ['Ink', 'Stone'], sizes: ['S', 'M', 'L', 'XL'], material: 'Wool', new: true, stock: { XS: 0, S: 6, M: 8, L: 4, XL: 2 } },
  { id: 'M-02', name: { en: 'Pleated Trouser 04', es: 'Pantalón plisado 04' }, sku: 'MO-PT-004', cat: 'Trousers', catEs: 'Pantalones', price: 420, stripe: 'stripes-sand', colorChip: '#d9cdb6', colors: ['Bone', 'Olive'], sizes: ['XS', 'S', 'M', 'L'], material: 'Wool', stock: { XS: 3, S: 9, M: 11, L: 7, XL: 0 } },
  { id: 'M-03', name: { en: 'Bone Cashmere Crew', es: 'Crew cachemir hueso' }, sku: 'MO-CC-007', cat: 'Knitwear', catEs: 'Punto', price: 540, stripe: 'stripes', colorChip: '#e8e4dc', colors: ['Bone'], sizes: ['S', 'M', 'L'], material: 'Cashmere', new: true, stock: { XS: 0, S: 5, M: 7, L: 5, XL: 0 } },
  { id: 'M-04', name: { en: 'Rust Workshop Shirt', es: 'Camisa de taller óxido' }, sku: 'MO-WS-012', cat: 'Shirts', catEs: 'Camisas', price: 320, stripe: 'stripes-rust', colorChip: '#c0432a', colors: ['Rust'], sizes: ['XS', 'S', 'M', 'L', 'XL'], material: 'Cotton', stock: { XS: 4, S: 8, M: 10, L: 6, XL: 3 } },
  { id: 'M-05', name: { en: 'Field Olive Parka', es: 'Parka de campo oliva' }, sku: 'MO-FP-002', cat: 'Outerwear', catEs: 'Abrigos', price: 980, stripe: 'stripes-olive', colorChip: '#6e6f4f', colors: ['Olive'], sizes: ['M', 'L', 'XL'], material: 'Cotton', stock: { XS: 0, S: 0, M: 4, L: 3, XL: 2 } },
  { id: 'M-06', name: { en: 'Mason Linen Suit', es: 'Traje de lino albañil' }, sku: 'MO-MS-009', cat: 'Tailoring', catEs: 'Sastrería', price: 1480, stripe: 'stripes-stone', colorChip: '#b8b5ad', colors: ['Stone', 'Bone'], sizes: ['S', 'M', 'L'], material: 'Linen', stock: { XS: 0, S: 2, M: 3, L: 2, XL: 0 } },
  { id: 'M-07', name: { en: 'Navy Reefer Jacket', es: 'Chaqueta marinera marino' }, sku: 'MO-RJ-003', cat: 'Outerwear', catEs: 'Abrigos', price: 860, stripe: 'stripes-navy', colorChip: '#1f2b3e', colors: ['Navy'], sizes: ['S', 'M', 'L', 'XL'], material: 'Wool', stock: { XS: 0, S: 5, M: 6, L: 4, XL: 1 } },
  { id: 'M-08', name: { en: 'Studio Leather Derby', es: 'Derby de cuero estudio' }, sku: 'MO-LD-005', cat: 'Footwear', catEs: 'Calzado', price: 720, stripe: 'stripes-dark', colorChip: '#0a0a0a', colors: ['Ink'], sizes: ['S', 'M', 'L'], material: 'Leather', stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 } },
  { id: 'M-09', name: { en: 'Quarry Knit Vest', es: 'Chaleco punto cantera' }, sku: 'MO-QV-011', cat: 'Knitwear', catEs: 'Punto', price: 380, stripe: 'stripes-stone', colorChip: '#a8a59c', colors: ['Stone'], sizes: ['S', 'M', 'L', 'XL'], material: 'Wool', stock: { XS: 0, S: 4, M: 6, L: 5, XL: 3 } },
  { id: 'M-10', name: { en: 'Plaster Cotton Tee', es: 'Camiseta algodón yeso' }, sku: 'MO-PT-010', cat: 'Shirts', catEs: 'Camisas', price: 180, stripe: 'stripes', colorChip: '#fafaf7', colors: ['Bone'], sizes: ['XS', 'S', 'M', 'L', 'XL'], material: 'Cotton', stock: { XS: 8, S: 14, M: 18, L: 10, XL: 6 } },
  { id: 'M-11', name: { en: 'Drafted Wide Trouser', es: 'Pantalón ancho dibujado' }, sku: 'MO-DW-013', cat: 'Trousers', catEs: 'Pantalones', price: 460, stripe: 'stripes-dark', colorChip: '#0a0a0a', colors: ['Ink'], sizes: ['XS', 'S', 'M', 'L'], material: 'Wool', new: true, stock: { XS: 2, S: 7, M: 9, L: 5, XL: 0 } },
  { id: 'M-12', name: { en: 'Atelier Double-Breasted', es: 'Doble botonadura atelier' }, sku: 'MO-AD-006', cat: 'Tailoring', catEs: 'Sastrería', price: 1620, stripe: 'stripes-navy', colorChip: '#1f2b3e', colors: ['Navy', 'Ink'], sizes: ['M', 'L', 'XL'], material: 'Wool', stock: { XS: 0, S: 0, M: 2, L: 3, XL: 1 } },
]

export const ORDERS = [
  { id: 'MO-58210', date: '2026-05-12', items: 3, total: 1740, status: 'intransit', piece: "Architect's Coat + 2" },
  { id: 'MO-58041', date: '2026-04-28', items: 1, total: 540, status: 'delivered', piece: 'Bone Cashmere Crew' },
  { id: 'MO-57902', date: '2026-04-14', items: 2, total: 740, status: 'delivered', piece: 'Workshop Shirt + 1' },
  { id: 'MO-57755', date: '2026-03-30', items: 1, total: 420, status: 'delivered', piece: 'Pleated Trouser 04' },
  { id: 'MO-57612', date: '2026-03-09', items: 4, total: 2180, status: 'delivered', piece: 'Mason Linen Suit + 3' },
  { id: 'MO-57498', date: '2026-02-22', items: 1, total: 320, status: 'returned', piece: 'Rust Workshop Shirt' },
]

export const LIVE_ORDERS = [
  { id: 'MO-58319', who: 'K. Almeida · Porto', amount: 1240, t: '00:02' },
  { id: 'MO-58318', who: 'S. Watanabe · Kyoto', amount: 540, t: '00:11' },
  { id: 'MO-58317', who: 'M. Ferrer · Barcelona', amount: 860, t: '00:24' },
  { id: 'MO-58316', who: 'J. Lindqvist · Malmö', amount: 320, t: '00:38' },
  { id: 'MO-58315', who: 'R. Okafor · Lagos', amount: 1620, t: '01:02' },
  { id: 'MO-58314', who: 'E. Bauer · Zürich', amount: 420, t: '01:14' },
]

export const CLIENTS = [
  { name: 'Kiyomi Tanaka', contact: 'k.tanaka@studio.jp', loc: 'Tokyo, JP', status: 'VIP', value: 18420, last: '2026-05-12' },
  { name: 'Mateo Ferrer', contact: 'mateo@ferrer.cat', loc: 'Barcelona, ES', status: 'Active', value: 6240, last: '2026-05-08' },
  { name: 'Olivia Bauer', contact: 'olivia.b@arch.ch', loc: 'Zürich, CH', status: 'VIP', value: 22180, last: '2026-05-04' },
  { name: 'Rashid Okafor', contact: 'rashid@okafor.studio', loc: 'Lagos, NG', status: 'Active', value: 4980, last: '2026-04-29' },
  { name: 'Helena Quintana', contact: 'h.quintana@correo.mx', loc: 'CDMX, MX', status: 'Lapsed', value: 1740, last: '2025-11-02' },
  { name: 'Lukas Lindqvist', contact: 'lukas@malmo.se', loc: 'Malmö, SE', status: 'Active', value: 3320, last: '2026-05-01' },
  { name: 'Sara Watanabe', contact: 'sara@watanabe.kyoto', loc: 'Kyoto, JP', status: 'VIP', value: 14620, last: '2026-05-14' },
  { name: 'Diego Almeida', contact: 'd.almeida@porto.pt', loc: 'Porto, PT', status: 'Active', value: 5180, last: '2026-05-10' },
]

export const SUPPLIERS = [
  { name: 'Casa de Lã, Bragança', contact: 'p.dias@casadela.pt', loc: 'Bragança, PT', status: 'Active', cat: 'Wool', lead: '21 d' },
  { name: 'Filature Roubaix', contact: 'claire@roubaix.fr', loc: 'Roubaix, FR', status: 'Active', cat: 'Cashmere', lead: '34 d' },
  { name: 'Conceria Toscana', contact: 'info@concitos.it', loc: 'Pisa, IT', status: 'Active', cat: 'Leather', lead: '28 d' },
  { name: 'Linho do Alentejo', contact: 'vendas@linho.pt', loc: 'Évora, PT', status: 'Onboarding', cat: 'Linen', lead: '18 d' },
  { name: 'Mühlbach Spinnerei', contact: 'info@muhl.de', loc: 'Augsburg, DE', status: 'Active', cat: 'Wool', lead: '24 d' },
  { name: 'Cotonificio Padano', contact: 'rete@cotpad.it', loc: 'Cremona, IT', status: 'Paused', cat: 'Cotton', lead: '—' },
]

export const BANNERS = [
  { id: 'B-01', title: { en: 'SS/26 — On the floor', es: 'PV/26 — En el suelo' }, body: { en: 'Twenty-three pieces. One language. Live on the 14th.', es: 'Veintitrés piezas. Un lenguaje. Activo el 14.' }, cta: { en: 'Enter', es: 'Entrar' }, status: 'live', schedule: '2026-05-14' },
  { id: 'B-02', title: { en: 'The Field Parka', es: 'La parka de campo' }, body: { en: 'Re-issued in oiled cotton. Limited run of 80.', es: 'Reedición en algodón engrasado. Tirada limitada de 80.' }, cta: { en: 'Reserve', es: 'Reservar' }, status: 'scheduled', schedule: '2026-06-02' },
  { id: 'B-03', title: { en: 'Atelier Hours', es: 'Horario de atelier' }, body: { en: 'Lisboa flagship now open Sundays.', es: 'Tienda insignia de Lisboa abierta los domingos.' }, cta: { en: 'Visit', es: 'Visitar' }, status: 'draft', schedule: '—' },
]

export const PAGES_CMS: CMSPage[] = [
  { id: 'P-01', title: { en: 'About the atelier', es: 'Sobre el atelier' }, status: 'live', updated: '2026-04-19', slug: '/about' },
  { id: 'P-02', title: { en: 'Press & coverage', es: 'Prensa' }, status: 'live', updated: '2026-03-02', slug: '/press' },
  { id: 'P-03', title: { en: 'Sustainability', es: 'Sostenibilidad' }, status: 'draft', updated: '2026-05-09', slug: '/sustainability' },
  { id: 'P-04', title: { en: 'Sizing & fit', es: 'Tallas y corte' }, status: 'live', updated: '2026-02-14', slug: '/sizing' },
]

export const POLICIES: CMSPage[] = [
  { id: 'L-01', title: { en: 'Shipping & returns', es: 'Envíos y devoluciones' }, status: 'live', updated: '2026-05-01', slug: '/shipping' },
  { id: 'L-02', title: { en: 'Privacy', es: 'Privacidad' }, status: 'live', updated: '2026-04-22', slug: '/privacy' },
  { id: 'L-03', title: { en: 'Terms of service', es: 'Términos del servicio' }, status: 'live', updated: '2026-04-22', slug: '/terms' },
  { id: 'L-04', title: { en: 'Cookies', es: 'Cookies' }, status: 'draft', updated: '2026-05-18', slug: '/cookies' },
]

export const NEWSLETTERS: CMSPage[] = [
  { id: 'N-01', title: { en: 'Issue No. 12 — On weight & drape', es: 'Número 12 — Peso y caída' }, status: 'live', updated: '2026-05-04', slug: '/newsletter/12' },
  { id: 'N-02', title: { en: 'Issue No. 13 — The Field Parka', es: 'Número 13 — La parka de campo' }, status: 'scheduled', updated: '2026-06-02', slug: '/newsletter/13' },
]

export const PAYMENT_METHODS = [
  { id: 'card', name: 'Card payments', desc: { en: 'Visa, Mastercard, Amex via Stripe', es: 'Visa, Mastercard, Amex vía Stripe' }, on: true },
  { id: 'paypal', name: 'PayPal', desc: { en: 'Buy now, pay in 3', es: 'Compra ahora, paga en 3' }, on: true },
  { id: 'klarna', name: 'Klarna', desc: { en: 'Instalments at checkout', es: 'Plazos en la caja' }, on: true },
  { id: 'apple', name: 'Apple Pay', desc: { en: 'One-tap on iOS & macOS', es: 'Un toque en iOS y macOS' }, on: false },
  { id: 'google', name: 'Google Pay', desc: { en: 'One-tap on Android & web', es: 'Un toque en Android y web' }, on: false },
  { id: 'wire', name: 'Bank transfer', desc: { en: 'For orders over €2,000', es: 'Para pedidos superiores a 2.000 €' }, on: true },
]

export const REVENUE_SERIES = [12, 18, 15, 22, 28, 24, 31, 29, 34, 30, 38, 42, 45, 40, 48, 52, 49, 58, 62, 55, 64, 71, 68, 74, 79, 82, 88, 84, 92, 98]
export const TRAFFIC_SERIES = [4200, 5100, 4800, 6300, 5900, 7400, 7100]

export const SOCIAL_THREADS = [
  { id: 'T-2114', channel: 'ig', name: 'Kiyomi Tanaka', handle: '@kiyomi.t', avatar: 'stripes-dark', last: "Could you reserve the Architect's Coat in size M? I'll collect Friday in Lisboa.", time: '00:04', unread: 2, priority: true, status: 'open', productRef: 'M-01', messages: [{ who: 'them', at: '10:21', text: 'Hola. I just saw the SS/26 drop on your story.' }, { who: 'them', at: '10:22', text: "Could you reserve the Architect's Coat in size M? I'll collect Friday in Lisboa." }, { who: 'us', at: '10:24', text: 'Of course, Kiyomi. Reserved for you under your client number. Bring your ID at pickup.' }, { who: 'them', at: '10:30', text: 'Perfect. Any chance you also have the Quarry Vest in S?' }] },
  { id: 'T-2113', channel: 'wa', name: 'Mateo Ferrer', handle: '+34 612 994 008', avatar: 'stripes-sand', last: "Tracking says delivered but I can't find the package — can you check?", time: '00:12', unread: 1, priority: true, status: 'open', orderRef: 'MO-58041', messages: [{ who: 'them', at: '11:02', text: "Tracking says delivered but I can't find the package — can you check?" }, { who: 'us', at: '11:04', text: 'Let me pull up MO-58041 right now. One moment.' }] },
  { id: 'T-2112', channel: 'ig', name: 'Olivia Bauer', handle: '@olivia.bauer', avatar: 'stripes-stone', last: 'Reel saved 🤍', time: '00:38', unread: 0, status: 'open', messages: [{ who: 'them', at: 'Yesterday', text: 'Reel saved 🤍' }] },
  { id: 'T-2111', channel: 'wa', name: 'Rashid Okafor', handle: '+234 803 412 7700', avatar: 'stripes-rust', last: 'Could you ship the Mason suit DDP to Lagos?', time: '01:14', unread: 0, status: 'open', productRef: 'M-06', messages: [{ who: 'them', at: '08:40', text: 'Could you ship the Mason suit DDP to Lagos?' }, { who: 'us', at: '09:02', text: 'Yes — DDP all-in to LOS is €58. ETA 7-10 days. Want me to draft the quote?' }, { who: 'them', at: '09:12', text: 'Please.' }] },
  { id: 'T-2110', channel: 'ig', name: 'Lukas Lindqvist', handle: '@l.lindqvist', avatar: 'stripes-navy', last: 'Will the Pleated 04 restock in XL?', time: '02:48', unread: 0, status: 'open', productRef: 'M-02', messages: [{ who: 'them', at: 'Mon', text: 'Will the Pleated 04 restock in XL?' }, { who: 'us', at: 'Mon', text: "We're cutting another 12 pairs at the atelier — XL drops May 28. I'll ping you." }] },
  { id: 'T-2109', channel: 'wa', name: 'Sara Watanabe', handle: '+81 90 1284 6602', avatar: 'stripes-olive', last: 'Thank you, the parka arrived perfectly.', time: 'Yesterday', unread: 0, status: 'resolved', messages: [{ who: 'them', at: 'Yesterday', text: 'Thank you, the parka arrived perfectly.' }, { who: 'us', at: 'Yesterday', text: 'Wonderful. Wear it well, Sara.' }] },
  { id: 'T-2107', channel: 'wa', name: 'Diego Almeida', handle: '+351 96 882 1004', avatar: 'stripes', last: 'Atelier hours on Sunday?', time: '3 days', unread: 0, status: 'resolved', messages: [{ who: 'them', at: 'Fri', text: 'Atelier hours on Sunday?' }, { who: 'us', at: 'Fri', text: '11h–17h, by appointment. Want me to book you in?' }] },
]

export const SOCIAL_KPIS = { igReach30d: 128400, igEngagement: 9.4, waOpenRate: 86.2, waCTR: 14.1, scheduled: 9, unread: 3, followersIG: 42180, subscribersWA: 3840, attributed30d: 62420 }

export const SOCIAL_POSTS = [
  { id: 'P-01', channel: 'ig', format: 'Feed', title: { en: "Architect's Coat — campaign still", es: 'Abrigo del arquitecto — pieza de campaña' }, when: 'May 22 · 09:00', status: 'scheduled', reach: null, stripe: 'stripes-dark', product: 'M-01' },
  { id: 'P-02', channel: 'ig', format: 'Story', title: { en: 'Behind the cutting room', es: 'Detrás de la sala de corte' }, when: 'May 22 · 18:00', status: 'scheduled', reach: null, stripe: 'stripes-stone', product: null },
  { id: 'P-03', channel: 'wa', format: 'Broadcast', title: { en: 'VIP early access — Capsule 04', es: 'Acceso VIP — Cápsula 04' }, when: 'May 23 · 11:00', status: 'scheduled', reach: null, stripe: 'stripes-rust', product: null },
  { id: 'P-04', channel: 'ig', format: 'Reel', title: { en: 'Field Parka in oiled cotton', es: 'Parka de campo en algodón engrasado' }, when: 'May 24 · 12:00', status: 'draft', reach: null, stripe: 'stripes-olive', product: 'M-05' },
  { id: 'P-05', channel: 'ig', format: 'Feed', title: { en: 'Bone cashmere · close-up', es: 'Cachemir hueso · primer plano' }, when: 'May 20 · 09:00', status: 'live', reach: 18420, stripe: 'stripes', product: 'M-03' },
  { id: 'P-06', channel: 'wa', format: 'Broadcast', title: { en: 'Atelier Sundays — appointments', es: 'Domingos de atelier — citas' }, when: 'May 18 · 10:00', status: 'live', reach: 3120, stripe: 'stripes-sand', product: null },
  { id: 'P-07', channel: 'ig', format: 'Story', title: { en: 'Capsule 04 unboxing', es: 'Apertura de la Cápsula 04' }, when: 'May 16 · 17:00', status: 'live', reach: 22640, stripe: 'stripes-navy', product: null },
]

export const SOCIAL_FUNNEL = [
  { l: 'Impressions', v: 412000, w: 100 },
  { l: 'Profile visits', v: 84200, w: 64 },
  { l: 'Storefront clicks', v: 18420, w: 38 },
  { l: 'Add to bag', v: 4280, w: 22 },
  { l: 'Orders', v: 1284, w: 12 },
]

export const SOCIAL_REACH_SERIES_IG = [3.2, 3.8, 4.4, 4.1, 5.0, 5.6, 5.2, 6.0, 6.4, 7.0, 7.6, 7.2, 8.0, 8.4, 9.0, 8.8, 9.6, 10.2, 10.0, 11.0, 11.6, 12.0, 12.4, 12.8, 13.0, 13.6, 14.2, 14.0, 15.0, 15.6]
export const SOCIAL_REACH_SERIES_WA = [0.6, 0.8, 0.7, 0.9, 1.0, 1.1, 1.0, 1.2, 1.3, 1.4, 1.3, 1.5, 1.6, 1.7, 1.6, 1.8, 1.9, 2.0, 1.9, 2.1, 2.2, 2.3, 2.4, 2.3, 2.5, 2.6, 2.7, 2.6, 2.8, 2.9]

export const SOCIAL_TEMPLATES = [
  { id: 'tmpl-1', l: { en: 'Reservation confirmed', es: 'Reserva confirmada' }, body: { en: 'Reserved under your client number. Bring ID at pickup.', es: 'Reservado bajo tu número de cliente. Trae el documento al retirar.' } },
  { id: 'tmpl-2', l: { en: 'Restock notice', es: 'Aviso de reposición' }, body: { en: "We're cutting another batch — I'll ping you the moment it goes live.", es: 'Estamos cortando un nuevo lote — te avisaré en cuanto entre.' } },
  { id: 'tmpl-3', l: { en: 'DDP quote', es: 'Cotización DDP' }, body: { en: 'DDP all-in to your address: €— total. ETA — days.', es: 'DDP completo a tu dirección: €— total. Plazo — días.' } },
  { id: 'tmpl-4', l: { en: 'Fitting invitation', es: 'Invitación a prueba' }, body: { en: 'Want to book a fitting at the Lisboa atelier? Sundays 11h–17h.', es: '¿Reservamos una prueba en el atelier de Lisboa? Domingos 11h–17h.' } },
]

export const SOCIAL_SYNC_OVERRIDES: Record<string, Record<string, string>> = {
  'M-08': { ig: 'stale', wa: 'unlisted' },
  'M-12': { ig: 'ok', wa: 'stale' },
  'M-06': { ig: 'ok', wa: 'ok' },
}

export function synthesizeOrder(orderId: string) {
  const existing = ORDERS.find((o) => o.id === orderId)
  if (!existing) return null
  const items = PRODUCTS.slice(0, existing.items).map((p, i) => ({
    ...p,
    size: ['M', 'L', 'S', 'XL'][i % 4],
    qty: 1,
  }))
  const subtotal = items.reduce((a, p) => a + p.price, 0)
  const tax = Math.round(subtotal * 0.23)
  return {
    id: existing.id,
    date: existing.date,
    status: existing.status,
    items,
    subtotal,
    shipping: 0,
    tax,
    total: existing.total,
    deliveryOpt: { id: 'express', l: 'Express · DHL Sensitive', eta: '3-5 d' },
    form: { first: 'Olivia', last: 'Bauer', email: 'olivia.b@arch.ch', phone: '+41 76 421 8800', address1: 'Limmatquai 88', address2: '', city: 'Zürich', state: 'ZH', zip: '8001', country: 'Switzerland', payMethod: 'Card', cardNumber: '4242 4242 4242 4242', cardName: 'Olivia Bauer', cardExpiry: '08 / 28' },
  }
}
