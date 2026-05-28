'use client'

import React from 'react'
import { Activity, Mail, Database, Image, TrendingUp } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { SOCIAL_THREADS, SOCIAL_KPIS, SOCIAL_POSTS, SOCIAL_FUNNEL, SOCIAL_TEMPLATES } from '@/lib/data'
import { PageFade, Sparkline, Btn } from '@/components/ui/primitives'

function ConnectedAccount({ ch, handle }: { ch: string; handle: string }) {
  return (
    <div className="border border-ink h-11 flex items-center gap-3 px-4">
      <div className="w-2 h-2 bg-rust animate-pulse" />
      <div className="mono text-[10px] uppercase tracking-[0.22em]">{ch.toUpperCase()}</div>
      <div className="mono text-[10px] text-ink/60">{handle}</div>
    </div>
  )
}

function SocialOverview() {
  const { lang } = useApp()
  return (
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-ink mb-8">
        {SOCIAL_KPIS.map((k, i) => (
          <div key={k.k} className={`p-5 ${i > 0 ? 'border-l border-ink' : ''}`}>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{k.k}</div>
            <div className="display text-4xl mt-3">{k.v}</div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-rust mt-2">{k.trend}</div>
            <div className="w-full h-8 mt-2"><Sparkline data={k.data} height={32} color="#c0432a" filled={false} /></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">Recent posts</div>
          <div className="border border-ink divide-y divide-ink/15">
            {SOCIAL_POSTS.slice(0, 5).map((p, i) => (
              <div key={i} className="grid grid-cols-12 items-center px-5 py-4">
                <div className="col-span-1 mono text-[10px] text-ink/50">{p.ch.toUpperCase()}</div>
                <div className="col-span-8 text-sm text-ink/80 truncate">{p.caption[lang as 'en' | 'es']}</div>
                <div className="col-span-2 mono text-[10px] text-ink/60 text-right">{p.likes} ♥</div>
                <div className="col-span-1 mono text-[9px] text-ink/40 text-right">{p.date}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">Funnel</div>
          <div className="border border-ink divide-y divide-ink/15">
            {SOCIAL_FUNNEL.map((f, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/70">{f.stage}</div>
                  <div className="mono text-[10px] text-ink/60">{f.value.toLocaleString()}</div>
                </div>
                <div className="h-1 bg-ink/10"><div className="h-full bg-rust" style={{ width: `${f.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialInbox() {
  const { lang } = useApp()
  const [sel, setSel] = React.useState(0)
  const thread = SOCIAL_THREADS[sel]
  return (
    <div className="grid grid-cols-12 min-h-[70vh]">
      <div className="col-span-12 lg:col-span-4 border-r border-ink">
        <div className="px-5 py-4 border-b border-ink mono text-[10px] uppercase tracking-[0.25em] text-ink/60">
          Inbox · {SOCIAL_THREADS.length}
        </div>
        {SOCIAL_THREADS.map((t, i) => (
          <button key={i} onClick={() => setSel(i)} className={`w-full text-left px-5 py-4 border-b border-ink/15 ${sel === i ? 'bg-chalk' : 'hover:bg-chalk'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{t.ch.toUpperCase()}</span>
              {t.unread && <span className="w-1.5 h-1.5 bg-rust" />}
              <span className="ml-auto mono text-[9px] text-ink/40">{t.time}</span>
            </div>
            <div className="text-sm font-medium">{t.from}</div>
            <div className="text-sm text-ink/60 truncate">{t.preview}</div>
          </button>
        ))}
      </div>
      <div className="col-span-12 lg:col-span-8 p-6">
        {thread && (
          <>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink">
              <div className="w-10 h-10 border border-ink stripes-stone" />
              <div>
                <div className="display text-2xl">{thread.from}</div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{thread.ch.toUpperCase()} · {thread.time}</div>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              {thread.messages.map((m, i) => (
                <div key={i} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-4 text-sm ${m.mine ? 'bg-ink text-paper' : 'border border-ink'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-ink flex">
              <input className="flex-1 px-4 h-12 bg-transparent outline-none text-sm" placeholder={lang === 'es' ? 'Responder…' : 'Reply…'} />
              <button className="mono text-[10px] uppercase tracking-[0.22em] border-l border-ink px-4 hover:bg-ink hover:text-paper">Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SocialSync() {
  const { lang } = useApp()
  return (
    <div className="px-6 md:px-12 py-8 space-y-6">
      <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">Product sync</div>
      <div className="border border-ink divide-y divide-ink/15">
        {['Instagram Shopping · 12 products synced', 'WhatsApp Catalog · 12 products synced', 'Facebook Shop · Not connected'].map((c, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="text-sm">{c}</div>
            <Btn kind={i < 2 ? 'outline' : 'solid'} size="sm">{i < 2 ? (lang === 'es' ? 'Sincronizar' : 'Sync now') : (lang === 'es' ? 'Conectar' : 'Connect')}</Btn>
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialStudio() {
  const { lang } = useApp()
  return (
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {SOCIAL_TEMPLATES.map((tpl, i) => (
          <div key={i} className="border border-ink">
            <div className={`${tpl.stripe} aspect-square relative`}>
              <div className="absolute inset-0 noise opacity-40" />
            </div>
            <div className="p-3 border-t border-ink">
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{tpl.name}</div>
              <Btn kind="outline" size="sm" full className="mt-2">{lang === 'es' ? 'Usar' : 'Use'}</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SocialHub() {
  const { t } = useApp()
  const [tab, setTab] = React.useState('overview')

  const tabs = [
    { id: 'overview',  l: t.social.tabs[0], icon: Activity },
    { id: 'inbox',     l: t.social.tabs[1], icon: Mail },
    { id: 'sync',      l: t.social.tabs[2], icon: Database },
    { id: 'studio',    l: t.social.tabs[3], icon: Image },
    { id: 'analytics', l: t.social.tabs[4], icon: TrendingUp },
  ]

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · CHANNELS</div>
            <h1 className="display text-6xl md:text-7xl">{t.social.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.social.sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <ConnectedAccount ch="ig" handle="@monolith.atelier" />
            <ConnectedAccount ch="wa" handle="MONOLITH Business" />
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
            <span className="w-1.5 h-1.5 bg-rust animate-pulse mr-2" />
            Realtime · webhook OK
          </div>
        </div>
      </div>

      <PageFade k={tab}>
        {tab === 'overview' && <SocialOverview />}
        {tab === 'inbox' && <SocialInbox />}
        {tab === 'sync' && <SocialSync />}
        {tab === 'studio' && <SocialStudio />}
        {tab === 'analytics' && <SocialOverview />}
      </PageFade>
    </div>
  )
}
