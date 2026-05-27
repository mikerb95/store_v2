// CRM — Clients & Suppliers ledger

function CRM() {
  const { t, lang } = useT();
  const [tab, setTab] = React.useState("clients");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState(null);

  const rows = tab === "clients" ? CLIENTS : SUPPLIERS;
  const filtered = rows.filter((r) => {
    const blob = (r.name + " " + r.contact + " " + r.loc + " " + (r.cat||"")).toLowerCase();
    return blob.includes(q.toLowerCase());
  });

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · OPERATIONS</div>
            <h1 className="display text-6xl md:text-7xl">{t.crm.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.crm.sub}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-ink h-11 flex">
              {[{id:"clients",l:t.crm.tabs[0]},{id:"suppliers",l:t.crm.tabs[1]}].map((x) => (
                <button key={x.id} onClick={() => setTab(x.id)} className={`mono text-[10px] uppercase tracking-[0.22em] px-4 h-full ${tab === x.id ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{x.l}</button>
              ))}
            </div>
            <div className="border border-ink h-11 flex items-center px-4 w-72 max-w-full bg-paper">
              <Icons.Search size={14} className="text-ink/60" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.crm.search} className="bg-transparent ml-3 outline-none text-sm" />
            </div>
            <Btn kind="solid" size="md" icon={Icons.Plus}>{tab === "clients" ? t.crm.addClient : t.crm.addSupplier}</Btn>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-ink mt-8">
          {[
            { l: tab === "clients" ? (lang === "es" ? "Total clientes" : "Total clients") : (lang === "es" ? "Total proveedores" : "Total suppliers"), v: rows.length.toString().padStart(2,"0") },
            { l: tab === "clients" ? "VIP" : (lang === "es" ? "Activos" : "Active"), v: rows.filter(r => r.status === "VIP" || r.status === "Active").length.toString().padStart(2,"0") },
            { l: tab === "clients" ? (lang === "es" ? "Valor agregado" : "Total LTV") : (lang === "es" ? "Plazo medio" : "Avg lead"), v: tab === "clients" ? "€" + (rows.reduce((a,b)=>a+b.value,0)/1000).toFixed(0) + "k" : "25 d" },
            { l: tab === "clients" ? (lang === "es" ? "Recurrentes" : "Returning") : (lang === "es" ? "Países" : "Countries"), v: tab === "clients" ? "62%" : "06" },
          ].map((s, i) => (
            <div key={i} className={`p-5 ${i > 0 ? "border-l border-ink" : ""}`}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s.l}</div>
              <div className="display text-4xl mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 border-r border-ink">
          {/* table header */}
          <div className="grid grid-cols-12 px-6 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
            <div className="col-span-4">{t.crm.columns.name}</div>
            <div className="col-span-3">{t.crm.columns.contact}</div>
            <div className="col-span-2">{t.crm.columns.location}</div>
            <div className="col-span-1">{t.crm.columns.status}</div>
            <div className="col-span-2 text-right">{tab === "clients" ? t.crm.columns.value : t.crm.columns.leadTime}</div>
          </div>
          <div>
            {filtered.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setSelected(i)}
                className={`grid grid-cols-12 px-6 py-4 w-full text-left border-b border-ink/15 hover:bg-chalk ${selected === i ? "bg-chalk" : ""}`}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 border border-ink stripes-stone flex-shrink-0" />
                  <div>
                    <div className="text-sm">{r.name}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{tab === "clients" ? (lang === "es" ? "Última compra " + r.last : "Last order " + r.last) : r.cat}</div>
                  </div>
                </div>
                <div className="col-span-3 text-sm text-ink/80 truncate">{r.contact}</div>
                <div className="col-span-2 text-sm text-ink/80">{r.loc}</div>
                <div className="col-span-1"><StatusBadge status={r.status} lang={lang} /></div>
                <div className="col-span-2 text-right">
                  {tab === "clients"
                    ? <div className="display text-xl">{fmtMoney(r.value, "EUR", lang)}</div>
                    : <div className="mono text-sm">{r.lead}</div>}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="p-12 text-center text-ink/60 mono text-[10px] uppercase tracking-[0.22em]">No matches.</div>}
          </div>
        </div>

        {/* detail panel */}
        <div className="col-span-12 lg:col-span-4 min-h-[60vh]">
          {selected != null && filtered[selected]
            ? <CRMDetail r={filtered[selected]} type={tab} />
            : (
              <div className="p-12 flex flex-col items-center justify-center text-center min-h-[60vh] text-ink/60">
                <Icons.Users size={28} />
                <div className="display text-2xl mt-3">{lang === "es" ? "Selecciona una fila" : "Pick a row"}</div>
                <p className="text-sm mt-1">{lang === "es" ? "Verás el detalle completo aquí." : "Full detail appears here."}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function CRMDetail({ r, type }) {
  const { t, lang } = useT();
  const isClient = type === "clients";

  return (
    <div className="p-6 sticky top-[57px]">
      <div className="flex items-center justify-between mb-4">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{isClient ? "Client" : "Supplier"} · {r.status}</div>
        <button className="w-8 h-8 inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.MoreHorizontal size={16} /></button>
      </div>
      <div className="display text-4xl leading-tight">{r.name}</div>
      <div className="text-sm text-ink/70 mt-1">{r.loc}</div>

      <div className="grid grid-cols-2 gap-0 border border-ink mt-5">
        <div className="p-4">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{isClient ? "Lifetime value" : "Lead time"}</div>
          <div className="display text-3xl mt-1">{isClient ? fmtMoney(r.value, "EUR", lang) : r.lead}</div>
        </div>
        <div className="p-4 border-l border-ink">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{isClient ? "Last order" : "Category"}</div>
          <div className="display text-3xl mt-1">{isClient ? r.last : r.cat}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">Contact</div>
        <div className="border border-ink divide-y divide-ink/15">
          <div className="px-4 py-3 flex items-center gap-3"><Icons.Mail size={14} /><span className="text-sm">{r.contact}</span></div>
          <div className="px-4 py-3 flex items-center gap-3"><Icons.MapPin size={14} /><span className="text-sm">{r.loc}</span></div>
          <div className="px-4 py-3 flex items-center gap-3"><Icons.Phone size={14} /><span className="text-sm text-ink/70">+— — —</span></div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Línea de tiempo" : "Timeline"}</div>
        <div className="space-y-3">
          {(isClient
            ? [
                { d: r.last, t: lang === "es" ? "Pedido completado · MO-58041" : "Order completed · MO-58041" },
                { d: "2026-03-09", t: lang === "es" ? "Prueba en atelier · 2 piezas" : "Atelier fitting · 2 pieces" },
                { d: "2025-12-14", t: lang === "es" ? "Inscripción Atelier tier" : "Joined Atelier tier" },
              ]
            : [
                { d: "2026-05-04", t: lang === "es" ? "Recepción de lote · 240m lana" : "Batch received · 240m wool" },
                { d: "2026-04-12", t: lang === "es" ? "Pedido emitido · €18,240" : "Order placed · €18,240" },
                { d: "2026-03-01", t: lang === "es" ? "Inspección de telar" : "Loom inspection" },
              ]
          ).map((x, i) => (
            <div key={i} className="grid grid-cols-12 gap-3">
              <div className="col-span-3 mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{x.d}</div>
              <div className="col-span-9 text-sm">{x.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Btn kind="solid" size="sm" full icon={Icons.Mail}>{lang === "es" ? "Contactar" : "Reach out"}</Btn>
        <Btn kind="outline" size="sm" icon={Icons.Edit} />
      </div>
    </div>
  );
}

window.CRM = CRM;
