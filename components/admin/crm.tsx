'use client'

import React from 'react'
import { Search, Plus, Users } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { CLIENTS, SUPPLIERS } from '@/lib/data'
import type { Client, Supplier } from '@/lib/data'
import { Btn, StatusBadge } from '@/components/ui/primitives'
import { fmtMoney } from '@/lib/utils'

type Row = Client | Supplier

function CRMDetail({ r, type }: { r: Row; type: string }) {
  const { lang } = useApp()
  const isClient = type === 'clients'
  const client = r as Client
  const supplier = r as Supplier
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 border border-ink stripes-stone flex-shrink-0" />
        <div>
          <div className="display text-3xl">{r.name}</div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 mt-1">{r.loc}</div>
        </div>
      </div>

      <div className="border border-ink">
        {[
          { l: lang === 'es' ? 'Contacto' : 'Contact', v: r.contact },
          { l: 'Status', v: <StatusBadge status={r.status} lang={lang} /> },
          isClient
            ? { l: lang === 'es' ? 'Valor total' : 'Lifetime value', v: fmtMoney(client.value, 'EUR', lang as 'en' | 'es') }
            : { l: lang === 'es' ? 'Plazo' : 'Lead time', v: supplier.lead },
          isClient
            ? { l: lang === 'es' ? 'Último pedido' : 'Last order', v: client.last }
            : { l: lang === 'es' ? 'Categoría' : 'Category', v: supplier.cat },
        ].map((row, i) => (
          <div key={i} className={`grid grid-cols-2 px-4 py-3 ${i > 0 ? 'border-t border-ink/15' : ''}`}>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{row.l}</div>
            <div className="text-sm">{row.v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Btn kind="outline" size="sm" full>{lang === 'es' ? 'Enviar mensaje' : 'Send message'}</Btn>
        <Btn kind="solid" size="sm" full>{lang === 'es' ? 'Editar' : 'Edit'}</Btn>
      </div>
    </div>
  )
}

export function CRM() {
  const { t, lang } = useApp()
  const [tab, setTab] = React.useState<'clients' | 'suppliers'>('clients')
  const [q, setQ] = React.useState('')
  const [selected, setSelected] = React.useState<number | null>(null)

  const rows: Row[] = tab === 'clients' ? CLIENTS : SUPPLIERS
  const filtered = rows.filter(r => {
    const blob = (r.name + ' ' + r.contact + ' ' + r.loc + ' ' + ((r as Supplier).cat || '')).toLowerCase()
    return blob.includes(q.toLowerCase())
  })

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · OPERATIONS</div>
            <h1 className="display text-6xl md:text-7xl">{t.crm.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.crm.sub}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-ink h-11 flex">
              {([{ id: 'clients', l: t.crm.tabs[0] }, { id: 'suppliers', l: t.crm.tabs[1] }] as const).map(x => (
                <button key={x.id} onClick={() => { setTab(x.id as 'clients' | 'suppliers'); setSelected(null) }} className={`mono text-[10px] uppercase tracking-[0.22em] px-4 h-full ${tab === x.id ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}>{x.l}</button>
              ))}
            </div>
            <div className="border border-ink h-11 flex items-center px-4 w-72 max-w-full bg-paper">
              <Search size={14} className="text-ink/60" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.crm.search} className="bg-transparent ml-3 outline-none text-sm flex-1" />
            </div>
            <Btn kind="solid" size="md" icon={Plus}>{tab === 'clients' ? t.crm.addClient : t.crm.addSupplier}</Btn>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border border-ink mt-8">
          {[
            { l: tab === 'clients' ? (lang === 'es' ? 'Total clientes' : 'Total clients') : (lang === 'es' ? 'Total proveedores' : 'Total suppliers'), v: rows.length.toString().padStart(2, '0') },
            { l: tab === 'clients' ? 'VIP' : (lang === 'es' ? 'Activos' : 'Active'), v: rows.filter(r => r.status === 'VIP' || r.status === 'Active').length.toString().padStart(2, '0') },
            { l: tab === 'clients' ? (lang === 'es' ? 'Valor agregado' : 'Total LTV') : (lang === 'es' ? 'Plazo medio' : 'Avg lead'), v: tab === 'clients' ? '€' + ((CLIENTS.reduce((a, b) => a + b.value, 0)) / 1000).toFixed(0) + 'k' : '25 d' },
            { l: tab === 'clients' ? (lang === 'es' ? 'Recurrentes' : 'Returning') : (lang === 'es' ? 'Países' : 'Countries'), v: tab === 'clients' ? '62%' : '06' },
          ].map((s, i) => (
            <div key={i} className={`p-5 ${i > 0 ? 'border-l border-ink' : ''}`}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s.l}</div>
              <div className="display text-4xl mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 border-r border-ink">
          <div className="grid grid-cols-12 px-6 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
            <div className="col-span-4">{t.crm.columns.name}</div>
            <div className="col-span-3">{t.crm.columns.contact}</div>
            <div className="col-span-2">{t.crm.columns.location}</div>
            <div className="col-span-1">{t.crm.columns.status}</div>
            <div className="col-span-2 text-right">{tab === 'clients' ? t.crm.columns.value : t.crm.columns.leadTime}</div>
          </div>
          <div>
            {filtered.map((r, i) => (
              <button
                key={r.name + i}
                onClick={() => setSelected(i)}
                className={`grid grid-cols-12 px-6 py-4 w-full text-left border-b border-ink/15 hover:bg-chalk ${selected === i ? 'bg-chalk' : ''}`}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 border border-ink stripes-stone flex-shrink-0" />
                  <div>
                    <div className="text-sm">{r.name}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                      {tab === 'clients' ? (lang === 'es' ? 'Última compra ' : 'Last order ') + (r as Client).last : (r as Supplier).cat}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 text-sm text-ink/80 truncate">{r.contact}</div>
                <div className="col-span-2 text-sm text-ink/80">{r.loc}</div>
                <div className="col-span-1"><StatusBadge status={r.status} lang={lang} /></div>
                <div className="col-span-2 text-right">
                  {tab === 'clients'
                    ? <div className="display text-xl">{fmtMoney((r as Client).value, 'EUR', lang as 'en' | 'es')}</div>
                    : <div className="mono text-sm">{(r as Supplier).lead}</div>}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="p-12 text-center text-ink/60 mono text-[10px] uppercase tracking-[0.22em]">No matches.</div>}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 min-h-[60vh]">
          {selected != null && filtered[selected]
            ? <CRMDetail r={filtered[selected]} type={tab} />
            : (
              <div className="p-12 flex flex-col items-center justify-center text-center min-h-[60vh] text-ink/60">
                <Users size={28} />
                <div className="display text-2xl mt-3">{lang === 'es' ? 'Selecciona una fila' : 'Pick a row'}</div>
                <p className="text-sm mt-1">{lang === 'es' ? 'Verás el detalle completo aquí.' : 'Full detail appears here.'}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
