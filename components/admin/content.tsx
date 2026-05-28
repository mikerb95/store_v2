'use client'

import React from 'react'
import { BarChart3, CalendarDays, Plus, ArrowUpRight, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { CONTENT_POSTS, CLIENTS, PRODUCTS, type ContentPost } from '@/lib/data'
import { PageFade, StripePlaceholder, Btn, StatusBadge } from '@/components/ui/primitives'
import { fmtMoney } from '@/lib/utils'

const CH_LABEL: Record<string, string> = { ig: 'IG', wa: 'WA', fb: 'FB', tiktok: 'TT' }
const CH_NAME: Record<string, string> = { ig: 'Instagram', wa: 'WhatsApp', fb: 'Facebook', tiktok: 'TikTok' }

function conv(p: ContentPost) {
  return p.clicks > 0 ? (p.orders / p.clicks) * 100 : 0
}

// Deterministic attributed orders for a post — demo data derived from the post.
function attributedOrders(p: ContentPost) {
  const n = Math.min(p.orders, 6)
  if (n === 0) return []
  const per = Math.round(p.revenue / p.orders)
  return Array.from({ length: n }).map((_, i) => {
    const client = CLIENTS[(i + p.id.charCodeAt(p.id.length - 1)) % CLIENTS.length]
    const prod = PRODUCTS[(i + 3) % PRODUCTS.length]
    return {
      id: `MO-${58400 - i * 13 - (p.id.charCodeAt(2) % 40)}`,
      who: client.name,
      loc: client.loc,
      piece: prod,
      amount: per + (i % 2 === 0 ? 40 : -40),
    }
  })
}

type SortKey = 'reach' | 'clicks' | 'orders' | 'revenue' | 'conv'

function PostDetail({ post, onClose }: { post: ContentPost; onClose: () => void }) {
  const { t, lang } = useApp()
  const c = t.content
  const orders = attributedOrders(post)
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-ink/30" onClick={onClose} />
      <div className="w-full max-w-md bg-paper border-l border-ink h-full overflow-auto om-pagefade">
        <div className="flex items-start justify-between p-5 border-b border-ink">
          <div className="min-w-0">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{CH_NAME[post.channel]} · {post.format} · {post.date}</div>
            <div className="display text-2xl mt-1">{post.title[lang as 'en' | 'es']}</div>
            <div className="mt-2"><StatusBadge status={post.status} lang={lang} /></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper shrink-0">
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 border-b border-ink">
          {[
            { l: c.columns.reach, v: post.reach.toLocaleString() },
            { l: c.columns.clicks, v: post.clicks.toLocaleString() },
            { l: c.columns.orders, v: post.orders.toLocaleString() },
            { l: c.columns.conv, v: conv(post).toFixed(1) + '%' },
          ].map((k, i) => (
            <div key={k.l} className={`p-4 ${i % 2 ? 'border-l' : ''} ${i < 2 ? 'border-b' : ''} border-ink/15`}>
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/60">{k.l}</div>
              <div className="display text-2xl mt-1">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{c.columns.orders}</div>
            <div className="display text-xl">{fmtMoney(post.revenue, 'EUR', lang as 'en' | 'es')}</div>
          </div>
          {orders.length === 0 ? (
            <div className="text-sm text-ink/50 py-6 text-center">—</div>
          ) : (
            <div className="border border-ink divide-y divide-ink/15">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-7 h-9 shrink-0"><StripePlaceholder stripe={o.piece.stripe} aspect="3/4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="mono text-[10px]">{o.id}</div>
                    <div className="text-sm truncate">{o.who} · <span className="text-ink/50">{o.loc}</span></div>
                  </div>
                  <div className="display text-base">{fmtMoney(o.amount, 'EUR', lang as 'en' | 'es')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SortHead({ label, k, sort, dir, onSort, className = '' }: {
  label: string; k: SortKey; sort: SortKey; dir: 'asc' | 'desc'; onSort: (k: SortKey) => void; className?: string
}) {
  const on = sort === k
  return (
    <button onClick={() => onSort(k)} className={`inline-flex items-center gap-0.5 hover:text-ink ${on ? 'text-ink' : ''} ${className}`}>
      {label}
      {on && (dir === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />)}
    </button>
  )
}

function ContentPerformance({ onOpen }: { onOpen: (p: ContentPost) => void }) {
  const { t, lang } = useApp()
  const c = t.content
  const [sort, setSort] = React.useState<SortKey>('revenue')
  const [dir, setDir] = React.useState<'asc' | 'desc'>('desc')

  const onSort = (k: SortKey) => {
    if (k === sort) setDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSort(k); setDir('desc') }
  }

  const published = CONTENT_POSTS.filter((p) => p.status === 'published')
  const val = (p: ContentPost) => (sort === 'conv' ? conv(p) : p[sort])
  const rows = [...published].sort((a, b) => (dir === 'desc' ? val(b) - val(a) : val(a) - val(b)))
  const top = [...published].sort((a, b) => b.revenue - a.revenue).slice(0, 4)
  const maxRev = Math.max(...top.map((p) => p.revenue), 1)

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{c.filters.published} · {published.length}</div>
          <div className="border border-ink overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-12 items-center px-4 py-3 border-b border-ink bg-chalk mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
                <div className="col-span-5">{c.columns.content}</div>
                <div className="col-span-1 text-center">{c.columns.channel}</div>
                <div className="col-span-2 flex justify-end"><SortHead label={c.columns.reach} k="reach" sort={sort} dir={dir} onSort={onSort} /></div>
                <div className="col-span-1 flex justify-end"><SortHead label={c.columns.orders} k="orders" sort={sort} dir={dir} onSort={onSort} /></div>
                <div className="col-span-2 flex justify-end"><SortHead label={c.columns.revenue} k="revenue" sort={sort} dir={dir} onSort={onSort} /></div>
                <div className="col-span-1 flex justify-end"><SortHead label={c.columns.conv} k="conv" sort={sort} dir={dir} onSort={onSort} /></div>
              </div>
              {rows.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onOpen(p)}
                  className="w-full text-left grid grid-cols-12 items-center gap-2 px-4 py-3 border-b border-ink/15 last:border-b-0 hover:bg-chalk"
                >
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-11 shrink-0"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{p.title[lang as 'en' | 'es']}</div>
                      <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{p.format} · {p.date}</div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center mono text-[10px] uppercase tracking-[0.18em] text-ink/60">{CH_LABEL[p.channel]}</div>
                  <div className="col-span-2 text-right mono text-[11px]">{p.reach.toLocaleString()}</div>
                  <div className="col-span-1 text-right mono text-[11px]">{p.orders}</div>
                  <div className="col-span-2 text-right display text-lg">{fmtMoney(p.revenue, 'EUR', lang as 'en' | 'es')}</div>
                  <div className="col-span-1 text-right mono text-[11px] text-rust">{conv(p).toFixed(1)}%</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{c.top}</div>
          <div className="border border-ink divide-y divide-ink/15">
            {top.map((p, i) => (
              <button key={p.id} onClick={() => onOpen(p)} className="w-full text-left px-4 py-4 hover:bg-chalk">
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
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarColumn({ title, items, lang, onOpen }: { title: string; items: ContentPost[]; lang: string; onOpen: (p: ContentPost) => void }) {
  return (
    <div className="col-span-12 lg:col-span-6">
      <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{title}</div>
      <div className="space-y-3">
        {items.map((p) => (
          <button key={p.id} onClick={() => onOpen(p)} className="w-full text-left border border-ink flex hover:bg-chalk">
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
          </button>
        ))}
      </div>
    </div>
  )
}

function ContentCalendar({ onOpen }: { onOpen: (p: ContentPost) => void }) {
  const { t, lang } = useApp()
  const c = t.content
  const upcoming = CONTENT_POSTS.filter((p) => p.status !== 'published').sort((a, b) => a.date.localeCompare(b.date))
  const published = CONTENT_POSTS.filter((p) => p.status === 'published').sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-12 gap-6">
        <CalendarColumn title={c.pipeline} items={upcoming} lang={lang} onOpen={onOpen} />
        <CalendarColumn title={c.filters.published} items={published} lang={lang} onOpen={onOpen} />
      </div>
    </div>
  )
}

export function ContentHub() {
  const { t, lang } = useApp()
  const c = t.content
  const [tab, setTab] = React.useState('performance')
  const [openPost, setOpenPost] = React.useState<ContentPost | null>(null)

  const pub = CONTENT_POSTS.filter((p) => p.status === 'published')
  const reach = pub.reduce((a, p) => a + p.reach, 0)
  const orders = pub.reduce((a, p) => a + p.orders, 0)
  const revenue = pub.reduce((a, p) => a + p.revenue, 0)
  const clicks = pub.reduce((a, p) => a + p.clicks, 0)
  const avgConv = clicks > 0 ? (orders / clicks) * 100 : 0

  const byChannel = pub.reduce<Record<string, number>>((acc, p) => {
    acc[p.channel] = (acc[p.channel] || 0) + p.revenue
    return acc
  }, {})
  const topChannel = Object.entries(byChannel).sort((a, b) => b[1] - a[1])[0]?.[0]

  const kpis = [
    { k: c.kpis.published, v: pub.length.toString().padStart(2, '0') },
    { k: c.kpis.reach, v: (reach / 1000).toFixed(1) + 'k' },
    { k: c.kpis.orders, v: orders.toLocaleString() },
    { k: c.kpis.revenue, v: fmtMoney(revenue, 'EUR', lang as 'en' | 'es') },
    { k: c.kpis.conversion, v: avgConv.toFixed(1) + '%' },
    { k: c.kpis.topChannel, v: topChannel ? CH_NAME[topChannel] : '—' },
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
        {tab === 'performance' && <ContentPerformance onOpen={setOpenPost} />}
        {tab === 'calendar' && <ContentCalendar onOpen={setOpenPost} />}
      </PageFade>

      {openPost && <PostDetail post={openPost} onClose={() => setOpenPost(null)} />}
    </div>
  )
}
