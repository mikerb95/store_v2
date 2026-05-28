'use client'

import { useParams, useRouter } from 'next/navigation'
import { TopNav } from '@/components/ui/nav'
import { Footer } from '@/components/ui/footer'
import { OrderDetail } from '@/components/order/order-detail'
import { CartDrawer } from '@/components/ui/cart-drawer'
import { AuthModal } from '@/components/auth/auth-modal'
import { synthesizeOrder } from '@/lib/data'

export default function OrderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const order = synthesizeOrder(id)

  if (!order) {
    return (
      <>
        <TopNav />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="display text-6xl mb-4">404</div>
            <p className="text-ink/60">Order not found.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <OrderDetail order={order} onBack={() => router.push('/account')} />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </>
  )
}
