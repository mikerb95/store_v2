// Storefront: hero + catalog + filters + quick view modal

function Hero({ onEnter }) {
  const { t, lang } = useT();
  return (
    <section className="relative border-b border-ink overflow-hidden">
      <div className="grid grid-cols-12 min-h-[78vh]">
        {/* Left: copy */}
        <div className="col-span-12 md:col-span-7 px-6 md:px-12 py-12 md:py-20 flex flex-col justify-between relative">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-ink" />
            <span className="mono text-[10px] uppercase tracking-[0.3em]">{t.hero.season}</span>
          </div>
          <Motion.motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2,0.8,0.2,1] }}
            className="display text-[18vw] md:text-[12vw] leading-[0.85] whitespace-pre-line my-8"
          >
            {t.hero.title}
          </Motion.motion.h1>
          <div className="flex flex-col gap-6 max-w-md">
            <p className="text-base text-ink/80">{t.hero.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Btn onClick={onEnter} kind="solid" size="lg" iconRight={Icons.ArrowRight}>{t.hero.cta}</Btn>
              <Btn kind="outline" size="lg">{t.hero.ctaAlt}</Btn>
            </div>
          </div>
        </div>
        {/* Right: image rail */}
        <div className="col-span-12 md:col-span-5 border-l border-ink relative">
          <div className="absolute inset-0 grid grid-rows-3">
            <div className="stripes-dark border-b border-ink relative">
              <div className="absolute inset-0 noise opacity-40" />
              <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-paper">M-01 · Architect's Coat</div>
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

      {/* marquee */}
      <div className="border-t border-ink bg-ink text-paper py-3 overflow-hidden">
        <Motion.motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="flex gap-12 whitespace-nowrap mono text-[11px] uppercase tracking-[0.3em]"
        >
          {Array.from({length: 12}).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>SS / 26 — CAPSULE N° 04</span>
              <span className="opacity-60">·</span>
              <span>23 PIECES, ONE LANGUAGE</span>
              <span className="opacity-60">·</span>
              <span>SHIPPING WORLDWIDE FROM LISBOA</span>
              <span className="opacity-60">·</span>
            </span>
          ))}
        </Motion.motion.div>
      </div>
    </section>
  );
}

