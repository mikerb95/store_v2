'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CreditCard, Mail, Phone } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { Btn, Field, Select, StripePlaceholder } from '@/components/ui/primitives'
import { fmtMoney } from '@/lib/utils'
import type { Product } from '@/lib/data'

const COUNTRIES = ['Portugal','Spain','France','United Kingdom','Germany','Italy','Switzerland','Netherlands','Sweden','Denmark','United States','Canada','Mexico','Brazil','Japan','South Korea','Australia']

interface CartLine extends Product { size: string; qty: number; lineId: number }

interface OrderResult {
  id: string; date: string; items: CartLine[]; subtotal: number; shipping: number; tax: number; total: number
  form: typeof DEFAULT_FORM; deliveryOpt: { id: string; l: string; eta: string; price: number } | undefined; status: string
}

const DEFAULT_FORM = {
  email: 'olivia.b@arch.ch', phone: '+41 76 421 8800', guest: false, marketing: true,
  first: 'Olivia', last: 'Bauer', company: '', address1: 'Limmatquai 88', address2: '',
  city: 'Zürich', state: 'ZH', zip: '8001', country: 'Switzerland', sameBilling: true,
  delivery: 'express', payMethod: 'Card', cardNumber: '4242 4242 4242 4242',
  cardName: 'Olivia Bauer', cardExpiry: '08 / 28', cardCVC: '224', saveCard: true,
  promo: '', creditApplied: 0,
}

