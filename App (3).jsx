import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Trash2, X, Check, TrendingUp, Users, IndianRupee, Calendar,
  Sparkles, RotateCw, MousePointerClick, Circle, CloudRain, Magnet,
  LayoutGrid, Square, Brain, Dices, Grid2X2, Pencil, Search, Megaphone,
  ChevronRight, Wallet, Smartphone, Globe, ArrowUpRight, Filter, User,
  Zap, Target, Grid3X3, Palette
} from "lucide-react";

const SUPABASE_URL = "https://kxtzzfggmvivuchbvwuh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dHp6ZmdnbXZpdnVjaGJ2d3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxODgxMjAsImV4cCI6MjEwMjc2NDEyMH0.EPKlIxcQ5MkXqPVY047QPAhErh4ERJlYurapJ24sFBQ";

const sb = {
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  },
  async select(table, query = "") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${query}`, { headers: this.headers });
    if (!res.ok) return { data: null, error: await res.text() };
    return { data: await res.json(), error: null };
  },
  async insert(table, payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...this.headers, Prefer: "return=representation" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { data: null, error: await res.text() };
    return { data: await res.json(), error: null };
  },
  async update(table, id, payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...this.headers, Prefer: "return=representation" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { data: null, error: await res.text() };
    return { data: await res.json(), error: null };
  },
  async delete(table, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: this.headers,
    });
    if (!res.ok) return { data: null, error: await res.text() };
    return { data: true, error: null };
  },
};

const todayStr = () => new Date().toISOString().split("T")[0];
const thisMonthStr = () => todayStr().slice(0, 7);
const fmtMoney = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};
const fmtMonth = (m) => {
  if (!m) return "—";
  const dt = new Date(m + "-01T00:00:00");
  return dt.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

const PAYMENT_MODES = ["Cash", "UPI", "Online"];
const REFERRAL_OPTIONS = ["Walk-in", "Google", "Instagram", "Existing client"];

const APP_PIN = "1234";
const PIN_SESSION_KEY = "echofyre_pin_ok";

const TOKENS = {
  bg: "#0B100C",
  surface: "#131A14",
  surfaceRaised: "#1B231C",
  border: "#283329",
  borderLight: "#344536",
  text: "#F6F4EE",
  textDim: "#9FAA9F",
  emerald: "#0E7A55",
  emeraldGlow: "#14A36F",
  emeraldDark: "#093D2B",
  gold: "#D4AF37",
  goldDim: "#9E8430",
  red: "#D14F42",
  blue: "#5B8DEF",
};

function GlobalStyles() {
  return (
    <style>{`
      :root {
        --bg: #0B100C;
        --surface: #131A14;
        --surface-raised: #1B231C;
        --border: #283329;
        --border-light: #344536;
        --text: #F6F4EE;
        --text-dim: #9FAA9F;
        --emerald: #0E7A55;
        --emerald-glow: #14A36F;
        --emerald-dark: #093D2B;
        --gold: #D4AF37;
        --gold-dim: #9E8430;
        --red: #D14F42;
        --blue: #5B8DEF;
        --radius-sm: 8px;
        --radius: 12px;
        --radius-lg: 16px;
        --radius-xl: 20px;
        --shadow: 0 8px 30px rgba(0,0,0,0.25);
        --shadow-sm: 0 2px 8px rgba(0,0,0,0.15);
        --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      * { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; min-height: 100%; }
      body { background: var(--bg); color: var(--text); font-family: var(--font); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      .app { min-height: 100vh; display: flex; flex-direction: column; }
      .app-main { flex: 1; max-width: 640px; width: 100%; margin: 0 auto; padding: 0 16px 110px; }

      .text-dim { color: var(--text-dim); }
      .text-gold { color: var(--gold); }
      .text-emerald { color: var(--emerald-glow); }
      .text-red { color: var(--red); }
      .text-blue { color: var(--blue); }

      .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 16px; box-shadow: var(--shadow); }
      .card-raised { background: var(--surface-raised); }

      .section-label { font-size: 11px; font-weight: 800; color: var(--gold-dim); letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }

      .field { margin-bottom: 18px; }
      .field-label { font-size: 12.5px; color: var(--text-dim); margin-bottom: 8px; font-weight: 600; display: block; }

      .input { width: 100%; padding: 13px 14px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface-raised); color: var(--text); font-size: 15px; font-family: inherit; outline: none; transition: border-color .15s, box-shadow .15s; }
      .input:focus { border-color: var(--emerald-glow); box-shadow: 0 0 0 3px rgba(20,163,111,0.12); }
      .input::placeholder { color: var(--text-dim); opacity: 0.55; }

      .input-with-icon { position: relative; }
      .input-with-icon svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-dim); }
      .input-with-icon .input { padding-left: 40px; }

      .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 18px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface-raised); color: var(--text); font-weight: 700; font-size: 14px; font-family: inherit; cursor: pointer; transition: all .12s; }
      .btn:hover { background: var(--surface); }
      .btn:disabled { opacity: 0.5; cursor: default; }
      .btn-primary { background: var(--emerald-glow); border-color: var(--emerald-glow); color: #fff; box-shadow: 0 6px 20px rgba(14,122,85,0.35), inset 0 1px 0 rgba(255,255,255,0.1); }
      .btn-primary:hover { background: #16b87c; }
      .btn-danger { color: var(--red); border-color: var(--red); }
      .btn-ghost { background: transparent; border-color: transparent; color: var(--text-dim); }
      .btn-ghost:hover { background: var(--surface-raised); color: var(--text); }
      .btn-icon { width: 34px; height: 34px; padding: 0; }

      .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
      .chip { padding: 10px 16px; border-radius: var(--radius); border: 1.5px solid var(--border); background: var(--surface-raised); color: var(--text-dim); font-weight: 700; font-size: 14px; cursor: pointer; transition: all .12s; }
      .chip:hover { border-color: var(--border-light); color: var(--text); }
      .chip.active { border-color: var(--emerald-glow); background: var(--emerald-dark); color: var(--emerald-glow); box-shadow: 0 0 0 2px rgba(20,163,111,0.12); }

      .segmented { display: flex; background: var(--surface); border-radius: var(--radius); padding: 4px; border: 1px solid var(--border); }
      .segmented button { flex: 1; padding: 10px 4px; border-radius: 10px; border: none; background: transparent; color: var(--text-dim); font-weight: 700; font-size: 13px; cursor: pointer; transition: all .15s; }
      .segmented button.active { background: var(--emerald-glow); color: #fff; box-shadow: 0 4px 10px rgba(14,122,85,0.25); }

      .header { position: sticky; top: 0; z-index: 10; background: linear-gradient(180deg, #131A14 0%, #0F1510 100%); border-bottom: 1px solid var(--border); backdrop-filter: blur(8px); }
      .header-inner { max-width: 640px; margin: 0 auto; padding: 14px 16px 12px; }
      .header-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
      .header-title { font-size: 17px; font-weight: 800; letter-spacing: -0.3px; }
      .header-date { font-size: 12px; color: var(--text-dim); font-weight: 500; }
      .header-stats { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 8px; }
      .stat-chip { background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius); padding: 9px 8px; min-width: 0; box-shadow: var(--shadow-sm); }
      .stat-chip-label { font-size: 10px; color: var(--text-dim); font-weight: 600; margin-bottom: 2px; white-space: nowrap; }
      .stat-chip-value { font-size: 13px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .stat-chip.big .stat-chip-value { font-size: 17px; color: var(--gold); }

      .empty { text-align: center; padding: 44px 24px; color: var(--text-dim); font-size: 14px; background: var(--surface-raised); border-radius: var(--radius); border: 1px dashed var(--border); }

      .tabbar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(19,26,20,0.96); border-top: 1px solid var(--border); backdrop-filter: blur(12px); z-index: 10; }
      .tabbar-inner { max-width: 640px; margin: 0 auto; display: flex; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
      .tabbar-inner::-webkit-scrollbar { display: none; }
      .tab-btn { flex: 1 1 auto; min-width: 52px; padding: 10px 2px 14px; background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-dim); cursor: pointer; position: relative; transition: color .15s; }
      .tab-btn.active { color: var(--emerald-glow); }
      .tab-btn::after { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: var(--emerald-glow); border-radius: 0 0 4px 4px; opacity: 0; transition: opacity .15s; }
      .tab-btn.active::after { opacity: 1; }
      .tab-label { font-size: 9px; font-weight: 700; }

      .toast { position: fixed; bottom: 92px; left: 50%; transform: translateX(-50%); color: #fff; padding: 11px 22px; border-radius: 24px; font-size: 13px; font-weight: 700; z-index: 50; box-shadow: 0 10px 28px rgba(0,0,0,0.45); animation: toast-in 0.25s ease; }
      @keyframes toast-in { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }

      .pin-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background: var(--bg); }
      .pin-title { font-size: 22px; font-weight: 900; margin-bottom: 6px; letter-spacing: -0.5px; }
      .pin-subtitle { font-size: 13.5px; color: var(--text-dim); margin-bottom: 34px; }
      .pin-dots { display: flex; gap: 14px; margin-bottom: 34px; }
      .pin-dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--border); background: transparent; transition: all .15s; }
      .pin-dot.filled { background: var(--emerald-glow); border-color: var(--emerald-glow); }
      .pin-dot.error { background: var(--red); border-color: var(--red); }
      .pin-pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 264px; }
      .pin-key { width: 78px; height: 66px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface-raised); color: var(--text); font-size: 20px; font-weight: 700; cursor: pointer; transition: all .1s; font-family: inherit; }
      .pin-key:hover { background: var(--surface); border-color: var(--border-light); }
      .pin-key:active { transform: scale(0.96); }
      .pin-shake { animation: shake 0.3s; }
      @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

      .loading-screen { text-align: center; padding: 80px 20px; color: var(--text-dim); }
      .skeleton { background: linear-gradient(90deg, var(--surface-raised) 25%, var(--border) 50%, var(--surface-raised) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: var(--radius); }
      @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

      .visit-row { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; transition: border-color .15s; }
      .visit-row:hover { border-color: var(--border-light); }

      .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; }
      .badge-cash { background: rgba(20,163,111,0.12); color: var(--emerald-glow); }
      .badge-upi { background: rgba(91,141,239,0.12); color: var(--blue); }
      .badge-online { background: rgba(212,175,55,0.12); color: var(--gold); }

      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-between { justify-content: space-between; }
      .gap-1 { gap: 4px; }
      .gap-2 { gap: 8px; }
      .gap-3 { gap: 12px; }
      .mt-2 { margin-top: 8px; }
      .mt-3 { margin-top: 12px; }
      .mt-4 { margin-top: 16px; }
      .mb-2 { margin-bottom: 8px; }
      .mb-3 { margin-bottom: 12px; }
      .mb-4 { margin-bottom: 16px; }
      .w-full { width: 100%; }
      .text-sm { font-size: 13px; }
      .text-xs { font-size: 11px; }
      .font-bold { font-weight: 700; }
      .font-extrabold { font-weight: 800; }
      .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

      .scroll-x { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
      .scroll-x::-webkit-scrollbar { display: none; }

      .metric-card { background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 14px; }
      .metric-label { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: 12px; margin-bottom: 10px; font-weight: 600; }
      .metric-value { font-size: 26px; font-weight: 900; letter-spacing: -0.6px; }
    `}</style>
  );
}

function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(PIN_SESSION_KEY) === "1"; } catch { return false; }
  });
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const tryUnlock = (value) => {
    if (value === APP_PIN) {
      try { sessionStorage.setItem(PIN_SESSION_KEY, "1"); } catch {}
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 700);
    }
  };

  const press = (d) => {
    const next = (pin + d).slice(0, APP_PIN.length);
    setPin(next);
    if (next.length === APP_PIN.length) tryUnlock(next);
  };

  if (unlocked) return children;

  return (
    <div className="pin-screen">
      <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, var(--emerald-glow), var(--gold))", display: "grid", placeItems: "center", marginBottom: 22, boxShadow: "0 8px 24px rgba(14,122,85,0.35)" }}>
        <Sparkles size={30} color="#fff" />
      </div>
      <div className="pin-title">EchoFyre Desk</div>
      <div className="pin-subtitle">Enter PIN to unlock</div>
      <div className={`pin-dots ${error ? "pin-shake" : ""}`}>
        {Array.from({ length: APP_PIN.length }).map((_, i) => (
          <div key={i} className={`pin-dot ${i < pin.length ? (error ? "error" : "filled") : ""}`} />
        ))}
      </div>
      <div className="pin-pad">
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
          d === "" ? <div key={i} /> : (
            <button key={i} className="pin-key" onClick={() => d === "⌫" ? setPin((p) => p.slice(0, -1)) : press(d)}>
              {d}
            </button>
          )
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("entry");
  const [staff, setStaff] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "ok") => setToast({ msg, type }), []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const loadData = useCallback(async () => {
    const [{ data: staffData, error: staffErr }, { data: visitsData, error: visitsErr }] = await Promise.all([
      sb.select("staff", "&order=name.asc"),
      sb.select("visits", "&order=created_at.desc"),
    ]);
    if (staffErr) showToast("Couldn't load staff: " + staffErr, "err");
    if (visitsErr) showToast("Couldn't load visits: " + visitsErr, "err");
    setStaff(staffData || []);
    setVisits(visitsData || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const staffMap = Object.fromEntries(staff.map((s) => [s.id, s]));
  const todayVisits = visits.filter((v) => v.visit_date === todayStr());

  return (
    <PinGate>
      <GlobalStyles />
      <div className="app">
        <Header todayVisits={todayVisits} />
        <main className="app-main">
          {loading ? (
            <LoadingScreen />
          ) : tab === "entry" ? (
            <EntryTab staff={staff} visits={visits} onSaved={loadData} showToast={showToast} />
          ) : tab === "dashboard" ? (
            <DashboardTab visits={todayVisits} staff={staff} />
          ) : tab === "history" ? (
            <HistoryTab visits={visits} staff={staff} staffMap={staffMap} onChanged={loadData} showToast={showToast} />
          ) : tab === "staff" ? (
            <StaffTab staff={staff} onChanged={loadData} showToast={showToast} />
          ) : tab === "owner" ? (
            <OwnerTab visits={visits} staff={staff} staffMap={staffMap} />
          ) : (
            <FidgetTab />
          )}
        </main>
        <TabBar tab={tab} setTab={setTab} />
        {toast && <Toast toast={toast} />}
      </div>
    </PinGate>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="skeleton" style={{ width: 80, height: 16, margin: "0 auto 16px" }} />
      <div className="skeleton" style={{ width: "100%", height: 120, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: "100%", height: 200 }} />
    </div>
  );
}

function Header({ todayVisits }) {
  const cash = todayVisits.reduce((s, v) => s + (v.entry_payment_mode === "Cash" ? Number(v.entry_fee) : 0) + (v.extra_payment_mode === "Cash" ? Number(v.extra_amount) : 0), 0);
  const upi = todayVisits.reduce((s, v) => s + (v.entry_payment_mode === "UPI" ? Number(v.entry_fee) : 0) + (v.extra_payment_mode === "UPI" ? Number(v.extra_amount) : 0), 0);
  const online = todayVisits.reduce((s, v) => s + (v.entry_payment_mode === "Online" ? Number(v.entry_fee) : 0) + (v.extra_payment_mode === "Online" ? Number(v.extra_amount) : 0), 0);
  const total = cash + upi + online;

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-top">
          <div className="header-title">EchoFyre Desk</div>
          <div className="header-date">{fmtDate(todayStr())}</div>
        </div>
        <div className="header-stats">
          <StatChip label="Today's Total" value={fmtMoney(total)} accent={TOKENS.gold} big />
          <StatChip label="Cash" value={fmtMoney(cash)} icon={<Wallet size={10} />} />
          <StatChip label="UPI" value={fmtMoney(upi)} icon={<Smartphone size={10} />} />
          <StatChip label="Online" value={fmtMoney(online)} icon={<Globe size={10} />} />
        </div>
      </div>
    </header>
  );
}

function StatChip({ label, value, accent, big, icon }) {
  return (
    <div className={`stat-chip ${big ? "big" : ""}`} style={accent ? { borderColor: big ? TOKENS.border : TOKENS.borderLight } : {}}>
      <div className="stat-chip-label" style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {icon} {label}
      </div>
      <div className="stat-chip-value" style={{ color: accent || TOKENS.text }}>{value}</div>
    </div>
  );
}

function EntryTab({ staff, visits, onSaved, showToast }) {
  const [form, setForm] = useState(() => ({
    client_name: "",
    client_phone: "",
    source: "Offline",
    staff_id: "",
    entry_fee: 1000,
    entry_payment_mode: "Cash",
    extra_amount: "",
    extra_payment_mode: "None",
    referred_by: "",
    notes: "",
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!form.staff_id && staff[0]) setForm((f) => ({ ...f, staff_id: staff[0].id }));
  }, [staff, form.staff_id]);

  const set = (k, v) => setForm((f) => {
    const next = { ...f, [k]: v };
    if (k === "extra_amount" && Number(v) > 0 && next.extra_payment_mode === "None") next.extra_payment_mode = "Cash";
    return next;
  });

  const cleanPhone = form.client_phone.replace(/\D/g, "");
  const priorVisits = cleanPhone.length >= 7
    ? visits.filter((v) => (v.client_phone || "").replace(/\D/g, "") === cleanPhone)
    : [];
  const isRepeat = priorVisits.length > 0;
  const lastVisit = isRepeat ? priorVisits.sort((a, b) => (a.visit_date < b.visit_date ? 1 : -1))[0] : null;

  const submit = async () => {
    if (!form.staff_id) return showToast("Pick a staff member", "err");
    if (!form.entry_payment_mode) return showToast("Pick entry payment mode", "err");
    setSaving(true);
    const payload = {
      visit_date: todayStr(),
      client_name: form.client_name || null,
      client_phone: form.client_phone || null,
      source: form.source,
      staff_id: form.staff_id,
      entry_fee: Number(form.entry_fee) || 0,
      entry_payment_mode: form.entry_payment_mode,
      extra_amount: Number(form.extra_amount) || 0,
      extra_payment_mode: Number(form.extra_amount) > 0 ? form.extra_payment_mode : "None",
      referred_by: form.referred_by || null,
      notes: form.notes || null,
    };
    const { error } = await sb.insert("visits", payload);
    setSaving(false);
    if (error) return showToast("Save failed: " + error, "err");
    showToast("Client saved ✓");
    setForm((f) => ({
      client_name: "",
      client_phone: "",
      source: "Offline",
      staff_id: staff.find((s) => s.id === f.staff_id)?.id || staff[0]?.id || "",
      entry_fee: 1000,
      entry_payment_mode: "Cash",
      extra_amount: "",
      extra_payment_mode: "None",
      referred_by: "",
      notes: "",
    }));
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <Card>
        <SectionLabel icon={<Plus size={12} />}>New client visit</SectionLabel>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Client name">
            <input className="input" value={form.client_name} onChange={(e) => set("client_name", e.target.value)} placeholder="Rahul Sharma" />
          </Field>
          <Field label="Phone">
            <input className="input" value={form.client_phone} onChange={(e) => set("client_phone", e.target.value)} placeholder="10-digit" inputMode="tel" />
          </Field>
        </div>

        {isRepeat && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "12px 14px",
            borderRadius: 12, background: TOKENS.emeraldDark, border: `1px solid ${TOKENS.borderLight}`,
          }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(20,163,111,0.18)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <RotateCw size={14} color={TOKENS.emeraldGlow} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: TOKENS.text, fontWeight: 700 }}>Returning client</div>
              <div style={{ fontSize: 12, color: TOKENS.textDim, marginTop: 2 }}>
                {priorVisits.length} prior visit{priorVisits.length !== 1 ? "s" : ""} · last on {fmtDate(lastVisit.visit_date)}
              </div>
            </div>
          </div>
        )}

        <Field label="Source">
          <SegmentedControl options={["Offline", "Online"]} value={form.source} onChange={(v) => set("source", v)} />
        </Field>

        <Field label="Staff">
          <div className="scroll-x">
            {staff.map((s) => (
              <button key={s.id} className={`chip ${form.staff_id === s.id ? "active" : ""}`} onClick={() => set("staff_id", s.id)}>
                <User size={14} style={{ marginRight: 4 }} />
                {s.name.replace("Staff ", "S")}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Entry fee">
          <div className="chip-group" style={{ marginBottom: 10 }}>
            {[800, 1000, 1500, 2000].map((amt) => (
              <button key={amt} className={`chip ${form.entry_fee === amt ? "active" : ""}`} onClick={() => set("entry_fee", amt)}>
                ₹{amt}
              </button>
            ))}
          </div>
          <SegmentedControl options={PAYMENT_MODES} value={form.entry_payment_mode} onChange={(v) => set("entry_payment_mode", v)} />
        </Field>

        <Field label="Extra amount">
          <input className="input" type="number" value={form.extra_amount} onChange={(e) => set("extra_amount", e.target.value)} placeholder="0" />
          {Number(form.extra_amount) > 0 && (
            <div style={{ marginTop: 10 }}>
              <SegmentedControl options={PAYMENT_MODES} value={form.extra_payment_mode} onChange={(v) => set("extra_payment_mode", v)} />
            </div>
          )}
        </Field>

        <Field label="Referred by (optional)">
          <div className="chip-group" style={{ marginBottom: 10 }}>
            {REFERRAL_OPTIONS.map((opt) => (
              <button key={opt} className={`chip ${form.referred_by === opt ? "active" : ""}`} onClick={() => set("referred_by", opt)}>
                {opt}
              </button>
            ))}
          </div>
          <input className="input" value={form.referred_by} onChange={(e) => set("referred_by", e.target.value)} placeholder="Or type a name / source" />
        </Field>

        <Field label="Notes">
          <input className="input" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything worth remembering" />
        </Field>

        <button className="btn btn-primary w-full" onClick={submit} disabled={saving} style={{ padding: "16px", fontSize: 16, borderRadius: 14, marginTop: 4 }}>
          <Plus size={20} /> {saving ? "Saving…" : "Save client"}
        </button>
      </Card>
    </div>
  );
}

function SectionLabel({ children, icon }) {
  return <div className="section-label">{icon}{children}</div>;
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="segmented">
      {options.map((opt) => (
        <button key={opt} className={value === opt ? "active" : ""} onClick={() => onChange(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>;
}

function DashboardTab({ visits, staff }) {
  const byStaff = staff.map((s) => {
    const sv = visits.filter((v) => v.staff_id === s.id);
    const payout = sv.length * Number(s.rate_per_client);
    return { staff: s, count: sv.length, payout };
  }).filter((r) => r.count > 0);

  const totalPayout = byStaff.reduce((s, r) => s + r.payout, 0);
  const offlineCount = visits.filter((v) => v.source === "Offline").length;
  const onlineCount = visits.filter((v) => v.source === "Online").length;

  return (
    <div style={{ paddingTop: 20 }}>
      <Card style={{ marginBottom: 16 }}>
        <SectionLabel icon={<TrendingUp size={12} />}>Today's summary</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MetricCard icon={<Users size={18} />} label="Clients today" value={visits.length} />
          <MetricCard icon={<IndianRupee size={18} />} label="Staff payout" value={fmtMoney(totalPayout)} accent={TOKENS.gold} />
        </div>
        <div className="flex gap-3 mt-4" style={{ fontSize: 13, color: TOKENS.textDim, fontWeight: 600 }}>
          <span className="flex items-center gap-2">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: TOKENS.emeraldGlow }} />
            {offlineCount} offline
          </span>
          <span className="flex items-center gap-2">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: TOKENS.blue }} />
            {onlineCount} online
          </span>
        </div>
      </Card>

      <Card>
        <SectionLabel icon={<Users size={12} />}>Staff-wise payout</SectionLabel>
        {byStaff.length === 0 ? (
          <EmptyState text="No clients logged yet today" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...byStaff].sort((a, b) => b.count - a.count).map((r) => (
              <div key={r.staff.id} className="visit-row flex justify-between items-center">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.staff.name}</div>
                  <div style={{ fontSize: 12, color: TOKENS.textDim, marginTop: 3 }}>{r.count} client{r.count !== 1 ? "s" : ""} · {fmtMoney(r.staff.rate_per_client)}/client</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: TOKENS.gold }}>{fmtMoney(r.payout)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function MetricCard({ icon, label, value, accent }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{icon} {label}</div>
      <div className="metric-value" style={{ color: accent || TOKENS.text }}>{value}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="empty">{text}</div>;
}

function HistoryTab({ visits, staff, staffMap, onChanged, showToast }) {
  const [dateFilter, setDateFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const searchLower = search.trim().toLowerCase();
  const filtered = visits
    .filter((v) => v.id !== pendingDelete?.id)
    .filter((v) => (!dateFilter || v.visit_date === dateFilter) && (!staffFilter || v.staff_id === staffFilter))
    .filter((v) => {
      if (!searchLower) return true;
      const name = (v.client_name || "").toLowerCase();
      const phone = (v.client_phone || "").replace(/\D/g, "");
      return name.includes(searchLower) || phone.includes(searchLower.replace(/\D/g, ""));
    });
  const filteredTotal = filtered.reduce((s, v) => s + Number(v.entry_fee) + Number(v.extra_amount), 0);

  const grouped = filtered.reduce((acc, v) => {
    (acc[v.visit_date] = acc[v.visit_date] || []).push(v);
    return acc;
  }, {});

  const queueDelete = (id) => {
    const timeoutId = setTimeout(async () => {
      const { error } = await sb.delete("visits", id);
      if (error) showToast("Delete failed", "err");
      setPendingDelete((p) => (p?.id === id ? null : p));
      onChanged();
    }, 5000);
    setPendingDelete({ id, timeoutId });
    showToast("Entry removed — tap Undo to restore");
  };

  const undoDelete = () => {
    if (!pendingDelete) return;
    clearTimeout(pendingDelete.timeoutId);
    setPendingDelete(null);
    showToast("Restored ✓");
  };

  const staffList = Object.values(staffMap);

  return (
    <div style={{ paddingTop: 20 }}>
      <Card style={{ marginBottom: 16 }}>
        <SectionLabel icon={<Filter size={12} />}>Search & filters</SectionLabel>
        <div className="input-with-icon mb-3">
          <Search size={16} />
          <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by client name or phone" />
        </div>
        <div className="flex gap-3 mb-3">
          <input className="input" style={{ flex: 1 }} type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          <select className="input" style={{ flex: 1 }} value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}>
            <option value="">All staff</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center" style={{ paddingTop: 12, borderTop: `1px solid ${TOKENS.border}` }}>
          <span className="text-sm text-dim font-bold">{filtered.length} entries</span>
          <span style={{ fontSize: 17, color: TOKENS.gold, fontWeight: 900 }}>{fmtMoney(filteredTotal)}</span>
        </div>
      </Card>

      {pendingDelete && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: TOKENS.surfaceRaised, border: `1px solid ${TOKENS.gold}`, borderRadius: 12,
          padding: "12px 16px", marginBottom: 14,
        }}>
          <span className="text-sm text-dim font-bold">Entry deleted</span>
          <button className="btn btn-ghost" onClick={undoDelete} style={{ color: TOKENS.gold, fontWeight: 800 }}>
            UNDO
          </button>
        </div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <EmptyState text="No entries match this filter" />
      ) : (
        Object.entries(grouped).map(([date, dayVisits]) => (
          <div key={date} style={{ marginBottom: 22 }}>
            <div className="flex items-center gap-2" style={{ fontSize: 12.5, fontWeight: 700, color: TOKENS.textDim, marginBottom: 10 }}>
              <Calendar size={14} /> {fmtDate(date)} <span style={{ color: TOKENS.text, opacity: 0.5 }}>· {dayVisits.length} clients</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dayVisits.map((v) => (
                <VisitRow
                  key={v.id}
                  visit={v}
                  staff={staffMap[v.staff_id]}
                  allStaff={staff}
                  onDelete={() => queueDelete(v.id)}
                  isEditing={editingId === v.id}
                  onEditStart={() => setEditingId(v.id)}
                  onEditEnd={() => setEditingId(null)}
                  onChanged={onChanged}
                  showToast={showToast}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function VisitRow({ visit, staff, allStaff, onDelete, isEditing, onEditStart, onEditEnd, onChanged, showToast }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const total = Number(visit.entry_fee) + Number(visit.extra_amount);

  const startEdit = () => {
    setEditForm({
      client_name: visit.client_name || "",
      client_phone: visit.client_phone || "",
      source: visit.source,
      staff_id: visit.staff_id,
      entry_fee: visit.entry_fee,
      entry_payment_mode: visit.entry_payment_mode,
      extra_amount: visit.extra_amount,
      extra_payment_mode: visit.extra_payment_mode || "Cash",
    });
    onEditStart();
  };

  const saveEdit = async () => {
    setSavingEdit(true);
    const payload = {
      client_name: editForm.client_name || null,
      client_phone: editForm.client_phone || null,
      source: editForm.source,
      staff_id: editForm.staff_id,
      entry_fee: Number(editForm.entry_fee) || 0,
      entry_payment_mode: editForm.entry_payment_mode,
      extra_amount: Number(editForm.extra_amount) || 0,
      extra_payment_mode: Number(editForm.extra_amount) > 0 ? editForm.extra_payment_mode : "None",
    };
    const { error } = await sb.update("visits", visit.id, payload);
    setSavingEdit(false);
    if (error) return showToast("Update failed", "err");
    showToast("Entry updated ✓");
    onEditEnd();
    onChanged();
  };

  const badgeClass = visit.entry_payment_mode === "Cash" ? "badge-cash" : visit.entry_payment_mode === "UPI" ? "badge-upi" : "badge-online";

  if (isEditing && editForm) {
    return (
      <div style={{ background: TOKENS.surfaceRaised, border: `1.5px solid ${TOKENS.emeraldGlow}`, borderRadius: 12, padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <input className="input" value={editForm.client_name} onChange={(e) => setEditForm((f) => ({ ...f, client_name: e.target.value }))} placeholder="Client name" />
          <input className="input" value={editForm.client_phone} onChange={(e) => setEditForm((f) => ({ ...f, client_phone: e.target.value }))} placeholder="Phone" />
        </div>
        <div className="mb-3">
          <div className="field-label">Staff</div>
          <div className="chip-group">
            {allStaff.map((s) => (
              <button key={s.id} className={`chip ${editForm.staff_id === s.id ? "active" : ""}`} onClick={() => setEditForm((f) => ({ ...f, staff_id: s.id }))}>
                {s.name.replace("Staff ", "S")}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <div className="field-label">Entry fee</div>
            <input className="input" type="number" value={editForm.entry_fee} onChange={(e) => setEditForm((f) => ({ ...f, entry_fee: e.target.value }))} />
          </div>
          <div>
            <div className="field-label">Extra amount</div>
            <input className="input" type="number" value={editForm.extra_amount} onChange={(e) => setEditForm((f) => ({ ...f, extra_amount: e.target.value }))} />
          </div>
        </div>
        <div className="mb-3">
          <div className="field-label">Entry payment mode</div>
          <SegmentedControl options={PAYMENT_MODES} value={editForm.entry_payment_mode} onChange={(v) => setEditForm((f) => ({ ...f, entry_payment_mode: v }))} />
        </div>
        {Number(editForm.extra_amount) > 0 && (
          <div className="mb-3">
            <div className="field-label">Extra payment mode</div>
            <SegmentedControl options={PAYMENT_MODES} value={editForm.extra_payment_mode} onChange={(v) => setEditForm((f) => ({ ...f, extra_payment_mode: v }))} />
          </div>
        )}
        <div className="flex gap-2">
          <button className="btn btn-primary w-full" onClick={saveEdit} disabled={savingEdit}>
            {savingEdit ? "Saving…" : "Save changes"}
          </button>
          <button className="btn w-full" onClick={onEditEnd}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="visit-row">
      <div className="flex justify-between items-start">
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{visit.client_name || "Unnamed client"}</div>
          <div className="flex items-center gap-2 mt-2" style={{ fontSize: 12, color: TOKENS.textDim, flexWrap: "wrap" }}>
            <span className={`badge ${badgeClass}`}>{visit.entry_payment_mode}</span>
            <span>·</span>
            <span>{staff?.name || "—"}</span>
            <span>·</span>
            <span>{visit.source}</span>
            {Number(visit.extra_amount) > 0 && <span>· Extra {fmtMoney(visit.extra_amount)}</span>}
            {visit.referred_by && <span>· via {visit.referred_by}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: TOKENS.gold }}>{fmtMoney(total)}</div>
          {confirmDelete ? (
            <div className="flex gap-1">
              <button className="btn btn-icon btn-danger" onClick={onDelete}><Check size={14} /></button>
              <button className="btn btn-icon" onClick={() => setConfirmDelete(false)}><X size={14} /></button>
            </div>
          ) : (
            <div className="flex gap-1">
              <button className="btn btn-icon" onClick={startEdit}><Pencil size={14} /></button>
              <button className="btn btn-icon" onClick={() => setConfirmDelete(true)}><Trash2 size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StaffTab({ staff, onChanged, showToast }) {
  const [edits, setEdits] = useState({});
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const saveRate = async (id) => {
    const val = edits[id];
    if (val === undefined || val === "") return;
    const { error } = await sb.update("staff", id, { rate_per_client: Number(val) });
    if (error) return showToast("Update failed", "err");
    showToast("Rate updated ✓");
    setEdits((e) => ({ ...e, [id]: undefined }));
    onChanged();
  };

  const addStaff = async () => {
    const name = newName.trim();
    if (!name) return showToast("Enter a staff name", "err");
    setAdding(true);
    const { error } = await sb.insert("staff", { name, rate_per_client: 1000 });
    setAdding(false);
    if (error) return showToast("Add failed: " + error, "err");
    showToast("Staff added ✓");
    setNewName("");
    onChanged();
  };

  const removeStaff = async (id) => {
    const { error } = await sb.delete("staff", id);
    if (error) return showToast("Remove failed: " + error, "err");
    showToast("Staff removed");
    setConfirmDelete(null);
    onChanged();
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <Card style={{ marginBottom: 16 }}>
        <SectionLabel icon={<Plus size={12} />}>Add staff</SectionLabel>
        <div className="flex gap-2">
          <input className="input" style={{ flex: 1 }} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New staff name" onKeyDown={(e) => e.key === "Enter" && addStaff()} />
          <button className="btn btn-primary" onClick={addStaff} disabled={adding || !newName.trim()}>
            {adding ? "…" : "Add"}
          </button>
        </div>
      </Card>

      <Card>
        <SectionLabel icon={<Users size={12} />}>Manage staff & rates</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {staff.map((s) => (
            <div key={s.id} className="visit-row flex items-center justify-between gap-3">
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-dim font-bold">₹</span>
                <input type="number" value={edits[s.id] !== undefined ? edits[s.id] : s.rate_per_client} onChange={(e) => setEdits((ed) => ({ ...ed, [s.id]: e.target.value }))} className="input" style={{ width: 80, padding: "9px 10px", fontSize: 14, fontWeight: 800, textAlign: "center" }} />
                <span className="text-xs text-dim">/client</span>
                {edits[s.id] !== undefined && edits[s.id] !== "" && Number(edits[s.id]) !== Number(s.rate_per_client) && (
                  <button className="btn btn-icon" style={{ color: TOKENS.emeraldGlow }} onClick={() => saveRate(s.id)}><Check size={15} /></button>
                )}
                {confirmDelete === s.id ? (
                  <div className="flex gap-1">
                    <button className="btn btn-icon btn-danger" onClick={() => removeStaff(s.id)}><Check size={13} /></button>
                    <button className="btn btn-icon" onClick={() => setConfirmDelete(null)}><X size={13} /></button>
                  </div>
                ) : (
                  <button className="btn btn-icon" onClick={() => setConfirmDelete(s.id)}><Trash2 size={13} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-dim mt-4" style={{ lineHeight: 1.6 }}>
          Tap the rate, type a new number, then tap ✓. Trash icon removes the staff member permanently.
        </div>
      </Card>
    </div>
  );
}

function OwnerTab({ visits, staff, staffMap }) {
  const [mode, setMode] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedMonth, setSelectedMonth] = useState(thisMonthStr());

  const selectedVisits = mode === "daily"
    ? visits.filter((v) => v.visit_date === selectedDate)
    : visits.filter((v) => v.visit_date.startsWith(selectedMonth));

  const gross = selectedVisits.reduce((s, v) => s + Number(v.entry_fee) + Number(v.extra_amount), 0);
  const staffPayout = selectedVisits.reduce((s, v) => s + Number(staffMap[v.staff_id]?.rate_per_client || 0), 0);
  const ownerTakeHome = gross - staffPayout;

  const bestDay = (() => {
    if (selectedVisits.length === 0) return null;
    const map = {};
    selectedVisits.forEach((v) => {
      map[v.visit_date] = (map[v.visit_date] || 0) + Number(v.entry_fee) + Number(v.extra_amount);
    });
    const [best, bestAmount] = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return { date: best, amount: bestAmount };
  })();

  const bySource = ["Offline", "Online"].map((src) => {
    const sv = selectedVisits.filter((v) => v.source === src);
    const revenue = sv.reduce((s, v) => s + Number(v.entry_fee) + Number(v.extra_amount), 0);
    return { source: src, count: sv.length, revenue, avgPerClient: sv.length ? revenue / sv.length : 0 };
  });

  const totalSourceRevenue = bySource.reduce((s, r) => s + r.revenue, 0);

  const staffConversion = staff.map((s) => {
    const sv = selectedVisits.filter((v) => v.staff_id === s.id);
    const withExtra = sv.filter((v) => Number(v.extra_amount) > 0);
    const extraTotal = sv.reduce((sum, v) => sum + Number(v.extra_amount), 0);
    return {
      staff: s,
      clientCount: sv.length,
      extraCount: withExtra.length,
      extraTotal,
      conversionRate: sv.length ? (withExtra.length / sv.length) * 100 : 0,
      avgExtra: sv.length ? extraTotal / sv.length : 0,
    };
  }).filter((r) => r.clientCount > 0).sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <div style={{ paddingTop: 20 }}>
      <Card style={{ marginBottom: 16 }}>
        <SectionLabel icon={<IndianRupee size={12} />}>Owner view</SectionLabel>
        <SegmentedControl options={["Daily", "Monthly"]} value={mode === "daily" ? "Daily" : "Monthly"} onChange={(v) => setMode(v.toLowerCase())} />
        <div className="mt-3">
          {mode === "daily" ? (
            <input className="input" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          ) : (
            <input className="input" type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          )}
        </div>
        <div className="mt-3 text-sm text-dim font-bold">
          {mode === "daily" ? fmtDate(selectedDate) : fmtMonth(selectedMonth)} · {selectedVisits.length} client{selectedVisits.length !== 1 ? "s" : ""}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionLabel icon={<TrendingUp size={12} />}>Take-home breakdown</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <MetricCard icon={<ArrowUpRight size={18} />} label="Gross income" value={fmtMoney(gross)} accent={TOKENS.emeraldGlow} />
          <MetricCard icon={<Users size={18} />} label="Staff payout" value={fmtMoney(staffPayout)} accent={TOKENS.gold} />
        </div>
        <div style={{ background: TOKENS.emeraldDark, border: `1px solid ${TOKENS.borderLight}`, borderRadius: 16, padding: "22px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: TOKENS.emeraldGlow, fontWeight: 800, marginBottom: 8, letterSpacing: 0.8 }}>OWNER TAKE-HOME</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: TOKENS.text, letterSpacing: -1 }}>{fmtMoney(ownerTakeHome)}</div>
          <div className="text-sm text-dim mt-2">Gross minus staff payouts</div>
        </div>

        {bestDay && (
          <div className="mt-4" style={{ padding: "14px 16px", borderRadius: 12, background: TOKENS.surfaceRaised, border: `1px solid ${TOKENS.border}` }}>
            <div className="text-sm text-dim font-bold">Best day in period</div>
            <div className="flex justify-between items-baseline mt-2">
              <div style={{ fontWeight: 800, fontSize: 16 }}>{fmtDate(bestDay.date)}</div>
              <div style={{ fontWeight: 900, fontSize: 17, color: TOKENS.gold }}>{fmtMoney(bestDay.amount)}</div>
            </div>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionLabel icon={<Megaphone size={12} />}>Source performance</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bySource.map((r) => (
            <div key={r.source} className="visit-row">
              <div className="flex justify-between items-center mb-2">
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{r.source}</div>
                <div style={{ fontWeight: 900, fontSize: 16, color: TOKENS.gold }}>{fmtMoney(r.revenue)}</div>
              </div>
              <div className="text-sm text-dim">
                {r.count} client{r.count !== 1 ? "s" : ""} · avg {fmtMoney(Math.round(r.avgPerClient))}/client
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: TOKENS.surface, overflow: "hidden" }}>
                <div style={{ width: `${Math.min((r.revenue / Math.max(totalSourceRevenue, 1)) * 100, 100)}%`, height: "100%", background: r.source === "Offline" ? TOKENS.emeraldGlow : TOKENS.blue, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel icon={<Sparkles size={12} />}>Staff upsell performance</SectionLabel>
        {staffConversion.length === 0 ? (
          <EmptyState text="No data for this period" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {staffConversion.map((r) => (
              <div key={r.staff.id} className="visit-row">
                <div className="flex justify-between items-center mb-2">
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{r.staff.name}</div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: TOKENS.gold }}>{r.conversionRate.toFixed(0)}% upsell</div>
                </div>
                <div className="text-sm text-dim">
                  {r.extraCount} of {r.clientCount} clients paid extra · {fmtMoney(r.extraTotal)} total extras
                </div>
                <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: TOKENS.surface, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(r.conversionRate, 100)}%`, height: "100%", background: TOKENS.emeraldGlow, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function FidgetTab() {
  const [mode, setMode] = useState("flow");
  const modes = [
    { id: "flow", label: "Flow", icon: MousePointerClick },
    { id: "rain", label: "Rain", icon: CloudRain },
    { id: "magnet", label: "Magnet", icon: Magnet },
    { id: "mesh", label: "Mesh", icon: LayoutGrid },
    { id: "breathe", label: "Breathe", icon: Square },
    { id: "gravity", label: "Gravity", icon: Circle },
    { id: "memory", label: "Memory", icon: Zap },
    { id: "reaction", label: "Reaction", icon: Target },
    { id: "bubbles", label: "Bubbles", icon: Grid3X3 },
    { id: "colorcatch", label: "Catch", icon: Palette },
    { id: "dice", label: "Dice", icon: Dices },
    { id: "coin", label: "Coin", icon: Circle },
    { id: "tictactoe", label: "TicTacToe", icon: Grid2X2 },
    { id: "cardmatch", label: "Match", icon: Brain },
  ];
  return (
    <div style={{ paddingTop: 20 }}>
      <Card style={{ marginBottom: 16 }}>
        <SectionLabel icon={<Sparkles size={12} />}>Fidget zone</SectionLabel>
        <div className="scroll-x">
          {modes.map((m) => (
            <button key={m.id} className={`chip ${mode === m.id ? "active" : ""}`} onClick={() => setMode(m.id)}>
              <m.icon size={14} /> {m.label}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        {mode === "flow" && <FlowFidget />}
        {mode === "rain" && <RainFidget />}
        {mode === "magnet" && <MagnetFidget />}
        {mode === "mesh" && <MeshWaveFidget />}
        {mode === "breathe" && <BreatheBoxFidget />}
        {mode === "gravity" && <GravityBallsFidget />}
        {mode === "memory" && <MemoryLightsFidget />}
        {mode === "reaction" && <ReactionFidget />}
        {mode === "bubbles" && <BubbleWrapFidget />}
        {mode === "colorcatch" && <ColorCatchFidget />}
        {mode === "dice" && <DiceFidget />}
        {mode === "coin" && <CoinFlipFidget />}
        {mode === "tictactoe" && <TicTacToeFidget />}
        {mode === "cardmatch" && <CardMatchFidget />}
      </Card>
    </div>
  );
}

function FlowFidget() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = TOKENS.surface;
      ctx.fillRect(0, 0, rect.width, rect.height);
    };
    resize();

    const palette = [TOKENS.emeraldGlow, TOKENS.gold, TOKENS.blue, TOKENS.text];
    const add = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: clientX - rect.left,
          y: clientY - rect.top,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: 1,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: Math.random() * 6 + 2,
        });
      }
    };

    const move = (e) => {
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      add(p.clientX, p.clientY);
    };
    canvas.addEventListener("pointermove", move);

    const step = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = "rgba(19, 26, 20, 0.18)";
      ctx.fillRect(0, 0, rect.width, rect.height);
      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.97; p.vy *= 0.97;
        p.life -= 0.012;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", move);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 14, background: TOKENS.surface, touchAction: "none", cursor: "crosshair" }} />
      <div className="text-sm text-dim font-bold mt-4">Drag to leave glowing trails</div>
    </div>
  );
}

