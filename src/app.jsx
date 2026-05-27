// App shell — top nav, language toggle, routing, auth modal management

const ROUTES = {
  STOREFRONT: "storefront",
  CART:       "cart",
  CHECKOUT:   "checkout",
  ORDER:      "order",
  USER:       "user",
  ADMIN:      "admin",
  ERROR:      "error",
};

const ADMIN_TABS = ["dashboard","products","crm","cms","orders","settings"];

function Logo({ size = 40, light }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`border ${light ? "border-paper" : "border-ink"} flex items-center justify-center`} style={{ width: size, height: size }}>
        <div className={`${light ? "bg-paper" : "bg-ink"}`} style={{ width: size/5, height: size/5 }} />
      </div>
      <div className="leading-none">
        <div className={`display text-2xl ${light ? "text-paper" : "text-ink"}`} style={{ letterSpacing: "0.04em" }}>MONOLITH</div>
        <div className={`mono text-[9px] uppercase tracking-[0.3em] ${light ? "text-paper/60" : "text-ink/60"}`}>ATELIER · LISBOA</div>
      </div>
    </div>
  );
}

function TopNav({ route, setRoute, lang, setLang, user, onLogin, onLogout, cartCount, onCart }) {
  const { t } = useT();
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { id: ROUTES.STOREFRONT, l: t.nav.shop },
    { id: "collections",     l: t.nav.collections },
    { id: "journal",         l: t.nav.journal },
    { id: "stores",          l: t.nav.stores },
  ];

  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-ink">
      <div className="grid grid-cols-12 items-center h-14">
        <div className="col-span-3 px-5 border-r border-ink h-full flex items-center">
          <button onClick={() => setRoute(ROUTES.STOREFRONT)} className="text-left">
            <Logo size={28} />
          </button>
        </div>

        <nav className="col-span-5 h-full flex items-stretch">
          {navItems.map((n, i) => (
            <button
              key={n.id}
              onClick={() => n.id === ROUTES.STOREFRONT ? setRoute(ROUTES.STOREFRONT) : setRoute(ROUTES.ERROR)}
              className={`mono text-[10px] uppercase tracking-[0.25em] px-5 ${i > 0 ? "border-l border-ink/10" : ""} ${route === n.id ? "text-ink" : "text-ink/60 hover:text-ink"}`}
            >
              {n.l}
            </button>
          ))}
        </nav>

        <div className="col-span-4 h-full flex items-stretch justify-end">
          {/* Language toggle */}
          <div className="h-full px-2 flex items-center border-l border-ink/10">
            <div className="border border-ink h-8 flex items-center">
              {["en","es"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`mono text-[10px] uppercase tracking-[0.22em] h-full w-9 ${lang === l ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setRoute(user ? ROUTES.USER : null) || (!user && onLogin())} className="h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-paper">
            <Icons.User size={14} />
            {user ? user.name.split(" ")[0] : t.nav.login}
          </button>

          <button onClick={() => setRoute(ROUTES.ADMIN)} className={`h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper ${route === ROUTES.ADMIN ? "bg-ink text-paper" : "text-ink"}`}>
            <Icons.Layers size={14} />
            {t.nav.admin}
          </button>

          <button onClick={onCart} className="h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper">
            <Icons.ShoppingBag size={14} />
            {t.nav.cart} · {cartCount}
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminShell({ children, tab, setTab, lang, setLang, user, onLogin, onLogout, defaultLang, setDefaultLang }) {
  const { t } = useT();
  const tabs = [
    { id: "dashboard", l: t.admin.tabs[0], icon: Icons.Activity },
    { id: "products",  l: t.admin.tabs[1], icon: Icons.Package },
    { id: "crm",       l: t.admin.tabs[2], icon: Icons.Users },
    { id: "cms",       l: t.admin.tabs[3], icon: Icons.Newspaper },
    { id: "social",    l: t.admin.tabs[4], icon: Icons.Mail },
    { id: "orders",    l: t.admin.tabs[5], icon: Icons.Truck },
    { id: "settings",  l: t.admin.tabs[6], icon: Icons.Settings },
  ];
  return (
    <div className="grid grid-cols-12 min-h-screen">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-ink text-paper md:border-r border-ink flex flex-col md:sticky md:top-14 md:self-start md:min-h-[calc(100vh-56px)] md:max-h-[calc(100vh-56px)] md:overflow-auto">
        <div className="p-5 border-b border-paper/15">
          <Logo size={28} light />
        </div>
        <div className="p-3 border-b border-paper/15">
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-paper/50 px-2 py-2">Operations</div>
          {tabs.map((x) => {
            const on = x.id === tab;
            return (
              <button key={x.id} onClick={() => setTab(x.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 mono text-[10px] uppercase tracking-[0.22em] mb-0.5 ${on ? "bg-paper text-ink" : "text-paper/80 hover:bg-paper/10"}`}>
                <x.icon size={14} />
                <span className="flex-1 text-left">{x.l}</span>
                {on && <Icons.ChevronRight size={12} />}
              </button>
            );
          })}
        </div>
        <div className="p-3 flex-1">
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-paper/50 px-2 py-2">Shortcuts</div>
          {[
            { l: "View storefront", icon: Icons.ExternalLink },
            { l: "Notifications · 04", icon: Icons.Bell },
            { l: "Atelier calendar", icon: Icons.Calendar },
          ].map((x, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 mono text-[10px] uppercase tracking-[0.22em] text-paper/70 hover:bg-paper/10">
              <x.icon size={14} />
              <span className="flex-1 text-left">{x.l}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-paper/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-paper stripes-stone" />
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.22em]">Inês Costa</div>
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/50">Owner</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-8 h-8 border border-paper/40 inline-flex items-center justify-center hover:bg-paper hover:text-ink"><Icons.LogOut size={12} /></button>
        </div>
      </aside>

      <main className="col-span-12 md:col-span-9 lg:col-span-10 bg-paper min-h-[calc(100vh-56px)]">
        <PageFade k={tab}>{children}</PageFade>
      </main>
    </div>
  );
}

