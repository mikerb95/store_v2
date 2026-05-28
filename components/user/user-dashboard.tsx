'use client'

import React from 'react'
import { TrendingUp, Filter, Download, Upload, Plus, Save, LogOut, Lock, Mail, Phone } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { ORDERS, PRODUCTS } from '@/lib/data'
import { Tabs, PageFade, StatusBadge, Tag, StripePlaceholder, Btn, Field, FieldArea, Select, Toggle } from '@/components/ui/primitives'
import { fmtMoney } from '@/lib/utils'

function KPI({ label, value, trend, border = false }: { label: string; value: string; trend: string; border?: boolean }) {
  return (
    <div className={`p-6 ${border ? 'border-t border-ink' : ''} flex flex-col justify-between min-h-[140px]`}>
      <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{label}</div>
      <div className="display text-5xl">{value}</div>
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-rust inline-flex items-center gap-1.5">
        <TrendingUp size={12} /> {trend}
      </div>
    </div>
  )
}

function OrderRow({ o, onOpen }: { o: typeof ORDERS[0]; onOpen?: (id: string) => void }) {
  const { t, lang } = useApp()
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 border-t border-ink/15 first:border-t-0 items-center hover:bg-chalk">
      <div className="col-span-12 md:col-span-3">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{o.id}</div>
        <div className="text-sm">{o.date}</div>
      </div>
      <div className="col-span-12 md:col-span-4 text-sm">{o.piece}</div>
      <div className="col-span-6 md:col-span-2 mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{o.items} {lang === 'es' ? 'pzas.' : 'items'}</div>
      <div className="col-span-6 md:col-span-1 display text-xl">{fmtMoney(o.total, 'EUR', lang as 'en' | 'es')}</div>
      <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-3">
        <StatusBadge status={o.status} lang={lang} />
        <button onClick={() => onOpen?.(o.id)} className="mono text-[10px] uppercase tracking-[0.2em] underline underline-offset-4">{t.user.view}</button>
      </div>
    </div>
  )
}