function RainFidget() {
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);
  const splashesRef = useRef([]);
  const rafRef = useRef(null);
  const [heavy, setHeavy] = useState(false);
  const heavyRef = useRef(heavy);
  useEffect(() => { heavyRef.current = heavy; }, [heavy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const addDrop = () => {
      const rect = canvas.getBoundingClientRect();
      dropsRef.current.push({ x: Math.random() * rect.width, y: -20, speed: Math.random() * 4 + 5, len: Math.random() * 14 + 8 });
    };

    const splash = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      splashesRef.current.push({ x: clientX - rect.left, y: clientY - rect.top, r: 2, life: 1 });
    };

    const tap = (e) => {
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      splash(p.clientX, p.clientY);
    };
    canvas.addEventListener("pointerdown", tap);

    let timer = 0;
    const step = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = TOKENS.surface;
      ctx.fillRect(0, 0, rect.width, rect.height);

      timer++;
      if (timer > (heavyRef.current ? 3 : 10)) {
        addDrop();
        timer = 0;
      }

      ctx.strokeStyle = "rgba(91,141,239,0.55)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (let i = dropsRef.current.length - 1; i >= 0; i--) {
        const d = dropsRef.current[i];
        d.y += d.speed;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.len); ctx.stroke();
        if (d.y > rect.height) dropsRef.current.splice(i, 1);
      }

      for (let i = splashesRef.current.length - 1; i >= 0; i--) {
        const s = splashesRef.current[i];
        s.r += 1.2; s.life -= 0.025;
        if (s.life <= 0) {
          splashesRef.current.splice(i, 1);
          continue;
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(91,141,239,${s.life * 0.5})`;
        ctx.lineWidth = 1.5; ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointerdown", tap);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 14, background: TOKENS.surface, touchAction: "none", cursor: "pointer" }} />
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-dim font-bold">Tap to splash · {heavy ? "Heavy rain" : "Light rain"}</div>
        <button className="btn" onClick={() => setHeavy((h) => !h)}>Toggle rain</button>
      </div>
    </div>
  );
}

function MagnetFidget() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const ptsRef = useRef([]);
  const ptrRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const cols = 12, rows = 9;
      const pts = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          pts.push({ ox: (c + 1) * (rect.width / (cols + 1)), oy: (r + 1) * (rect.height / (rows + 1)), x: 0, y: 0, vx: 0, vy: 0 });
        }
      }
      ptsRef.current = pts;
    };
    init();

    const move = (e) => {
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      ptrRef.current = { x: p.clientX, y: p.clientY };
    };
    const leave = () => { ptrRef.current = null; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);

    const step = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = TOKENS.surface;
      ctx.fillRect(0, 0, rect.width, rect.height);

      const ptr = ptrRef.current;
      const pts = ptsRef.current;
      pts.forEach((p) => {
        let tx = p.ox, ty = p.oy;
        if (ptr) {
          const px = ptr.x - rect.left, py = ptr.y - rect.top;
          const dx = px - p.ox, dy = py - p.oy, dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const f = 1 - dist / 130;
            tx += dx * f * 0.55;
            ty += dy * f * 0.55;
          }
        }
        p.vx += (tx - p.x) * 0.08;
        p.vy += (ty - p.y) * 0.08;
        p.vx *= 0.78; p.vy *= 0.78;
        p.x += p.vx; p.y += p.vy;

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5);
        glow.addColorStop(0, TOKENS.emeraldGlow);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = TOKENS.emeraldGlow;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
      });

      ctx.strokeStyle = "rgba(20,163,111,0.14)";
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 55) {
            ctx.globalAlpha = 1 - d / 55;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 14, background: TOKENS.surface, touchAction: "none", cursor: "pointer" }} />
      <div className="text-sm text-dim font-bold mt-4">Move your finger to pull the field</div>
    </div>
  );
}

function MeshWaveFidget() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const ptsRef = useRef([]);
  const ripplesRef = useRef([]);
  const ptrRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const cols = 18, rows = 12;
    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const pts = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          pts.push({ ox: (c + 0.5) * (rect.width / cols), oy: (r + 0.5) * (rect.height / rows) });
        }
      }
      ptsRef.current = pts;
    };
    init();

    const addRipple = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({ x: clientX - rect.left, y: clientY - rect.top, t: 0 });
    };

    const move = (e) => {
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      ptrRef.current = { x: p.clientX - canvas.getBoundingClientRect().left, y: p.clientY - canvas.getBoundingClientRect().top };
    };
    const leave = () => { ptrRef.current = null; };
    const tap = (e) => {
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      addRipple(p.clientX, p.clientY);
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerdown", tap);

    const step = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = TOKENS.surface;
      ctx.fillRect(0, 0, rect.width, rect.height);

      const ripples = ripplesRef.current;
      ripples.forEach((r) => r.t += 1);
      for (let i = ripples.length - 1; i >= 0; i--) if (ripples[i].t > 120) ripples.splice(i, 1);

      const pts = ptsRef.current;
      pts.forEach((p) => {
        let dy = 0;
        ripples.forEach((r) => {
          const d = Math.hypot(p.ox - r.x, p.oy - r.y);
          dy += Math.sin(d * 0.12 - r.t * 0.18) * Math.max(0, 10 - r.t * 0.08) * Math.exp(-d * 0.025);
        });
        if (ptrRef.current) {
          const d = Math.hypot(p.ox - ptrRef.current.x, p.oy - ptrRef.current.y);
          if (d < 90) dy += (1 - d / 90) * 10;
        }
        p.x = p.ox; p.y = p.oy + dy;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
        glow.addColorStop(0, TOKENS.blue);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
      });

      ctx.strokeStyle = "rgba(91,141,239,0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 48) {
            ctx.globalAlpha = 1 - d / 48;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerdown", tap);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 14, background: TOKENS.surface, touchAction: "none", cursor: "pointer" }} />
      <div className="text-sm text-dim font-bold mt-4">Drag to ripple · tap to send waves</div>
    </div>
  );
}

function BreatheBoxFidget() {
  const [phase, setPhase] = useState("Breathe In");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const phases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
    const durations = [4000, 2000, 4000, 2000];
    let idx = 0;
    let start = performance.now();
    const loop = (t) => {
      const elapsed = t - start;
      setProgress(Math.min(elapsed / durations[idx], 1));
      if (elapsed >= durations[idx]) {
        idx = (idx + 1) % phases.length;
        setPhase(phases[idx]);
        start = t;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  let scale = 1, color = TOKENS.emeraldGlow;
  if (phase === "Breathe In") { scale = 1 + progress * 0.5; color = TOKENS.emeraldGlow; }
  else if (phase === "Hold") { scale = 1.5; color = TOKENS.gold; }
  else if (phase === "Breathe Out") { scale = 1.5 - progress * 0.5; color = TOKENS.blue; }
  else { scale = 1; color = TOKENS.emeraldGlow; }

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 150, height: 150, margin: "0 auto", borderRadius: 18, border: `3px solid ${color}`, transform: `scale(${scale})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color, fontWeight: 800, fontSize: 15 }}>{phase}</span>
      </div>
      <div className="text-sm text-dim font-bold mt-4">Match the box with your breath</div>
      <div className="text-xs text-dim mt-2">4-2-4-2 rhythm · good for anxiety</div>
    </div>
  );
}

