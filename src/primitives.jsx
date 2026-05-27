// Shared primitives & framer-motion shorthands
const { motion, AnimatePresence } = window.Motion || window.FramerMotion || window["framer-motion"] || {};
// framer-motion UMD exposes itself as window.Motion in v11
const M = (window.Motion || window.FramerMotion || {});
const Motion = { motion: M.motion, AnimatePresence: M.AnimatePresence };

// ─── Language context ───────────────────────────────────────────
const LangCtx = React.createContext({ lang: "en", t: T.en, setLang: () => {} });
const useT = () => React.useContext(LangCtx);

// ─── Currency formatter ─────────────────────────────────────────
function fmtMoney(n, currency = "EUR", lang = "en") {
  try {
    return new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-GB", {
      style: "currency", currency, maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return "€" + n;
  }
}

// ─── Buttons ────────────────────────────────────────────────────
function Btn({ children, onClick, kind = "solid", size = "md", icon: I, iconRight: IR, full, disabled, type = "button" }) {
  const base = "btn inline-flex items-center justify-center gap-2 select-none transition-colors";
  const sizes = { sm: "h-9 px-4 text-[11px]", md: "h-11 px-5 text-xs", lg: "h-14 px-7 text-sm" };
  const kinds = {
    solid:   "bg-ink text-paper hover:bg-rust",
    outline: "border border-ink text-ink bg-transparent hover:bg-ink hover:text-paper",
    ghost:   "text-ink hover:bg-ink/5",
    paper:   "bg-paper text-ink hover:bg-chalk border border-ink",
    danger:  "border border-ink text-ink bg-transparent hover:bg-ink hover:text-paper",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${kinds[kind]} ${full ? "w-full" : ""} ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      {I && <I size={14} />}
      <span>{children}</span>
      {IR && <IR size={14} />}
    </button>
  );
}

