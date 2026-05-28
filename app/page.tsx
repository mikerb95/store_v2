'use client'

import { useRef } from 'react'
import { TopNav } from '@/components/ui/nav'
import { Footer } from '@/components/ui/footer'
import { Hero } from '@/components/storefront/hero'
import { Catalog } from '@/components/storefront/catalog'
import { CartDrawer } from '@/components/ui/cart-drawer'
import { AuthModal } from '@/components/auth/auth-modal'

export default function StorefrontPage() {
  const catalogRef = useRef<HTMLElement>(null)

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      window.scrollTo({ top: catalogRef.current.offsetTop - 56, behavior: 'smooth' })
    }
  }

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <Hero onEnter={scrollToCatalog} />
        <Catalog catalogRef={catalogRef} />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </>
  )
}