function UserOverview({ onOrderOpen }: { onOrderOpen?: (id: string) => void }) {
  const { t, lang } = useApp()
  const recent = ORDERS.slice(0, 3)
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="border border-ink">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink">
            <div className="display text-2xl">{t.user.recent}</div>
            <button className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 hover:text-ink">{t.admin.view}</button>
          </div>
          <div>{recent.map(o => <OrderRow key={o.id} o={o} onOpen={onOrderOpen} />)}</div>
        </div>

        <div className="border border-ink p-6">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">Active package — MO-58210</div>
          <div className="display text-3xl mb-4">{lang === 'es' ? 'En tránsito a Lisboa' : 'In transit to Lisboa'}</div>
          <div className="grid grid-cols-4 gap-0 border-t border-ink">
            {[
              { l: lang === 'es' ? 'Cortado' : 'Cut',      done: true,  date: 'May 06' },
              { l: lang === 'es' ? 'Cosido' : 'Sewn',      done: true,  date: 'May 09' },
              { l: lang === 'es' ? 'Enviado' : 'Shipped',  done: true,  date: 'May 12' },
              { l: lang === 'es' ? 'Entrega' : 'Delivery', done: false, date: 'May 16' },
            ].map((s, i, arr) => (
              <div key={i} className={`p-4 ${i < arr.length - 1 ? 'border-r border-ink' : ''}`}>
                <div className={`w-3 h-3 ${s.done ? 'bg-rust' : 'border border-ink'} mb-3`} />
                <div className="display text-xl">{s.l}</div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{s.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="border border-ink p-6 bg-ink text-paper">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-paper/60 mb-3">Atelier Credit</div>
          <div className="display text-6xl mb-3">€340</div>
          <p className="text-sm text-paper/70 mb-5">{lang === 'es' ? '1% de cada pedido vuelve a tu cuenta.' : '1% of every order returns to your account.'}</p>
          <Btn kind="paper" full>Use credit</Btn>
        </div>

        <div className="border border-ink">
          <div className="px-5 py-4 border-b border-ink display text-xl">{lang === 'es' ? 'Próximas pruebas' : 'Upcoming fittings'}</div>
          <div className="divide-y divide-ink/20">
            {[
              { d: 'Jun 02', t: '11:30', l: 'Lisboa flagship — Mason Linen Suit' },
              { d: 'Jul 18', t: '16:00', l: 'Lisboa flagship — Field Parka pickup' },
            ].map((x, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="border border-ink p-2 text-center min-w-[64px]">
                  <div className="display text-2xl leading-none">{x.d.split(' ')[1]}</div>
                  <div className="mono text-[9px] uppercase tracking-[0.2em]">{x.d.split(' ')[0]}</div>
                </div>
                <div className="flex-1">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{x.t}</div>
                  <div className="text-sm">{x.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UserOrders({ onOrderOpen }: { onOrderOpen?: (id: string) => void }) {
  const { t } = useApp()
  return (
    <div className="border border-ink">
      <div className="px-5 py-4 border-b border-ink flex items-center justify-between">
        <div className="display text-2xl">{t.user.orders}</div>
        <div className="flex gap-2">
          <Btn kind="outline" size="sm" icon={Filter}>Filter</Btn>
          <Btn kind="outline" size="sm" icon={Download}>Export</Btn>
        </div>
      </div>
      {ORDERS.map(o => <OrderRow key={o.id} o={o} onOpen={onOrderOpen} />)}
    </div>
  )
}

function UserProfile({ user }: { user: { name: string; email: string } | null }) {
  const { lang, t } = useApp()
  const [f, setF] = React.useState({
    first: user?.name?.split(' ')[0] || 'Olivia',
    last: user?.name?.split(' ')[1] || 'Bauer',
    email: user?.email || 'olivia.b@arch.ch',
    phone: '+41 76 421 8800',
    bio: lang === 'es' ? 'Arquitecta, Zürich. Coleccionando MONOLITH desde 2023.' : 'Architect, Zürich. Collecting MONOLITH since 2023.',
  })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <div className="border border-ink p-6">
          <div className="w-full aspect-square stripes-dark relative mb-5">
            <div className="absolute inset-0 noise opacity-40" />
            <div className="absolute bottom-3 left-3 mono text-[10px] uppercase tracking-[0.25em] text-paper">{f.first.toUpperCase()} · CLIENT</div>
          </div>
          <div className="display text-3xl">{f.first} {f.last}</div>
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mt-1">Atelier tier · Since 2023</div>
          <div className="mt-4"><Btn kind="outline" size="sm" full icon={Upload}>{lang === 'es' ? 'Subir retrato' : 'Upload portrait'}</Btn></div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label={lang === 'es' ? 'Nombre' : 'First name'} value={f.first} onChange={set('first') as (e: React.ChangeEvent<HTMLInputElement>) => void} />
          <Field label={lang === 'es' ? 'Apellido' : 'Last name'} value={f.last} onChange={set('last') as (e: React.ChangeEvent<HTMLInputElement>) => void} />
        </div>
        <Field label={t.auth.email} value={f.email} onChange={set('email') as (e: React.ChangeEvent<HTMLInputElement>) => void} icon={Mail} />
        <Field label={lang === 'es' ? 'Teléfono' : 'Phone'} value={f.phone} onChange={set('phone') as (e: React.ChangeEvent<HTMLInputElement>) => void} icon={Phone} />
        <FieldArea label="Bio" value={f.bio} onChange={set('bio') as (e: React.ChangeEvent<HTMLTextAreaElement>) => void} />
        <div className="flex justify-end gap-2">
          <Btn kind="ghost">{t.common.cancel}</Btn>
          <Btn kind="solid" icon={Save}>{t.user.saveChanges}</Btn>
        </div>
      </div>
    </div>
  )
}

function UserAddresses() {
  const { lang } = useApp()
  const addrs = [
    { label: lang === 'es' ? 'Casa' : 'Home', line1: 'Rua da Boavista 142', line2: '1200-068 Lisboa, PT', phone: '+351 21 397 4400', primary: true },
    { label: 'Studio', line1: 'Limmatquai 88', line2: '8001 Zürich, CH', phone: '+41 76 421 8800' },
    { label: 'Atelier', line1: 'Casa MONOLITH', line2: 'Rua do Século 7, Lisboa', phone: '+351 21 397 4400' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {addrs.map((a, i) => (
        <div key={i} className="border border-ink p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Tag tone={a.primary ? 'ink' : 'line'}>{a.label}{a.primary ? ' · default' : ''}</Tag>
            <button className="mono text-[10px] uppercase tracking-[0.2em] underline underline-offset-4">Edit</button>
          </div>
          <div className="text-sm">
            <div>{a.line1}</div>
            <div>{a.line2}</div>
            <div className="text-ink/60 mt-2 mono text-[11px]">{a.phone}</div>
          </div>
        </div>
      ))}
      <button className="border border-dashed border-ink/40 hover:border-ink p-5 min-h-[180px] flex flex-col items-center justify-center text-ink/60 hover:text-ink">
        <Plus size={20} />
        <div className="mono text-[10px] uppercase tracking-[0.25em] mt-2">{lang === 'es' ? 'Añadir dirección' : 'Add address'}</div>
      </button>
    </div>
  )
}

function UserWishlist() {
  const { t } = useApp()
  const items = PRODUCTS.slice(0, 4)
  return (
    <div>
      <div className="display text-3xl mb-4">{t.user.wishlist}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(p => (
          <div key={p.id} className="border border-ink">
            <StripePlaceholder stripe={p.stripe} label={p.id} aspect="4/5" />
            <div className="p-3 border-t border-ink">
              <div className="display text-lg leading-tight">{p.name.en}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="display text-base">{fmtMoney(p.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserSettingsTab({ onLogout }: { onLogout: () => void }) {
  const { t, lang } = useApp()
  const [notif, setNotif] = React.useState({ emails: true, sms: false, drops: true })
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="border border-ink p-6">
          <div className="display text-2xl mb-1">{lang === 'es' ? 'Notificaciones' : 'Notifications'}</div>
          <p className="text-sm text-ink/60 mb-5">{lang === 'es' ? 'Cómo quieres que la casa se ponga en contacto contigo.' : 'How you want the house to reach you.'}</p>
          {[
            { k: 'emails' as const, l: lang === 'es' ? 'Correos del atelier' : 'Atelier emails' },
            { k: 'sms' as const, l: 'SMS · drops & shipping' },
            { k: 'drops' as const, l: lang === 'es' ? 'Avisos de lanzamientos' : 'Drop notifications' },
          ].map(x => (
            <div key={x.k} className="flex items-center justify-between py-3 border-t border-ink/15 first:border-t-0">
              <div className="text-sm">{x.l}</div>
              <Toggle on={notif[x.k]} onChange={v => setNotif({ ...notif, [x.k]: v })} />
            </div>
          ))}
        </div>

        <div className="border border-ink p-6">
          <div className="display text-2xl mb-4">{lang === 'es' ? 'Seguridad' : 'Security'}</div>
          <div className="space-y-3 text-sm">
            <Field label={lang === 'es' ? 'Contraseña actual' : 'Current password'} type="password" placeholder="••••••••" icon={Lock} />
            <Field label={lang === 'es' ? 'Nueva contraseña' : 'New password'} type="password" placeholder="••••••••" icon={Lock} />
          </div>
          <div className="flex justify-end mt-4"><Btn kind="solid" size="sm">{t.common.save}</Btn></div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="border border-ink p-6">
          <div className="display text-2xl mb-2">{lang === 'es' ? 'Idioma y moneda' : 'Language & currency'}</div>
          <div className="space-y-3 mt-5">
            <Select label={lang === 'es' ? 'Idioma' : 'Language'} value="es" onChange={() => {}} options={[{ label: 'English', value: 'en' }, { label: 'Español', value: 'es' }]} />
            <Select label={lang === 'es' ? 'Moneda' : 'Currency'} value="EUR" onChange={() => {}} options={['EUR','GBP','USD','JPY']} />
          </div>
        </div>

        <div className="border border-ink p-6 bg-chalk">
          <div className="display text-2xl mb-2">{lang === 'es' ? 'Cerrar sesión' : 'Sign out'}</div>
          <p className="text-sm text-ink/60 mb-4">{lang === 'es' ? 'Tu archivo permanece a salvo.' : 'Your archive stays safe.'}</p>
          <Btn kind="outline" icon={LogOut} onClick={onLogout}>{t.nav.logout}</Btn>
        </div>
      </div>
    </div>
  )
}

export function UserDashboard({ onOrderOpen }: { onOrderOpen?: (id: string) => void }) {
  const { t, lang, user, logout } = useApp()
  const [tab, setTab] = React.useState(0)
  const tabIds = t.user.tabs

  return (
    <section className="border-b border-ink">
      <div className="grid grid-cols-12 border-b border-ink">
        <div className="col-span-12 md:col-span-8 px-6 md:px-12 py-12 border-r border-ink">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-3">PRIVATE / CLIENT LEDGER</div>
          <div className="flex items-baseline gap-4 flex-wrap">
            <h1 className="display text-7xl md:text-8xl leading-none">{t.user.hello},</h1>
            <h1 className="display text-7xl md:text-8xl leading-none text-rust">{(user?.name || 'Olivia').split(' ')[0]}.</h1>
          </div>
          <div className="mt-6 flex items-center gap-6 mono text-[10px] uppercase tracking-[0.25em] text-ink/60">
            <span>{t.user.member} · 2023</span><span>·</span>
            <span>Lisboa, PT</span><span>·</span>
            <span>Tier · Atelier</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 grid grid-cols-3 md:grid-cols-1">
          <KPI label={t.user.activeOrders} value="2" trend="+1" />
          <KPI label={t.user.totalSpend} value="€18,420" trend="+€1.2k" border />
          <KPI label={t.user.loyalty} value="€340" trend="+€40" border />
        </div>
      </div>

      <div className="px-6 md:px-12">
        <Tabs tabs={tabIds.map((id: string, i: number) => ({ id: i, label: id }))} active={tab} onChange={v => setTab(v as number)} />
      </div>

      <div className="px-6 md:px-12 py-8 min-h-[60vh]">
        <PageFade k={tab}>
          {tab === 0 && <UserOverview onOrderOpen={onOrderOpen} />}
          {tab === 1 && <UserOrders onOrderOpen={onOrderOpen} />}
          {tab === 2 && <UserProfile user={user} />}
          {tab === 3 && <UserAddresses />}
          {tab === 4 && <UserWishlist />}
          {tab === 5 && <UserSettingsTab onLogout={logout} />}
        </PageFade>
      </div>
    </section>
  )
}