// ─── Tag pill ───────────────────────────────────────────────────
function Tag({ children, tone = "ink" }) {
  const tones = {
    ink:   "bg-ink text-paper",
    paper: "bg-paper text-ink border border-ink",
    rust:  "bg-rust text-paper",
    chalk: "bg-chalk text-ink",
    line:  "bg-transparent text-ink border border-ink",
  };
  return (
    <span className={`mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

// ─── Section header (eyebrow + title) ────────────────────────────
function SectionHead({ eyebrow, title, sub, right }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-6">
      <div>
        {eyebrow && (
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-2">{eyebrow}</div>
        )}
        <h2 className="display text-5xl md:text-6xl">{title}</h2>
        {sub && <p className="text-sm text-ink/70 mt-2 max-w-xl">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ─── Input ──────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, hint, icon: I, right }) {
  return (
    <label className="block">
      {label && <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/70 mb-2">{label}</div>}
      <div className="border border-ink h-12 flex items-center gap-3 px-4 bg-paper">
        {I && <I size={14} className="text-ink/60" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 text-sm bg-transparent outline-none"
        />
        {right}
      </div>
      {hint && <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-2">{hint}</div>}
    </label>
  );
}

// ─── Textarea ───────────────────────────────────────────────────
function FieldArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      {label && <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/70 mb-2">{label}</div>}
      <div className="border border-ink p-4 bg-paper">
        <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} className="w-full text-sm bg-transparent outline-none resize-none" />
      </div>
    </label>
  );
}

// ─── Select (custom) ────────────────────────────────────────────
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      {label && <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink/70 mb-2">{label}</div>}
      <div className="border border-ink h-12 flex items-center px-4 bg-paper relative">
        <select value={value} onChange={onChange} className="w-full text-sm appearance-none bg-transparent outline-none cursor-pointer pr-8">
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
        <Icons.ChevronDown size={14} className="absolute right-4 pointer-events-none" />
      </div>
    </label>
  );
}

// ─── Toggle ─────────────────────────────────────────────────────
function Toggle({ on, onChange, labels = ["OFF","ON"] }) {
  return (
    <button onClick={() => onChange(!on)} className={`mono text-[10px] uppercase tracking-[0.2em] border border-ink h-8 px-1 inline-flex items-center gap-1 ${on ? "bg-ink text-paper" : "bg-paper text-ink"}`}>
      <span className={`px-2 h-6 inline-flex items-center ${on ? "" : "bg-ink text-paper"}`}>{labels[0]}</span>
      <span className={`px-2 h-6 inline-flex items-center ${on ? "bg-paper text-ink" : ""}`}>{labels[1]}</span>
    </button>
  );
}

// ─── Status badges ──────────────────────────────────────────────
function StatusBadge({ status, lang = "en" }) {
  const map = {
    delivered:  { en: "Delivered",  es: "Entregado",  dot: "bg-ink" },
    intransit:  { en: "In transit", es: "En tránsito", dot: "bg-rust" },
    preparing:  { en: "Preparing",  es: "Preparando", dot: "bg-rust" },
    cancelled:  { en: "Cancelled",  es: "Cancelado",  dot: "bg-ink/30" },
    returned:   { en: "Returned",   es: "Devuelto",   dot: "bg-ink/30" },
    live:       { en: "Live",       es: "Activo",     dot: "bg-rust" },
    draft:      { en: "Draft",      es: "Borrador",   dot: "bg-ink/30" },
    scheduled:  { en: "Scheduled",  es: "Programado", dot: "bg-ink" },
    Active:     { en: "Active",     es: "Activo",     dot: "bg-rust" },
    VIP:        { en: "VIP",        es: "VIP",        dot: "bg-ink" },
    Lapsed:     { en: "Lapsed",     es: "Inactivo",   dot: "bg-ink/30" },
    Onboarding: { en: "Onboarding", es: "Onboarding", dot: "bg-rust" },
    Paused:     { en: "Paused",     es: "Pausado",    dot: "bg-ink/30" },
  };
  const s = map[status] || { en: status, es: status, dot: "bg-ink" };
  return (
    <span className="mono text-[10px] uppercase tracking-[0.18em] inline-flex items-center gap-2">
      <span className={`w-1.5 h-1.5 ${s.dot}`} />
      {s[lang] || s.en}
    </span>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-ink/20">
      {tabs.map((t, i) => {
        const id = typeof t === "string" ? t : t.id;
        const label = typeof t === "string" ? t : t.label;
        const on = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`mono text-[11px] uppercase tracking-[0.22em] px-4 h-11 relative -mb-px ${on ? "text-ink border-b-2 border-ink" : "text-ink/50 hover:text-ink"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Page transition wrapper ────────────────────────────────────
// Keyed CSS fade — Framer Motion's key remount inside another keyed motion.div
// occasionally stalls at initial state, so we use a plain animation instead.
function PageFade({ k, children }) {
  return (
    <div key={k} className="om-pagefade">
      {children}
    </div>
  );
}

// ─── Sparkline (tiny chart) ─────────────────────────────────────
function Sparkline({ data, height = 60, color = "#0a0a0a", filled = true }) {
  const w = 240;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 8) - 4]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${w},${height} L 0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-full">
      {filled && <path d={area} fill={color} opacity="0.08" />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 2.5 : 0} fill={color} />
      ))}
    </svg>
  );
}

// ─── BarChart ───────────────────────────────────────────────────
function BarChart({ data, height = 100, color = "#0a0a0a" }) {
  const max = Math.max(...data) || 1;
  return (
    <div className="flex items-end gap-1.5 h-full w-full" style={{height}}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex items-end">
          <div style={{ height: `${(v / max) * 100}%`, background: color }} className="w-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Stripe placeholder for product imagery ─────────────────────
function StripePlaceholder({ stripe = "stripes", label, aspect = "4/5" }) {
  return (
    <div className={`relative overflow-hidden ${stripe}`} style={{ aspectRatio: aspect }}>
      <div className="absolute inset-0 noise opacity-50" />
      {label && (
        <div className="absolute bottom-2 left-2 mono text-[9px] uppercase tracking-[0.2em] text-ink/60 bg-paper px-1.5 py-0.5">
          {label}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  LangCtx, useT, fmtMoney,
  Btn, Tag, SectionHead, Field, FieldArea, Select, Toggle,
  StatusBadge, Tabs, PageFade, Sparkline, BarChart, StripePlaceholder,
  Motion,
});
