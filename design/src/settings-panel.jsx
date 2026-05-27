// Settings panel — store-wide configuration

function SettingsPanel({ defaultLang, onDefaultLangChange }) {
  const { t, lang } = useT();
  const [section, setSection] = React.useState("regional");
  const [paymentMethods, setPaymentMethods] = React.useState(PAYMENT_METHODS);
  const [currency, setCurrency] = React.useState("EUR");
  const [tz, setTz] = React.useState("Europe/Lisbon");
  const [rate, setRate] = React.useState("Atelier · DDP worldwide");

  const sections = [
    { id: "regional", l: t.settings.sections.regional, icon: Icons.Globe },
    { id: "payments", l: t.settings.sections.payments, icon: Icons.CreditCard },
    { id: "shipping", l: t.settings.sections.shipping, icon: Icons.Truck },
    { id: "taxes",    l: t.settings.sections.taxes,    icon: Icons.Receipt },
    { id: "team",     l: t.settings.sections.team,     icon: Icons.Users },
    { id: "danger",   l: t.settings.sections.danger,   icon: Icons.AlertTriangle },
  ];

  const togglePayment = (id) => {
    setPaymentMethods((m) => m.map((p) => p.id === id ? { ...p, on: !p.on } : p));
  };

  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · CONFIGURATION</div>
        <h1 className="display text-6xl md:text-7xl">{t.settings.title}</h1>
        <p className="text-sm text-ink/70 mt-2 max-w-xl">{t.settings.sub}</p>
      </div>

      <div className="grid grid-cols-12 min-h-[60vh]">
        <aside className="col-span-12 lg:col-span-3 border-r border-ink">
          {sections.map((s) => {
            const on = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)} className={`w-full text-left px-6 py-4 border-b border-ink/15 flex items-center gap-3 ${on ? "bg-ink text-paper" : "hover:bg-chalk"}`}>
                <s.icon size={16} />
                <div className="mono text-[11px] uppercase tracking-[0.22em] flex-1">{s.l}</div>
                <Icons.ChevronRight size={14} className={on ? "" : "opacity-30"} />
              </button>
            );
          })}
        </aside>

        <div className="col-span-12 lg:col-span-9 p-6 md:p-10">
          <PageFade k={section}>
            {section === "regional" && (
              <div className="max-w-3xl space-y-6">
                <SectionHead eyebrow="01" title={t.settings.sections.regional} sub={lang === "es" ? "Idioma, moneda y zona horaria por defecto." : "Default language, currency and timezone."} />
                <div className="grid grid-cols-2 gap-4">
                  <Select label={t.settings.defaultLang} value={defaultLang} onChange={(e) => onDefaultLangChange(e.target.value)} options={[{label:"English", value:"en"},{label:"Español", value:"es"}]} />
                  <Select label={t.settings.currency} value={currency} onChange={(e) => setCurrency(e.target.value)} options={["EUR","GBP","USD","JPY","CHF"]} />
                </div>
                <Select label={t.settings.timezone} value={tz} onChange={(e) => setTz(e.target.value)} options={["Europe/Lisbon","Europe/Zurich","Europe/London","America/New_York","Asia/Tokyo"]} />
                <Select label={t.settings.rateCard} value={rate} onChange={(e) => setRate(e.target.value)} options={["Atelier · DDP worldwide", "Standard · DAP", "Wholesale · EXW"]} />
                <div className="flex justify-end gap-2"><Btn kind="outline">{t.common.cancel}</Btn><Btn kind="solid" icon={Icons.Save}>{t.settings.saveAll}</Btn></div>
              </div>
            )}

            {section === "payments" && (
              <div className="space-y-6">
                <SectionHead eyebrow="02" title={t.settings.sections.payments} sub={lang === "es" ? "Pasarelas activas en la caja." : "Gateways available at checkout."} />
                <div className="border border-ink">
                  {paymentMethods.map((m, i) => (
                    <div key={m.id} className={`grid grid-cols-12 items-center px-5 py-4 ${i > 0 ? "border-t border-ink/15" : ""}`}>
                      <div className="col-span-1"><Icons.CreditCard size={18} /></div>
                      <div className="col-span-7">
                        <div className="display text-xl">{m.name}</div>
                        <div className="text-sm text-ink/60">{m.desc[lang]}</div>
                      </div>
                      <div className="col-span-2 mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{m.on ? t.settings.enabled : t.settings.disabled}</div>
                      <div className="col-span-2 flex justify-end">
                        <Toggle on={m.on} onChange={() => togglePayment(m.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "shipping" && (
              <div className="space-y-6 max-w-4xl">
                <SectionHead eyebrow="03" title={t.settings.sections.shipping} sub={lang === "es" ? "Zonas, tarifas y plazos comprometidos." : "Zones, rates and committed lead times."} />
                <div className="border border-ink">
                  {[
                    { z: "EU · 28 countries", rate: "Free over €240 · €18 std",   eta: "3-5 d" },
                    { z: "UK + EEA",          rate: "Free over €280 · €24 std",   eta: "4-6 d" },
                    { z: "North America",     rate: "€42 DDP · €0 over €600",     eta: "5-8 d" },
                    { z: "Asia · Pacific",    rate: "€58 DDP",                    eta: "7-10 d" },
                    { z: "Rest of world",     rate: "€68 DAP",                    eta: "10-14 d" },
                  ].map((z, i) => (
                    <div key={z.z} className={`grid grid-cols-12 items-center px-5 py-4 ${i > 0 ? "border-t border-ink/15" : ""}`}>
                      <div className="col-span-4 display text-xl">{z.z}</div>
                      <div className="col-span-5 text-sm">{z.rate}</div>
                      <div className="col-span-2 mono text-[11px]">{z.eta}</div>
                      <div className="col-span-1 flex justify-end"><Icons.Edit size={14} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "taxes" && (
              <div className="space-y-6 max-w-3xl">
                <SectionHead eyebrow="04" title={t.settings.sections.taxes} />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="VAT scheme" value="EU IOSS" onChange={() => {}} options={["EU IOSS","EU OSS","Non-EU"]} />
                  <Field label="VAT no." value="PT 514 281 002" onChange={() => {}} />
                </div>
                <div className="border border-ink p-5">
                  <div className="display text-xl mb-3">{lang === "es" ? "Tasas activas" : "Active rates"}</div>
                  {[
                    { l: "Portugal (default)", v: "23%" },
                    { l: "Spain", v: "21%" },
                    { l: "France", v: "20%" },
                    { l: "United Kingdom", v: "20%" },
                    { l: "United States", v: "Per state · automated" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-t border-ink/15 first:border-t-0">
                      <div className="text-sm">{r.l}</div>
                      <div className="mono text-[11px]">{r.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "team" && (
              <div className="space-y-6">
                <SectionHead eyebrow="05" title={t.settings.sections.team} right={<Btn kind="solid" icon={Icons.Plus} size="sm">Invite</Btn>} />
                <div className="border border-ink">
                  {[
                    { n: "Inês Costa",     r: "Owner",     e: "ines@monolith.studio",     last: "Just now" },
                    { n: "Carlos Almeida", r: "Operations", e: "carlos@monolith.studio",   last: "2 h ago" },
                    { n: "Sofia Pinto",    r: "Editor",    e: "sofia@monolith.studio",    last: "Yesterday" },
                    { n: "Bruno Tavares",  r: "Atelier",   e: "bruno@monolith.studio",    last: "3 d ago" },
                  ].map((m, i) => (
                    <div key={m.e} className={`grid grid-cols-12 items-center px-5 py-4 ${i > 0 ? "border-t border-ink/15" : ""}`}>
                      <div className="col-span-1"><div className="w-10 h-10 border border-ink stripes-stone" /></div>
                      <div className="col-span-4 ml-2">
                        <div className="display text-xl">{m.n}</div>
                        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{m.e}</div>
                      </div>
                      <div className="col-span-3"><Tag tone={m.r === "Owner" ? "ink" : "line"}>{m.r}</Tag></div>
                      <div className="col-span-3 mono text-[10px] uppercase tracking-[0.2em] text-ink/50">Last active · {m.last}</div>
                      <div className="col-span-1 flex justify-end"><Icons.MoreHorizontal size={16} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "danger" && (
              <div className="space-y-6 max-w-2xl">
                <SectionHead eyebrow="06" title={t.settings.sections.danger} sub={lang === "es" ? "Acciones irreversibles. Confirma dos veces." : "Irreversible actions. Confirm twice."} />
                <div className="border border-rust">
                  {[
                    { t: lang === "es" ? "Cerrar tienda temporalmente" : "Pause storefront",       b: lang === "es" ? "Pausar las ventas y mostrar un mensaje de mantenimiento." : "Pause sales and show a maintenance message.", btn: "Pause"},
                    { t: lang === "es" ? "Borrar caché editorial" : "Clear editorial cache",        b: lang === "es" ? "Invalida banners y páginas en CDN." : "Invalidates banners and pages in CDN.", btn: "Clear"},
                    { t: lang === "es" ? "Restaurar datos demo" : "Restore demo data",              b: lang === "es" ? "Sobrescribe el inventario actual." : "Overwrites current inventory.", btn: "Restore"},
                    { t: lang === "es" ? "Eliminar la cuenta" : "Delete account",                   b: lang === "es" ? "Cierra esta casa y libera el dominio." : "Closes this house and releases the domain.", btn: "Delete"},
                  ].map((x, i) => (
                    <div key={i} className={`grid grid-cols-12 items-center px-5 py-5 gap-4 ${i > 0 ? "border-t border-rust/40" : ""}`}>
                      <div className="col-span-9">
                        <div className="display text-xl">{x.t}</div>
                        <div className="text-sm text-ink/60">{x.b}</div>
                      </div>
                      <div className="col-span-3 flex justify-end">
                        <Btn kind="danger" size="sm">{x.btn}</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </PageFade>
        </div>
      </div>
    </div>
  );
}

window.SettingsPanel = SettingsPanel;
