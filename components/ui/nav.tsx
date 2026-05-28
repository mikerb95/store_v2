'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, User, Layers, ArrowLeft, Bell, Search } from 'lucide-react'
import { useApp } from '@/context/app-context'

export function Logo({ size = 40, light = false }: { size?: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`border ${light ? 'border-paper' : 'border-ink'} flex items-center justify-center`} style={{ width: size, height: size }}>
        <div className={`${light ? 'bg-paper' : 'bg-ink'}`} style={{ width: size / 5, height: size / 5 }} />
      </div>
      <div className="leading-none">
        <div className={`display text-2xl ${light ? 'text-paper' : 'text-ink'}`} style={{ letterSpacing: '0.04em' }}>MONOLITH</div>
        <div className={`mono text-[9px] uppercase tracking-[0.3em] ${light ? 'text-paper/60' : 'text-ink/60'}`}>ATELIER · LISBOA</div>
      </div>
    </div>
  )
}

export function TopNav() {
  const { lang, setLang, t, user, cart, setCartOpen, openLogin } = useApp()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: '/', label: t.nav.shop },
    { href: '/collections', label: t.nav.collections },
    { href: '/journal', label: t.nav.journal },
    { href: '/stores', label: t.nav.stores },
  ]

  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-ink">
      <div className="grid grid-cols-12 items-center h-14">
        <div className="col-span-3 px-5 border-r border-ink h-full flex items-center">
          <Link href="/" className="text-left">
            <Logo size={28} />
          </Link>
        </div>

        <nav className="col-span-5 h-full flex items-stretch">
          {navItems.map((n, i) => {
            const active = pathname === n.href
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`mono text-[10px] uppercase tracking-[0.25em] px-5 h-full flex items-center ${i > 0 ? 'border-l border-ink/10' : ''} ${active ? 'text-ink' : 'text-ink/60 hover:text-ink'}`}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div className="col-span-4 h-full flex items-stretch justify-end">
          <div className="h-full px-3 flex items-center border-l border-ink/10">
            <div className="border border-ink h-8 flex items-center">
              {(['en', 'es'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`mono text-[10px] uppercase tracking-[0.22em] h-full w-9 ${lang === l ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/5'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => user ? router.push('/account') : openLogin()}
            className="h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper whitespace-nowrap"
          >
            <User size={14} />
            {user ? user.name.split(' ')[0] : t.nav.login}
          </button>

          <Link
            href="/admin"
            className={`h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper whitespace-nowrap ${pathname.startsWith('/admin') ? 'bg-ink text-paper' : ''}`}
          >
            <Layers size={14} />
            {t.nav.admin}
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper whitespace-nowrap"
          >
            <ShoppingBag size={14} />
            {t.nav.cart} · {String(cart.length).padStart(2, '0')}
          </button>
        </div>
      </div>
    </header>
  )
}

export function AdminTopBar() {
  const { lang, setLang } = useApp()
  return (
    <header className="sticky top-0 z-30 bg-ink text-paper border-b border-ink">
      <div className="grid grid-cols-12 items-center h-14">
        <div className="col-span-3 px-5 border-r border-paper/15 h-full flex items-center">
          <Link href="/" className="flex items-center gap-2 mono text-[10px] uppercase tracking-[0.25em] hover:opacity-80">
            <ArrowLeft size={14} />
            <span>Back to storefront</span>
          </Link>
        </div>
        <div className="col-span-6 h-full flex items-center justify-center">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/70">MONOLITH · OPERATIONS · LISBOA</div>
        </div>
        <div className="col-span-3 h-full flex items-stretch justify-end">
          <div className="h-full px-3 flex items-center border-l border-paper/15">
            <div className="border border-paper h-8 flex items-center">
              {(['en', 'es'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`mono text-[10px] uppercase tracking-[0.22em] h-full w-9 ${lang === l ? 'bg-paper text-ink' : 'text-paper hover:bg-paper/10'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button className="h-full px-4 border-l border-paper/15 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-paper hover:text-ink">
            <Bell size={14} />04
          </button>
          <button className="h-full px-4 border-l border-paper/15 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-paper hover:text-ink">
            <Search size={14} />Search
          </button>
        </div>
      </div>
    </header>
  )
}