function CheckoutStep({ n, title, sub, active, done, onOpen, summary, children }: {
  n: number; title: string; sub?: string; active: boolean; done: boolean
  onOpen: () => void; summary?: string; children?: React.ReactNode
}) {
  const { t } = useApp()
  return (
    <div className={`border-t border-ink`}>
      <button onClick={() => !active && onOpen()} className={`w-full text-left px-6 md:px-10 py-5 flex items-center gap-4 ${active ? 'pointer-events-none' : 'hover:bg-chalk'}`}>
        <span className={`mono text-[11px] uppercase tracking-[0.22em] w-9 h-9 inline-flex items-center justify-center border ${active ? 'bg-ink text-paper border-ink' : done ? 'border-ink' : 'border-ink/30 text-ink/40'}`}>
          {done && !active ? <Check size={14} /> : String(n).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="display text-3xl leading-tight">{title}</div>
          {!active && done && summary && <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 truncate mt-1">{summary}</div>}
          {!active && !done && sub && <div className="text-xs text-ink/50 mt-1 truncate">{sub}</div>}
        </div>
        {!active && done && <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/60 hover:text-ink underline underline-offset-4">{t.checkout.review.editStep}</span>}
      </button>
      {active && (
        <div className="px-6 md:px-10 pb-8 om-step-open">
          {sub && <p className="text-sm text-ink/70 mb-6 max-w-xl">{sub}</p>}
          {children}
        </div>
      )}
    </div>
  )
}

function StepActions({ onNext, onBack, nextLabel }: { onNext?: () => void; onBack?: () => void; nextLabel?: string }) {
  const { t } = useApp()
  return (
    <div className="flex items-center justify-between gap-2 mt-6 pt-5 border-t border-ink/15">
      {onBack ? <Btn kind="ghost" icon={ArrowLeft} onClick={onBack}>{t.common.back}</Btn> : <div />}
      <Btn kind="solid" iconRight={ArrowRight} onClick={onNext}>{nextLabel || t.common.next}</Btn>
    </div>
  )
}

function OrderSummary({ lines, subtotal, shipping, tax, total, form, setForm, deliveryOpt }: {
  lines: CartLine[]; subtotal: number; shipping: number; tax: number; total: number
  form: typeof DEFAULT_FORM; setForm: (f: typeof DEFAULT_FORM) => void
  deliveryOpt: { l: string } | undefined
}) {
  const { t, lang } = useApp()
  const applyPromo = () => {
    if (form.promo.trim().toLowerCase() === 'atelier') setForm({ ...form, creditApplied: 80 })
  }
  return (
    <div className="bg-chalk min-h-full border-l border-ink lg:border-l-0">
      <div className="px-6 md:px-8 py-8">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">02 / {t.checkout.summary.title}</div>
        <div className="flex items-baseline justify-between">
          <h2 className="display text-4xl">{lines.length} {t.checkout.summary.items}</h2>
          <button className="mono text-[10px] uppercase tracking-[0.22em] underline underline-offset-4">{t.checkout.summary.edit}</button>
        </div>

        <div className="mt-5 space-y-3">
          {lines.map(l => (
            <div key={l.lineId} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-3"><StripePlaceholder stripe={l.stripe} aspect="3/4" /></div>
              <div className="col-span-7">
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{l.id}</div>
                <div className="display text-lg leading-tight">{l.name[lang as 'en' | 'es']}</div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 mt-1">{t.checkout.summary.size} {l.size} · ×{l.qty}</div>
              </div>
              <div className="col-span-2 text-right display text-base">{fmtMoney(l.price, 'EUR', lang as 'en' | 'es')}</div>
            </div>
          ))}
        </div>

        <div className="border border-ink mt-6 flex">
          <input value={form.promo} onChange={e => setForm({ ...form, promo: e.target.value })} placeholder={t.checkout.summary.promo} className="flex-1 px-4 h-12 bg-transparent outline-none text-sm" />
          <button onClick={applyPromo} className="mono text-[10px] uppercase tracking-[0.22em] border-l border-ink px-4 hover:bg-ink hover:text-paper">{t.checkout.summary.apply}</button>
        </div>

        <div className="mt-6 border-t border-ink/30 pt-5 space-y-2">
          {[
            { k: t.checkout.summary.subtotal, v: fmtMoney(subtotal, 'EUR', lang as 'en' | 'es') },
            { k: `${t.checkout.summary.shipping} · ${deliveryOpt?.l || ''}`, v: shipping === 0 ? (lang === 'es' ? 'Gratis' : 'Free') : fmtMoney(shipping, 'EUR', lang as 'en' | 'es') },
            { k: t.checkout.summary.tax, v: fmtMoney(tax, 'EUR', lang as 'en' | 'es') },
          ].map((r, i) => (
            <div key={i} className="flex items-baseline justify-between gap-4">
              <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/70 truncate">{r.k}</div>
              <div className="text-sm">{r.v}</div>
            </div>
          ))}
          {form.creditApplied > 0 && (
            <div className="flex items-baseline justify-between gap-4">
              <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/70">{t.checkout.summary.credit}</div>
              <div className="text-sm text-rust">− {fmtMoney(form.creditApplied, 'EUR', lang as 'en' | 'es')}</div>
            </div>
          )}
        </div>
        <div className="mt-5 border-t border-ink pt-5 flex items-baseline justify-between">
          <div className="display text-2xl">{t.checkout.summary.total}</div>
          <div className="display text-4xl">{fmtMoney(total, 'EUR', lang as 'en' | 'es')}</div>
        </div>

        <div className="mt-8 space-y-3">
          {t.checkout.summary.confidence.map((c: string, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <Check size={14} className="mt-1 text-rust flex-shrink-0" />
              <div className="text-xs text-ink/70 leading-relaxed">{c}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CheckoutSuccess({ order, onView, onKeep }: { order: OrderResult; onView: () => void; onKeep: () => void }) {
  const { t, lang } = useApp()
  return (
    <section className="border-b border-ink min-h-[80vh] grid grid-cols-12">
      <div className="col-span-12 md:col-span-7 px-6 md:px-12 py-12 border-r border-ink flex flex-col justify-between">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-3">{t.checkout.success.eyebrow}</div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="display text-7xl md:text-[10vw] leading-[0.9] mb-6">
            {t.checkout.success.title.toUpperCase()}.
          </motion.h1>
          <p className="text-base text-ink/80 max-w-lg">{t.checkout.success.sub}</p>
          <div className="mt-10 border border-ink inline-flex flex-wrap">
            <div className="px-5 py-4 border-r border-ink">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.order.title}</div>
              <div className="display text-3xl mt-1">{order.id}</div>
            </div>
            <div className="px-5 py-4 border-r border-ink">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.checkout.summary.total}</div>
              <div className="display text-3xl mt-1">{fmtMoney(order.total, 'EUR', lang as 'en' | 'es')}</div>
            </div>
            <div className="px-5 py-4">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.order.arrival}</div>
              <div className="display text-3xl mt-1">{order.deliveryOpt?.eta}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-10 flex-wrap">
          <Btn kind="solid" size="lg" iconRight={ArrowRight} onClick={onView}>{t.checkout.success.viewOrder}</Btn>
          <Btn kind="outline" size="lg" onClick={onKeep}>{t.checkout.success.keep}</Btn>
        </div>
      </div>
      <div className="col-span-12 md:col-span-5 grid grid-rows-3">
        <div className="stripes-dark border-b border-ink relative"><div className="absolute inset-0 noise opacity-40" /></div>
        <div className="stripes-rust border-b border-ink relative"><div className="absolute inset-0 noise opacity-40" /></div>
        <div className="stripes-sand relative"><div className="absolute inset-0 noise opacity-40" /></div>
      </div>
    </section>
  )
}

export function CheckoutPage({ onSuccess }: { onSuccess?: (order: OrderResult) => void }) {
  const { t, lang, cart } = useApp()
  const [step, setStep] = React.useState(0)
  const [completed, setCompleted] = React.useState(new Set<number>())
  const [placing, setPlacing] = React.useState(false)
  const [placedOrder, setPlacedOrder] = React.useState<OrderResult | null>(null)
  const [form, setForm] = React.useState(DEFAULT_FORM)

  const lines: CartLine[] = cart.map((p, i) => ({ ...p, size: ['M','L','S','XL'][i % 4], qty: 1, lineId: i }))
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0)
  const deliveryOpt = t.checkout.delivery.options.find((o: { id: string }) => o.id === form.delivery)
  const shipping = deliveryOpt?.price || 0
  const tax = Math.round(subtotal * 0.23)
  const total = subtotal + shipping + tax - form.creditApplied

  const next = () => { setCompleted(s => new Set([...s, step])); setStep(s => Math.min(s + 1, 4)) }
  const goto = (i: number) => setStep(i)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })

  const place = () => {
    setPlacing(true)
    setTimeout(() => {
      const order: OrderResult = {
        id: 'MO-' + String(58320 + Math.floor(Math.random() * 80)).padStart(5, '0'),
        date: new Date().toISOString().slice(0, 10),
        items: lines, subtotal, shipping, tax, total, form, deliveryOpt, status: 'preparing',
      }
      setPlacedOrder(order)
      setPlacing(false)
      onSuccess?.(order)
    }, 1100)
  }

  if (placedOrder) {
    return <CheckoutSuccess order={placedOrder} onView={() => {}} onKeep={() => { setPlacedOrder(null); setStep(0) }} />
  }

  return (
    <section className="border-b border-ink">
      {/* Progress */}
      <div className="border-b border-ink">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-12 md:col-span-3 px-6 md:px-10 py-5 border-r border-ink">
            <div className="mono text-[10px] uppercase tracking-[0.25em] inline-flex items-center gap-2 text-ink/60">
              <ArrowLeft size={14} /> {lang === 'es' ? 'Seguir comprando' : 'Keep shopping'}
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-5 h-16 border-t md:border-t-0 border-ink/10">
              {t.checkout.steps.map((label: string, i: number) => {
                const done = completed.has(i)
                const active = step === i
                return (
                  <button key={label} onClick={() => (done || active || i < step) && goto(i)} disabled={!done && !active && i > step}
                    className={`relative flex items-center justify-center gap-3 px-3 ${i > 0 ? 'border-l border-ink' : ''} ${active ? 'bg-ink text-paper' : done ? 'text-ink hover:bg-ink/5' : 'text-ink/40'}`}>
                    <span className={`mono text-[10px] uppercase tracking-[0.22em] w-6 h-6 inline-flex items-center justify-center border ${active ? 'border-paper' : done ? 'border-ink' : 'border-ink/30'}`}>
                      {done ? <Check size={12} /> : String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mono text-[10px] uppercase tracking-[0.22em] hidden md:inline">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 border-r border-ink">
          <div className="px-6 md:px-10 py-10">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">{t.checkout.eyebrow}</div>
            <h1 className="display text-5xl md:text-6xl">{t.checkout.title}</h1>
          </div>

          <CheckoutStep n={1} title={t.checkout.contact.title} sub={t.checkout.contact.sub} active={step === 0} done={completed.has(0)} onOpen={() => goto(0)} summary={`${form.email} · ${form.phone}`}>
            <div className="space-y-4 max-w-2xl">
              <Field label={t.checkout.contact.email} type="email" value={form.email} onChange={set('email') as (e: React.ChangeEvent<HTMLInputElement>) => void} icon={Mail} />
              <Field label={t.checkout.contact.phone} value={form.phone} onChange={set('phone') as (e: React.ChangeEvent<HTMLInputElement>) => void} icon={Phone} />
              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input type="checkbox" className="check" checked={form.marketing} onChange={e => setForm({ ...form, marketing: e.target.checked })} />
                <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/80">{t.checkout.contact.marketing}</span>
              </label>
            </div>
            <StepActions onNext={next} />
          </CheckoutStep>

          <CheckoutStep n={2} title={t.checkout.shipping.title} sub={t.checkout.shipping.sub} active={step === 1} done={completed.has(1)} onOpen={() => goto(1)} summary={`${form.first} ${form.last}, ${form.address1}, ${form.zip} ${form.city}`}>
            <div className="grid grid-cols-2 gap-4 max-w-3xl">
              <Field label={t.checkout.shipping.first} value={form.first} onChange={set('first') as (e: React.ChangeEvent<HTMLInputElement>) => void} />
              <Field label={t.checkout.shipping.last} value={form.last} onChange={set('last') as (e: React.ChangeEvent<HTMLInputElement>) => void} />
              <div className="col-span-2"><Field label={t.checkout.shipping.address1} value={form.address1} onChange={set('address1') as (e: React.ChangeEvent<HTMLInputElement>) => void} /></div>
              <Field label={t.checkout.shipping.zip} value={form.zip} onChange={set('zip') as (e: React.ChangeEvent<HTMLInputElement>) => void} />
              <Field label={t.checkout.shipping.city} value={form.city} onChange={set('city') as (e: React.ChangeEvent<HTMLInputElement>) => void} />
              <Select label={t.checkout.shipping.country} value={form.country} onChange={set('country')} options={COUNTRIES} />
            </div>
            <StepActions onNext={next} onBack={() => goto(0)} />
          </CheckoutStep>

          <CheckoutStep n={3} title={t.checkout.delivery.title} sub={t.checkout.delivery.sub} active={step === 2} done={completed.has(2)} onOpen={() => goto(2)} summary={deliveryOpt ? `${deliveryOpt.l} · ${deliveryOpt.eta}` : ''}>
            <div className="space-y-3">
              {t.checkout.delivery.options.map((o: { id: string; l: string; sub: string; note?: string; price: number; eta: string }) => {
                const on = form.delivery === o.id
                return (
                  <button key={o.id} onClick={() => setForm({ ...form, delivery: o.id })}
                    className={`w-full text-left border ${on ? 'border-ink bg-chalk' : 'border-ink/25 hover:border-ink'} p-5 grid grid-cols-12 gap-4 items-center`}>
                    <div className="col-span-1">
                      <span className={`w-5 h-5 border ${on ? 'bg-ink border-ink' : 'border-ink/40'} inline-block relative`}>
                        {on && <span className="absolute inset-1 bg-paper" />}
                      </span>
                    </div>
                    <div className="col-span-9">
                      <div className="display text-2xl">{o.l}</div>
                      <div className="text-sm text-ink/70 mt-1">{o.sub}</div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="display text-2xl">{o.price === 0 ? (lang === 'es' ? 'Gratis' : 'Free') : fmtMoney(o.price, 'EUR', lang as 'en' | 'es')}</div>
                      <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/60 mt-1">{o.eta}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            <StepActions onNext={next} onBack={() => goto(1)} />
          </CheckoutStep>

          <CheckoutStep n={4} title={t.checkout.payment.title} sub={t.checkout.payment.sub} active={step === 3} done={completed.has(3)} onOpen={() => goto(3)} summary={`${form.payMethod} · •••• ${form.cardNumber.slice(-4)}`}>
            <div className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-4 gap-2">
                {t.checkout.payment.methods.map((m: string) => (
                  <button key={m} onClick={() => setForm({ ...form, payMethod: m })} className={`border h-12 mono text-[10px] uppercase tracking-[0.22em] ${form.payMethod === m ? 'bg-ink text-paper border-ink' : 'border-ink/30 hover:border-ink'}`}>{m}</button>
                ))}
              </div>
              {form.payMethod === 'Card' && (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                    <div className="border border-ink bg-ink text-paper p-5 flex flex-col gap-6 h-44 relative overflow-hidden">
                      <div className="absolute inset-0 noise opacity-30" />
                      <div className="relative flex items-center justify-between">
                        <div className="mono text-[10px] uppercase tracking-[0.25em] text-paper/60">MONOLITH · Card</div>
                        <div className="display text-xl">VISA</div>
                      </div>
                      <div className="relative"><div className="mono text-base tracking-[0.18em]">{form.cardNumber || '0000 0000 0000 0000'}</div></div>
                      <div className="relative grid grid-cols-2">
                        <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/50">Name</div><div className="mono text-sm">{form.cardName || '—'}</div></div>
                        <div className="text-right"><div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/50">Exp.</div><div className="mono text-sm">{form.cardExpiry || '—'}</div></div>
                      </div>
                    </div>
                    <Field label={t.checkout.payment.cardNumber} value={form.cardNumber} onChange={set('cardNumber') as (e: React.ChangeEvent<HTMLInputElement>) => void} icon={CreditCard} />
                    <Field label={t.checkout.payment.cardName} value={form.cardName} onChange={set('cardName') as (e: React.ChangeEvent<HTMLInputElement>) => void} />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label={t.checkout.payment.cardExpiry} value={form.cardExpiry} onChange={set('cardExpiry') as (e: React.ChangeEvent<HTMLInputElement>) => void} placeholder="MM / YY" />
                      <Field label={t.checkout.payment.cardCVC} value={form.cardCVC} onChange={set('cardCVC') as (e: React.ChangeEvent<HTMLInputElement>) => void} placeholder="•••" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            <StepActions onNext={next} onBack={() => goto(2)} />
          </CheckoutStep>

          <CheckoutStep n={5} title={t.checkout.review.title} sub={t.checkout.review.sub} active={step === 4} done={false} onOpen={() => goto(4)}>
            <div className="border-t border-ink pt-5 mt-6 flex items-center justify-between gap-4 flex-wrap">
              <label className="flex items-start gap-2 cursor-pointer max-w-md">
                <input type="checkbox" className="check mt-0.5" defaultChecked />
                <span className="text-xs text-ink/70">{t.checkout.payment.terms}</span>
              </label>
              <Btn kind="solid" size="lg" iconRight={ArrowRight} onClick={place} disabled={placing}>
                {placing ? t.checkout.payment.placing : `${t.checkout.payment.place} · ${fmtMoney(total, 'EUR', lang as 'en' | 'es')}`}
              </Btn>
            </div>
          </CheckoutStep>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-14">
            <OrderSummary lines={lines} subtotal={subtotal} shipping={shipping} tax={tax} total={total} form={form} setForm={setForm} deliveryOpt={deliveryOpt} />
          </div>
        </aside>
      </div>
    </section>
  )
}
