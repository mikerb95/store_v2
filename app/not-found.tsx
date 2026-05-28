'use client'

import Link from 'next/link'
import { TopNav } from '@/components/ui/nav'
import { Footer } from '@/components/ui/footer'
import { Btn } from '@/components/ui/primitives'
import { useApp } from '@/context/app-context'

export default function NotFound() {
  const { t } = useApp()
  return (
    <>
      <TopNav />
      <main className="min-h-[80vh] grid grid-cols-12 border-b border-ink">
        <div className="col-span-12 md:col-span-7 px-6 md:px-12 py-20 border-r border-ink flex flex-col justify-between">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-3">{t.error.code}</div>
            <h1 className="display text-[18vw] md:text-[14vw] leading-[0.85] mb-6">{t.error.title}</h1>
            <p className="text-base text-ink/80 max-w-md">{t.error.sub}</p>
          </div>
          <div className="flex gap-3 mt-10 flex-wrap">
            <Link href="/"><Btn kind="solid" size="lg">{t.error.home}</Btn></Link>
            <Link href="/#catalog"><Btn kind="outline" size="lg">{t.error.search}</Btn></Link>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5 grid grid-rows-3">
          <div className="stripes-dark border-b border-ink relative"><div className="absolute inset-0 noise opacity-40" /></div>
          <div className="stripes-rust border-b border-ink relative"><div className="absolute inset-0 noise opacity-40" /></div>
          <div className="stripes-sand relative"><div className="absolute inset-0 noise opacity-40" /></div>
        </div>
      </main>
      <Footer />
    </>
  )
}