// ─── Filters rail ───────────────────────────────────────────────
function FiltersRail({ filters, setFilters, onClear }) {
  const { t } = useT();
  const toggle = (key, val) => {
    setFilters((f) => {
      const set = new Set(f[key]);
      set.has(val) ? set.delete(val) : set.add(val);
      return { ...f, [key]: [...set] };
    });
  };
  const Group = ({ title, items, k }) => (
    <div className="border-t border-ink/20 py-5">
      <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/70 mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((v, i) => {
          const label = typeof v === "string" ? v : v.label;
          const value = typeof v === "string" ? v : v.value;
          const on = filters[k].includes(value);
          return (
            <button
              key={value}
              onClick={() => toggle(k, value)}
              className={`mono text-[10px] uppercase tracking-[0.2em] border h-8 px-3 ${on ? "bg-ink text-paper border-ink" : "border-ink/30 hover:border-ink"}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
  return (
    <aside className="sticky top-[57px] self-start">
      <div className="border border-ink bg-paper">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink">
          <div className="display text-2xl flex items-center gap-2"><Icons.Filter size={16} /> {t.catalog.filters}</div>
          <button onClick={onClear} className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 hover:text-ink">{t.catalog.clear}</button>
        </div>
        <div className="px-5 pb-5">
          <Group title={t.catalog.category} items={t.catalog.categories.map((c,i) => ({label:c, value: T.en.catalog.categories[i]}))} k="category" />
          <Group title={t.catalog.size} items={t.catalog.sizes} k="size" />
          <Group title={t.catalog.color} items={t.catalog.colors.map((c,i)=>({label:c, value: T.en.catalog.colors[i]}))} k="color" />
          <Group title={t.catalog.material} items={t.catalog.materials.map((c,i)=>({label:c, value: T.en.catalog.materials[i]}))} k="material" />
          <Group title={t.catalog.price} items={[
            {label:"€0 — €400", value:"0-400"},
            {label:"€400 — €800", value:"400-800"},
            {label:"€800 — €1,500", value:"800-1500"},
            {label:"€1,500+", value:"1500+"},
          ]} k="price" />
        </div>
      </div>
    </aside>
  );
}

// ─── Product card ───────────────────────────────────────────────
const ProductCard = React.forwardRef(function ProductCard({ p, onQuick }, ref) {
  const { t, lang } = useT();
  const [hover, setHover] = React.useState(false);
  const totalStock = Object.values(p.stock).reduce((a,b)=>a+b,0);
  const soldOut = totalStock === 0;
  return (
    <Motion.motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="group relative border border-ink bg-paper flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <StripePlaceholder stripe={p.stripe} label={`${p.id} · ${p.material}`} />
        {p.new && <div className="absolute top-3 left-3"><Tag tone="rust">{t.catalog.new}</Tag></div>}
        {soldOut && <div className="absolute top-3 left-3"><Tag tone="paper">{t.catalog.sold}</Tag></div>}
        <Motion.motion.div
          animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 10 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-x-0 bottom-0 p-3 flex gap-2"
        >
          <Btn kind="solid" size="sm" full icon={Icons.Eye} onClick={() => onQuick(p)}>{t.catalog.quickView}</Btn>
        </Motion.motion.div>
      </div>
      <div className="border-t border-ink p-4 flex items-start justify-between gap-3">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50 mb-1">{p.id}</div>
          <h3 className="display text-xl">{p.name[lang]}</h3>
          <div className="flex items-center gap-1.5 mt-2">
            {p.colors.map((c, i) => (
              <span key={i} className="w-3 h-3 border border-ink" style={{ background: p.colorChip }} />
            ))}
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50 ml-2">{p.colors.length} {p.colors.length === 1 ? "colour" : "colours"}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="display text-2xl">{fmtMoney(p.price, "EUR", lang)}</div>
        </div>
      </div>
    </Motion.motion.div>
  );
});

// ─── Catalog ────────────────────────────────────────────────────
function Catalog() {
  const { t, lang } = useT();
  const [filters, setFilters] = React.useState({ category: [], size: [], color: [], material: [], price: [] });
  const [sort, setSort] = React.useState(0);
  const [quick, setQuick] = React.useState(null);

  const inPrice = (p, ranges) => {
    if (!ranges.length) return true;
    return ranges.some((r) => {
      if (r === "1500+") return p.price >= 1500;
      const [a,b] = r.split("-").map(Number);
      return p.price >= a && p.price <= b;
    });
  };

  const filtered = PRODUCTS.filter((p) => {
    if (filters.category.length && !filters.category.includes(p.cat)) return false;
    if (filters.size.length && !p.sizes.some((s) => filters.size.includes(s))) return false;
    if (filters.color.length && !p.colors.some((c) => filters.color.includes(c))) return false;
    if (filters.material.length && !filters.material.includes(p.material)) return false;
    if (!inPrice(p, filters.price)) return false;
    return true;
  }).sort((a,b) => {
    if (sort === 1) return a.price - b.price;
    if (sort === 2) return b.price - a.price;
    if (sort === 3) return (b.id < a.id ? 1 : -1);
    return a.id < b.id ? 1 : -1;
  });

  const clear = () => setFilters({ category: [], size: [], color: [], material: [], price: [] });

  return (
    <section id="catalog" className="bg-paper">
      {/* heading band */}
      <div className="border-b border-ink px-6 md:px-12 py-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">SS/26 · {t.catalog.title}</div>
            <h2 className="display text-7xl md:text-8xl">{t.catalog.title}</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{filtered.length} {t.catalog.results}</div>
            <div className="border border-ink h-11 flex items-center">
              <div className="mono text-[10px] uppercase tracking-[0.25em] px-4 border-r border-ink h-full inline-flex items-center">{t.catalog.sort}</div>
              {t.catalog.sortOptions.map((opt, i) => (
                <button key={i} onClick={() => setSort(i)} className={`mono text-[10px] uppercase tracking-[0.2em] px-3 h-full ${sort === i ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 px-6 md:px-12 py-10">
        <div className="col-span-12 lg:col-span-3">
          <FiltersRail filters={filters} setFilters={setFilters} onClear={clear} />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <Motion.motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Motion.AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} onQuick={setQuick} />
              ))}
            </Motion.AnimatePresence>
          </Motion.motion.div>
          {filtered.length === 0 && (
            <div className="text-center py-20 border border-ink/20">
              <div className="display text-4xl mb-2">No matches</div>
              <p className="text-sm text-ink/60 mb-6">Loosen the filters and try again.</p>
              <Btn kind="outline" onClick={clear}>{t.catalog.clear}</Btn>
            </div>
          )}
        </div>
      </div>

      <QuickView open={!!quick} product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}

// ─── Quick View modal ───────────────────────────────────────────
function QuickView({ open, product, onClose }) {
  const { t, lang } = useT();
  const [size, setSize] = React.useState(null);
  React.useEffect(() => { if (open) setSize(null); }, [open, product]);
  if (!product) return null;

  const totalStock = Object.values(product.stock).reduce((a,b)=>a+b,0);
  const soldOut = totalStock === 0;

  return (
    <Motion.AnimatePresence>
      {open && (
        <>
          <Motion.motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/60 z-40"
          />
          <Motion.motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2,0.8,0.2,1] }}
            className="fixed inset-4 md:inset-12 z-50 bg-paper border border-ink overflow-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 border border-ink bg-paper inline-flex items-center justify-center hover:bg-ink hover:text-paper">
              <Icons.X size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="grid grid-cols-2 grid-rows-2 md:h-[80vh] border-b md:border-b-0 md:border-r border-ink">
                <div className={`${product.stripe} border-r border-b border-ink relative`}>
                  <div className="absolute inset-0 noise opacity-40" />
                  <div className="absolute bottom-2 left-2 mono text-[9px] uppercase tracking-[0.2em] bg-paper px-1.5 py-0.5">FRONT</div>
                </div>
                <div className="stripes border-b border-ink relative">
                  <div className="absolute bottom-2 left-2 mono text-[9px] uppercase tracking-[0.2em] bg-paper px-1.5 py-0.5">BACK</div>
                </div>
                <div className="stripes-stone border-r border-ink relative">
                  <div className="absolute bottom-2 left-2 mono text-[9px] uppercase tracking-[0.2em] bg-paper px-1.5 py-0.5">DETAIL</div>
                </div>
                <div className={`${product.stripe} relative`}>
                  <div className="absolute bottom-2 left-2 mono text-[9px] uppercase tracking-[0.2em] bg-paper px-1.5 py-0.5">LOOK</div>
                </div>
              </div>

              <div className="p-8 md:p-12 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{product.id}</span>
                  {product.new && <Tag tone="rust">{t.catalog.new}</Tag>}
                  {soldOut && <Tag tone="paper">{t.catalog.sold}</Tag>}
                </div>
                <h2 className="display text-5xl md:text-6xl mb-3">{product.name[lang]}</h2>
                <div className="display text-3xl mb-6">{fmtMoney(product.price, "EUR", lang)}</div>

                <div className="border-t border-ink/20 pt-5 mb-5">
                  <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/70 mb-3">{t.qv.composition}</div>
                  <p className="text-sm text-ink/80">
                    {lang === "es"
                      ? `Cortado en ${product.material.toLowerCase()} de telar europeo, lavado a piedra y prensado a mano. Forrado en cupro, costuras francesas, botones de cuerno.`
                      : `Cut from European-loom ${product.material.toLowerCase()}, stone-washed and hand-pressed. Cupro-lined, French seams, horn buttons.`}
                  </p>
                </div>

                <div className="border-t border-ink/20 pt-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/70">{t.qv.selectSize}</div>
                    <button className="mono text-[10px] uppercase tracking-[0.25em] underline underline-offset-4">{t.qv.sizeGuide}</button>
                  </div>
                  <div className="flex gap-2">
                    {["XS","S","M","L","XL"].map((s) => {
                      const avail = product.stock[s] > 0;
                      const on = size === s;
                      return (
                        <button
                          key={s}
                          disabled={!avail}
                          onClick={() => setSize(s)}
                          className={`mono text-[11px] uppercase tracking-[0.2em] w-12 h-12 border ${on ? "bg-ink text-paper border-ink" : "border-ink/30 hover:border-ink"} ${!avail ? "opacity-30 line-through pointer-events-none" : ""}`}
                        >{s}</button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-ink/20 pt-5 mb-8">
                  <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/70 mb-3">{t.qv.fit}</div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><div className="mono text-[10px] text-ink/50 uppercase tracking-[0.2em]">{t.qv.shipping}</div><div className="text-ink/80">3-5 d</div></div>
                    <div><div className="mono text-[10px] text-ink/50 uppercase tracking-[0.2em]">{t.qv.care}</div><div className="text-ink/80">Dry clean</div></div>
                    <div><div className="mono text-[10px] text-ink/50 uppercase tracking-[0.2em]">Origin</div><div className="text-ink/80">Lisboa</div></div>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <Btn kind="solid" size="lg" full disabled={soldOut || !size} icon={Icons.ShoppingBag}>
                    {soldOut ? t.catalog.sold : t.catalog.addBag}
                  </Btn>
                  <Btn kind="outline" size="lg" icon={Icons.Heart} />
                </div>
              </div>
            </div>
          </Motion.motion.div>
        </>
      )}
    </Motion.AnimatePresence>
  );
}

function Storefront({ onAuth }) {
  return (
    <div>
      <Hero onEnter={() => {
        const el = document.getElementById("catalog");
        if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
      }} />
      <Catalog />
    </div>
  );
}

Object.assign(window, { Storefront, QuickView, Catalog, Hero });
