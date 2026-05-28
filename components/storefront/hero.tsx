'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useApp } from '@/context/app-context'
import { Btn } from '@/components/ui/primitives'

export function Hero({ onEnter }: { onEnter: () => void }) {
  const { t } = useApp()
  return (
    <section className="relative border-b border-ink overflow-hidden">
      <div className="grid grid-cols-12 min-h-[78vh]">
        {/* Left: copy */}
        <div className="col-span-12 md:col-span-7 px-6 md:px-12 py-12 md:py-20 flex flex-col justify-between relative">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-ink" />
            <span className="mono text-[10px] uppercase tracking-[0.3em]">{t.hero.season}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="display text-[18vw] md:text-[12vw] leading-[0.85] whitespace-pre-line my-8"
          >
            {t.hero.title}
          </motion.h1>
          <div className="flex flex-col gap-6 max-w-md">
            <p className="text-base text-ink/80">{t.hero.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Btn onClick={onEnter} kind="solid" size="lg" iconRight={ArrowRight}>{t.hero.cta}</Btn>
              <Btn kind="outline" size="lg">{t.hero.ctaAlt}</Btn>
            </div>
          </div>
        </div>

        {/* Right: image rail */}
        <div className="col-span-12 md:col-span-5 border-l border-ink relative">
          <div className="absolute inset-0 grid grid-rows-3">
            <div className="stripes-dark border-b border-ink relative">
              <div className="absolute inset-0 noise opacity-40" />
              <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-paper">M-01 · Architect&apos;s Coat</div>
              <div className="absolute bottom-4 right-4 mono text-[10px] uppercase tracking-[0.25em] text-paper">€1,240</div>
            </div>
            <div className="stripes-rust border-b border-ink relative">
              <div className="absolute inset-0 noise opacity-40" />
              <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-paper">M-04 · Workshop Shirt</div>
              <div className="absolute bottom-4 right-4 mono text-[10px] uppercase tracking-[0.25em] text-paper">€320</div>
            </div>
            <div className="stripes-sand relative">
              <div className="absolute inset-0 noise opacity-40" />
              <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-ink/70">M-02 · Pleated Trouser 04</div>
              <div className="absolute bottom-4 right-4 mono text-[10px] uppercase tracking-[0.25em] text-ink/70">€420</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="border-t border-ink bg-ink text-paper py-3 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          className="flex gap-12 whitespace-nowrap mono text-[11px] uppercase tracking-[0.3em]"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>SS / 26 — CAPSULE N° 04</span>
              <span className="opacity-60">·</span>
              <span>23 PIECES, ONE LANGUAGE</span>
              <span className="opacity-60">·</span>
              <span>SHIPPING WORLDWIDE FROM LISBOA</span>
              <span className="opacity-60">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
