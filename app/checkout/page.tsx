'use client'

import { TopNav } from '@/components/ui/nav'
import { Footer } from '@/components/ui/footer'
import { CheckoutPage } from '@/components/checkout/checkout-page'
import { CartDrawer } from '@/components/ui/cart-drawer'
import { AuthModal } from '@/components/auth/auth-modal'

export default function Checkout() {
  return (
    <>
      <TopNav />
      <main className="flex-1">
        <CheckoutPage />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </>
  )
}
