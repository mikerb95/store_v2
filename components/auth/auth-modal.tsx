'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Lock, AlertTriangle, ArrowRight } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { Field, Btn } from '@/components/ui/primitives'

export function AuthModal() {
  const { lang, t, authOpen, setAuthOpen, authMode, setAuthMode, setUser } = useApp()
  const [form, setForm] = React.useState({ name: '', email: '', password: '', confirm: '', remember: true, agree: false })
  const [errors, setErrors] = React.useState<Record<string, boolean>>({})
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (authOpen) { setErrors({}); setLoading(false) }
  }, [authOpen, authMode])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, boolean> = {}
    if (authMode === 'signup' && !form.name.trim()) errs.name = true
    if (!/.+@.+\..+/.test(form.email)) errs.email = true
    if (form.password.length < 8) errs.password = true
    if (authMode === 'signup' && form.confirm !== form.password) errs.confirm = true
    if (authMode === 'signup' && !form.agree) errs.agree = true
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(() => {
      setUser({ name: form.name || form.email.split('@')[0], email: form.email })
      setAuthOpen(false)
      setLoading(false)
    }, 700)
  }

  return (
    <AnimatePresence>
      {authOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAuthOpen(false)}
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-paper border border-ink w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 pointer-events-auto max-h-[92vh] overflow-auto">
              {/* Left poster */}
              <div className="hidden md:flex relative bg-ink text-paper p-12 flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-paper inline-flex items-center justify-center">
                    <div className="w-2 h-2 bg-paper" />
                  </div>
                  <div>
                    <div className="display text-2xl leading-none">MONOLITH</div>
                    <div className="mono text-[9px] uppercase tracking-[0.3em] text-paper/60">Atelier · Lisboa</div>
                  </div>
                </div>
                <div className="absolute inset-12 grid place-items-center pointer-events-none">
                  <div className="display text-[10vw] leading-[0.85] opacity-90">M</div>
                </div>
                <div>
                  <div className="display text-5xl leading-[0.95] mb-4 whitespace-pre-line">
                    {lang === 'es' ? 'EL ARCHIVO\nES TUYO.' : 'THE ARCHIVE\nIS YOURS.'}
                  </div>
                  <p className="text-sm text-paper/70 max-w-xs">
                    {lang === 'es'
                      ? 'Pedidos, pruebas, prendas guardadas y un crédito atelier que crece con cada temporada.'
                      : 'Orders, fittings, saved looks and an atelier credit that grows each season.'}
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div>
                      <div className="display text-3xl">23</div>
                      <div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/60">{lang === 'es' ? 'Piezas' : 'Pieces'}</div>
                    </div>
                    <div>
                      <div className="display text-3xl">06</div>
                      <div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/60">{lang === 'es' ? 'Categorías' : 'Categories'}</div>
                    </div>
                    <div>
                      <div className="display text-3xl">14</div>
                      <div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/60">{lang === 'es' ? 'Ciudades' : 'Cities'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right form */}
              <div className="relative p-8 md:p-12">
                <button onClick={() => setAuthOpen(false)} className="absolute top-4 right-4 w-10 h-10 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper">
                  <X size={16} />
                </button>

                <div className="flex mb-8 border-b border-ink/20">
                  {(['login', 'signup'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setAuthMode(m)}
                      className={`mono text-[11px] uppercase tracking-[0.25em] px-5 h-11 -mb-px ${authMode === m ? 'border-b-2 border-ink text-ink' : 'text-ink/40 hover:text-ink'}`}
                    >
                      {m === 'login' ? t.nav.login : t.nav.signup}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={authMode}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">
                      {authMode === 'login' ? '01 / Identification' : '01 / Open ledger'}
                    </div>
                    <h2 className="display text-5xl mb-2">{authMode === 'login' ? t.auth.loginTitle : t.auth.signupTitle}</h2>
                    <p className="text-sm text-ink/70 mb-8">{authMode === 'login' ? t.auth.loginSub : t.auth.signupSub}</p>

                    <form onSubmit={submit} className="space-y-4">
                      {authMode === 'signup' && (
                        <Field label={t.auth.name} value={form.name} onChange={set('name')} placeholder="Olivia Bauer" icon={User} />
                      )}
                      <Field label={t.auth.email} type="email" value={form.email} onChange={set('email')} placeholder="olivia@studio.ch" icon={Mail} />
                      <Field label={t.auth.password} type="password" value={form.password} onChange={set('password')} placeholder="••••••••" icon={Lock} hint={authMode === 'signup' ? t.auth.passwordHint : undefined} />
                      {authMode === 'signup' && (
                        <Field label={t.auth.confirm} type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" icon={Lock} />
                      )}

                      {Object.keys(errors).length > 0 && (
                        <div className="border border-rust bg-rust/5 text-rust p-3 mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                          <AlertTriangle size={14} />
                          {lang === 'es' ? 'Revisa los campos marcados' : 'Please check the marked fields'}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm pt-2">
                        {authMode === 'login' ? (
                          <>
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="check" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
                              <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/70">{t.auth.remember}</span>
                            </label>
                            <button type="button" className="mono text-[10px] uppercase tracking-[0.22em] underline underline-offset-4">{t.auth.forgot}</button>
                          </>
                        ) : (
                          <label className="inline-flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" className="check mt-0.5" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} />
                            <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/70 leading-relaxed">{t.auth.agree}</span>
                          </label>
                        )}
                      </div>

                      <Btn type="submit" kind="solid" size="lg" full iconRight={ArrowRight} disabled={loading}>
                        {loading ? '…' : t.auth.continue}
                      </Btn>

                      <div className="flex items-center gap-3 pt-4">
                        <div className="flex-1 h-px bg-ink/20" />
                        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/50">{t.auth.orContinue}</div>
                        <div className="flex-1 h-px bg-ink/20" />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {['Apple', 'Google', 'Email'].map((s) => (
                          <button key={s} type="button" className="border border-ink h-12 mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper">
                            {s}
                          </button>
                        ))}
                      </div>

                      <div className="text-center pt-4">
                        <button
                          type="button"
                          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                          className="mono text-[10px] uppercase tracking-[0.22em] text-ink/60 hover:text-ink underline underline-offset-4"
                        >
                          {authMode === 'login' ? t.auth.switchToSignup : t.auth.switchToLogin}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
