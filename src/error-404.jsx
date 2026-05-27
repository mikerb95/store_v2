// 404 page

function Error404({ onHome, onCatalog }) {
  const { t } = useT();
  return (
    <section className="min-h-[80vh] grid grid-cols-12 border-b border-ink">
      <div className="col-span-12 md:col-span-7 border-r border-ink px-6 md:px-12 py-12 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-ink" />
          <span className="mono text-[10px] uppercase tracking-[0.3em]">Status / 404 — Off-pattern</span>
        </div>

        <Motion.motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="display select-none my-8 relative"
        >
          <div className="text-[34vw] md:text-[26vw] leading-[0.85] tracking-tight">404</div>
          <Motion.motion.div
            animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4 }}
            className="absolute inset-0 text-[34vw] md:text-[26vw] leading-[0.85] tracking-tight text-rust mix-blend-multiply pointer-events-none"
            style={{ clipPath: "inset(40% 0 40% 0)" }}
          >
            404
          </Motion.motion.div>
        </Motion.motion.div>

        <div className="max-w-md">
          <h1 className="display text-5xl md:text-6xl mb-3">{t.error.title}</h1>
          <p className="text-base text-ink/70 mb-8">{t.error.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Btn kind="solid" size="lg" icon={Icons.Home} onClick={onHome}>{t.error.home}</Btn>
            <Btn kind="outline" size="lg" icon={Icons.Search} onClick={onCatalog}>{t.error.search}</Btn>
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-5 relative grid grid-rows-4">
        <div className="stripes-rust border-b border-ink relative">
          <div className="absolute inset-0 noise opacity-40" />
          <div className="absolute top-3 left-3 mono text-[10px] uppercase tracking-[0.25em] text-paper">REJECTED PATTERN · A-12</div>
        </div>
        <div className="stripes-dark border-b border-ink relative">
          <div className="absolute inset-0 noise opacity-40" />
          <div className="absolute top-3 left-3 mono text-[10px] uppercase tracking-[0.25em] text-paper">CUTTING ROOM</div>
        </div>
        <div className="stripes-stone border-b border-ink relative">
          <div className="absolute top-3 left-3 mono text-[10px] uppercase tracking-[0.25em] text-ink/70">DRAFTING TABLE</div>
        </div>
        <div className="stripes-sand relative">
          <div className="absolute top-3 left-3 mono text-[10px] uppercase tracking-[0.25em] text-ink/70">FLOOR · LISBOA</div>
          <div className="absolute bottom-3 right-3 mono text-[10px] uppercase tracking-[0.25em] text-ink/70">CTRL-Z THE WORLD</div>
        </div>
      </div>
    </section>
  );
}

window.Error404 = Error404;
