'use client'

import { useApp } from '@/context/app-context'
import { TopNav } from '@/components/ui/nav'
import { Footer } from '@/components/ui/footer'
import { UserDashboard } from '@/components/user/user-dashboard'
import { CartDrawer } from '@/components/ui/cart-drawer'
import { AuthModal } from '@/components/auth/auth-modal'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { user, authOpen, openLogin } = useApp()
  const router = useRouter()

  if (!user && !authOpen) {
    openLogin()
  }

  return (
    <>
      <TopNav />
      <main className="flex-1">
        {user
          ? <UserDashboard onOrderOpen={id => router.push(`/order/${id}`)} />
          : <div className="min-h-[60vh] flex items-center justify-center"><div className="display text-3xl text-ink/40">Loading…</div></div>
        }
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </>
  )
}
