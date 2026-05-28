'use client'

import React from 'react'
import { Plus, Eye, Save, Calendar, FileText, Newspaper } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { BANNERS, PAGES_CMS, POLICIES, NEWSLETTERS } from '@/lib/data'
import type { Banner, CMSPage } from '@/lib/data'
import { Btn, StatusBadge, Field, FieldArea } from '@/components/ui/primitives'

function BannerEditor() {
  const { lang, t } = useApp()
  const [items, setItems] = React.useState<Banner[]>(BANNERS)
  const [sel, setSel] = React.useState(0)
  const banner = items[sel]

  const update = (field: 'title' | 'body' | 'cta', value: string) => {
    setItems(items => items.map((b, i) => i === sel ? { ...b, [field]: { ...b[field], [lang]: value } } : b))
  }

  const setStatus = (s: string) => {
    setItems(items => items.map((b, i) => i === sel ? { ...b, status: s } : b))
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-3 border-r border-ink">
        <div className="px-5 py-4 border-b border-ink mono text-[10px] uppercase tracking-[0.25em] text-ink/60">All banners · {items.length}</div>
        {items.map((b, i) => (
          <button key={b.id} onClick={() => setSel(i)} className={`w-full text-left px-5 py-4 border-b border-ink/15 flex flex-col gap-2 ${sel === i ? 'bg-chalk' : 'hover:bg-chalk'}`}>
            <div className="flex items-center justify-between">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/50">{b.id}</div>
              <StatusBadge status={b.status} lang={lang} />
            </div>
            <div className="display text-xl leading-tight">{b.title[lang as 'en' | 'es']}</div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{lang === 'es' ? 'Publica' : 'Publishes'} · {b.schedule}</div>
          </button>
        ))}
      </div>

      <div className="col-span-12 lg:col-span-5 border-r border-ink p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">Editor · {banner.id}</div>
          <div className="flex gap-2">
            {['draft','scheduled','live'].map(s => (
              <button key={s} onClick={() => setStatus(s)} className={`mono text-[10px] uppercase tracking-[0.2em] border h-8 px-3 ${banner.status === s ? 'bg-ink text-paper border-ink' : 'border-ink/30 hover:border-ink'}`}>
                {s === 'draft' ? t.cms.draft : s === 'live' ? t.cms.live : t.cms.scheduled}
              </button>
            ))}
          </div>
        </div>
        <Field label={t.cms.title2} value={banner.title[lang as 'en' | 'es']} onChange={e => update('title', e.target.value)} />
        <FieldArea label={t.cms.body} value={banner.body[lang as 'en' | 'es']} onChange={e => update('body', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.cms.cta} value={banner.cta[lang as 'en' | 'es']} onChange={e => update('cta', e.target.value)} />
          <Field label={t.cms.schedule} value={banner.schedule} onChange={() => {}} icon={Calendar} />
        </div>
        <div className="border border-ink p-4">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === 'es' ? 'Tratamiento visual' : 'Visual treatment'}</div>
          <div className="grid grid-cols-4 gap-2">
            {['stripes','stripes-dark','stripes-rust','stripes-sand','stripes-stone','stripes-olive','stripes-navy'].map(s => (
              <button key={s} className={`aspect-square border border-ink ${s}`} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Btn kind="ghost" icon={Eye}>{t.cms.preview}</Btn>
          <div className="flex-1" />
          <Btn kind="solid" icon={Save}>{t.cms.publish}</Btn>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 p-6">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === 'es' ? 'Vista previa' : 'Preview'}</div>
        <div className={`${banner.stripe || 'stripes'} aspect-[16/9] relative border border-ink`}>
          <div className="absolute inset-0 noise opacity-40" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-paper p-4">
              <div className="display text-2xl">{banner.title[lang as 'en' | 'es']}</div>
              <p className="text-sm text-ink/70 mt-1">{banner.body[lang as 'en' | 'es']}</p>
              <div className="mt-3 mono text-[10px] uppercase tracking-[0.2em] border border-ink px-3 py-2 inline-block">{banner.cta[lang as 'en' | 'es']}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageList({ items, icon: Icon }: { items: CMSPage[]; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  const { lang } = useApp()
  return (
    <div className="px-6 md:px-12 py-8">
      <div className="border border-ink">
        <div className="grid grid-cols-12 px-5 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2">Updated</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {items.map((p, i) => (
          <div key={p.id} className={`grid grid-cols-12 items-center px-5 py-4 hover:bg-chalk ${i > 0 ? 'border-t border-ink/15' : ''}`}>
            <div className="col-span-5 flex items-center gap-3">
              <Icon size={14} className="text-ink/40" />
              <div className="display text-xl">{p.title[lang as 'en' | 'es']}</div>
            </div>
            <div className="col-span-3 mono text-[11px] text-ink/60">{p.slug}</div>
            <div className="col-span-2 mono text-[11px] text-ink/60">{p.updated}</div>
            <div className="col-span-2 flex justify-end"><StatusBadge status={p.status} lang={lang} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CMS() {
  const { t, lang } = useApp()
  const [tab, setTab] = React.useState<'banners' | 'pages' | 'policies' | 'newsletters'>('banners')

  const tabs = [
    { id: 'banners', l: t.cms.tabs[0] },
    { id: 'pages', l: t.cms.tabs[1] },
    { id: 'policies', l: t.cms.tabs[2] },
    { id: 'newsletters', l: t.cms.tabs[3] },
  ]

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · EDITORIAL</div>
            <h1 className="display text-6xl md:text-7xl">{t.cms.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.cms.sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-ink h-11 flex">
              {tabs.map(x => (
                <button key={x.id} onClick={() => setTab(x.id as typeof tab)} className={`mono text-[10px] uppercase tracking-[0.22em] px-4 h-full ${tab === x.id ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}>{x.l}</button>
              ))}
            </div>
            <Btn kind="solid" size="md" icon={Plus}>{lang === 'es' ? 'Nuevo' : 'New'}</Btn>
          </div>
        </div>
      </div>

      {tab === 'banners' && <BannerEditor />}
      {tab === 'pages' && <PageList items={PAGES_CMS} icon={FileText} />}
      {tab === 'policies' && <PageList items={POLICIES} icon={FileText} />}
      {tab === 'newsletters' && <PageList items={NEWSLETTERS} icon={Newspaper} />}
    </div>
  )
}