function GravityBallsFidget() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const ballsRef = useRef([]);
  const ptrRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const palette = [TOKENS.emeraldGlow, TOKENS.gold, TOKENS.blue, TOKENS.text, TOKENS.red];
    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const balls = [];
      for (let i = 0; i < 16; i++) {
        balls.push({ x: Math.random() * rect.width, y: Math.random() * rect.height * 0.5, vx: (Math.random() - 0.5) * 4, vy: 0, r: Math.random() * 7 + 5, color: palette[i % palette.length] });
      }
      ballsRef.current = balls;
    };
    init();

    const move = (e) => {
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      ptrRef.current = { x: p.clientX, y: p.clientY };
    };
    const leave = () => { ptrRef.current = null; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);

    const step = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = TOKENS.surface;
      ctx.fillRect(0, 0, rect.width, rect.height);

      const ptr = ptrRef.current;
      ballsRef.current.forEach((b) => {
        if (ptr) {
          const px = ptr.x - rect.left, py = ptr.y - rect.top;
          const dx = b.x - px, dy = b.y - py, dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0) {
            const f = (1 - dist / 120) * 0.8;
            b.vx += (dx / dist) * f;
            b.vy += (dy / dist) * f;
          }
        }

        b.vy += 0.18;
        b.x += b.vx; b.y += b.vy;
        b.vx *= 0.995; b.vy *= 0.995;

        if (b.x < b.r) { b.x = b.r; b.vx *= -0.75; }
        if (b.x > rect.width - b.r) { b.x = rect.width - b.r; b.vx *= -0.75; }
        if (b.y < b.r) { b.y = b.r; b.vy *= -0.75; }
        if (b.y > rect.height - b.r) { b.y = rect.height - b.r; b.vy *= -0.75; }

        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color; ctx.shadowColor = b.color; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 14, background: TOKENS.surface, touchAction: "none", cursor: "pointer" }} />
      <div className="text-sm text-dim font-bold mt-4">Move to push the glowing balls</div>
    </div>
  );
}

