'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Truck, Download, ShoppingBag, Mail, AlertTriangle } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { Btn, StatusBadge, StripePlaceholder } from '@/components/ui/primitives'
import { fmtMoney, addDays } from '@/lib/utils'

interface OrderData {
  id: string
  date: string
  status: string
  items: Array<{ id: string; name: { en: string; es: string }; stripe: string; material: string; colors: string[]; price: number; size?: string; qty?: number }>
  subtotal?: number
  shipping?: number
  tax?: number
  total: number
  deliveryOpt?: { id: string; l: string; eta: string }
  form?: { first?: string; last?: string; address1?: string; address2?: string; zip?: string; city?: string; country?: string; phone?: string; payMethod?: string; cardNumber?: string; cardExpiry?: string; cardName?: string }
}

function OrderTimeline({ stages, currentIdx }: { stages: Array<{ id: string; l: string; date: string; time: string; future?: boolean }>; currentIdx: number }) {
  return (
    <ol className="relative border border-ink">
      {stages.map((s, i) => {
        const done = i <= currentIdx
        const current = i === currentIdx
        return (
          <li key={s.id} className={`grid grid-cols-12 gap-4 items-center px-4 py-4 ${i > 0 ? 'border-t border-ink/15' : ''}`}>
            <div className="col-span-1 flex justify-center">
              <div className="relative">
                <span className={`block w-3 h-3 ${done ? 'bg-ink' : 'border border-ink/30 bg-paper'}`} />
                {current && (
                  <motion.span
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="absolute inset-0 block w-3 h-3 bg-rust"
                  />
                )}
              </div>
            </div>
            <div className="col-span-7 sm:col-span-6">
              <div className={`display text-xl ${done ? 'text-ink' : 'text-ink/40'}`}>{s.l}</div>
              {current && <div className="mono text-[10px] uppercase tracking-[0.22em] text-rust mt-1">Now</div>}
            </div>
            <div className="col-span-4 sm:col-span-5 text-right mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
              <div>{s.date}</div>
              {s.time && s.time !== '—' && <div className="text-ink/40">{s.time}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function SumRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/70 truncate">{k}</div>
      <div className="text-sm">{v}</div>
    </div>
  )
}

export function OrderDetail({ order, onBack }: { order: OrderData; onBack?: () => void }) {
  const { t, lang } = useApp()
  if (!order) return null

  const stages = [
    { id: 'ordered',        l: t.order.stages.ordered,        date: order.date,                       time: '11:24' },
    { id: 'cut',            l: t.order.stages.cut,            date: order.date,                       time: '16:02' },
    { id: 'sewn',           l: t.order.stages.sewn,           date: addDays(order.date, 2),           time: '10:38' },
    { id: 'packed',         l: t.order.stages.packed,         date: addDays(order.date, 3),           time: '09:14' },
    { id: 'shipped',        l: t.order.stages.shipped,        date: addDays(order.date, 3),           time: '17:40' },
    { id: 'outForDelivery', l: t.order.stages.outForDelivery, date: addDays(order.date, 5),           time: '08:12' },
    { id: 'delivered',      l: t.order.stages.delivered,      date: addDays(order.date, order.deliveryOpt?.id === 'atelier' ? 1 : 5), time: '—' },
  ]
  const currentIdx = order.status === 'delivered' ? 6 : 4

  const lines = order.items || []
  const subtotal = order.subtotal ?? lines.reduce((a, l) => a + l.price * (l.qty || 1), 0)
  const shipping = order.shipping ?? 0
  const tax = order.tax ?? Math.round(subtotal * 0.23)
  const total = order.total ?? (subtotal + shipping + tax)
  const f = order.form || {}

  return (
    <section className="border-b border-ink">
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {onBack && (
              <button onClick={onBack} className="mono text-[10px] uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:opacity-70 mb-4">
                <ArrowLeft size={14} /> {t.order.back}
              </button>
            )}
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">{t.order.eyebrow}</div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="display text-7xl md:text-8xl leading-none">{order.id}</h1>
              <StatusBadge status={order.status} lang={lang} />
            </div>
            <div className="mt-4 flex items-center gap-6 mono text-[10px] uppercase tracking-[0.25em] text-ink/60 flex-wrap">
              <span>{t.order.placed} · {order.date}</span>
              <span>·</span>
              <span>{lines.length} {lang === 'es' ? 'piezas' : 'pieces'}</span>
              <span>·</span>
              <span>{fmtMoney(total, 'EUR', lang as 'en' | 'es')}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn kind="solid" icon={Truck}>{t.order.track}</Btn>
            <Btn kind="outline" icon={Download}>{t.order.invoice}</Btn>
            <Btn kind="outline" icon={ShoppingBag}>{t.order.reorder}</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 border-r border-ink">
          <div className="px-6 md:px-12 py-8 border-b border-ink">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-2">01 / {t.order.sections.timeline}</div>
            <h2 className="display text-5xl mb-6">{order.status === 'delivered' ? (lang === 'es' ? 'Entregado' : 'Delivered') : (lang === 'es' ? 'En camino' : 'On its way')}</h2>
            <OrderTimeline stages={stages} currentIdx={currentIdx} />
            <div className="grid grid-cols-3 gap-0 border border-ink mt-8">
              <div className="p-4">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.order.carrier}</div>
                <div className="display text-2xl mt-1">DHL · Sensitive</div>
              </div>
              <div className="p-4 border-l border-ink">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.order.tracking}</div>
                <div className="display text-2xl mt-1">SE-{order.id.replace('MO-', '')}-PT</div>
              </div>
              <div className="p-4 border-l border-ink">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.order.arrival}</div>
                <div className="display text-2xl mt-1">{order.deliveryOpt?.eta || '5-8 d'}</div>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-12 py-8">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-2">02 / {t.order.sections.items}</div>
            <h2 className="display text-5xl mb-6">{lines.length} {lang === 'es' ? 'piezas' : 'pieces'}</h2>
            <div className="border border-ink">
              {lines.map((l, i) => (
                <div key={i} className={`grid grid-cols-12 gap-4 p-5 ${i > 0 ? 'border-t border-ink/15' : ''}`}>
                  <div className="col-span-3 sm:col-span-2"><StripePlaceholder stripe={l.stripe} aspect="3/4" /></div>
                  <div className="col-span-9 sm:col-span-7">
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{l.id}</div>
                    <div className="display text-2xl mt-1">{l.name[lang as 'en' | 'es']}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/60 mt-2 flex flex-wrap gap-3">
                      <span>{l.material}</span><span>·</span>
                      <span>{l.colors?.[0]}</span><span>·</span>
                      <span>Size {l.size || 'M'}</span><span>·</span>
                      <span>×{l.qty || 1}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="mono text-[10px] uppercase tracking-[0.22em] underline underline-offset-4">{lang === 'es' ? 'Devolver' : 'Return'}</button>
                      <span className="text-ink/30">·</span>
                      <button className="mono text-[10px] uppercase tracking-[0.22em] underline underline-offset-4">{lang === 'es' ? 'Cambio de talla' : 'Exchange size'}</button>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-3 sm:text-right">
                    <div className="display text-3xl">{fmtMoney(l.price * (l.qty || 1), 'EUR', lang as 'en' | 'es')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border-b border-ink p-6 md:p-8 bg-chalk">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1">03 / {t.checkout.summary.title}</div>
            <h2 className="display text-3xl mb-5">{lines.length} {t.checkout.summary.items} · {fmtMoney(total, 'EUR', lang as 'en' | 'es')}</h2>
            <div className="space-y-2 border-t border-ink/20 pt-4">
              <SumRow k={t.checkout.summary.subtotal} v={fmtMoney(subtotal, 'EUR', lang as 'en' | 'es')} />
              <SumRow k={`${t.checkout.summary.shipping} · ${order.deliveryOpt?.l || 'Express'}`} v={shipping === 0 ? (lang === 'es' ? 'Gratis' : 'Free') : fmtMoney(shipping, 'EUR', lang as 'en' | 'es')} />
              <SumRow k={t.checkout.summary.tax} v={fmtMoney(tax, 'EUR', lang as 'en' | 'es')} />
            </div>
            <div className="border-t border-ink mt-4 pt-4 flex items-baseline justify-between">
              <div className="display text-xl">{t.checkout.summary.total}</div>
              <div className="display text-3xl">{fmtMoney(total, 'EUR', lang as 'en' | 'es')}</div>
            </div>
          </div>

          <div className="border-b border-ink p-6 md:p-8">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-2">04 / {t.order.sections.shipping}</div>
            <h3 className="display text-2xl mb-3">{order.deliveryOpt?.l || 'Express delivery'}</h3>
            <div className="text-sm leading-relaxed">
              <div>{f.first} {f.last}</div>
              <div>{f.address1}{f.address2 ? ', ' + f.address2 : ''}</div>
              <div>{f.zip} {f.city}, {f.country}</div>
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 mt-2">{f.phone}</div>
            </div>
          </div>

          <div className="border-b border-ink p-6 md:p-8">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-2">05 / {t.order.sections.billing}</div>
            <h3 className="display text-2xl mb-3">{f.payMethod || 'Card'}</h3>
            <div className="text-sm">
              {f.payMethod === 'Card' && (
                <div>•••• {f.cardNumber?.slice(-4) || '4242'} · {f.cardExpiry || '08 / 28'}</div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-2">06 / {t.order.sections.support}</div>
            <h3 className="display text-2xl mb-3">{lang === 'es' ? '¿Algo va mal?' : 'Anything wrong?'}</h3>
            <p className="text-sm text-ink/70 mb-4">{lang === 'es' ? 'Escribe directamente al atelier.' : 'Reach the atelier directly.'}</p>
            <div className="space-y-2">
              <Btn kind="outline" full icon={Mail}>{t.order.contact}</Btn>
              <Btn kind="ghost" full icon={AlertTriangle}>{t.order.report}</Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
