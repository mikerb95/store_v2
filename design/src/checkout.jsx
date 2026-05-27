// Checkout — multi-step funnel with sticky order summary

const COUNTRIES = ["Portugal","Spain","France","United Kingdom","Germany","Italy","Switzerland","Netherlands","Sweden","Denmark","United States","Canada","Mexico","Brazil","Japan","South Korea","Australia","Nigeria"];

function CheckoutPage({ cart, onPlaceOrder, onBack, onSuccess }) {
  const { t, lang } = useT();
  const [step, setStep] = React.useState(0); // 0..4
  const [completed, setCompleted] = React.useState(new Set());
  const [placing, setPlacing] = React.useState(false);
  const [placedOrder, setPlacedOrder] = React.useState(null);

  const [form, setForm] = React.useState({
    email: "olivia.b@arch.ch",
    phone: "+41 76 421 8800",
    guest: false,
    marketing: true,
    first: "Olivia",
    last: "Bauer",
    company: "",
    address1: "Limmatquai 88",
    address2: "",
    city: "Zürich",
    state: "ZH",
    zip: "8001",
    country: "Switzerland",
    sameBilling: true,
    delivery: "express",
    payMethod: "Card",
    cardNumber: "4242 4242 4242 4242",
    cardName: "Olivia Bauer",
    cardExpiry: "08 / 28",
    cardCVC: "224",
    saveCard: true,
    promo: "",
    creditApplied: 0,
  });

  // Cart items resolved with sizes/qty
  const lines = React.useMemo(() => cart.map((p, i) => ({
    ...p,
    size: ["M","L","S","XL"][i % 4],
    qty: 1,
    lineId: i,
  })), [cart]);

  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const deliveryOpt = t.checkout.delivery.options.find(o => o.id === form.delivery);
  const shipping = deliveryOpt?.price || 0;
  const taxRate = 0.23;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shipping + tax - form.creditApplied;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setVal = (k, v) => setForm({ ...form, [k]: v });

  const next = () => {
    setCompleted((s) => new Set([...s, step]));
    setStep((s) => Math.min(s + 1, 4));
  };
  const goto = (i) => setStep(i);

  const place = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = {
        id: "MO-" + String(58320 + Math.floor(Math.random() * 80)).padStart(5, "0"),
        date: new Date().toISOString().slice(0, 10),
        items: lines,
        subtotal, shipping, tax, total,
        form,
        deliveryOpt,
        status: "preparing",
      };
      setPlacedOrder(order);
      setPlacing(false);
      onPlaceOrder?.(order);
    }, 1100);
  };

  if (placedOrder) {
    return <CheckoutSuccess order={placedOrder} onView={() => onSuccess?.(placedOrder)} onKeep={onBack} />;
  }

  return (
    <section className="border-b border-ink">
      {/* Top breadcrumb / progress */}
      <div className="border-b border-ink">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-12 md:col-span-3 px-6 md:px-10 py-5 border-r border-ink">
            <button onClick={onBack} className="mono text-[10px] uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:opacity-70">
              <Icons.ArrowLeft size={14} /> {lang === "es" ? "Seguir comprando" : "Keep shopping"}
            </button>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-5 h-16 border-t md:border-t-0 border-ink/10">
              {t.checkout.steps.map((label, i) => {
                const done = completed.has(i);
                const active = step === i;
                const reachable = done || active || i < step;
                return (
                  <button
                    key={label}
                    onClick={() => reachable && goto(i)}
                    disabled={!reachable}
                    className={`relative flex items-center justify-center gap-3 px-3 ${i > 0 ? "border-l border-ink" : ""} ${active ? "bg-ink text-paper" : done ? "text-ink hover:bg-ink/5" : "text-ink/40"}`}
                  >
                    <span className={`mono text-[10px] uppercase tracking-[0.22em] w-6 h-6 inline-flex items-center justify-center border ${active ? "border-paper" : done ? "border-ink" : "border-ink/30"}`}>
                      {done ? <Icons.Check size={12} /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mono text-[10px] uppercase tracking-[0.22em] hidden md:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 border-r border-ink">
          <div className="px-6 md:px-10 py-10">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">{t.checkout.eyebrow}</div>
            <h1 className="display text-5xl md:text-6xl">{t.checkout.title}</h1>
          </div>

          {/* Steps stack */}
          <CheckoutStep
            n={1}
            title={t.checkout.contact.title}
            sub={t.checkout.contact.sub}
            active={step === 0}
            done={completed.has(0)}
            onOpen={() => goto(0)}
            summary={`${form.email} · ${form.phone}`}
          >
            <ContactStep form={form} set={set} setVal={setVal} />
            <StepActions onNext={next} />
          </CheckoutStep>

          <CheckoutStep
            n={2}
            title={t.checkout.shipping.title}
            sub={t.checkout.shipping.sub}
            active={step === 1}
            done={completed.has(1)}
            onOpen={() => goto(1)}
            summary={`${form.first} ${form.last}, ${form.address1}, ${form.zip} ${form.city}, ${form.country}`}
          >
            <ShippingStep form={form} set={set} setVal={setVal} />
            <StepActions onNext={next} onBack={() => goto(0)} />
          </CheckoutStep>

          <CheckoutStep
            n={3}
            title={t.checkout.delivery.title}
            sub={t.checkout.delivery.sub}
            active={step === 2}
            done={completed.has(2)}
            onOpen={() => goto(2)}
            summary={deliveryOpt ? `${deliveryOpt.l} · ${deliveryOpt.eta}` : ""}
          >
            <DeliveryStep form={form} setVal={setVal} />
            <StepActions onNext={next} onBack={() => goto(1)} />
          </CheckoutStep>

          <CheckoutStep
            n={4}
            title={t.checkout.payment.title}
            sub={t.checkout.payment.sub}
            active={step === 3}
            done={completed.has(3)}
            onOpen={() => goto(3)}
            summary={`${form.payMethod} · •••• ${form.cardNumber.slice(-4)}`}
          >
            <PaymentStep form={form} set={set} setVal={setVal} />
            <StepActions onNext={next} onBack={() => goto(2)} nextLabel={t.common.next} />
          </CheckoutStep>

          <CheckoutStep
            n={5}
            title={t.checkout.review.title}
            sub={t.checkout.review.sub}
            active={step === 4}
            done={false}
            onOpen={() => goto(4)}
            summary=""
          >
            <ReviewStep form={form} lines={lines} subtotal={subtotal} shipping={shipping} tax={tax} total={total} deliveryOpt={deliveryOpt} onEdit={goto} />
            <div className="border-t border-ink pt-5 mt-6 flex items-center justify-between gap-4 flex-wrap">
              <label className="flex items-start gap-2 cursor-pointer max-w-md">
                <input type="checkbox" className="check mt-0.5" defaultChecked />
                <span className="text-xs text-ink/70">{t.checkout.payment.terms}</span>
              </label>
              <Btn kind="solid" size="lg" iconRight={Icons.ArrowRight} onClick={place} disabled={placing}>
                {placing ? t.checkout.payment.placing : `${t.checkout.payment.place} · ${fmtMoney(total, "EUR", lang)}`}
              </Btn>
            </div>
          </CheckoutStep>
        </div>

        {/* Summary */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-14">
            <OrderSummary lines={lines} subtotal={subtotal} shipping={shipping} tax={tax} total={total} form={form} setForm={setForm} deliveryOpt={deliveryOpt} />
          </div>
        </aside>
      </div>
    </section>
  );
}

// ─── Step shell ─────────────────────────────────────────────────
function CheckoutStep({ n, title, sub, active, done, onOpen, summary, children }) {
  const { t, lang } = useT();
  return (
    <div className={`border-t border-ink ${active ? "bg-paper" : "bg-paper"}`}>
      <button onClick={() => !active && onOpen()} className={`w-full text-left px-6 md:px-10 py-5 flex items-center gap-4 ${active ? "pointer-events-none" : "hover:bg-chalk"}`}>
        <span className={`mono text-[11px] uppercase tracking-[0.22em] w-9 h-9 inline-flex items-center justify-center border ${active ? "bg-ink text-paper border-ink" : done ? "border-ink" : "border-ink/30 text-ink/40"}`}>
          {done && !active ? <Icons.Check size={14} /> : String(n).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <div className="display text-3xl leading-tight">{title}</div>
          {!active && done && summary && (
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 truncate mt-1">{summary}</div>
          )}
          {!active && !done && sub && (
            <div className="text-xs text-ink/50 mt-1 truncate">{sub}</div>
          )}
        </div>
        {!active && done && (
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/60 hover:text-ink underline underline-offset-4">{t.checkout.review.editStep}</span>
        )}
      </button>
      {active && (
        <div className="px-6 md:px-10 pb-8 om-step-open">
          {sub && <p className="text-sm text-ink/70 mb-6 max-w-xl">{sub}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

function StepActions({ onNext, onBack, nextLabel }) {
  const { t } = useT();
  return (
    <div className="flex items-center justify-between gap-2 mt-6 pt-5 border-t border-ink/15">
      {onBack ? <Btn kind="ghost" icon={Icons.ArrowLeft} onClick={onBack}>{t.common.back}</Btn> : <div />}
      <Btn kind="solid" iconRight={Icons.ArrowRight} onClick={onNext}>{nextLabel || t.common.next}</Btn>
    </div>
  );
}

// ─── Contact ───────────────────────────────────────────────────
function ContactStep({ form, set, setVal }) {
  const { t } = useT();
  return (
    <div className="space-y-4 max-w-2xl">
      <Field label={t.checkout.contact.email} type="email" value={form.email} onChange={set("email")} icon={Icons.Mail} />
      <Field label={t.checkout.contact.phone} value={form.phone} onChange={set("phone")} icon={Icons.Phone} />
      <label className="flex items-center gap-2 pt-2 cursor-pointer">
        <input type="checkbox" className="check" checked={form.marketing} onChange={(e) => setVal("marketing", e.target.checked)} />
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/80">{t.checkout.contact.marketing}</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="check" checked={form.guest} onChange={(e) => setVal("guest", e.target.checked)} />
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/80">{t.checkout.contact.guest}</span>
      </label>
    </div>
  );
}

// ─── Shipping ──────────────────────────────────────────────────
function ShippingStep({ form, set, setVal }) {
  const { t } = useT();
  return (
    <div className="grid grid-cols-2 gap-4 max-w-3xl">
      <Field label={t.checkout.shipping.first} value={form.first} onChange={set("first")} />
      <Field label={t.checkout.shipping.last}  value={form.last}  onChange={set("last")} />
      <div className="col-span-2"><Field label={t.checkout.shipping.company} value={form.company} onChange={set("company")} /></div>
      <div className="col-span-2"><Field label={t.checkout.shipping.address1} value={form.address1} onChange={set("address1")} /></div>
      <div className="col-span-2"><Field label={t.checkout.shipping.address2} value={form.address2} onChange={set("address2")} /></div>
      <Field label={t.checkout.shipping.zip} value={form.zip} onChange={set("zip")} />
      <Field label={t.checkout.shipping.city} value={form.city} onChange={set("city")} />
      <Field label={t.checkout.shipping.state} value={form.state} onChange={set("state")} />
      <Select label={t.checkout.shipping.country} value={form.country} onChange={set("country")} options={COUNTRIES} />
      <label className="col-span-2 flex items-center gap-2 pt-2 cursor-pointer">
        <input type="checkbox" className="check" checked={form.sameBilling} onChange={(e) => setVal("sameBilling", e.target.checked)} />
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/80">{t.checkout.shipping.sameBilling}</span>
      </label>
    </div>
  );
}

// ─── Delivery ──────────────────────────────────────────────────
function DeliveryStep({ form, setVal }) {
  const { t, lang } = useT();
  return (
    <div className="space-y-3">
      {t.checkout.delivery.options.map((o) => {
        const on = form.delivery === o.id;
        return (
          <button
            key={o.id}
            onClick={() => setVal("delivery", o.id)}
            className={`w-full text-left border ${on ? "border-ink bg-chalk" : "border-ink/25 hover:border-ink"} p-5 grid grid-cols-12 gap-4 items-center`}
          >
            <div className="col-span-1">
              <span className={`w-5 h-5 border ${on ? "bg-ink border-ink" : "border-ink/40"} inline-block relative`}>
                {on && <span className="absolute inset-1 bg-paper" />}
              </span>
            </div>
            <div className="col-span-9">
              <div className="display text-2xl">{o.l}</div>
              <div className="text-sm text-ink/70 mt-1">{o.sub}</div>
              {o.note && <div className="mono text-[10px] uppercase tracking-[0.22em] text-rust mt-2">{o.note}</div>}
            </div>
            <div className="col-span-2 text-right">
              <div className="display text-2xl">{o.price === 0 ? (lang === "es" ? "Gratis" : "Free") : fmtMoney(o.price, "EUR", lang)}</div>
              <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/60 mt-1">{o.eta}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Payment ───────────────────────────────────────────────────
function PaymentStep({ form, set, setVal }) {
  const { t } = useT();
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-4 gap-2">
        {t.checkout.payment.methods.map((m) => {
          const on = form.payMethod === m;
          return (
            <button key={m} onClick={() => setVal("payMethod", m)} className={`border h-12 mono text-[10px] uppercase tracking-[0.22em] ${on ? "bg-ink text-paper border-ink" : "border-ink/30 hover:border-ink"}`}>{m}</button>
          );
        })}
      </div>

      {form.payMethod === "Card" && (
        <Motion.motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Card preview */}
          <div className="border border-ink bg-ink text-paper p-5 flex flex-col gap-6 h-44 relative overflow-hidden">
            <div className="absolute inset-0 noise opacity-30" />
            <div className="relative flex items-center justify-between">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-paper/60">MONOLITH · Card</div>
              <div className="display text-xl">VISA</div>
            </div>
            <div className="relative">
              <div className="mono text-base tracking-[0.18em]">{form.cardNumber || "0000 0000 0000 0000"}</div>
            </div>
            <div className="relative grid grid-cols-2">
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/50">Name</div>
                <div className="mono text-sm">{form.cardName || "—"}</div>
              </div>
              <div className="text-right">
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-paper/50">Exp.</div>
                <div className="mono text-sm">{form.cardExpiry || "—"}</div>
              </div>
            </div>
          </div>

          <Field label={t.checkout.payment.cardNumber} value={form.cardNumber} onChange={set("cardNumber")} icon={Icons.CreditCard} />
          <Field label={t.checkout.payment.cardName}   value={form.cardName}   onChange={set("cardName")} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.checkout.payment.cardExpiry} value={form.cardExpiry} onChange={set("cardExpiry")} placeholder="MM / YY" />
            <Field label={t.checkout.payment.cardCVC}    value={form.cardCVC}    onChange={set("cardCVC")} placeholder="•••" />
          </div>
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input type="checkbox" className="check" checked={form.saveCard} onChange={(e) => setVal("saveCard", e.target.checked)} />
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink/80">{t.checkout.payment.saveCard}</span>
          </label>
        </Motion.motion.div>
      )}

      {form.payMethod !== "Card" && (
        <div className="border border-ink p-6 text-center">
          <div className="display text-3xl mb-2">{form.payMethod}</div>
          <p className="text-sm text-ink/60">{form.payMethod === "Klarna" ? "Pay in 3 — interest free." : "You'll complete the payment on the next screen."}</p>
        </div>
      )}
    </div>
  );
}

// ─── Review ────────────────────────────────────────────────────
function ReviewStep({ form, lines, subtotal, shipping, tax, total, deliveryOpt, onEdit }) {
  const { t, lang } = useT();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-ink">
        <ReviewBlock title={t.checkout.contact.title} onEdit={() => onEdit(0)}>
          <div className="text-sm">{form.email}</div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{form.phone}</div>
        </ReviewBlock>
        <ReviewBlock title={t.checkout.shipping.title} onEdit={() => onEdit(1)} border>
          <div className="text-sm">{form.first} {form.last}</div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{form.address1}</div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{form.zip} {form.city} · {form.country}</div>
        </ReviewBlock>
        <ReviewBlock title={t.checkout.payment.title} onEdit={() => onEdit(3)} border>
          <div className="text-sm">{form.payMethod}</div>
          {form.payMethod === "Card" && <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">•••• {form.cardNumber.slice(-4)} · {form.cardExpiry}</div>}
        </ReviewBlock>
      </div>

      <div className="border border-ink">
        <div className="grid grid-cols-12 px-5 py-3 mono text-[10px] uppercase tracking-[0.22em] text-ink/60 border-b border-ink">
          <div className="col-span-6">{t.checkout.summary.title.split(" ").pop()}</div>
          <div className="col-span-2">{t.checkout.summary.size}</div>
          <div className="col-span-2 text-right">{t.checkout.summary.qty}</div>
          <div className="col-span-2 text-right">{t.checkout.summary.subtotal}</div>
        </div>
        {lines.map((l) => (
          <div key={l.lineId} className="grid grid-cols-12 items-center px-5 py-4 border-t border-ink/15 first:border-t-0">
            <div className="col-span-6 flex items-center gap-3">
              <div className="w-12 h-14"><StripePlaceholder stripe={l.stripe} aspect="3/4" /></div>
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{l.id}</div>
                <div className="display text-xl">{l.name[lang]}</div>
              </div>
            </div>
            <div className="col-span-2 mono text-[11px]">{l.size}</div>
            <div className="col-span-2 text-right mono text-[11px]">{String(l.qty).padStart(2,"0")}</div>
            <div className="col-span-2 text-right display text-xl">{fmtMoney(l.price * l.qty, "EUR", lang)}</div>
          </div>
        ))}
      </div>

      <div className="border border-ink p-5 grid grid-cols-2 gap-5">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.checkout.delivery.title}</div>
          <div className="display text-xl mt-1">{deliveryOpt?.l}</div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{deliveryOpt?.eta}</div>
        </div>
        <div className="text-right">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.checkout.summary.total}</div>
          <div className="display text-4xl mt-1">{fmtMoney(total, "EUR", lang)}</div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{lang === "es" ? "Impuestos y envío incluidos" : "Tax & shipping included"}</div>
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ title, onEdit, border, children }) {
  const { t } = useT();
  return (
    <div className={`p-5 ${border ? "md:border-l border-t md:border-t-0 border-ink" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{title}</div>
        <button onClick={onEdit} className="mono text-[10px] uppercase tracking-[0.22em] underline underline-offset-4">{t.checkout.review.editStep}</button>
      </div>
      {children}
    </div>
  );
}

// ─── Sticky order summary ──────────────────────────────────────
function OrderSummary({ lines, subtotal, shipping, tax, total, form, setForm, deliveryOpt }) {
  const { t, lang } = useT();
  const applyPromo = () => {
    if (form.promo.trim().toLowerCase() === "atelier") setForm({ ...form, creditApplied: 80, promo: form.promo });
  };
  return (
    <div className="bg-chalk min-h-full border-l border-ink lg:border-l-0">
      <div className="px-6 md:px-8 py-8">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">02 / {t.checkout.summary.title}</div>
        <div className="flex items-baseline justify-between">
          <h2 className="display text-4xl">{lines.length} {t.checkout.summary.items}</h2>
          <button className="mono text-[10px] uppercase tracking-[0.22em] underline underline-offset-4">{t.checkout.summary.edit}</button>
        </div>

        <div className="mt-5 space-y-3">
          {lines.map((l) => (
            <div key={l.lineId} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-3"><StripePlaceholder stripe={l.stripe} aspect="3/4" /></div>
              <div className="col-span-7">
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{l.id}</div>
                <div className="display text-lg leading-tight">{l.name[lang]}</div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/60 mt-1">{t.checkout.summary.size} {l.size} · ×{l.qty}</div>
              </div>
              <div className="col-span-2 text-right display text-base">{fmtMoney(l.price, "EUR", lang)}</div>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div className="border border-ink mt-6 flex">
          <input value={form.promo} onChange={(e) => setForm({ ...form, promo: e.target.value })} placeholder={t.checkout.summary.promo} className="flex-1 px-4 h-12 bg-transparent outline-none text-sm" />
          <button onClick={applyPromo} className="mono text-[10px] uppercase tracking-[0.22em] border-l border-ink px-4 hover:bg-ink hover:text-paper">{t.checkout.summary.apply}</button>
        </div>

        {/* Totals */}
        <div className="mt-6 border-t border-ink/30 pt-5 space-y-2">
          <Row k={t.checkout.summary.subtotal} v={fmtMoney(subtotal, "EUR", lang)} />
          <Row k={`${t.checkout.summary.shipping} · ${deliveryOpt?.l}`} v={shipping === 0 ? (lang === "es" ? "Gratis" : "Free") : fmtMoney(shipping, "EUR", lang)} />
          <Row k={t.checkout.summary.tax} v={fmtMoney(tax, "EUR", lang)} />
          {form.creditApplied > 0 && <Row k={t.checkout.summary.credit} v={"− " + fmtMoney(form.creditApplied, "EUR", lang)} accent />}
        </div>
        <div className="mt-5 border-t border-ink pt-5 flex items-baseline justify-between">
          <div className="display text-2xl">{t.checkout.summary.total}</div>
          <div className="display text-4xl">{fmtMoney(total, "EUR", lang)}</div>
        </div>

        {/* Reassurance */}
        <div className="mt-8 space-y-3">
          {t.checkout.summary.confidence.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <Icons.Check size={14} className="mt-1 text-rust flex-shrink-0" />
              <div className="text-xs text-ink/70 leading-relaxed">{c}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, accent }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="mono text-[10px] uppercase tracking-[0.22em] text-ink/70 truncate">{k}</div>
      <div className={`text-sm ${accent ? "text-rust" : ""}`}>{v}</div>
    </div>
  );
}

// ─── Success ───────────────────────────────────────────────────
function CheckoutSuccess({ order, onView, onKeep }) {
  const { t, lang } = useT();
  return (
    <section className="border-b border-ink min-h-[80vh] grid grid-cols-12">
      <div className="col-span-12 md:col-span-7 px-6 md:px-12 py-12 border-r border-ink flex flex-col justify-between">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-3">{t.checkout.success.eyebrow}</div>
          <Motion.motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="display text-7xl md:text-[10vw] leading-[0.9] mb-6"
          >
            {t.checkout.success.title.toUpperCase()}.
          </Motion.motion.h1>
          <p className="text-base text-ink/80 max-w-lg">{t.checkout.success.sub}</p>

          <div className="mt-10 border border-ink inline-flex flex-wrap">
            <div className="px-5 py-4 border-r border-ink">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.order.title}</div>
              <div className="display text-3xl mt-1">{order.id}</div>
            </div>
            <div className="px-5 py-4 border-r border-ink">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.checkout.summary.total}</div>
              <div className="display text-3xl mt-1">{fmtMoney(order.total, "EUR", lang)}</div>
            </div>
            <div className="px-5 py-4">
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{t.order.arrival}</div>
              <div className="display text-3xl mt-1">{order.deliveryOpt?.eta}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-10 flex-wrap">
          <Btn kind="solid" size="lg" iconRight={Icons.ArrowRight} onClick={onView}>{t.checkout.success.viewOrder}</Btn>
          <Btn kind="outline" size="lg" onClick={onKeep}>{t.checkout.success.keep}</Btn>
        </div>
      </div>

      <div className="col-span-12 md:col-span-5 grid grid-rows-3">
        <div className="stripes-dark border-b border-ink relative">
          <div className="absolute inset-0 noise opacity-40" />
          <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-paper">{t.order.stages.cut.toUpperCase()}</div>
        </div>
        <div className="stripes-rust border-b border-ink relative">
          <div className="absolute inset-0 noise opacity-40" />
          <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-paper">{t.order.stages.packed.toUpperCase()}</div>
        </div>
        <div className="stripes-sand relative">
          <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-ink/70">{t.order.stages.delivered.toUpperCase()}</div>
        </div>
      </div>
    </section>
  );
}

window.CheckoutPage = CheckoutPage;