function MemoryLightsFidget() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState("Press Start");
  const [failed, setFailed] = useState(false);
  const timeoutsRef = useRef([]);

  const colors = [
    { id: 0, color: TOKENS.emeraldGlow, active: "#3BD19A" },
    { id: 1, color: TOKENS.gold, active: "#F0D878" },
    { id: 2, color: TOKENS.blue, active: "#8CB5FF" },
    { id: 3, color: TOKENS.red, active: "#FF8A7E" },
  ];

  const sleep = (ms) => new Promise((r) => {
    const id = setTimeout(r, ms);
    timeoutsRef.current.push(id);
  });

  const playSequence = async (seq) => {
    setPlaying(true);
    setUserSequence([]);
    setStatus("Watch…");
    setFailed(false);
    await sleep(600);
    for (const id of seq) {
      setHighlight(id);
      await sleep(400 - Math.min(level * 12, 180));
      setHighlight(null);
      await sleep(200 - Math.min(level * 6, 100));
    }
    setPlaying(false);
    setStatus("Your turn");
  };

  const startGame = async () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setLevel(1);
    await playSequence(first);
  };

  const handlePad = async (id) => {
    if (playing || failed || sequence.length === 0) return;

    setHighlight(id);
    const clear = setTimeout(() => setHighlight(null), 180);
    timeoutsRef.current.push(clear);

    const next = [...userSequence, id];
    setUserSequence(next);

    if (sequence[next.length - 1] !== id) {
      setFailed(true);
      setStatus("Game over!");
      return;
    }

    if (next.length === sequence.length) {
      setPlaying(true);
      setStatus("Good!");
      await sleep(700);
      const extended = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(extended);
      setLevel((l) => l + 1);
      await playSequence(extended);
    }
  };

  useEffect(() => () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-dim font-bold">Level <span style={{ color: TOKENS.text }}>{level}</span></div>
        <div style={{ fontSize: 13, fontWeight: 800, color: failed ? TOKENS.red : TOKENS.gold }}>{status}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 260, margin: "0 auto" }}>
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => handlePad(c.id)}
            disabled={playing}
            style={{
              width: "100%", aspectRatio: "1 / 1", borderRadius: 16, border: `2px solid ${TOKENS.border}`,
              background: highlight === c.id ? c.active : c.color, opacity: playing && highlight !== c.id ? 0.6 : 1,
              boxShadow: highlight === c.id ? `0 0 28px ${c.active}` : "none", transition: "all 0.12s",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
      <button className="btn btn-primary w-full mt-4" onClick={startGame} disabled={playing}>
        {sequence.length === 0 ? "Start game" : "Restart"}
      </button>
      <div className="text-xs text-dim mt-3">Watch the pattern, then repeat it. Speed increases every level.</div>
    </div>
  );
}

