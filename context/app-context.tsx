'use client'

import React, { createContext, useContext, useState, useMemo } from 'react'
import { T } from '@/lib/translations'
import type { Lang } from '@/lib/data'
import { PRODUCTS } from '@/lib/data'
import type { Product } from '@/lib/data'

interface User {
  name: string
  email: string
}

interface AppContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: typeof T[Lang]
  user: User | null
  setUser: (u: User | null) => void
  logout: () => void
  cart: Product[]
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  authOpen: boolean
  setAuthOpen: (v: boolean) => void
  authMode: 'login' | 'signup'
  setAuthMode: (m: 'login' | 'signup') => void
  openLogin: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const [user, setUser] = useState<User | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const cart = useMemo(() => PRODUCTS.slice(0, 2), [])

  const logout = () => setUser(null)
  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }

  const value = useMemo<AppContextValue>(() => ({
    lang,
    setLang,
    t: T[lang],
    user,
    setUser,
    logout,
    cart,
    cartOpen,
    setCartOpen,
    authOpen,
    setAuthOpen,
    authMode,
    setAuthMode,
    openLogin,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [lang, user, cartOpen, authOpen, authMode, cart])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
