'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { useRouter } from 'next/navigation'
import { StripePlaceholder } from './primitives'
import { fmtMoney } from '@/lib/utils'

export function CartDrawer() {
  const { lang, cart, cartOpen, setCartOpen } = useApp()
  const router = useRouter()
  const total = cart.reduce((a, b) => a + b.price, 0)

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-ink/60 z-40"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[460px] bg-paper border-l border-ink z-50 flex flex-col"
          >
            <div className="p-6 border-b border-ink flex items-center justify-between">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{lang === 'es' ? 'Bolso' : 'Cart'}</div>
                <div className="display text-4xl">{cart.length} {lang === 'es' ? 'piezas' : 'pieces'}</div>
              </div>
              <button onClick={() => setCartOpen(false)} className="w-10 h-10 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {cart.length === 0 && (
                <div className="p-12 text-center text-ink/60">
                  <ShoppingBag size={28} className="mx-auto" />
                  <div className="display text-3xl mt-4">{lang === 'es' ? 'Bolso vacío' : 'Empty bag'}</div>
                  <p className="text-sm mt-1">{lang === 'es' ? 'Explora la colección y reserva piezas.' : 'Explore the collection and reserve pieces.'}</p>
                </div>
              )}
              {cart.map((p, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-4 border-b border-ink/15">
                  <div className="col-span-3"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                  <div className="col-span-7">
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{p.id}</div>
                    <div className="display text-xl">{p.name[lang as 'en' | 'es']}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 mt-1">Size · M · 1</div>
                  </div>
                  <div className="col-span-2 text-right display text-xl">{fmtMoney(p.price, 'EUR', lang as 'en' | 'es')}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink p-6">
              <div className="flex items-baseline justify-between mb-4">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">Total</div>
                <div className="display text-4xl">{fmtMoney(total, 'EUR', lang as 'en' | 'es')}</div>
              </div>
              <button
                onClick={() => { setCartOpen(false); router.push('/checkout') }}
                className="btn w-full h-14 px-7 text-sm bg-ink text-paper hover:bg-rust inline-flex items-center justify-center gap-2"
              >
                <span>{lang === 'es' ? 'Ir a la caja' : 'Checkout'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