function ReactionFidget() {
  const [state, setState] = useState("idle");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const start = () => {
    setState("waiting");
    const delay = 1500 + Math.random() * 2500;
    timeoutRef.current = setTimeout(() => {
      setState("ready");
      startTimeRef.current = performance.now();
    }, delay);
  };

  const tap = () => {
    if (state === "waiting") {
      clearTimeout(timeoutRef.current);
      setState("falseStart");
      setTimeout(() => setState("idle"), 900);
      return;
    }
    if (state === "ready") {
      const ms = Math.round(performance.now() - startTimeRef.current);
      setResults((r) => [...r, ms]);
      setState("result");
      setTimeout(() => setState("idle"), 1200);
    }
  };

  const best = results.length ? Math.min(...results) : null;
  const avg = results.length ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : null;

  let boxStyle = { background: TOKENS.surfaceRaised, border: `2px solid ${TOKENS.border}` };
  let message = "Tap Start, then tap as soon as it turns green";
  if (state === "waiting") { boxStyle = { background: TOKENS.red, border: `2px solid ${TOKENS.red}` }; message = "Wait for green…"; }
  else if (state === "ready") { boxStyle = { background: TOKENS.emeraldGlow, border: `2px solid ${TOKENS.emeraldGlow}` }; message = "Tap now!"; }
  else if (state === "result") { boxStyle = { background: TOKENS.gold, border: `2px solid ${TOKENS.gold}` }; message = `${results[results.length - 1]} ms`; }
  else if (state === "falseStart") { boxStyle = { background: TOKENS.surfaceRaised, border: `2px solid ${TOKENS.red}` }; message = "Too soon!"; }

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={state === "idle" ? start : tap}
        disabled={state === "result" || state === "falseStart"}
        style={{
          width: "100%", height: 200, borderRadius: 18, fontSize: 26, fontWeight: 900, color: "#fff",
          ...boxStyle, transition: "all 0.12s", cursor: "pointer",
        }}
      >
        {state === "idle" ? "START" : state === "waiting" ? "…" : state === "ready" ? "GO!" : message}
      </button>
      <div className="flex justify-center gap-4 mt-4">
        <MetricCard icon={<Zap size={16} />} label="Best" value={best ? `${best} ms` : "—"} accent={TOKENS.emeraldGlow} />
        <MetricCard icon={<TrendingUp size={16} />} label="Average" value={avg ? `${avg} ms` : "—"} accent={TOKENS.gold} />
      </div>
      <button className="btn btn-ghost mt-3" onClick={() => setResults([])}>Reset scores</button>
    </div>
  );
}

