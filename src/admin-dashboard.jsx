// Admin Dashboard — overview metrics

function AdminDashboard() {
  const { t, lang } = useT();

  const kpis = [
    { k: "revenue",   v: "€482,140", trend: "+18.4%", up: true,  data: REVENUE_SERIES },
    { k: "orders",    v: "1,284",    trend: "+9.2%",  up: true,  data: REVENUE_SERIES.map(x => x * 0.7 + 10) },
    { k: "aov",       v: "€376",     trend: "+4.1%",  up: true,  data: REVENUE_SERIES.map(x => 40 + Math.sin(x/4)*8 + x/3) },
    { k: "ctr",       v: "3.84%",    trend: "−0.2%",  up: false, data: REVENUE_SERIES.map(x => 30 + Math.cos(x/3)*6) },
    { k: "returning", v: "41.2%",    trend: "+2.1%",  up: true,  data: REVENUE_SERIES.map(x => 20 + x/3) },
    { k: "stock",     v: "07",       trend: "−2",     up: true,  data: [4,3,5,6,8,9,7,5,6,7,8,9,10,7,5,4,5,6,7,8,7,7,6,7,8,9,7,5,4,7] },
  ];

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-3">{t.admin.title} · {new Date().toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { day:"2-digit", month:"long", year:"numeric" })}</div>
          <h1 className="display text-7xl md:text-8xl leading-none">Good <span className="text-rust">morning,</span></h1>
          <h1 className="display text-7xl md:text-8xl leading-none">House of Monolith.</h1>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-end">
          <div className="border border-ink p-5 bg-ink text-paper">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-paper/60 mb-2">{lang === "es" ? "Resumen vivo" : "Live tally"}</div>
            <div className="flex items-baseline justify-between">
              <div className="display text-5xl">€18,420</div>
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-rust inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rust animate-pulse" />
                {lang === "es" ? "hoy" : "today"}
              </div>
            </div>
            <div className="flex justify-between mt-4 mono text-[10px] uppercase tracking-[0.2em]">
              <span>32 orders</span>
              <span>4 carts open</span>
              <span>11 fittings</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-ink">
        {kpis.map((k, i) => (
          <div key={k.k} className={`p-5 ${i > 0 ? "border-l border-ink" : ""} ${i < 3 ? "" : "lg:border-l lg:border-ink"}`}>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.admin.kpis[k.k]}</div>
            <div className="display text-4xl mt-3">{k.v}</div>
            <div className="flex items-center justify-between mt-3">
              <span className={`mono text-[10px] uppercase tracking-[0.2em] inline-flex items-center gap-1 ${k.up ? "text-rust" : "text-ink/60"}`}>
                {k.up ? <Icons.TrendingUp size={12} /> : <Icons.TrendingDown size={12} />} {k.trend}
              </span>
              <div className="w-16 h-6">
                <Sparkline data={k.data} height={24} color={k.up ? "#c0432a" : "#0a0a0a"} filled={false} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + traffic */}
      <div className="grid grid-cols-12 border-b border-ink">
        <div className="col-span-12 lg:col-span-8 p-6 border-r border-ink">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.admin.sections.revenue}</div>
              <div className="display text-3xl mt-1">€482,140 <span className="mono text-xs text-ink/50 align-middle">/ 30 days</span></div>
            </div>
            <div className="flex gap-2">
              {["1D","7D","30D","12M"].map((p) => (
                <button key={p} className={`mono text-[10px] uppercase tracking-[0.2em] border border-ink h-8 px-3 ${p === "30D" ? "bg-ink text-paper" : ""}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="h-56">
            <RevenueChart data={REVENUE_SERIES} />
          </div>
          <div className="grid grid-cols-4 gap-0 border-t border-ink/20 mt-6 pt-4">
            {[
              { l: "Storefront",   v: "€312,400", p: 65 },
              { l: "Wholesale",    v: "€102,180", p: 21 },
              { l: "Lisboa store", v: "€48,260",  p: 10 },
              { l: "Pop-ups",      v: "€19,300",  p: 4 },
            ].map((c, i) => (
              <div key={i} className={`pr-4 ${i > 0 ? "pl-4 border-l border-ink/20" : ""}`}>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{c.l}</div>
                <div className="display text-2xl mt-1">{c.v}</div>
                <div className="h-1 bg-ink/10 mt-2"><div className="h-full bg-ink" style={{width:`${c.p}%`}} /></div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">{c.p}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 p-6">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{t.admin.sections.traffic}</div>
          <div className="display text-3xl">42,038 <span className="mono text-xs text-ink/50 align-middle">visits</span></div>
          <div className="h-40 mt-5"><BarChart data={TRAFFIC_SERIES} height={160} /></div>
          <div className="grid grid-cols-7 gap-0 mt-2 mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
            {["M","T","W","T","F","S","S"].map((d,i) => <div key={i} className="text-center">{d}</div>)}
          </div>
          <div className="border-t border-ink/20 mt-6 pt-4">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">Top channels</div>
            {[
              { l: "Organic", p: 38 },
              { l: "Direct",  p: 24 },
              { l: "Editorial", p: 18 },
              { l: "Paid social", p: 14 },
              { l: "Email", p: 6 },
            ].map((c, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-3 py-1.5">
                <div className="col-span-4 mono text-[10px] uppercase tracking-[0.2em] text-ink/70">{c.l}</div>
                <div className="col-span-7 h-1 bg-ink/10"><div className="h-full bg-rust" style={{width:`${c.p*2.5}%`}} /></div>
                <div className="col-span-1 mono text-[10px] text-right">{c.p}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live orders + top products */}
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-7 p-6 border-r border-ink">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.admin.sections.liveOrders}</div>
              <div className="display text-3xl mt-1 flex items-center gap-3">
                Live feed
                <span className="w-2 h-2 bg-rust animate-pulse" />
              </div>
            </div>
            <Btn kind="outline" size="sm" iconRight={Icons.ArrowUpRight}>{t.admin.view}</Btn>
          </div>
          <div className="border border-ink">
            {LIVE_ORDERS.map((o, i) => (
              <div key={o.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3 border-t border-ink/15 first:border-t-0 hover:bg-chalk">
                <div className="col-span-1 mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{o.t}</div>
                <div className="col-span-3 mono text-[11px]">{o.id}</div>
                <div className="col-span-5 text-sm">{o.who}</div>
                <div className="col-span-3 display text-xl text-right">{fmtMoney(o.amount, "EUR", lang)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.admin.sections.topProducts}</div>
              <div className="display text-3xl mt-1">This season</div>
            </div>
          </div>
          {PRODUCTS.slice(0,5).map((p, i) => (
            <div key={p.id} className="grid grid-cols-12 items-center gap-3 py-3 border-t border-ink/15 first:border-t-0">
              <div className="col-span-1 mono text-2xl display">{(i+1).toString().padStart(2,"0")}</div>
              <div className="col-span-2 w-12 h-14"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
              <div className="col-span-5">
                <div className="text-sm">{p.name[lang]}</div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{p.id} · {p.material}</div>
              </div>
              <div className="col-span-2 mono text-[10px] uppercase tracking-[0.2em] text-ink/60 text-right">{220 - i*32} {lang === "es" ? "ud." : "u."}</div>
              <div className="col-span-2 display text-xl text-right">{fmtMoney(p.price, "EUR", lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Revenue line chart with axes ───────────────────────────────
function RevenueChart({ data }) {
  const w = 900, h = 220, padL = 36, padR = 12, padT = 10, padB = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = (w - padL - padR) / (data.length - 1);
  const yFor = (v) => h - padB - ((v - min) / range) * (h - padT - padB);
  const pts = data.map((v, i) => [padL + i * step, yFor(v)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${padL + (data.length-1)*step},${h-padB} L ${padL},${h-padB} Z`;
  const yTicks = 4;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      {/* grid */}
      {Array.from({length: yTicks+1}).map((_, i) => {
        const y = padT + ((h - padT - padB) / yTicks) * i;
        return <line key={i} x1={padL} y1={y} x2={w - padR} y2={y} stroke="#0a0a0a" strokeOpacity="0.08" strokeWidth="1" />;
      })}
      {/* area */}
      <path d={area} fill="#c0432a" fillOpacity="0.08" />
      {/* line */}
      <path d={line} fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
      {/* points (highlight last) */}
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill="#c0432a" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="8" fill="#c0432a" fillOpacity="0.2" />
      {/* axis labels */}
      {Array.from({length: yTicks+1}).map((_, i) => {
        const v = max - (i * range / yTicks);
        const y = padT + ((h - padT - padB) / yTicks) * i;
        return <text key={i} x={padL - 6} y={y+3} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono" fill="#0a0a0a99">{"€"+Math.round(v*5)+"k"}</text>;
      })}
      <text x={padL} y={h-6} fontSize="9" fontFamily="JetBrains Mono" fill="#0a0a0a99">May 01</text>
      <text x={(padL+w-padR)/2} y={h-6} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="#0a0a0a99">May 15</text>
      <text x={w-padR} y={h-6} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono" fill="#0a0a0a99">May 30</text>
    </svg>
  );
}

window.AdminDashboard = AdminDashboard;
