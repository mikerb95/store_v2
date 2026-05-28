'use client'

import React from 'react'
import { Globe, CreditCard, Truck, Users, AlertTriangle, ChevronRight, Save } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { PAYMENT_METHODS } from '@/lib/data'
import { Btn, SectionHead, Select, Toggle } from '@/components/ui/primitives'

export function SettingsPanel() {
  const { t, lang } = useApp()
  const [section, setSection] = React.useState('regional')
  const [paymentMethods, setPaymentMethods] = React.useState(PAYMENT_METHODS)
  const [currency, setCurrency] = React.useState('EUR')
  const [tz, setTz] = React.useState('Europe/Lisbon')
  const [defaultLang, setDefaultLang] = React.useState('en')

  const sections = [
    { id: 'regional', l: t.settings.sections.regional,  icon: Globe },
    { id: 'payments', l: t.settings.sections.payments,  icon: CreditCard },
    { id: 'shipping', l: t.settings.sections.shipping,  icon: Truck },
    { id: 'team',     l: t.settings.sections.team,      icon: Users },
    { id: 'danger',   l: t.settings.sections.danger,    icon: AlertTriangle },
  ]

  const togglePayment = (id: string) => {
    setPaymentMethods(m => m.map(p => p.id === id ? { ...p, on: !p.on } : p))
  }

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · CONFIGURATION</div>
        <h1 className="display text-6xl md:text-7xl">{t.settings.title}</h1>
        <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.settings.sub}</p>
      </div>

      <div className="grid grid-cols-12 min-h-[60vh]">
        <aside className="col-span-12 lg:col-span-3 border-r border-ink">
          {sections.map(s => {
            const on = section === s.id
            return (
              <button key={s.id} onClick={() => setSection(s.id)} className={`w-full text-left px-6 py-4 border-b border-ink/15 flex items-center gap-3 ${on ? 'bg-ink text-paper' : 'hover:bg-chalk'}`}>
                <s.icon size={16} />
                <div className="mono text-[11px] uppercase tracking-[0.22em] flex-1">{s.l}</div>
                <ChevronRight size={14} className={on ? '' : 'opacity-30'} />
              </button>
            )
          })}
        </aside>

        <div className="col-span-12 lg:col-span-9 p-6 md:p-10">
          {section === 'regional' && (
            <div className="max-w-3xl space-y-6">
              <SectionHead eyebrow="01" title={t.settings.sections.regional} sub={lang === 'es' ? 'Idioma, moneda y zona horaria por defecto.' : 'Default language, currency and timezone.'} />
              <div className="grid grid-cols-2 gap-4">
                <Select label={t.settings.defaultLang} value={defaultLang} onChange={e => setDefaultLang(e.target.value)} options={[{ label: 'English', value: 'en' }, { label: 'Español', value: 'es' }]} />
                <Select label={t.settings.currency} value={currency} onChange={e => setCurrency(e.target.value)} options={['EUR','GBP','USD','JPY','CHF']} />
              </div>
              <Select label={t.settings.timezone} value={tz} onChange={e => setTz(e.target.value)} options={['Europe/Lisbon','Europe/Zurich','Europe/London','America/New_York','Asia/Tokyo']} />
              <div className="flex justify-end gap-2">
                <Btn kind="outline">{t.common.cancel}</Btn>
                <Btn kind="solid" icon={Save}>{t.settings.saveAll}</Btn>
              </div>
            </div>
          )}

          {section === 'payments' && (
            <div className="space-y-6">
              <SectionHead eyebrow="02" title={t.settings.sections.payments} sub={lang === 'es' ? 'Pasarelas activas en la caja.' : 'Gateways available at checkout.'} />
              <div className="border border-ink">
                {paymentMethods.map((m, i) => (
                  <div key={m.id} className={`grid grid-cols-12 items-center px-5 py-4 ${i > 0 ? 'border-t border-ink/15' : ''}`}>
                    <div className="col-span-1"><CreditCard size={18} /></div>
                    <div className="col-span-7">
                      <div className="display text-xl">{m.name}</div>
                      <div className="text-sm text-ink/60">{m.desc[lang as 'en' | 'es']}</div>
                    </div>
                    <div className="col-span-2 mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{m.on ? t.settings.enabled : t.settings.disabled}</div>
                    <div className="col-span-2 flex justify-end">
                      <Toggle on={m.on} onChange={() => togglePayment(m.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'shipping' && (
            <div className="space-y-6">
              <SectionHead eyebrow="03" title={t.settings.sections.shipping} sub={lang === 'es' ? 'Zonas, tarifas y transportistas.' : 'Zones, rates and carriers.'} />
              <div className="border border-ink divide-y divide-ink/15">
                {['DHL Sensitive · Express worldwide', 'CTT · Standard PT/ES', 'GLS · Standard EU', 'Matkahuolto · Finland'].map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4">
                    <div className="text-sm">{c}</div>
                    <Toggle on={i < 2} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'team' && (
            <div className="space-y-6">
              <SectionHead eyebrow="04" title={t.settings.sections.team} sub={lang === 'es' ? 'Accesos y roles del equipo.' : 'Access and roles for your team.'} />
              <div className="border border-ink divide-y divide-ink/15">
                {[
                  { name: 'Inês Costa', role: 'Owner', email: 'ines@monolith.pt' },
                  { name: 'Tomás Vaz', role: 'Operations', email: 'tomas@monolith.pt' },
                  { name: 'Beatriz Santos', role: 'Editorial', email: 'bea@monolith.pt' },
                ].map((m, i) => (
                  <div key={i} className="grid grid-cols-12 items-center px-5 py-4">
                    <div className="col-span-1"><div className="w-9 h-9 border border-ink stripes-stone" /></div>
                    <div className="col-span-5 ml-3">
                      <div className="text-sm">{m.name}</div>
                      <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{m.email}</div>
                    </div>
                    <div className="col-span-4 mono text-[10px] uppercase tracking-[0.2em] text-ink/70">{m.role}</div>
                    <div className="col-span-2 flex justify-end"><Btn kind="outline" size="sm">Edit</Btn></div>
                  </div>
                ))}
              </div>
              <Btn kind="solid" icon={Users}>{lang === 'es' ? 'Invitar miembro' : 'Invite member'}</Btn>
            </div>
          )}

          {section === 'danger' && (
            <div className="space-y-6">
              <SectionHead eyebrow="05" title={t.settings.sections.danger} sub={lang === 'es' ? 'Acciones irreversibles. Úsalas con cuidado.' : 'Irreversible actions. Use with care.'} />
              <div className="border border-rust/40 p-6 space-y-4">
                {[
                  { l: lang === 'es' ? 'Exportar todos los datos' : 'Export all data', b: lang === 'es' ? 'Exportar' : 'Export' },
                  { l: lang === 'es' ? 'Resetear catálogo' : 'Reset catalog', b: lang === 'es' ? 'Resetear' : 'Reset' },
                  { l: lang === 'es' ? 'Cerrar cuenta' : 'Close account', b: lang === 'es' ? 'Cerrar' : 'Close' },
                ].map((x, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="text-sm">{x.l}</div>
                    <Btn kind="danger" size="sm">{x.b}</Btn>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