function BubbleWrapFidget() {
  const ROWS = 5, COLS = 5;
  const [popped, setPopped] = useState(() => Array(ROWS * COLS).fill(false));
  const count = popped.filter(Boolean).length;

  const pop = (i) => {
    setPopped((p) => { const n = [...p]; n[i] = true; return n; });
  };

  const reset = () => setPopped(Array(ROWS * COLS).fill(false));

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 10, maxWidth: 280, margin: "0 auto" }}>
        {popped.map((isPopped, i) => (
          <button
            key={i}
            onClick={() => pop(i)}
            style={{
              aspectRatio: "1 / 1", borderRadius: "50%", border: "none",
              background: isPopped ? TOKENS.surface : TOKENS.surfaceRaised,
              boxShadow: isPopped ? "inset 0 2px 6px rgba(0,0,0,0.4)" : `inset 0 3px 8px rgba(255,255,255,0.08), 0 4px 10px rgba(0,0,0,0.3)`,
              transform: isPopped ? "scale(0.92)" : "scale(1)", transition: "all 0.08s",
              cursor: "pointer",
            }}
          >
            {isPopped && <div style={{ width: 8, height: 8, borderRadius: "50%", background: TOKENS.borderLight, margin: "0 auto" }} />}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4" style={{ maxWidth: 280, margin: "16px auto 0" }}>
        <div className="text-sm text-dim font-bold">Popped: <span style={{ color: TOKENS.text }}>{count}</span> / {ROWS * COLS}</div>
        <button className="btn" onClick={reset}>Refill sheet</button>
      </div>
    </div>
  );
}

function ColorCatchFidget() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const colors = [TOKENS.emeraldGlow, TOKENS.gold, TOKENS.blue, TOKENS.red];
  const colorNames = ["Green", "Gold", "Blue", "Red"];

  const scoreRef = useRef(score);
  const missesRef = useRef(misses);
  const activeColorRef = useRef(activeColor);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { missesRef.current = misses; }, [misses]);
  useEffect(() => { activeColorRef.current = activeColor; }, [activeColor]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameOverRef.current) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dots = [];
    const rectRef = { width: 0, height: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      rectRef.width = rect.width; rectRef.height = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    let spawnTimer = 0;

    const handleMiss = () => {
      const nextMisses = missesRef.current + 1;
      missesRef.current = nextMisses;
      setMisses(nextMisses);
      if (nextMisses >= 5) setGameOver(true);
    };

    const handleScore = () => {
      const nextScore = scoreRef.current + 10;
      scoreRef.current = nextScore;
      setScore(nextScore);
    };

    const tap = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      const x = p.clientX - rect.left, y = p.clientY - rect.top;

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        if (Math.hypot(d.x - x, d.y - y) < d.r + 10) {
          if (d.color === activeColorRef.current) {
            handleScore();
          } else {
            handleMiss();
          }
          dots.splice(i, 1);
          return;
        }
      }
    };
    canvas.addEventListener("pointerdown", tap);

    const step = () => {
      ctx.fillStyle = TOKENS.surface;
      ctx.fillRect(0, 0, rectRef.width, rectRef.height);

      spawnTimer++;
      if (spawnTimer > 35) { spawn(); spawnTimer = 0; }

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.y += d.speed;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = colors[d.color]; ctx.shadowColor = colors[d.color]; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;

        if (d.y > rectRef.height + 20) {
          if (d.color === activeColorRef.current) handleMiss();
          dots.splice(i, 1);
        }
      }

      if (!gameOverRef.current) rafRef.current = requestAnimationFrame(step);
    };

    const spawn = () => {
      const color = Math.floor(Math.random() * colors.length);
      dots.push({
        x: Math.random() * (rectRef.width - 36) + 18,
        y: -20, r: 16, color, speed: 1.5 + Math.random() * 1.5,
      });
    };

    rafRef.current = requestAnimationFrame(step);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointerdown", tap);
      window.removeEventListener("resize", onResize);
    };
  }, [gameOver]);

  const restart = () => {
    setScore(0); setMisses(0); setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-dim font-bold">Score: <span style={{ color: TOKENS.text }}>{score}</span></div>
        <div className="text-sm text-dim font-bold">Misses: <span style={{ color: TOKENS.red }}>{misses}</span>/5</div>
      </div>
      <div className="mb-3">
        <div className="text-sm text-dim font-bold mb-2">Catch only: <span style={{ color: colors[activeColor] }}>{colorNames[activeColor]}</span></div>
        <div className="scroll-x" style={{ justifyContent: "center" }}>
          {colors.map((c, i) => (
            <button key={i} className={`chip ${activeColor === i ? "active" : ""}`} onClick={() => setActiveColor(i)} style={{ borderColor: activeColor === i ? c : undefined, color: activeColor === i ? c : undefined }}>
              {colorNames[i]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 14, background: TOKENS.surface, touchAction: "none", cursor: "pointer" }} />
        {gameOver && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(11,16,12,0.9)", borderRadius: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Game Over</div>
            <div className="text-sm text-dim font-bold" style={{ marginBottom: 16 }}>Final score: {score}</div>
            <button className="btn btn-primary" onClick={restart}>Play again</button>
          </div>
        )}
      </div>
      <div className="text-xs text-dim mt-3">Tap dots that match the active color. Avoid wrong colors and misses.</div>
    </div>
  );
}

