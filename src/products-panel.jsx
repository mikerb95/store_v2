// Products panel — CRUD for inventory

function ProductsPanel() {
  const { t, lang } = useT();
  const [items, setItems] = React.useState(PRODUCTS);
  const [editing, setEditing] = React.useState(null); // product object or "new"
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("");

  const cats = ["Outerwear","Knitwear","Trousers","Shirts","Tailoring","Footwear"];
  const filtered = items.filter((p) => {
    if (q && !(p.name.en.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))) return false;
    if (cat && p.cat !== cat) return false;
    return true;
  });

  const remove = (id) => {
    if (!confirm(t.products.confirmDelete)) return;
    setItems((items) => items.filter((p) => p.id !== id));
  };

  const save = (p) => {
    if (editing === "new") {
      setItems((items) => [...items, { ...p, id: "M-" + String(items.length + 1).padStart(2,"0") }]);
    } else {
      setItems((items) => items.map((x) => x.id === p.id ? p : x));
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · INVENTORY</div>
            <h1 className="display text-6xl md:text-7xl">{t.products.title}</h1>
            <p className="text-sm text-ink/70 mt-2">{t.products.sub}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="border border-ink h-11 flex items-center px-4 w-64 bg-paper">
              <Icons.Search size={14} className="text-ink/60" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.common.search} className="bg-transparent ml-3 outline-none text-sm" />
            </div>
            <div className="border border-ink h-11 flex">
              <button onClick={() => setCat("")} className={`mono text-[10px] uppercase tracking-[0.22em] px-3 h-full ${cat === "" ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>All</button>
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c === cat ? "" : c)} className={`mono text-[10px] uppercase tracking-[0.22em] px-3 h-full border-l border-ink ${cat === c ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{c}</button>
              ))}
            </div>
            <Btn kind="outline" size="md" icon={Icons.Download}>{t.products.export}</Btn>
            <Btn kind="solid" size="md" icon={Icons.Plus} onClick={() => setEditing("new")}>{t.products.add}</Btn>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border border-ink mt-8">
          {[
            { l: lang === "es" ? "Total piezas" : "Total pieces", v: items.length.toString().padStart(2,"0") },
            { l: lang === "es" ? "Stock bajo" : "Low stock", v: items.filter(p => Object.values(p.stock).reduce((a,b)=>a+b,0) < 10).length.toString().padStart(2,"0") },
            { l: lang === "es" ? "Agotadas" : "Sold out", v: items.filter(p => Object.values(p.stock).reduce((a,b)=>a+b,0) === 0).length.toString().padStart(2,"0") },
            { l: lang === "es" ? "Valor inventario" : "Inventory value", v: "€" + Math.round(items.reduce((a,p) => a + p.price * Object.values(p.stock).reduce((x,y)=>x+y,0), 0) / 1000) + "k" },
          ].map((s, i) => (
            <div key={i} className={`p-5 ${i > 0 ? "border-l border-ink" : ""}`}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s.l}</div>
              <div className="display text-4xl mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-ink">
        <div className="grid grid-cols-12 px-6 md:px-12 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
          <div className="col-span-4">{t.products.columns.piece}</div>
          <div className="col-span-2">{t.products.columns.sku}</div>
          <div className="col-span-2">{t.products.columns.category}</div>
          <div className="col-span-1 text-right">{t.products.columns.stock}</div>
          <div className="col-span-1 text-right">{t.products.columns.price}</div>
          <div className="col-span-2 text-right">{lang === "es" ? "Acciones" : "Actions"}</div>
        </div>
        {filtered.map((p) => {
          const totalStock = Object.values(p.stock).reduce((a,b)=>a+b,0);
          const low = totalStock < 10;
          return (
            <div key={p.id} className="grid grid-cols-12 items-center px-6 md:px-12 py-4 border-b border-ink/15 hover:bg-chalk">
              <div className="col-span-4 flex items-center gap-4">
                <div className="w-12 h-14 border border-ink"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                <div>
                  <div className="display text-xl leading-tight">{p.name[lang]}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">{p.material} · {p.colors.join(" / ")}</div>
                </div>
              </div>
              <div className="col-span-2 mono text-[11px]">{p.sku}</div>
              <div className="col-span-2"><Tag tone="line">{p.cat}</Tag></div>
              <div className="col-span-1 text-right">
                <div className={`display text-xl ${low ? "text-rust" : ""}`}>{String(totalStock).padStart(2,"0")}</div>
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{low ? "low" : "ok"}</div>
              </div>
              <div className="col-span-1 text-right display text-xl">{fmtMoney(p.price, "EUR", lang)}</div>
              <div className="col-span-2 flex justify-end gap-1">
                <button onClick={() => setEditing(p)} className="w-9 h-9 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.Edit size={14} /></button>
                <button className="w-9 h-9 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.Eye size={14} /></button>
                <button onClick={() => remove(p.id)} className="w-9 h-9 border border-ink inline-flex items-center justify-center hover:bg-rust hover:text-paper hover:border-rust"><Icons.Trash size={14} /></button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="p-16 text-center text-ink/60 mono text-[10px] uppercase tracking-[0.22em]">No pieces match.</div>}
      </div>

      <ProductEditor
        open={!!editing}
        initial={editing === "new" ? null : editing}
        onClose={() => setEditing(null)}
        onSave={save}
        onDelete={editing && editing !== "new" ? () => { remove(editing.id); setEditing(null); } : null}
      />
    </div>
  );
}

function ProductEditor({ open, initial, onClose, onSave, onDelete }) {
  const { t, lang } = useT();
  const [p, setP] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setP(initial ? JSON.parse(JSON.stringify(initial)) : {
        id: "",
        sku: "MO-NEW-000",
        name: { en: "", es: "" },
        cat: "Outerwear",
        price: 0,
        stripe: "stripes",
        colorChip: "#e8e4dc",
        colors: ["Bone"],
        sizes: ["S","M","L"],
        material: "Wool",
        stock: { XS:0, S:0, M:0, L:0, XL:0 },
      });
    }
  }, [open, initial]);

  if (!p) return null;

  const stripes = ["stripes","stripes-dark","stripes-rust","stripes-sand","stripes-stone","stripes-olive","stripes-navy"];

  return (
    <Motion.AnimatePresence>
      {open && (
        <>
          <Motion.motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="fixed inset-0 bg-ink/60 z-40" />
          <Motion.motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.2,0.8,0.2,1] }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[820px] bg-paper border-l border-ink z-50 overflow-auto"
          >
            <div className="border-b border-ink p-6 flex items-center justify-between sticky top-0 bg-paper z-10">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{initial ? t.products.editing + " · " + initial.id : t.products.newPiece}</div>
                <div className="display text-3xl mt-1">{p.name[lang] || (initial ? initial.name[lang] : t.products.newPiece)}</div>
              </div>
              <button onClick={onClose} className="w-10 h-10 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.X size={16} /></button>
            </div>

            <div className="p-6 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-5 space-y-3">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-2">{t.products.images}</div>
                <div className="aspect-[4/5] border border-ink relative">
                  <StripePlaceholder stripe={p.stripe} label={p.sku} />
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {stripes.map((s) => (
                    <button key={s} onClick={() => setP({ ...p, stripe: s })} className={`aspect-square border ${s} ${p.stripe === s ? "border-ink ring-2 ring-rust" : "border-ink/40"}`} />
                  ))}
                </div>
                <Btn kind="outline" full icon={Icons.Upload}>{lang === "es" ? "Subir imágenes reales" : "Upload real images"}</Btn>
              </div>

              <div className="col-span-12 md:col-span-7 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.products.name + " · EN"} value={p.name.en} onChange={(e) => setP({ ...p, name: { ...p.name, en: e.target.value } })} />
                  <Field label={t.products.name + " · ES"} value={p.name.es} onChange={(e) => setP({ ...p, name: { ...p.name, es: e.target.value } })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label={t.products.sku} value={p.sku} onChange={(e) => setP({ ...p, sku: e.target.value })} />
                  <Select label={t.products.category} value={p.cat} onChange={(e) => setP({ ...p, cat: e.target.value })} options={["Outerwear","Knitwear","Trousers","Shirts","Tailoring","Footwear"]} />
                  <Field label={t.products.price + " (€)"} type="number" value={p.price} onChange={(e) => setP({ ...p, price: Number(e.target.value) })} />
                </div>
                <FieldArea label={t.products.description} value={p.description || ""} onChange={(e) => setP({ ...p, description: e.target.value })} placeholder={lang === "es" ? "Cortado en lana europea, lavado a piedra…" : "Cut from European wool, stone-washed…"} />

                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-2">{t.products.stock}</div>
                  <div className="border border-ink grid grid-cols-5">
                    {["XS","S","M","L","XL"].map((s, i) => (
                      <div key={s} className={`p-3 ${i > 0 ? "border-l border-ink" : ""}`}>
                        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s}</div>
                        <input type="number" value={p.stock[s]} onChange={(e) => setP({ ...p, stock: { ...p.stock, [s]: Number(e.target.value) } })} className="display text-3xl outline-none w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select label={lang === "es" ? "Material" : "Material"} value={p.material} onChange={(e) => setP({ ...p, material: e.target.value })} options={["Wool","Cotton","Linen","Leather","Cashmere"]} />
                  <Field label={lang === "es" ? "Colores (CSV)" : "Colours (CSV)"} value={p.colors.join(", ")} onChange={(e) => setP({ ...p, colors: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) })} />
                </div>
              </div>
            </div>

            <div className="border-t border-ink p-6 flex items-center justify-between sticky bottom-0 bg-paper">
              <div>
                {onDelete && <Btn kind="ghost" icon={Icons.Trash} onClick={onDelete}>{t.products.delete}</Btn>}
              </div>
              <div className="flex gap-2">
                <Btn kind="outline" onClick={onClose}>{t.products.cancel}</Btn>
                <Btn kind="solid" icon={Icons.Save} onClick={() => onSave(p)}>{t.products.save}</Btn>
              </div>
            </div>
          </Motion.motion.div>
        </>
      )}
    </Motion.AnimatePresence>
  );
}

window.ProductsPanel = ProductsPanel;
