'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Package, Users, Newspaper, Mail, Truck, Settings, ExternalLink, Bell, Calendar, LogOut, ChevronRight } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { AdminTopBar } from '@/components/ui/nav'
import { Logo } from '@/components/ui/nav'
import { CartDrawer } from '@/components/ui/cart-drawer'
import { AuthModal } from '@/components/auth/auth-modal'

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard',  icon: Activity },
  { href: '/admin/products',  label: 'Products',   icon: Package },
  { href: '/admin/crm',       label: 'CRM',        icon: Users },
  { href: '/admin/cms',       label: 'CMS',        icon: Newspaper },
  { href: '/admin/social',    label: 'Social',     icon: Mail },
  { href: '/admin/orders',    label: 'Orders',     icon: Truck },
  { href: '/admin/settings',  label: 'Settings',   icon: Settings },
]

const SHORTCUTS = [
  { label: 'View storefront', icon: ExternalLink, href: '/' },
  { label: 'Notifications · 04', icon: Bell, href: '#' },
  { label: 'Atelier calendar', icon: Calendar, href: '#' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout } = useApp()

  return (
    <>
      <AdminTopBar />
      <div className="grid grid-cols-12 min-h-[calc(100vh-56px)]">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-ink text-paper md:border-r border-ink flex flex-col md:sticky md:top-14 md:self-start md:min-h-[calc(100vh-56px)] md:max-h-[calc(100vh-56px)] md:overflow-auto">
          <div className="p-5 border-b border-paper/15">
            <Logo size={28} light />
          </div>

          <div className="p-3 border-b border-paper/15">
            <div className="mono text-[9px] uppercase tracking-[0.3em] text-paper/50 px-2 py-2">Operations</div>
            {ADMIN_NAV.map(x => {
              const on = pathname === x.href || (x.href !== '/admin' && pathname.startsWith(x.href))
              return (
                <Link
                  key={x.href}
                  href={x.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 mono text-[10px] uppercase tracking-[0.22em] mb-0.5 ${on ? 'bg-paper text-ink' : 'text-paper/80 hover:bg-paper/10'}`}
                >
                  <x.icon size={14} />
                  <span className="flex-1 text-left">{x.label}</span>
                  {on && <ChevronRight size={12} />}
                </Link>
              )
            })}
          </div>

          <div className="p-3 flex-1">
            <div className="mono text-[9px] uppercase tracking-[0.3em] text-paper/50 px-2 py-2">Shortcuts</div>
            {SHORTCUTS.map((x, i) => (
              <Link key={i} href={x.href} className="w-full flex items-center gap-3 px-3 py-2.5 mono text-[10px] uppercase tracking-[0.22em] text-paper/70 hover:bg-paper/10">
                <x.icon size={14} />
                <span className="flex-1 text-left">{x.label}</span>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-paper/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-paper stripes-stone" />
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.22em]">Inês Costa</div>
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/50">Owner</div>
              </div>
            </div>
            <button onClick={logout} className="w-8 h-8 border border-paper/40 inline-flex items-center justify-center hover:bg-paper hover:text-ink">
              <LogOut size={12} />
            </button>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 bg-paper min-h-[calc(100vh-56px)]">
          {children}
        </main>
      </div>
      <CartDrawer />
      <AuthModal />
    </>
  )
}