function DiceFidget() {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    let steps = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      steps++;
      if (steps > 10) {
        clearInterval(interval);
        setValue(Math.floor(Math.random() * 6) + 1);
        setRolling(false);
      }
    }, 80);
  };

  const dots = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  };

  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <button
        onClick={roll}
        disabled={rolling}
        style={{
          width: 140, height: 140, borderRadius: 24, border: "none",
          background: TOKENS.surfaceRaised, boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 2px 6px rgba(255,255,255,0.06)",
          display: "grid", placeItems: "center", margin: "0 auto", cursor: "pointer", transition: "transform 0.1s",
        }}
      >
        <div style={{ width: 100, height: 100, borderRadius: 16, background: "#fff", position: "relative", transform: rolling ? "rotate(12deg)" : "rotate(0deg)", transition: "transform 0.1s" }}>
          {dots[value].map(([x, y], i) => (
            <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", width: 14, height: 14, borderRadius: "50%", background: "#1a1a1a" }} />
          ))}
        </div>
      </button>
      <div className="text-sm text-dim font-bold mt-4">{rolling ? "Rolling…" : `Rolled a ${value}`}</div>
      <button className="btn btn-primary mt-3" onClick={roll} disabled={rolling}>Roll dice</button>
    </div>
  );
}

function CoinFlipFidget() {
  const [side, setSide] = useState("Heads");
  const [flipping, setFlipping] = useState(false);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      const result = Math.random() < 0.5 ? "Heads" : "Tails";
      setSide(result);
      if (result === "Heads") setHeadsCount((c) => c + 1);
      else setTailsCount((c) => c + 1);
      setFlipping(false);
    }, 900);
  };

  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <button
        onClick={flip}
        disabled={flipping}
        style={{
          width: 130, height: 130, borderRadius: "50%", border: "none", margin: "0 auto",
          background: side === "Heads" ? TOKENS.gold : TOKENS.surfaceRaised,
          color: side === "Heads" ? "#1a1505" : TOKENS.text,
          fontSize: 44, fontWeight: 900,
          transform: flipping ? "rotateY(720deg)" : "rotateY(0deg)",
          transition: "transform 0.9s ease-in-out, background 0.2s",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          cursor: "pointer", display: "grid", placeItems: "center",
        }}
      >
        {side === "Heads" ? "H" : "T"}
      </button>
      <div className="text-sm text-dim font-bold mt-4">{flipping ? "Flipping…" : side}</div>
      <div className="flex justify-center gap-3 mt-3">
        <MetricCard icon={<span style={{ fontSize: 16 }}>H</span>} label="Heads" value={headsCount} />
        <MetricCard icon={<span style={{ fontSize: 16 }}>T</span>} label="Tails" value={tailsCount} />
      </div>
      <button className="btn btn-primary mt-3" onClick={flip} disabled={flipping}>Flip coin</button>
    </div>
  );
}

