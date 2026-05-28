'use client'

import React from 'react'
import { BarChart3, CalendarDays, Plus, ArrowUpRight } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { CONTENT_POSTS, type ContentPost } from '@/lib/data'
import { PageFade, StripePlaceholder, Btn, StatusBadge } from '@/components/ui/primitives'
import { fmtMoney } from '@/lib/utils'

const CH_LABEL: Record<string, string> = { ig: 'IG', wa: 'WA', fb: 'FB', tiktok: 'TT' }

function conv(p: ContentPost) {
  return p.clicks > 0 ? (p.orders / p.clicks) * 100 : 0
}

function ContentPerformance() {
  const { t, lang } = useApp()
  const c = t.content
  const [filter, setFilter] = React.useState<'all' | 'published' | 'scheduled' | 'draft'>('all')

  const rows = CONTENT_POSTS.filter((p) => filter === 'all' || p.status === filter)
  const top = [...CONTENT_POSTS].sort((a, b) => b.revenue - a.revenue).slice(0, 4)
  const maxRev = Math.max(...top.map((p) => p.revenue), 1)

  const filters = [
    { id: 'all', l: c.filters.all },
    { id: 'published', l: c.filters.published },
    { id: 'scheduled', l: c.filters.scheduled },
    { id: 'draft', l: c.filters.draft },
  ] as const

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`mono text-[10px] uppercase tracking-[0.2em] h-8 px-3 border border-ink ${filter === f.id ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}
              >
                {f.l}
              </button>
            ))}
          </div>

          <div className="border border-ink">
            <div className="grid grid-cols-12 items-center px-4 py-3 border-b border-ink bg-chalk mono text-[9px] uppercase tracking-[0.2em] text-ink/60">
              <div className="col-span-5">{c.columns.content}</div>
              <div className="col-span-1 text-center">{c.columns.channel}</div>
              <div className="col-span-2 text-right">{c.columns.reach}</div>
              <div className="col-span-1 text-right">{c.columns.orders}</div>
              <div className="col-span-2 text-right">{c.columns.revenue}</div>
              <div className="col-span-1 text-right">{c.columns.conv}</div>
            </div>
            {rows.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-ink/50">{c.empty}</div>
            )}
            {rows.map((p) => (
              <div key={p.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 border-b border-ink/15 last:border-b-0 hover:bg-chalk">
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-11 shrink-0"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{p.title[lang as 'en' | 'es']}</div>
                    <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{p.format} · {p.date}</div>
                    <div className="mt-1"><StatusBadge status={p.status} lang={lang} /></div>
                  </div>
                </div>
                <div className="col-span-1 text-center mono text-[10px] uppercase tracking-[0.18em] text-ink/60">{CH_LABEL[p.channel]}</div>
                <div className="col-span-2 text-right mono text-[11px]">{p.reach ? p.reach.toLocaleString() : '—'}</div>
                <div className="col-span-1 text-right mono text-[11px]">{p.orders || '—'}</div>
                <div className="col-span-2 text-right display text-lg">{p.revenue ? fmtMoney(p.revenue, 'EUR', lang as 'en' | 'es') : '—'}</div>
                <div className="col-span-1 text-right mono text-[11px] text-rust">{p.clicks ? conv(p).toFixed(1) + '%' : '—'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{c.top}</div>
          <div className="border border-ink divide-y divide-ink/15">
            {top.map((p, i) => (
              <div key={p.id} className="px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="display text-xl">{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="text-sm truncate flex-1">{p.title[lang as 'en' | 'es']}</span>
                  <span className="mono text-[9px] uppercase tracking-[0.18em] text-ink/50">{CH_LABEL[p.channel]}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="display text-lg">{fmtMoney(p.revenue, 'EUR', lang as 'en' | 'es')}</span>
                  <span className="mono text-[10px] text-ink/60">{p.orders} {t.channels.sales.orders}</span>
                </div>
                <div className="h-1 bg-ink/10"><div className="h-full bg-rust" style={{ width: `${(p.revenue / maxRev) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarColumn({ title, items, lang }: { title: string; items: ContentPost[]; lang: string }) {
  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{title}</div>
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="border border-ink flex">
            <div className="w-1.5 shrink-0" style={{ background: p.status === 'published' ? '#c0432a' : '#0a0a0a', opacity: p.status === 'draft' ? 0.3 : 1 }} />
            <div className="w-14 h-16 shrink-0"><StripePlaceholder stripe={p.stripe} aspect="1/1" /></div>
            <div className="flex-1 p-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{CH_LABEL[p.channel]} · {p.format}</span>
                <span className="mono text-[9px] text-ink/50">{p.date}</span>
              </div>
              <div className="text-sm truncate mt-1">{p.title[lang as 'en' | 'es']}</div>
              <div className="mt-1.5"><StatusBadge status={p.status} lang={lang} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentCalendar() {
  const { t, lang } = useApp()
  const c = t.content
  const upcoming = CONTENT_POSTS.filter((p) => p.status !== 'published').sort((a, b) => a.date.localeCompare(b.date))
  const published = CONTENT_POSTS.filter((p) => p.status === 'published').sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-12 gap-6">
        <CalendarColumn title={c.pipeline} items={upcoming} lang={lang} />
        <CalendarColumn title={c.filters.published} items={published} lang={lang} />
      </div>
    </div>
  )
}

export function ContentHub() {
  const { t, lang } = useApp()
  const c = t.content
  const [tab, setTab] = React.useState('performance')

  const pub = CONTENT_POSTS.filter((p) => p.status === 'published')
  const reach = pub.reduce((a, p) => a + p.reach, 0)
  const orders = pub.reduce((a, p) => a + p.orders, 0)
  const revenue = pub.reduce((a, p) => a + p.revenue, 0)
  const clicks = pub.reduce((a, p) => a + p.clicks, 0)
  const avgConv = clicks > 0 ? (orders / clicks) * 100 : 0

  const kpis = [
    { k: c.kpis.published, v: pub.length.toString().padStart(2, '0') },
    { k: c.kpis.reach, v: (reach / 1000).toFixed(1) + 'k' },
    { k: c.kpis.orders, v: orders.toLocaleString() },
    { k: c.kpis.revenue, v: fmtMoney(revenue, 'EUR', lang as 'en' | 'es') },
    { k: c.kpis.conversion, v: avgConv.toFixed(1) + '%' },
    { k: c.kpis.topChannel, v: 'Instagram' },
  ]

  const tabs = [
    { id: 'performance', l: c.tabs[0], icon: BarChart3 },
    { id: 'calendar', l: c.tabs[1], icon: CalendarDays },
  ]

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PUBLISHED · SALES</div>
            <h1 className="display text-6xl md:text-7xl">{c.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{c.sub}</p>
          </div>
          <Btn icon={Plus}>{c.new}</Btn>
        </div>

        <div className="border border-ink mt-8 flex flex-wrap">
          {tabs.map((x, i) => {
            const on = tab === x.id
            return (
              <button key={x.id} onClick={() => setTab(x.id)} className={`mono text-[10px] uppercase tracking-[0.22em] h-12 px-5 inline-flex items-center gap-2 ${i > 0 ? 'border-l border-ink' : ''} ${on ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}>
                <x.icon size={14} />
                {x.l}
              </button>
            )
          })}
          <div className="flex-1 border-l border-ink hidden md:flex items-center justify-end px-5 mono text-[10px] uppercase tracking-[0.25em] text-ink/60">
            <ArrowUpRight size={14} className="mr-2" />
            {fmtMoney(revenue, 'EUR', lang as 'en' | 'es')} {lang === 'es' ? 'atribuidos' : 'attributed'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-ink">
        {kpis.map((k, i) => (
          <div key={k.k} className={`p-5 ${i > 0 ? 'border-l border-ink' : ''}`}>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{k.k}</div>
            <div className="display text-3xl mt-3">{k.v}</div>
          </div>
        ))}
      </div>

      <PageFade k={tab}>
        {tab === 'performance' && <ContentPerformance />}
        {tab === 'calendar' && <ContentCalendar />}
      </PageFade>
    </div>
  )
}
