// CMS — Banners, Pages, Policies, Newsletters

function CMS() {
  const { t, lang } = useT();
  const [tab, setTab] = React.useState("banners");
  const [editingId, setEditingId] = React.useState(null);

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · EDITORIAL</div>
            <h1 className="display text-6xl md:text-7xl">{t.cms.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.cms.sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-ink h-11 flex">
              {[
                { id: "banners",      l: t.cms.tabs[0] },
                { id: "pages",        l: t.cms.tabs[1] },
                { id: "policies",     l: t.cms.tabs[2] },
                { id: "newsletters",  l: t.cms.tabs[3] },
              ].map((x) => (
                <button key={x.id} onClick={() => { setTab(x.id); setEditingId(null); }} className={`mono text-[10px] uppercase tracking-[0.22em] px-4 h-full ${tab === x.id ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{x.l}</button>
              ))}
            </div>
            <Btn kind="solid" size="md" icon={Icons.Plus}>{lang === "es" ? "Nuevo" : "New"}</Btn>
          </div>
        </div>
      </div>

      {tab === "banners" && <BannerEditor editingId={editingId} setEditingId={setEditingId} />}
      {tab === "pages" && <PageList items={PAGES} icon={Icons.FileText} />}
      {tab === "policies" && <PageList items={POLICIES} icon={Icons.ShieldCheck} />}
      {tab === "newsletters" && <PageList items={NEWSLETTERS} icon={Icons.Newspaper} />}
    </div>
  );
}

function BannerEditor({ editingId, setEditingId }) {
  const { t, lang } = useT();
  const [items, setItems] = React.useState(BANNERS);
  const [sel, setSel] = React.useState(0);
  const banner = items[sel];

  const update = (field, value) => {
    setItems((items) => items.map((b, i) => i === sel ? { ...b, [field]: { ...b[field], [lang]: value } } : b));
  };
  const setStatus = (s) => setItems((items) => items.map((b, i) => i === sel ? { ...b, status: s } : b));

  return (
    <div className="grid grid-cols-12">
      {/* List */}
      <div className="col-span-12 lg:col-span-3 border-r border-ink">
        <div className="px-5 py-4 border-b border-ink mono text-[10px] uppercase tracking-[0.25em] text-ink/60">All banners · {items.length}</div>
        {items.map((b, i) => (
          <button key={b.id} onClick={() => setSel(i)} className={`w-full text-left px-5 py-4 border-b border-ink/15 flex flex-col gap-2 ${sel === i ? "bg-chalk" : "hover:bg-chalk"}`}>
            <div className="flex items-center justify-between">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/50">{b.id}</div>
              <StatusBadge status={b.status} lang={lang} />
            </div>
            <div className="display text-xl leading-tight">{b.title[lang]}</div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{lang === "es" ? "Publica" : "Publishes"} · {b.schedule}</div>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="col-span-12 lg:col-span-5 border-r border-ink p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{lang === "es" ? "Editor" : "Editor"} · {banner.id}</div>
          <div className="flex gap-2">
            {["draft","scheduled","live"].map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`mono text-[10px] uppercase tracking-[0.2em] border h-8 px-3 ${banner.status === s ? "bg-ink text-paper border-ink" : "border-ink/30 hover:border-ink"}`}>
                {s === "draft" ? t.cms.draft : s === "live" ? t.cms.live : t.cms.scheduled}
              </button>
            ))}
          </div>
        </div>

        <Field label={t.cms.title2} value={banner.title[lang]} onChange={(e) => update("title", e.target.value)} />
        <FieldArea label={t.cms.body} value={banner.body[lang]} onChange={(e) => update("body", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.cms.cta} value={banner.cta[lang]} onChange={(e) => update("cta", e.target.value)} />
          <Field label={t.cms.schedule} value={banner.schedule} onChange={() => {}} icon={Icons.Calendar} />
        </div>

        <div className="border border-ink p-4">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Tratamiento visual" : "Visual treatment"}</div>
          <div className="grid grid-cols-4 gap-2">
            {["stripes","stripes-dark","stripes-rust","stripes-sand","stripes-stone","stripes-olive","stripes-navy"].map((s) => (
              <button key={s} className={`aspect-square border border-ink ${s}`} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Btn kind="ghost" icon={Icons.Eye}>{t.cms.preview}</Btn>
          <div className="flex-1" />
          <Btn kind="outline">{t.common.cancel}</Btn>
          <Btn kind="solid" icon={Icons.Upload}>{t.cms.publish}</Btn>
        </div>
      </div>

      {/* Preview */}
      <div className="col-span-12 lg:col-span-4 p-6">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Vista previa en tienda" : "Storefront preview"}</div>
        <Motion.AnimatePresence mode="wait">
          <Motion.motion.div
            key={banner.id + lang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-ink"
          >
            <div className="stripes-dark relative overflow-hidden aspect-[4/3]">
              <div className="absolute inset-0 noise opacity-40" />
              <div className="absolute inset-6 flex flex-col justify-between text-paper">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-px bg-paper" />
                  <span className="mono text-[9px] uppercase tracking-[0.25em]">{banner.id}</span>
                </div>
                <div>
                  <div className="display text-4xl leading-none mb-3">{banner.title[lang]}</div>
                  <p className="text-sm text-paper/80 mb-4 line-clamp-2">{banner.body[lang]}</p>
                  <div className="inline-flex border border-paper px-4 h-9 items-center mono text-[10px] uppercase tracking-[0.2em]">{banner.cta[lang]} →</div>
                </div>
              </div>
            </div>
          </Motion.motion.div>
        </Motion.AnimatePresence>

        <div className="border border-ink mt-4 p-4 space-y-3">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{lang === "es" ? "Vistas (7d)" : "Views (7d)"}</div>
          <div className="display text-3xl">12,408</div>
          <div className="h-16"><Sparkline data={[20,32,28,40,35,52,68]} color="#c0432a" /></div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-ink/20">
            <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/60">CTR</div><div className="display text-xl">5.2%</div></div>
            <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/60">Clicks</div><div className="display text-xl">645</div></div>
            <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/60">{lang === "es" ? "Conv." : "Conv."}</div><div className="display text-xl">1.8%</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageList({ items, icon: I }) {
  const { t, lang } = useT();
  return (
    <div className="px-6 md:px-12 py-10">
      <div className="border border-ink">
        <div className="grid grid-cols-12 px-5 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Updated</div>
          <div className="col-span-1 text-right">…</div>
        </div>
        {items.map((p, i) => (
          <div key={p.id} className="grid grid-cols-12 items-center px-5 py-4 border-b border-ink/15 last:border-b-0 hover:bg-chalk">
            <div className="col-span-1 mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{p.id}</div>
            <div className="col-span-6 flex items-center gap-3">
              <I size={14} className="text-ink/60" />
              <div className="display text-xl">{p.title[lang]}</div>
            </div>
            <div className="col-span-2"><StatusBadge status={p.status} lang={lang} /></div>
            <div className="col-span-2 mono text-[11px] text-ink/70">{p.updated}</div>
            <div className="col-span-1 flex justify-end gap-1">
              <button className="w-8 h-8 inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.Edit size={14} /></button>
              <button className="w-8 h-8 inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.Eye size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.CMS = CMS;
