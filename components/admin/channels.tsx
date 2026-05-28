'use client'

import React from 'react'
import { Plug, BarChart3, Boxes, RefreshCw, Check, AlertTriangle, Plus } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { CONNECTORS, CHANNEL_SALES, CHANNEL_LISTINGS, SYNC_CHANNELS, PRODUCTS, type Connector } from '@/lib/data'
import { PageFade, StripePlaceholder, Btn } from '@/components/ui/primitives'
import { fmtMoney, totalStock } from '@/lib/utils'

function Connections({ connectors, syncing, syncedAt, onSync, onConnect }: {
  connectors: Connector[]
  syncing: boolean
  syncedAt: string | null
  onSync: () => void
  onConnect: (id: string) => void
}) {
  const { t, lang } = useApp()
  const ch = t.channels
  const connected = connectors.filter((c) => c.status === 'connected')
  const available = connectors.filter((c) => c.status === 'available')

  return (
    <div className="px-6 md:px-12 py-8 space-y-10">
      <div>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{ch.connected} · {connected.length}</div>
          <div className="flex items-center gap-3">
            {syncedAt && !syncing && (
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-rust inline-flex items-center gap-1.5">
                <Check size={12} /> {ch.lastSync} {syncedAt}
              </span>
            )}
            <Btn kind="outline" size="sm" icon={RefreshCw} onClick={onSync} disabled={syncing}>
              {syncing ? (lang === 'es' ? 'Sincronizando…' : 'Syncing…') : ch.forceSync}
            </Btn>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connected.map((c) => (
            <div key={c.id} className="border border-ink flex">
              <div className="w-20 shrink-0"><StripePlaceholder stripe={c.stripe} aspect="1/1" /></div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="mono text-[10px] text-ink/60">{c.handle}</div>
                  </div>
                  <span className="mono text-[9px] uppercase tracking-[0.18em] inline-flex items-center gap-1.5 text-ink/70">
                    {c.health === 'ok'
                      ? <span className="w-1.5 h-1.5 bg-rust" />
                      : <AlertTriangle size={11} className="text-ink" />}
                    {(ch.health as Record<string, string>)[c.health || 'ok']}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                    {c.listed} {ch.listed} · {ch.lastSync} {syncing ? '…' : (syncedAt && c.health === 'ok' ? syncedAt : c.lastSync)}
                  </div>
                  <Btn kind="ghost" size="sm">{ch.manage}</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{ch.available} · {available.length}</div>
        {available.length === 0 && (
          <div className="border border-ink px-4 py-8 text-center text-sm text-ink/50">
            {lang === 'es' ? 'Todos los canales están conectados.' : 'Every channel is connected.'}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {available.map((c) => (
            <div key={c.id} className="border border-ink">
              <div className="relative aspect-[3/2]">
                <StripePlaceholder stripe={c.stripe} aspect="3/2" />
              </div>
              <div className="p-3 border-t border-ink">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <Btn kind="outline" size="sm" full icon={Plus} className="mt-2" onClick={() => onConnect(c.id)}>{ch.connect}</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Sales() {
  const { t, lang } = useApp()
  const ch = t.channels
  const total = CHANNEL_SALES.reduce((a, c) => a + c.rev, 0)
  const totalOrders = CHANNEL_SALES.reduce((a, c) => a + c.orders, 0)
  const max = Math.max(...CHANNEL_SALES.map((c) => c.rev), 1)

  // donut geometry
  const R = 52, C = 2 * Math.PI * R
  const segments = CHANNEL_SALES.reduce<{ c: typeof CHANNEL_SALES[number]; dash: number; offset: number }[]>((acc, c) => {
    const dash = (c.rev / total) * C
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0
    acc.push({ c, dash, offset })
    return acc
  }, [])

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="border border-ink p-6">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{ch.sales.total}</div>
            <div className="display text-4xl mt-2">{fmtMoney(total, 'EUR', lang as 'en' | 'es')}</div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">{totalOrders.toLocaleString()} {ch.sales.orders}</div>
            <div className="relative flex justify-center my-6">
              <svg viewBox="0 0 140 140" className="w-44 h-44 -rotate-90">
                {segments.map(({ c, dash, offset }) => (
                  <circle
                    key={c.id}
                    cx="70" cy="70" r={R}
                    fill="none" stroke={c.color} strokeWidth="16"
                    strokeDasharray={`${dash} ${C - dash}`}
                    strokeDashoffset={-offset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="display text-2xl">{(total / 1000).toFixed(0)}k</div>
                <div className="mono text-[8px] uppercase tracking-[0.2em] text-ink/50">EUR · 30d</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{ch.sales.title}</div>
          <div className="border border-ink">
            {CHANNEL_SALES.map((c) => (
              <div key={c.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3.5 border-b border-ink/15 last:border-b-0">
                <div className="col-span-4 md:col-span-3 flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 shrink-0" style={{ background: c.color }} />
                  <span className="text-sm truncate">{c.name}</span>
                </div>
                <div className="col-span-3 md:col-span-4">
                  <div className="h-1.5 bg-ink/10"><div className="h-full" style={{ width: `${(c.rev / max) * 100}%`, background: c.color }} /></div>
                </div>
                <div className="hidden md:block col-span-2 mono text-[10px] text-ink/60 text-right">{c.orders} {ch.sales.orders}</div>
                <div className="col-span-3 md:col-span-2 display text-lg text-right">{fmtMoney(c.rev, 'EUR', lang as 'en' | 'es')}</div>
                <div className="col-span-2 md:col-span-1 mono text-[11px] text-rust text-right">{c.share}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StockCell({ state, onPush }: { state: 'ok' | 'stale' | 'unlisted'; onPush?: () => void }) {
  const { t } = useApp()
  const s = t.channels.stock
  if (state === 'ok') {
    return (
      <span className="mono text-[9px] uppercase tracking-[0.18em] text-rust inline-flex items-center gap-1">
        <Check size={11} /> {s.ok}
      </span>
    )
  }
  // stale or unlisted → actionable
  const label = state === 'stale' ? s.stale : s.unlisted
  return (
    <button
      onClick={onPush}
      title={s.push}
      className="mono text-[9px] uppercase tracking-[0.18em] inline-flex items-center gap-1 border border-ink/40 px-1.5 py-0.5 hover:bg-ink hover:text-paper text-ink"
    >
      <AlertTriangle size={11} /> {label}
    </button>
  )
}

function Stock({ relisted, onPush, onSync, syncing }: {
  relisted: Set<string>
  onPush: (key: string) => void
  onSync: () => void
  syncing: boolean
}) {
  const { t, lang } = useApp()
  const ch = t.channels
  const s = ch.stock

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s.title}</div>
          <p className="text-sm text-ink/70 mt-1 max-w-md">{s.sub}</p>
        </div>
        <Btn kind="outline" size="sm" icon={RefreshCw} onClick={onSync} disabled={syncing}>
          {syncing ? (lang === 'es' ? 'Sincronizando…' : 'Syncing…') : ch.forceSync}
        </Btn>
      </div>

      <div className="border border-ink overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-12 items-center px-4 py-3 border-b border-ink bg-chalk mono text-[9px] uppercase tracking-[0.2em] text-ink/60">
            <div className="col-span-5">{s.columns.piece}</div>
            <div className="col-span-1 text-right">{s.columns.onHand}</div>
            {SYNC_CHANNELS.map((c) => (
              <div key={c.id} className="col-span-2 text-center">{c.label}</div>
            ))}
          </div>
          {PRODUCTS.map((p) => {
            const onHand = totalStock(p.stock)
            const listings = CHANNEL_LISTINGS[p.id] || {}
            return (
              <div key={p.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 border-b border-ink/15 last:border-b-0 hover:bg-chalk">
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-10 shrink-0"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{p.name[lang as 'en' | 'es']}</div>
                    <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{p.sku}</div>
                  </div>
                </div>
                <div className={`col-span-1 text-right display text-lg ${onHand === 0 ? 'text-ink/30' : ''}`}>{onHand}</div>
                {SYNC_CHANNELS.map((c) => {
                  const key = `${p.id}:${c.id}`
                  const base = onHand === 0 ? 'unlisted' : (listings[c.id] || 'ok')
                  const state = relisted.has(key) ? 'ok' : base
                  return (
                    <div key={c.id} className="col-span-2 text-center">
                      <StockCell state={state as 'ok' | 'stale' | 'unlisted'} onPush={() => onPush(key)} />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function nowLabel(lang: string) {
  return lang === 'es' ? 'ahora' : 'just now'
}

export function ChannelsHub() {
  const { t, lang } = useApp()
  const ch = t.channels
  const [tab, setTab] = React.useState('connections')

  const [connectors, setConnectors] = React.useState<Connector[]>(CONNECTORS)
  const [syncing, setSyncing] = React.useState(false)
  const [syncedAt, setSyncedAt] = React.useState<string | null>(null)
  const [relisted, setRelisted] = React.useState<Set<string>>(new Set())

  const connectedCount = connectors.filter((c) => c.status === 'connected').length
  const total = CHANNEL_SALES.reduce((a, c) => a + c.rev, 0)

  const handleSync = () => {
    if (syncing) return
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setSyncedAt(nowLabel(lang))
      setConnectors((prev) => prev.map((c) => (c.status === 'connected' ? { ...c, health: 'ok' } : c)))
    }, 1100)
  }

  const handleConnect = (id: string) => {
    setConnectors((prev) => prev.map((c) => (
      c.id === id ? { ...c, status: 'connected', health: 'ok', lastSync: nowLabel(lang), handle: c.handle || '@monolith', listed: 12 } : c
    )))
  }

  const handlePush = (key: string) => {
    setRelisted((prev) => new Set(prev).add(key))
  }

  const tabs = [
    { id: 'connections', l: ch.tabs[0], icon: Plug },
    { id: 'sales', l: ch.tabs[1], icon: BarChart3 },
    { id: 'stock', l: ch.tabs[2], icon: Boxes },
  ]

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">OMNICHANNEL · SALES + STOCK</div>
            <h1 className="display text-6xl md:text-7xl">{ch.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{ch.sub}</p>
          </div>
          <div className="border border-ink p-5 bg-ink text-paper">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-paper/60 mb-2">{ch.sales.total}</div>
            <div className="display text-4xl">{fmtMoney(total, 'EUR', lang as 'en' | 'es')}</div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-paper/60 mt-2">{connectedCount} {ch.connected.toLowerCase()}</div>
          </div>
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
            <span className={`w-1.5 h-1.5 mr-2 ${syncing ? 'bg-ink animate-pulse' : 'bg-rust animate-pulse'}`} />
            {syncing ? (lang === 'es' ? 'Sincronizando…' : 'Syncing…') : (lang === 'es' ? 'Sincronización en tiempo real' : 'Realtime sync')}
          </div>
        </div>
      </div>

      <PageFade k={tab}>
        {tab === 'connections' && <Connections connectors={connectors} syncing={syncing} syncedAt={syncedAt} onSync={handleSync} onConnect={handleConnect} />}
        {tab === 'sales' && <Sales />}
        {tab === 'stock' && <Stock relisted={relisted} onPush={handlePush} onSync={handleSync} syncing={syncing} />}
      </PageFade>
    </div>
  )
}