function Footer() {
  const { t, lang } = useT();
  return (
    <footer className="bg-ink text-paper">
      <div className="grid grid-cols-12 border-b border-paper/15">
        <div className="col-span-12 md:col-span-5 p-10 border-r border-paper/15">
          <Logo size={36} light />
          <div className="display text-5xl mt-8 leading-[0.95] max-w-md">
            {lang === "es" ? "Veintitrés piezas. Una sola voz." : "Twenty-three pieces. One voice."}
          </div>
          <p className="text-sm text-paper/70 mt-6 max-w-sm">
            {lang === "es" ? "Apúntate al correo y recibe los lanzamientos un día antes." : "Join the list and get every drop a day before."}
          </p>
          <div className="mt-4 flex border border-paper/30 h-12 max-w-md">
            <input className="flex-1 px-4 text-sm bg-transparent text-paper outline-none" placeholder={lang === "es" ? "tu@correo.com" : "you@email.com"} />
            <button className="px-5 mono text-[10px] uppercase tracking-[0.25em] border-l border-paper/30 hover:bg-paper hover:text-ink">{lang === "es" ? "Suscribir" : "Subscribe"}</button>
          </div>
        </div>
        <div className="col-span-6 md:col-span-2 p-10 border-r border-paper/15">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/50 mb-4">Shop</div>
          <ul className="space-y-2 text-sm text-paper/80">
            {t.catalog.categories.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2 p-10 border-r border-paper/15">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/50 mb-4">House</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>About</li><li>Press</li><li>Sustainability</li><li>Careers</li><li>Stores</li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-3 p-10">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/50 mb-4">Atelier</div>
          <address className="not-italic text-sm text-paper/80 leading-relaxed">
            Casa MONOLITH<br />
            Rua do Século 7<br />
            1200-433 Lisboa, PT<br />
            +351 21 397 4400
          </address>
        </div>
      </div>
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 mono text-[10px] uppercase tracking-[0.25em] text-paper/60">
        <div>{t.common.footerCopy}</div>
        <div className="flex gap-6">
          <span>Privacy</span><span>Terms</span><span>Cookies</span><span>Shipping</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Cart Drawer ────────────────────────────────────────────────
function CartDrawer({ open, onClose, items, onAuth, onCheckout }) {
  const { t, lang } = useT();
  const total = items.reduce((a, b) => a + b.price, 0);
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-ink/60 z-40 animate-[om-fade-up_.25s_both]" />
      <Motion.motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }}
        transition={{ duration: 0.35, ease: [0.2,0.8,0.2,1] }}
        className="fixed top-0 right-0 bottom-0 w-full md:w-[460px] bg-paper border-l border-ink z-50 flex flex-col"
      >
            <div className="p-6 border-b border-ink flex items-center justify-between">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.nav.cart}</div>
                <div className="display text-4xl">{items.length} {lang === "es" ? "piezas" : "pieces"}</div>
              </div>
              <button onClick={onClose} className="w-10 h-10 border border-ink inline-flex items-center justify-center hover:bg-ink hover:text-paper"><Icons.X size={16} /></button>
            </div>
            <div className="flex-1 overflow-auto">
              {items.length === 0 && (
                <div className="p-12 text-center text-ink/60">
                  <Icons.ShoppingBag size={28} className="mx-auto" />
                  <div className="display text-3xl mt-4">{lang === "es" ? "Bolso vacío" : "Empty bag"}</div>
                  <p className="text-sm mt-1">{lang === "es" ? "Explora la colección y reserva piezas." : "Explore the collection and reserve pieces."}</p>
                </div>
              )}
              {items.map((p, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-4 border-b border-ink/15">
                  <div className="col-span-3"><StripePlaceholder stripe={p.stripe} aspect="3/4" /></div>
                  <div className="col-span-7">
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{p.id}</div>
                    <div className="display text-xl">{p.name[lang]}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 mt-1">Size · M · 1</div>
                  </div>
                  <div className="col-span-2 text-right display text-xl">{fmtMoney(p.price, "EUR", lang)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-ink p-6">
              <div className="flex items-baseline justify-between mb-4">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{lang === "es" ? "Total" : "Total"}</div>
                <div className="display text-4xl">{fmtMoney(total, "EUR", lang)}</div>
              </div>
              <Btn kind="solid" size="lg" full iconRight={Icons.ArrowRight} onClick={onCheckout}>{lang === "es" ? "Ir a la caja" : "Checkout"}</Btn>
            </div>
          </Motion.motion.div>
    </>
  );
}

// ─── Root App ───────────────────────────────────────────────────
function App() {
  const [lang, setLang] = React.useState("en");
  const [defaultLang, setDefaultLang] = React.useState("en");
  const [route, setRoute] = React.useState(ROUTES.STOREFRONT);
  const [adminTab, setAdminTab] = React.useState("dashboard");
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState("login");
  const [user, setUser] = React.useState(null);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cart] = React.useState(() => PRODUCTS.slice(0, 2));
  const [activeOrder, setActiveOrder] = React.useState(null);

  const ctx = React.useMemo(() => ({ lang, t: T[lang], setLang }), [lang]);

  // Reset route to storefront if logout
  const logout = () => {
    setUser(null);
    setRoute(ROUTES.STOREFRONT);
  };

  const openLogin = () => { setAuthMode("login"); setAuthOpen(true); };

  // On user click: if logged in, go to user dashboard. If not, open login modal.
  const handleAccountClick = () => {
    if (user) setRoute(ROUTES.USER);
    else openLogin();
  };

  return (
    <LangCtx.Provider value={ctx}>
      <div className="min-h-screen flex flex-col">
        {/* Hide top nav inside admin to make it feel like a tool */}
        {route !== ROUTES.ADMIN && (
          <CustomTopNav
            route={route}
            setRoute={setRoute}
            lang={lang}
            setLang={setLang}
            user={user}
            onAccount={handleAccountClick}
            onAdmin={() => setRoute(ROUTES.ADMIN)}
            onCart={() => setCartOpen(true)}
            cartCount={cart.length}
          />
        )}

        {route === ROUTES.ADMIN && (
          <AdminTopBar lang={lang} setLang={setLang} onExit={() => setRoute(ROUTES.STOREFRONT)} />
        )}

        <PageFade k={route + "-" + adminTab}>
          {route === ROUTES.STOREFRONT && <Storefront onAuth={openLogin} />}
          {route === ROUTES.CHECKOUT && (
            <CheckoutPage
              cart={cart}
              onBack={() => setRoute(ROUTES.STOREFRONT)}
              onPlaceOrder={(o) => setActiveOrder(o)}
              onSuccess={(o) => { setActiveOrder(o); setRoute(ROUTES.ORDER); }}
            />
          )}
          {route === ROUTES.ORDER && (
            <OrderDetail
              order={activeOrder}
              onBack={() => { if (user) setRoute(ROUTES.USER); else setRoute(ROUTES.STOREFRONT); }}
              onSupport={() => {}}
            />
          )}
          {route === ROUTES.USER && (user
            ? <UserDashboard user={user} onLogout={logout} onOrderOpen={(id) => { const o = synthesizeOrder(id); if (o) { setActiveOrder(o); setRoute(ROUTES.ORDER); } }} />
            : <Error404 onHome={() => setRoute(ROUTES.STOREFRONT)} onCatalog={() => setRoute(ROUTES.STOREFRONT)} />
          )}
          {route === ROUTES.ERROR && <Error404 onHome={() => setRoute(ROUTES.STOREFRONT)} onCatalog={() => setRoute(ROUTES.STOREFRONT)} />}
          {route === ROUTES.ADMIN && (
            <AdminShell
              tab={adminTab}
              setTab={setAdminTab}
              lang={lang}
              setLang={setLang}
              user={user}
              onLogout={logout}
              defaultLang={defaultLang}
              setDefaultLang={setDefaultLang}
            >
              {adminTab === "dashboard" && <AdminDashboard />}
              {adminTab === "products" && <ProductsPanel />}
              {adminTab === "crm" && <CRM />}
              {adminTab === "cms" && <CMS />}
              {adminTab === "social" && <SocialHub />}
              {adminTab === "orders" && <OrdersPanel />}
              {adminTab === "settings" && <SettingsPanel defaultLang={defaultLang} onDefaultLangChange={setDefaultLang} />}
            </AdminShell>
          )}
        </PageFade>

        {route !== ROUTES.ADMIN && <Footer />}

        <AuthModal
          open={authOpen}
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onSwitch={setAuthMode}
          onAuth={(u) => { setUser(u); setAuthOpen(false); setRoute(ROUTES.USER); }}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cart}
          onAuth={openLogin}
          onCheckout={() => { setCartOpen(false); setRoute(ROUTES.CHECKOUT); }}
        />
      </div>
    </LangCtx.Provider>
  );
}

// Top nav reads from ctx via hook
function CustomTopNav({ route, setRoute, lang, setLang, user, onAccount, onAdmin, onCart, cartCount }) {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-ink">
      <div className="grid grid-cols-12 items-center h-14">
        <div className="col-span-3 px-5 border-r border-ink h-full flex items-center">
          <button onClick={() => setRoute(ROUTES.STOREFRONT)} className="text-left">
            <Logo size={28} />
          </button>
        </div>
        <nav className="col-span-5 h-full flex items-stretch">
          {[
            { id: ROUTES.STOREFRONT, l: t.nav.shop },
            { id: "collections",     l: t.nav.collections },
            { id: "journal",         l: t.nav.journal },
            { id: "stores",          l: t.nav.stores },
          ].map((n, i) => (
            <button
              key={n.id}
              onClick={() => n.id === ROUTES.STOREFRONT ? setRoute(ROUTES.STOREFRONT) : setRoute(ROUTES.ERROR)}
              className={`mono text-[10px] uppercase tracking-[0.25em] px-5 h-full ${i > 0 ? "border-l border-ink/10" : ""} ${route === n.id ? "text-ink" : "text-ink/60 hover:text-ink"}`}
            >
              {n.l}
            </button>
          ))}
        </nav>
        <div className="col-span-4 h-full flex items-stretch justify-end">
          <div className="h-full px-3 flex items-center border-l border-ink/10">
            <div className="border border-ink h-8 flex items-center">
              {["en","es"].map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`mono text-[10px] uppercase tracking-[0.22em] h-full w-9 ${lang === l ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onAccount} className="h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper whitespace-nowrap">
            <Icons.User size={14} />
            {user ? user.name.split(" ")[0] || user.email.split("@")[0] : t.nav.login}
          </button>
          <button onClick={onAdmin} className="h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper whitespace-nowrap">
            <Icons.Layers size={14} />
            {t.nav.admin}
          </button>
          <button onClick={onCart} className="h-full px-4 border-l border-ink/10 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper whitespace-nowrap">
            <Icons.ShoppingBag size={14} />
            {t.nav.cart} · {String(cartCount).padStart(2,"0")}
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminTopBar({ lang, setLang, onExit }) {
  return (
    <header className="sticky top-0 z-30 bg-ink text-paper border-b border-ink">
      <div className="grid grid-cols-12 items-center h-14">
        <div className="col-span-3 px-5 border-r border-paper/15 h-full flex items-center">
          <button onClick={onExit} className="flex items-center gap-2 mono text-[10px] uppercase tracking-[0.25em] hover:opacity-80">
            <Icons.ArrowLeft size={14} />
            <span>Back to storefront</span>
          </button>
        </div>
        <div className="col-span-6 h-full flex items-center justify-center">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-paper/70">MONOLITH · OPERATIONS · LISBOA</div>
        </div>
        <div className="col-span-3 h-full flex items-stretch justify-end">
          <div className="h-full px-3 flex items-center border-l border-paper/15">
            <div className="border border-paper h-8 flex items-center">
              {["en","es"].map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`mono text-[10px] uppercase tracking-[0.22em] h-full w-9 ${lang === l ? "bg-paper text-ink" : "text-paper hover:bg-paper/10"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button className="h-full px-4 border-l border-paper/15 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-paper hover:text-ink">
            <Icons.Bell size={14} />04
          </button>
          <button className="h-full px-4 border-l border-paper/15 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] hover:bg-paper hover:text-ink">
            <Icons.Search size={14} />Search
          </button>
        </div>
      </div>
    </header>
  );
}

// Orders panel (simple list reusing ORDERS / LIVE_ORDERS)
function OrdersPanel() {
  const { t, lang } = useT();
  const allOrders = [
    ...LIVE_ORDERS.map(o => ({ ...o, status: "preparing", date: "2026-05-21", piece: "—" })),
    ...ORDERS,
  ];
  return (
    <div>
      <div className="px-6 md:px-12 py-10 border-b border-ink">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">PRIVATE · LOGISTICS</div>
        <h1 className="display text-6xl md:text-7xl">{lang === "es" ? "Pedidos" : "Orders"}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 border border-ink mt-8">
          {[
            { l: lang === "es" ? "Hoy" : "Today",        v: "32" },
            { l: lang === "es" ? "Pendientes" : "Open",  v: "08" },
            { l: lang === "es" ? "En tránsito" : "In transit", v: "14" },
            { l: lang === "es" ? "Devoluciones" : "Returns", v: "02" },
          ].map((s, i) => (
            <div key={i} className={`p-5 ${i > 0 ? "border-l border-ink" : ""}`}>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{s.l}</div>
              <div className="display text-4xl mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 md:px-12 py-8">
        <div className="border border-ink">
          <div className="grid grid-cols-12 px-5 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
            <div className="col-span-2">Order</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Customer / piece</div>
            <div className="col-span-1 text-right">Items</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          {allOrders.slice(0, 14).map((o, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-5 py-3 border-b border-ink/15 last:border-b-0 hover:bg-chalk">
              <div className="col-span-2 mono text-[11px]">{o.id}</div>
              <div className="col-span-2 mono text-[11px] text-ink/70">{o.date}</div>
              <div className="col-span-4 text-sm">{o.who || o.piece}</div>
              <div className="col-span-1 text-right mono text-[11px]">{o.items || "1"}</div>
              <div className="col-span-1 text-right display text-xl">{fmtMoney(o.total || o.amount, "EUR", lang)}</div>
              <div className="col-span-2 flex justify-end"><StatusBadge status={o.status || "preparing"} lang={lang} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
