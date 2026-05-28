'use client'

import { Logo } from './nav'
import { useApp } from '@/context/app-context'

export function Footer() {
  const { lang, t } = useApp()
  return (
    <footer className="bg-ink text-paper">
      <div className="grid grid-cols-12 border-b border-paper/15">
        <div className="col-span-12 md:col-span-5 p-10 border-r border-paper/15">
          <Logo size={36} light />
          <div className="display text-5xl mt-8 leading-[0.95] max-w-md">
            {lang === 'es' ? 'Veintitrés piezas. Una sola voz.' : 'Twenty-three pieces. One voice.'}
          </div>
          <p className="text-sm text-paper/70 mt-6 max-w-sm">
            {lang === 'es' ? 'Apúntate al correo y recibe los lanzamientos un día antes.' : 'Join the list and get every drop a day before.'}
          </p>
          <div className="mt-4 flex border border-paper/30 h-12 max-w-md">
            <input className="flex-1 px-4 text-sm bg-transparent text-paper outline-none" placeholder={lang === 'es' ? 'tu@correo.com' : 'you@email.com'} />
            <button className="px-5 mono text-[10px] uppercase tracking-[0.25em] border-l border-paper/30 hover:bg-paper hover:text-ink">
              {lang === 'es' ? 'Suscribir' : 'Subscribe'}
            </button>
          </div>
        </div>
        <div className="col-span-6 md:col-span-2 p-10 border-r border-paper/15">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/50 mb-4">Shop</div>
          <ul className="space-y-2 text-sm text-paper/80">
            {t.catalog.categories.map((c: string) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2 p-10 border-r border-paper/15">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/50 mb-4">House</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>About</li><li>Press</li><li>Sustainability</li><li>Careers</li><li>Stores</li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-3 p-10">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/50 mb-4">Atelier</div>
          <address className="not-italic text-sm text-paper/80 leading-relaxed">
            Casa MONOLITH<br />
            Rua do Século 7<br />
            1200-433 Lisboa, PT<br />
            +351 21 397 4400
          </address>
        </div>
      </div>
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 mono text-[10px] uppercase tracking-[0.25em] text-paper/60">
        <div>{t.common.footerCopy}</div>
        <div className="flex gap-6">
          <span>Privacy</span><span>Terms</span><span>Cookies</span><span>Shipping</span>
        </div>
      </div>
    </footer>
  )
}
