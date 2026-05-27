// Social Hub — WhatsApp + Instagram integration

const CHANNEL = {
  ig: { name: "Instagram", short: "IG", color: "oklch(0.55 0.13 350)", bg: "oklch(0.55 0.13 350)" },
  wa: { name: "WhatsApp",  short: "WA", color: "oklch(0.55 0.13 150)", bg: "oklch(0.55 0.13 150)" },
};

function ChannelDot({ ch, size = 8 }) {
  return <span className="inline-block flex-shrink-0" style={{ width: size, height: size, background: CHANNEL[ch].bg }} />;
}

function ChannelGlyph({ ch, size = 16, className = "" }) {
  // Minimal monogram glyphs — not the actual brand marks
  if (ch === "ig") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <rect x="3" y="3" width="18" height="18" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4 20l1.6-4.4A8 8 0 1 1 8.6 18L4 20z" />
      <path d="M8.5 9.5c.5 2 2 3.5 4 4 0 0 1.5.2 2-1l-2-1c-.7 0-1 .5-1 .5-1-.5-1.7-1.2-2-2.2 0 0 .5-.3.5-1l-1-2c-1.2.5-1 2-1 2.7z" />
    </svg>
  );
}

// ─── Hub container ──────────────────────────────────────────────
function SocialHub() {
  const { t, lang } = useT();
  const [tab, setTab] = React.useState("overview");

  const tabs = [
    { id: "overview",  l: t.social.tabs[0], icon: Icons.Activity },
    { id: "inbox",     l: t.social.tabs[1], icon: Icons.Mail },
    { id: "sync",      l: t.social.tabs[2], icon: Icons.Database },
    { id: "studio",    l: t.social.tabs[3], icon: Icons.Image },
    { id: "analytics", l: t.social.tabs[4], icon: Icons.TrendingUp },
  ];

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · CHANNELS</div>
            <h1 className="display text-6xl md:text-7xl">{t.social.title}</h1>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.social.sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <ConnectedAccount ch="ig" handle="@monolith.atelier" />
            <ConnectedAccount ch="wa" handle="MONOLITH Business" />
          </div>
        </div>

        <div className="border border-ink mt-8 flex flex-wrap">
          {tabs.map((x, i) => {
            const on = tab === x.id;
            return (
              <button key={x.id} onClick={() => setTab(x.id)} className={`mono text-[10px] uppercase tracking-[0.22em] h-12 px-5 inline-flex items-center gap-2 ${i > 0 ? "border-l border-ink" : ""} ${on ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>
                <x.icon size={14} />
                {x.l}
              </button>
            );
          })}
          <div className="flex-1 border-l border-ink hidden md:flex items-center justify-end px-5 mono text-[10px] uppercase tracking-[0.25em] text-ink/60">
            <span className="w-1.5 h-1.5 bg-rust animate-pulse mr-2" />
            Realtime · webhook OK
          </div>
        </div>
      </div>

      <PageFade k={tab}>
        {tab === "overview"  && <SocialOverview />}
        {tab === "inbox"     && <SocialInbox />}
        {tab === "sync"      && <SocialSync />}
        {tab === "studio"    && <SocialStudio />}
        {tab === "analytics" && <SocialAnalytics />}
      </PageFade>
    </div>
  );
}

function ConnectedAccount({ ch, handle }) {
  const c = CHANNEL[ch];
  return (
    <div className="border border-ink flex items-stretch">
      <div className="px-3 flex items-center justify-center" style={{ background: c.bg, color: "white" }}>
        <ChannelGlyph ch={ch} size={16} />
      </div>
      <div className="px-3 py-2 flex flex-col justify-center">
        <div className="mono text-[9px] uppercase tracking-[0.25em] text-ink/60">{c.name}</div>
        <div className="text-sm">{handle}</div>
      </div>
      <button className="px-3 border-l border-ink/20 hover:bg-ink hover:text-paper inline-flex items-center"><Icons.Settings size={12} /></button>
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────────
function SocialOverview() {
  const { t, lang } = useT();
  const kpis = [
    { k: "connected",   v: "02",                     trend: "WA + IG",   data: null },
    { k: "unread",      v: String(SOCIAL_KPIS.unread).padStart(2,"0"), trend: "+1",  data: [1,2,1,3,2,4,3,5,3] },
    { k: "scheduled",   v: String(SOCIAL_KPIS.scheduled).padStart(2,"0"), trend: "+3", data: null },
    { k: "attributed",  v: fmtMoney(SOCIAL_KPIS.attributed30d, "EUR", lang), trend: "+22%", data: SOCIAL_REACH_SERIES_IG.map(x=>x*3) },
    { k: "followers",   v: (SOCIAL_KPIS.followersIG/1000).toFixed(1) + "k", trend: "+412", data: SOCIAL_REACH_SERIES_IG },
    { k: "subscribers", v: (SOCIAL_KPIS.subscribersWA/1000).toFixed(2) + "k", trend: "+84", data: SOCIAL_REACH_SERIES_WA },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-ink">
        {kpis.map((k, i) => (
          <div key={k.k} className={`p-5 ${i > 0 ? "md:border-l border-ink" : ""} ${i % 2 === 1 ? "border-l md:border-l" : ""} ${i >= 3 ? "border-t md:border-t-0" : ""}`}>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.social.kpis[k.k]}</div>
            <div className="display text-4xl mt-3">{k.v}</div>
            <div className="flex items-center justify-between mt-3 h-6">
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-rust inline-flex items-center gap-1">
                <Icons.TrendingUp size={12} /> {k.trend}
              </span>
              {k.data && <div className="w-16 h-6"><Sparkline data={k.data} height={24} color="#c0432a" filled={false} /></div>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12">
        {/* Channel cards */}
        <div className="col-span-12 lg:col-span-8 border-r border-ink p-6">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Reach combinado · 30 días" : "Combined reach · 30 days"}</div>
          <div className="display text-3xl mb-4">{(SOCIAL_KPIS.igReach30d/1000).toFixed(0)}k <span className="mono text-xs text-ink/50 align-middle">/ Instagram</span> · {(SOCIAL_KPIS.subscribersWA*7/1000).toFixed(0)}k <span className="mono text-xs text-ink/50 align-middle">/ WhatsApp</span></div>
          <div className="h-56">
            <DualLineChart a={SOCIAL_REACH_SERIES_IG} b={SOCIAL_REACH_SERIES_WA} aLabel="Instagram" bLabel="WhatsApp" aColor="#c0432a" bColor="#0a0a0a" />
          </div>
          <div className="grid grid-cols-3 gap-0 border-t border-ink/20 mt-6 pt-4">
            {[
              { l: lang === "es" ? "Tasa apertura (WA)" : "WA open rate", v: SOCIAL_KPIS.waOpenRate + "%" },
              { l: lang === "es" ? "Engagement (IG)" : "IG engagement",   v: SOCIAL_KPIS.igEngagement + "%" },
              { l: "CTR · DM",                                              v: SOCIAL_KPIS.waCTR + "%" },
            ].map((c, i) => (
              <div key={i} className={`pr-4 ${i > 0 ? "pl-4 border-l border-ink/20" : ""}`}>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{c.l}</div>
                <div className="display text-2xl mt-1">{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="col-span-12 lg:col-span-4 p-6">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Actividad reciente" : "Recent activity"}</div>
          <div className="border border-ink">
            {[
              { ch: "ig", t: lang === "es" ? "Nueva mención de @studio.lz" : "New mention by @studio.lz", time: "00:02" },
              { ch: "wa", t: lang === "es" ? "Cotización aceptada · Rashid" : "Quote accepted · Rashid", time: "00:11" },
              { ch: "ig", t: lang === "es" ? "Post programado · Field Parka" : "Post scheduled · Field Parka", time: "00:24" },
              { ch: "wa", t: lang === "es" ? "Reserva creada · Kiyomi · M-01" : "Reservation · Kiyomi · M-01", time: "00:38" },
              { ch: "ig", t: lang === "es" ? "Reel publicado · 18.4k alcance" : "Reel went live · 18.4k reach", time: "01:02" },
              { ch: "wa", t: lang === "es" ? "Broadcast enviado · 3,840" : "Broadcast sent · 3,840", time: "01:14" },
            ].map((a, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-3 px-4 py-3 border-t border-ink/15 first:border-t-0">
                <div className="col-span-1"><ChannelDot ch={a.ch} /></div>
                <div className="col-span-2 mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{a.time}</div>
                <div className="col-span-9 text-sm">{a.t}</div>
              </div>
            ))}
          </div>

          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mt-6 mb-3">{lang === "es" ? "Atajos" : "Shortcuts"}</div>
          <div className="grid grid-cols-2 gap-2">
            <Btn kind="outline" size="sm" icon={Icons.Mail}>{lang === "es" ? "Difusión WA" : "WA broadcast"}</Btn>
            <Btn kind="outline" size="sm" icon={Icons.Image}>{lang === "es" ? "Nueva historia" : "New story"}</Btn>
            <Btn kind="outline" size="sm" icon={Icons.Tag}>{lang === "es" ? "Etiquetar pieza" : "Tag piece"}</Btn>
            <Btn kind="outline" size="sm" icon={Icons.Database}>{lang === "es" ? "Sync catálogo" : "Sync catalog"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inbox ──────────────────────────────────────────────────────
function SocialInbox() {
  const { t, lang } = useT();
  const [filter, setFilter] = React.useState("all");
  const [channel, setChannel] = React.useState("all"); // all | ig | wa
  const [q, setQ] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(SOCIAL_THREADS[0].id);
  const [composer, setComposer] = React.useState("");
  const [threads, setThreads] = React.useState(SOCIAL_THREADS);

  const filtered = threads.filter((t) => {
    if (channel !== "all" && t.channel !== channel) return false;
    if (filter === "unread" && t.unread === 0) return false;
    if (filter === "priority" && !t.priority) return false;
    if (filter === "resolved" && t.status !== "resolved") return false;
    if (filter === "all" && t.status === "resolved") return false;
    if (q && !(t.name + " " + t.handle + " " + t.last).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const selected = threads.find((t) => t.id === selectedId);

  const send = () => {
    if (!composer.trim() || !selected) return;
    setThreads((ts) => ts.map((tt) => tt.id === selected.id ? {
      ...tt,
      messages: [...tt.messages, { who: "us", at: "now", text: composer }],
      last: composer,
    } : tt));
    setComposer("");
  };

  return (
    <div className="grid grid-cols-12 min-h-[calc(100vh-260px)]">
      {/* Thread list */}
      <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-ink flex flex-col">
        <div className="border-b border-ink p-4 space-y-3">
          <div className="border border-ink h-11 flex items-center px-3 bg-paper">
            <Icons.Search size={14} className="text-ink/60" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.social.inbox.searchPlaceholder} className="bg-transparent ml-3 outline-none text-sm" />
          </div>
          <div className="flex gap-1 border border-ink">
            {[
              { id: "all",      l: t.social.inbox.all },
              { id: "unread",   l: t.social.inbox.unread },
              { id: "priority", l: t.social.inbox.priority },
              { id: "resolved", l: t.social.inbox.resolved },
            ].map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`mono text-[10px] uppercase tracking-[0.2em] flex-1 h-9 ${filter === f.id ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{f.l}</button>
            ))}
          </div>
          <div className="flex gap-1">
            {[
              { id: "all", l: t.common.all },
              { id: "ig",  l: "IG" },
              { id: "wa",  l: "WA" },
            ].map((c) => {
              const on = channel === c.id;
              return (
                <button key={c.id} onClick={() => setChannel(c.id)} className={`mono text-[10px] uppercase tracking-[0.2em] flex-1 h-8 border border-ink inline-flex items-center justify-center gap-2 ${on ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>
                  {c.id !== "all" && <ChannelDot ch={c.id} />}
                  {c.l}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filtered.map((th) => {
            const on = th.id === selectedId;
            return (
              <button key={th.id} onClick={() => setSelectedId(th.id)} className={`w-full text-left p-4 border-b border-ink/15 ${on ? "bg-chalk" : "hover:bg-chalk"}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 border border-ink flex-shrink-0 ${th.avatar} relative`}>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border border-ink flex items-center justify-center" style={{ background: CHANNEL[th.channel].bg }}>
                      <ChannelGlyph ch={th.channel} size={9} className="text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="display text-base leading-tight truncate">{th.name}</div>
                      <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50 flex-shrink-0">{th.time}</div>
                    </div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50 truncate">{th.handle}</div>
                    <div className="text-xs text-ink/80 mt-1 line-clamp-2">{th.last}</div>
                    <div className="flex items-center gap-2 mt-2">
                      {th.priority && <Tag tone="rust">Priority</Tag>}
                      {th.unread > 0 && <span className="mono text-[10px] uppercase tracking-[0.2em] bg-ink text-paper px-1.5 py-0.5">{th.unread}</span>}
                      {th.productRef && <Tag tone="line">{th.productRef}</Tag>}
                      {th.orderRef && <Tag tone="line">{th.orderRef}</Tag>}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && <div className="p-8 text-center text-ink/60 mono text-[10px] uppercase tracking-[0.22em]">No threads.</div>}
        </div>
      </div>

      {/* Thread detail */}
      <div className="col-span-12 md:col-span-8 lg:col-span-6 border-r border-ink flex flex-col">
        {selected ? <ThreadDetail thread={selected} composer={composer} setComposer={setComposer} send={send} /> : (
          <div className="flex-1 flex items-center justify-center text-ink/60 p-12">
            <div className="text-center">
              <Icons.Mail size={32} className="mx-auto" />
              <div className="display text-2xl mt-3">{t.social.inbox.empty}</div>
            </div>
          </div>
        )}
      </div>

      {/* Side context — customer + actions */}
      <div className="col-span-12 lg:col-span-3 p-5">
        {selected ? <ThreadContext thread={selected} /> : null}
      </div>
    </div>
  );
}

function ThreadDetail({ thread, composer, setComposer, send }) {
  const { t, lang } = useT();
  const product = thread.productRef ? PRODUCTS.find((p) => p.id === thread.productRef) : null;
  return (
    <>
      <div className="border-b border-ink p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 border border-ink flex-shrink-0 ${thread.avatar}`} />
          <div className="min-w-0">
            <div className="display text-xl leading-tight flex items-center gap-2"><ChannelDot ch={thread.channel} />{thread.name}</div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 truncate">{thread.handle} · {CHANNEL[thread.channel].name}</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-9 h-9 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper" title={t.social.inbox.markRead}><Icons.Check size={14} /></button>
          <button className="w-9 h-9 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper" title={t.social.inbox.assign}><Icons.User size={14} /></button>
          <button className="w-9 h-9 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.MoreHorizontal size={14} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-4 bg-chalk/50">
        {thread.messages.map((m, i) => {
          const us = m.who === "us";
          return (
            <div key={i} className={`flex ${us ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] ${us ? "" : ""}`}>
                <div className={`border ${us ? "border-ink bg-ink text-paper" : "border-ink/30 bg-paper"} px-4 py-3`}>
                  <div className="text-sm">{m.text}</div>
                </div>
                <div className={`mono text-[9px] uppercase tracking-[0.2em] text-ink/50 mt-1 ${us ? "text-right" : ""}`}>{us ? "MONOLITH · " : ""}{m.at}</div>
              </div>
            </div>
          );
        })}

        {/* Product reference card inside thread */}
        {product && (
          <div className="flex justify-end">
            <div className="max-w-[78%] border border-ink bg-paper">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/60 px-3 py-2 border-b border-ink/15 flex items-center gap-2">
                <Icons.Tag size={12} /> {lang === "es" ? "Pieza adjuntada" : "Piece attached"}
              </div>
              <div className="flex gap-3 p-3">
                <div className="w-16 h-20"><StripePlaceholder stripe={product.stripe} aspect="4/5" /></div>
                <div className="flex-1">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{product.id}</div>
                  <div className="display text-lg leading-tight">{product.name[lang]}</div>
                  <div className="display text-xl mt-1">{fmtMoney(product.price, "EUR", lang)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-ink p-4 bg-paper">
        <div className="flex gap-2 mb-3 overflow-auto">
          {SOCIAL_TEMPLATES.map((tpl) => (
            <button key={tpl.id} onClick={() => setComposer(tpl.body[lang])} className="mono text-[10px] uppercase tracking-[0.2em] border border-ink/30 hover:border-ink h-8 px-3 whitespace-nowrap">
              {tpl.l[lang]}
            </button>
          ))}
        </div>
        <div className="border border-ink p-3">
          <textarea
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            placeholder={t.social.inbox.composer}
            rows={2}
            className="w-full text-sm bg-transparent outline-none resize-none"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink/15">
            <div className="flex gap-1">
              <button className="w-8 h-8 inline-flex items-center justify-center hover:bg-ink hover:text-paper" title={t.social.inbox.attach}><Icons.Tag size={14} /></button>
              <button className="w-8 h-8 inline-flex items-center justify-center hover:bg-ink hover:text-paper" title={t.social.inbox.quote}><Icons.Receipt size={14} /></button>
              <button className="w-8 h-8 inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.Image size={14} /></button>
              <button className="w-8 h-8 inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.Calendar size={14} /></button>
            </div>
            <Btn kind="solid" size="sm" iconRight={Icons.ArrowRight} onClick={send}>{t.social.inbox.reply}</Btn>
          </div>
        </div>
      </div>
    </>
  );
}

function ThreadContext({ thread }) {
  const { t, lang } = useT();
  const product = thread.productRef ? PRODUCTS.find((p) => p.id === thread.productRef) : null;
  return (
    <div className="sticky top-[57px] space-y-5">
      <div>
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Cliente" : "Customer"}</div>
        <div className="border border-ink p-4">
          <div className={`w-full aspect-square ${thread.avatar} border border-ink mb-3`} />
          <div className="display text-2xl">{thread.name}</div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 mt-1">{thread.handle}</div>
          <div className="grid grid-cols-3 gap-0 border-t border-ink/20 mt-4 pt-3">
            <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">LTV</div><div className="display text-lg">€18.4k</div></div>
            <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">{lang === "es" ? "Pedidos" : "Orders"}</div><div className="display text-lg">07</div></div>
            <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-ink/50">Tier</div><div className="display text-lg">VIP</div></div>
          </div>
        </div>
      </div>

      {product && (
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Referencia" : "Referenced piece"}</div>
          <div className="border border-ink">
            <StripePlaceholder stripe={product.stripe} aspect="4/5" />
            <div className="p-3 border-t border-ink">
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{product.id}</div>
              <div className="display text-lg">{product.name[lang]}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="display text-base">{fmtMoney(product.price, "EUR", lang)}</span>
                <Btn kind="outline" size="sm">{lang === "es" ? "Reservar" : "Reserve"}</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Acciones rápidas" : "Quick actions"}</div>
        <div className="space-y-2">
          <Btn kind="outline" size="sm" full icon={Icons.Receipt}>{lang === "es" ? "Crear cotización" : "Create quote"}</Btn>
          <Btn kind="outline" size="sm" full icon={Icons.Package}>{lang === "es" ? "Reservar pieza" : "Reserve piece"}</Btn>
          <Btn kind="outline" size="sm" full icon={Icons.Calendar}>{lang === "es" ? "Reservar prueba" : "Book fitting"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Catalog sync ───────────────────────────────────────────────
function SocialSync() {
  const { t, lang } = useT();
  const [syncing, setSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState({ ig: "12 min ago", wa: "27 min ago" });

  const statusOf = (p, ch) => {
    const o = SOCIAL_SYNC_OVERRIDES[p.id]?.[ch];
    if (o) return o;
    const stock = Object.values(p.stock).reduce((a,b)=>a+b,0);
    if (stock === 0) return "stale";
    return "ok";
  };

  const igCovered = PRODUCTS.filter((p) => statusOf(p, "ig") === "ok").length;
  const waCovered = PRODUCTS.filter((p) => statusOf(p, "wa") === "ok").length;

  const force = (ch) => {
    setSyncing(true);
    setTimeout(() => {
      setLastSync({ ...lastSync, [ch]: "just now" });
      setSyncing(false);
    }, 1100);
  };

  return (
    <div>
      <div className="px-6 md:px-12 py-8 border-b border-ink">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1">02 / {t.social.sync.title}</div>
            <h2 className="display text-5xl">{t.social.sync.title}</h2>
            <p className="text-sm text-ink/60 mt-2 max-w-xl">{t.social.sync.sub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border border-ink mt-6">
          {[
            { ch: "ig", title: t.social.sync.igShop,    covered: igCovered, total: PRODUCTS.length, last: lastSync.ig },
            { ch: "wa", title: t.social.sync.waCatalog, covered: waCovered, total: PRODUCTS.length, last: lastSync.wa },
          ].map((s, i) => (
            <div key={s.ch} className={`p-5 ${i > 0 ? "md:border-l border-ink border-t md:border-t-0" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-ink inline-flex items-center justify-center text-white" style={{ background: CHANNEL[s.ch].bg }}>
                    <ChannelGlyph ch={s.ch} size={16} />
                  </div>
                  <div>
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{CHANNEL[s.ch].name}</div>
                    <div className="display text-2xl">{s.title}</div>
                  </div>
                </div>
                <Btn kind={syncing ? "ghost" : "outline"} size="sm" icon={Icons.Database} disabled={syncing} onClick={() => force(s.ch)}>{syncing ? "…" : t.social.sync.force}</Btn>
              </div>
              <div className="grid grid-cols-3 gap-0 mt-5 pt-4 border-t border-ink/15">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{t.social.sync.coverage}</div>
                  <div className="display text-3xl">{s.covered}/{s.total}</div>
                </div>
                <div className="border-l border-ink/15 pl-4">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{t.social.sync.lastSync}</div>
                  <div className="display text-3xl">{s.last.split(" ")[0]}<span className="mono text-xs ml-1">{s.last.split(" ").slice(1).join(" ")}</span></div>
                </div>
                <div className="border-l border-ink/15 pl-4">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Webhook</div>
                  <div className="display text-3xl flex items-center gap-2">OK <span className="w-2 h-2 bg-rust animate-pulse" /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-product sync table */}
      <div className="px-6 md:px-12 py-8">
        <div className="border border-ink">
          <div className="grid grid-cols-12 px-5 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
            <div className="col-span-4">{lang === "es" ? "Pieza" : "Piece"}</div>
            <div className="col-span-2">SKU</div>
            <div className="col-span-2 text-right">{lang === "es" ? "Precio · Stock" : "Price · Stock"}</div>
            <div className="col-span-2 text-center">Instagram Shop</div>
            <div className="col-span-2 text-center">WhatsApp Catalog</div>
          </div>
          {PRODUCTS.map((p) => {
            const stock = Object.values(p.stock).reduce((a,b)=>a+b,0);
            const ig = statusOf(p, "ig");
            const wa = statusOf(p, "wa");
            return (
              <div key={p.id} className="grid grid-cols-12 items-center px-5 py-3 border-b border-ink/15 last:border-b-0 hover:bg-chalk">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-12"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                  <div>
                    <div className="text-sm">{p.name[lang]}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{p.id} · {p.cat}</div>
                  </div>
                </div>
                <div className="col-span-2 mono text-[11px]">{p.sku}</div>
                <div className="col-span-2 text-right">
                  <div className="display text-base">{fmtMoney(p.price, "EUR", lang)}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{String(stock).padStart(2,"0")} {lang === "es" ? "ud" : "u"}</div>
                </div>
                <div className="col-span-2 flex justify-center"><SyncStatus s={ig} /></div>
                <div className="col-span-2 flex justify-center"><SyncStatus s={wa} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SyncStatus({ s }) {
  const { t, lang } = useT();
  const map = {
    ok:       { l: t.social.sync.ok,       dot: "bg-rust" },
    stale:    { l: t.social.sync.stale,    dot: "bg-ink" },
    error:    { l: t.social.sync.error,    dot: "bg-rust",  ring: true },
    unlisted: { l: t.social.sync.unlisted, dot: "bg-ink/30" },
  };
  const m = map[s] || map.ok;
  return (
    <span className="mono text-[10px] uppercase tracking-[0.18em] inline-flex items-center gap-2">
      <span className={`w-1.5 h-1.5 ${m.dot} ${m.ring ? "ring-2 ring-rust/30" : ""}`} />
      {m.l}
    </span>
  );
}

// ─── Content studio ─────────────────────────────────────────────
function SocialStudio() {
  const { t, lang } = useT();
  const [format, setFormat] = React.useState("Feed");

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8 border-r border-ink">
        <div className="p-6 border-b border-ink flex items-end justify-between">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1">03 / {t.social.studio.title}</div>
            <h2 className="display text-5xl">{t.social.studio.title}</h2>
          </div>
          <Btn kind="solid" icon={Icons.Plus}>{t.social.studio.new}</Btn>
        </div>

        <div className="px-6 py-4 border-b border-ink flex flex-wrap gap-2">
          {t.social.studio.formats.map((f) => (
            <button key={f} onClick={() => setFormat(f)} className={`mono text-[10px] uppercase tracking-[0.22em] border border-ink h-9 px-3 ${format === f ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{f}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
          {SOCIAL_POSTS.map((p, i) => (
            <PostCard key={p.id} p={p} border={i} />
          ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 p-6">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{lang === "es" ? "Próximos · semana" : "Upcoming · this week"}</div>
        <div className="border border-ink">
          {SOCIAL_POSTS.filter(p => p.status === "scheduled" || p.status === "draft").map((p, i) => (
            <div key={p.id} className={`p-4 ${i > 0 ? "border-t border-ink/15" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="border border-ink p-2 text-center min-w-[56px]">
                  <div className="mono text-[9px] uppercase tracking-[0.2em]">{p.when.split(" · ")[0].split(" ")[0]}</div>
                  <div className="display text-2xl leading-none">{p.when.split(" · ")[0].split(" ")[1]}</div>
                  <div className="mono text-[9px] uppercase tracking-[0.2em] mt-1">{p.when.split(" · ")[1]}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ChannelDot ch={p.channel} />
                    <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{p.format}</span>
                    <StatusBadge status={p.status} lang={lang} />
                  </div>
                  <div className="display text-base leading-tight">{p.title[lang]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mt-6 mb-3">{lang === "es" ? "Compositor express" : "Quick composer"}</div>
        <div className="border border-ink p-4 space-y-3">
          <Field label={lang === "es" ? "Titular" : "Caption"} placeholder="..." />
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/70 mb-2">{t.social.studio.crosspost}</div>
            <div className="flex gap-2">
              {["ig","wa"].map((ch) => (
                <label key={ch} className="flex-1 border border-ink p-3 flex items-center gap-2 cursor-pointer hover:bg-ink/5">
                  <input type="checkbox" className="check" defaultChecked />
                  <ChannelGlyph ch={ch} size={14} />
                  <span className="mono text-[10px] uppercase tracking-[0.22em]">{CHANNEL[ch].name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Btn kind="outline" size="sm" icon={Icons.Calendar}>{t.social.studio.schedule}</Btn>
            <Btn kind="solid" size="sm" iconRight={Icons.ArrowRight}>{t.social.studio.publish}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ p, border }) {
  const { t, lang } = useT();
  return (
    <div className={`border-r border-b border-ink relative group ${border % 3 === 2 ? "lg:border-r" : ""}`}>
      <div className={`relative ${p.stripe}`} style={{ aspectRatio: p.format === "Story" || p.format === "Reel" ? "9/16" : "1/1" }}>
        <div className="absolute inset-0 noise opacity-40" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2 py-1 mono text-[9px] uppercase tracking-[0.22em] text-white" style={{ background: CHANNEL[p.channel].bg }}>{CHANNEL[p.channel].name} · {p.format}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="display text-xl text-paper leading-tight">{p.title[lang]}</div>
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-paper/70 mt-1">{p.when}</div>
        </div>
      </div>
      <div className="px-3 py-2 flex items-center justify-between bg-paper">
        <StatusBadge status={p.status} lang={lang} />
        {p.reach != null
          ? <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/70">{(p.reach/1000).toFixed(1)}k reach</div>
          : <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{lang === "es" ? "Pendiente" : "Pending"}</div>}
      </div>
    </div>
  );
}

// ─── Analytics ──────────────────────────────────────────────────
function SocialAnalytics() {
  const { t, lang } = useT();
  const topPosts = SOCIAL_POSTS.filter(p => p.status === "live").sort((a,b) => (b.reach||0) - (a.reach||0));

  return (
    <div>
      <div className="px-6 md:px-12 py-8 border-b border-ink">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1">04 / {t.social.analytics.title}</div>
        <h2 className="display text-5xl">{t.social.analytics.title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 border border-ink mt-6">
          {[
            { l: t.social.analytics.reach,      v: (SOCIAL_KPIS.igReach30d/1000).toFixed(0) + "k", trend: "+18%" },
            { l: t.social.analytics.engage,     v: SOCIAL_KPIS.igEngagement + "%",                  trend: "+0.9pp" },
            { l: t.social.analytics.clickThru,  v: SOCIAL_KPIS.waCTR + "%",                          trend: "+2.1pp" },
            { l: t.social.analytics.attributed, v: "1,284",                                          trend: "+22%" },
          ].map((s, i) => (
            <div key={i} className={`p-5 ${i > 0 ? "border-l border-ink" : ""}`}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s.l}</div>
              <div className="display text-4xl mt-2">{s.v}</div>
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-rust mt-2 inline-flex items-center gap-1">
                <Icons.TrendingUp size={12} /> {s.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12">
        {/* Funnel */}
        <div className="col-span-12 lg:col-span-7 p-6 border-r border-ink">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-3">{t.social.analytics.funnel}</div>
          <div className="space-y-3 mt-5">
            {SOCIAL_FUNNEL.map((s, i) => (
              <div key={s.l} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/70">{s.l}</div>
                <div className="col-span-7 h-8 bg-ink/5 relative">
                  <Motion.motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.w}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2,0.8,0.2,1] }}
                    className={`h-full ${i === SOCIAL_FUNNEL.length - 1 ? "bg-rust" : "bg-ink"}`}
                  />
                  <div className="absolute inset-0 flex items-center px-3 text-paper mix-blend-difference mono text-[10px] uppercase tracking-[0.2em]">
                    {s.w}%
                  </div>
                </div>
                <div className="col-span-2 text-right display text-xl">{s.v.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-0 border-t border-ink/20 pt-5">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{lang === "es" ? "Conversión global" : "Overall conversion"}</div>
              <div className="display text-5xl mt-2">3.04%</div>
            </div>
            <div className="border-l border-ink/20 pl-5">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{lang === "es" ? "Pedido medio" : "Avg. order"}</div>
              <div className="display text-5xl mt-2">€486</div>
            </div>
          </div>
        </div>

        {/* Top posts */}
        <div className="col-span-12 lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.social.analytics.top}</div>
            <button className="mono text-[10px] uppercase tracking-[0.25em] underline underline-offset-4">{lang === "es" ? "Ver todo" : "View all"}</button>
          </div>
          <div className="space-y-0 border border-ink">
            {topPosts.map((p, i) => (
              <div key={p.id} className={`grid grid-cols-12 items-center gap-3 p-3 ${i > 0 ? "border-t border-ink/15" : ""}`}>
                <div className="col-span-1 display text-2xl">{String(i+1).padStart(2,"0")}</div>
                <div className="col-span-2 w-12 h-14"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                <div className="col-span-6">
                  <div className="flex items-center gap-2 mb-1">
                    <ChannelDot ch={p.channel} />
                    <span className="mono text-[9px] uppercase tracking-[0.22em] text-ink/60">{p.format}</span>
                  </div>
                  <div className="text-sm leading-tight">{p.title[lang]}</div>
                </div>
                <div className="col-span-3 text-right">
                  <div className="display text-xl">{(p.reach/1000).toFixed(1)}k</div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">reach</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dual-line chart for reach ──────────────────────────────────
function DualLineChart({ a, b, aColor = "#c0432a", bColor = "#0a0a0a", aLabel, bLabel }) {
  const w = 900, h = 220, padL = 36, padR = 12, padT = 12, padB = 24;
  const all = [...a, ...b];
  const max = Math.max(...all);
  const min = 0;
  const range = max - min || 1;
  const step = (w - padL - padR) / (a.length - 1);
  const buildLine = (data) => data.map((v, i) => [padL + i * step, h - padB - ((v - min) / range) * (h - padT - padB)]);
  const ptsA = buildLine(a);
  const ptsB = buildLine(b);
  const path = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      {[0,1,2,3,4].map((_, i) => {
        const y = padT + ((h - padT - padB) / 4) * i;
        return <line key={i} x1={padL} y1={y} x2={w - padR} y2={y} stroke="#0a0a0a" strokeOpacity="0.08" />;
      })}
      <path d={path(ptsA) + ` L ${ptsA[ptsA.length-1][0]},${h-padB} L ${ptsA[0][0]},${h-padB} Z`} fill={aColor} fillOpacity="0.06" />
      <path d={path(ptsA)} fill="none" stroke={aColor} strokeWidth="1.5" />
      <path d={path(ptsB)} fill="none" stroke={bColor} strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx={ptsA[ptsA.length-1][0]} cy={ptsA[ptsA.length-1][1]} r="4" fill={aColor} />
      <circle cx={ptsB[ptsB.length-1][0]} cy={ptsB[ptsB.length-1][1]} r="4" fill={bColor} />

      <text x={padL} y={h-6} fontSize="9" fontFamily="JetBrains Mono" fill="#0a0a0a99">May 01</text>
      <text x={w-padR} y={h-6} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono" fill="#0a0a0a99">May 30</text>

      <g transform="translate(50, 20)">
        <rect x="0" y="-8" width="10" height="2" fill={aColor} />
        <text x="14" y="-3" fontSize="10" fontFamily="JetBrains Mono" fill="#0a0a0a">{aLabel}</text>
        <rect x="100" y="-8" width="10" height="2" fill={bColor} />
        <text x="114" y="-3" fontSize="10" fontFamily="JetBrains Mono" fill="#0a0a0a">{bLabel}</text>
      </g>
    </svg>
  );
}

window.SocialHub = SocialHub;