function TicTacToeFidget() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const checkWinner = (b) => {
    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    if (b.every(Boolean)) return "Draw";
    return null;
  };

  const play = (i) => {
    if (board[i] || winner || turn !== "X") return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);
    const w = checkWinner(next);
    if (w) {
      setWinner(w);
      return;
    }
    setTurn("O");
  };

  useEffect(() => {
    if (turn !== "O" || winner) return;
    const timer = setTimeout(() => {
      setBoard((current) => {
        const empty = current.map((v, idx) => (v ? null : idx)).filter((v) => v !== null);
        if (empty.length === 0) return current;
        const move = empty[Math.floor(Math.random() * empty.length)];
        const afterBot = [...current];
        afterBot[move] = "O";
        const botWin = checkWinner(afterBot);
        if (botWin) setWinner(botWin);
        setTurn("X");
        return afterBot;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [turn, winner]);

  const reset = () => { setBoard(Array(9).fill(null)); setTurn("X"); setWinner(null); };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-dim font-bold">{winner ? (winner === "Draw" ? "It's a draw" : `${winner} wins!`) : `Turn: ${turn}`}</div>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, maxWidth: 260, margin: "0 auto" }}>
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            style={{
              aspectRatio: "1 / 1", borderRadius: 14, border: `2px solid ${TOKENS.border}`,
              background: TOKENS.surfaceRaised, color: v === "X" ? TOKENS.emeraldGlow : TOKENS.gold,
              fontSize: 36, fontWeight: 900, cursor: "pointer",
            }}
          >
            {v || ""}
          </button>
        ))}
      </div>
      <div className="text-xs text-dim mt-3">You play X against a random bot.</div>
    </div>
  );
}

function CardMatchFidget() {
  const emojis = ["🌿", "⭐", "🌙", "🔥", "💧", "🪐"];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const init = () => {
    const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((icon, id) => ({ id, icon }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => { init(); }, []);

  const flip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id) || gameWon) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].icon === cards[b].icon) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === cards.length) setGameWon(true);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-dim font-bold">Moves: <span style={{ color: TOKENS.text }}>{moves}</span></div>
        <button className="btn btn-ghost" onClick={init}>New game</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 280, margin: "0 auto" }}>
        {cards.map((c, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={c.id}
              onClick={() => flip(i)}
              style={{
                aspectRatio: "1 / 1", borderRadius: 14, border: `2px solid ${matched.includes(i) ? TOKENS.emeraldGlow : TOKENS.border}`,
                background: isFlipped ? TOKENS.surfaceRaised : TOKENS.emeraldDark,
                fontSize: 28, cursor: "pointer", transition: "all 0.2s",
                color: isFlipped ? TOKENS.text : "transparent",
              }}
            >
              {isFlipped ? c.icon : "?"}
            </button>
          );
        })}
      </div>
      {gameWon && <div className="text-sm text-dim font-bold mt-3" style={{ color: TOKENS.gold }}>Matched all in {moves} moves!</div>}
      <div className="text-xs text-dim mt-3">Find the matching pairs.</div>
    </div>
  );
}

function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "entry", label: "Entry", icon: Plus },
    { id: "dashboard", label: "Today", icon: TrendingUp },
    { id: "history", label: "History", icon: Calendar },
    { id: "staff", label: "Staff", icon: Users },
    { id: "fidget", label: "Fidget", icon: Sparkles },
    { id: "owner", label: "Owner", icon: IndianRupee },
  ];
  return (
    <nav className="tabbar">
      <div className="tabbar-inner">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`tab-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            <Icon size={18} strokeWidth={tab === id ? 2.5 : 2} />
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function Toast({ toast }) {
  return (
    <div className="toast" style={{ background: toast.type === "err" ? TOKENS.red : TOKENS.emeraldGlow }}>
      {toast.msg}
    </div>
  );
}