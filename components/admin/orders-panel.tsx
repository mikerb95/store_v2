'use client'

import { useApp } from '@/context/app-context'
import { ORDERS, LIVE_ORDERS } from '@/lib/data'
import { StatusBadge } from '@/components/ui/primitives'
import { fmtMoney } from '@/lib/utils'

export function OrdersPanel() {
  const { lang } = useApp()
  const allOrders = [
    ...LIVE_ORDERS.map(o => ({ id: o.id, date: '2026-05-21', who: o.who, items: 1, total: o.amount, status: 'preparing' as const })),
    ...ORDERS,
  ]

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · LOGISTICS</div>
        <h1 className="display text-6xl md:text-7xl">{lang === 'es' ? 'Pedidos' : 'Orders'}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 border border-ink mt-8">
          {[
            { l: lang === 'es' ? 'Hoy' : 'Today',               v: '32' },
            { l: lang === 'es' ? 'Pendientes' : 'Open',          v: '08' },
            { l: lang === 'es' ? 'En tránsito' : 'In transit',   v: '14' },
            { l: lang === 'es' ? 'Devoluciones' : 'Returns',     v: '02' },
          ].map((s, i) => (
            <div key={i} className={`p-5 ${i > 0 ? 'border-l border-ink' : ''}`}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s.l}</div>
              <div className="display text-4xl mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 py-8">
        <div className="border border-ink">
          <div className="grid grid-cols-12 px-5 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
            <div className="col-span-2">Order</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Customer</div>
            <div className="col-span-1 text-right">Items</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          {allOrders.slice(0, 14).map((o, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-5 py-3 border-b border-ink/15 last:border-b-0 hover:bg-chalk">
              <div className="col-span-2 mono text-[11px]">{o.id}</div>
              <div className="col-span-2 mono text-[11px] text-ink/70">{o.date}</div>
              <div className="col-span-4 text-sm">{(o as { who?: string; piece?: string }).who || (o as { piece?: string }).piece || '—'}</div>
              <div className="col-span-1 text-right mono text-[11px]">{String(o.items || 1).padStart(2, '0')}</div>
              <div className="col-span-1 text-right display text-xl">{fmtMoney(o.total, 'EUR', lang as 'en' | 'es')}</div>
              <div className="col-span-2 flex justify-end"><StatusBadge status={o.status || 'preparing'} lang={lang} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
