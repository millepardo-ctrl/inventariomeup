import { useState, useMemo } from "react";

const PRODUCTS = [
  {c:"0136401",n:"Mármol Crema 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",cuc:0,baq:1368.19,d1:856.46,d2:0,eta1:"26 Feb 2026",eta2:null,res:143.5},
  {c:"0163701",n:"Mármol Crema 40xLL 1.2cm Arenado c/vetas",u:"m²",cat:"Mármol",cuc:0,baq:233.36,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0136402",n:"Mármol Crema 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:0,baq:1.3,d1:0,d2:701.18,eta1:null,eta2:"Mar 2026",res:19.5},
  {c:"0137202",n:"Mármol Crema 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",cuc:0,baq:291.97,d1:0,d2:251.97,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0137203",n:"Mármol Crema 40x100x2cm Rompeolas",u:"ml",cat:"Mármol",cuc:8,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154501",n:"Mármol Arenado 40xLL 1.2cm",u:"m²",cat:"Mármol",cuc:0,baq:1300.58,d1:511.26,d2:1354.12,eta1:"26 Feb 2026",eta2:"Mar 2026",res:126.6},
  {c:"0156102",n:"Mármol Arenado 30.5xLL 2cm Rompeolas",u:"ml",cat:"Mármol",cuc:0,baq:499.98,d1:0,d2:134.98,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0158501",n:"Mármol Nuevo Marfil 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:0,baq:12.34,d1:195,d2:695.2,eta1:"Feb 2026",eta2:"Mar 2026",res:9.7},
  {c:"0158504",n:"Mármol Nuevo Marfil 40xLL 1.5cm Brillado",u:"m²",cat:"Mármol",cuc:0,baq:2019.72,d1:0,d2:0,eta1:null,eta2:null,res:17.2},
  {c:"0154102",n:"Mármol Café 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",cuc:2.1,baq:1338.24,d1:0,d2:863.64,eta1:null,eta2:"Mar 2026",res:51.2},
  {c:"0154101",n:"Mármol Café 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:1.36,baq:421.49,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154203",n:"Mármol Café 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",cuc:0,baq:855,d1:0,d2:183.97,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0156001",n:"Mármol Gris 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",cuc:1.89,baq:631.64,d1:0,d2:140.32,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0156002",n:"Mármol Gris 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:2.56,baq:234.28,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0162001",n:"Mármol Tundra Grey 40xLL 1.2cm Pulido Mate",u:"m²",cat:"Mármol",cuc:0,baq:296.46,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0161802",n:"Mármol Ibiza Gold 61x122x1cm Brillante",u:"m²",cat:"Mármol",cuc:0,baq:327.44,d1:0,d2:327.44,eta1:null,eta2:"Abr 2026",res:0},
  {c:"0162003",n:"Mármol Afyon Grey 40xLL 1cm Arenado",u:"m²",cat:"Mármol",cuc:0,baq:299.67,d1:0,d2:299.67,eta1:null,eta2:"Abr 2026",res:0},
  {c:"0128702",n:"Travertino Clásico 30.5x61x1.2cm Pulido",u:"m²",cat:"Travertino",cuc:0.07,baq:148.32,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0128701",n:"Travertino Clásico 40xLL 1.2cm Pulido",u:"m²",cat:"Travertino",cuc:0,baq:1589.71,d1:0,d2:0,eta1:null,eta2:null,res:13.3},
  {c:"0163601",n:"Travertino Turco 30xLL 2cm Pulido",u:"m²",cat:"Travertino",cuc:0,baq:900,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0157201",n:"Travertino Macadamia 40.6x61x1.2cm",u:"m²",cat:"Travertino",cuc:0,baq:871.86,d1:0,d2:0,eta1:null,eta2:null,res:35.6},
  {c:"0128102",n:"Travertino Ivory 40x61x1.2cm",u:"m²",cat:"Travertino",cuc:0.84,baq:274.58,d1:0,d2:0,eta1:null,eta2:null,res:32.9},
  {c:"0128103",n:"Travertino Ivory 40.6x61x1.2cm Retapado",u:"m²",cat:"Travertino",cuc:14.15,baq:752.97,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154001",n:"Travertino Arena 40.6x61x1.2cm",u:"m²",cat:"Travertino",cuc:657.47,baq:911.49,d1:0,d2:0,eta1:null,eta2:null,res:44.9},
  {c:"0000601",n:"Bali Verde 20x20",u:"m²",cat:"Bali/Piedra",cuc:889,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:29.7},
  {c:"0000602",n:"Bali Verde 10x10",u:"m²",cat:"Bali/Piedra",cuc:0,baq:5.79,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0003201",n:"Bali Negra 10x10",u:"m²",cat:"Bali/Piedra",cuc:16,baq:160,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0003202",n:"Bali Negra 20x20",u:"m²",cat:"Bali/Piedra",cuc:63,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160101",n:"Bali Azul 20x20",u:"m²",cat:"Bali/Piedra",cuc:199,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158901",n:"Splitface Blanco 7x30x1.5cm",u:"m²",cat:"Splitface",cuc:3.03,baq:81.48,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158902",n:"Splitface Blanco 15x30x2.2cm",u:"m²",cat:"Splitface",cuc:0,baq:261.91,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159001",n:"Splitface Café 7x30x1.5cm",u:"m²",cat:"Splitface",cuc:2.2,baq:113.4,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159002",n:"Splitface Café 15x30x2.2cm",u:"m²",cat:"Splitface",cuc:231.16,baq:175.14,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160001",n:"Splitface Gris 7x30x1.5cm",u:"m²",cat:"Splitface",cuc:61.12,baq:88.8,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160002",n:"Splitface Gris 15x30x2.2cm",u:"m²",cat:"Splitface",cuc:92.48,baq:100.17,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0162501",n:"Splitface Crema 30x7x1.5cm",u:"m²",cat:"Splitface",cuc:63.24,baq:201.6,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158601",n:"Thin Brick Mármol Marfil 7x25x1.5cm",u:"m²",cat:"Splitface",cuc:10.91,baq:62.91,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158701",n:"Thin Brick Mármol Café 7x25x1.5cm",u:"m²",cat:"Splitface",cuc:48.04,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000401",n:"Pizarra Negra Óxido 5x15",u:"m²",cat:"Pizarra",cuc:124.7,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000402",n:"Pizarra Negra Óxido 10x20",u:"m²",cat:"Pizarra",cuc:117.6,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000501",n:"Pizarra Verde Bosque 5x15",u:"m²",cat:"Pizarra",cuc:89.9,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000502",n:"Pizarra Verde Bosque 10x20",u:"m²",cat:"Pizarra",cuc:105.72,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0002102",n:"Pizarra Roseta Gris 5x15",u:"m²",cat:"Pizarra",cuc:137.45,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0004601",n:"Pizarra Negra Veta 3xJP",u:"m²",cat:"Pizarra",cuc:154.5,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0004602",n:"Pizarra Negra Veta 5xJP",u:"m²",cat:"Pizarra",cuc:169,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
];

const CATS = ["Todos", "Mármol", "Travertino", "Bali/Piedra", "Splitface", "Pizarra"];

const CAT_COLORS = {
  "Mármol":     { bg: "#e8f0fe", accent: "#1a56db", dot: "#1a56db" },
  "Travertino": { bg: "#ecfdf5", accent: "#059669", dot: "#059669" },
  "Bali/Piedra":{ bg: "#fefce8", accent: "#ca8a04", dot: "#ca8a04" },
  "Splitface":  { bg: "#fdf4ff", accent: "#9333ea", dot: "#9333ea" },
  "Pizarra":    { bg: "#f1f5f9", accent: "#475569", dot: "#475569" },
};

const fmt = (v) => v > 0 ? v.toLocaleString("es-CO", { maximumFractionDigits: 1 }) : "—";

function Badge({ label, eta, color }) {
  if (!label || label <= 0) return null;
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "flex-start",
      background: color === "close" ? "#fffbeb" : "#eff6ff",
      border: `1px solid ${color === "close" ? "#fcd34d" : "#bfdbfe"}`,
      borderRadius: 8, padding: "4px 10px", gap: 1,
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: color === "close" ? "#92400e" : "#1e40af", fontFamily: "'DM Mono', monospace" }}>
        {label.toLocaleString("es-CO", { maximumFractionDigits: 1 })} {label > 0 ? "" : ""}
      </span>
      {eta && (
        <span style={{ fontSize: 10, color: color === "close" ? "#b45309" : "#3b82f6", fontWeight: 500 }}>
          📅 {eta}
        </span>
      )}
    </div>
  );
}

function StockPill({ value, label, accent }) {
  if (!value || value <= 0) return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>—</div>
      <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 1 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: accent || "#1e293b", fontFamily: "'DM Mono', monospace" }}>
        {value.toLocaleString("es-CO", { maximumFractionDigits: 1 })}
      </div>
      <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{label}</div>
    </div>
  );
}

function ProductCard({ p, isVendedor }) {
  const [expanded, setExpanded] = useState(false);
  const catStyle = CAT_COLORS[p.cat] || { bg: "#f8fafc", accent: "#64748b", dot: "#64748b" };
  const totalBodega = p.cuc + p.baq;
  const hasNav = p.d1 > 0 || p.d2 > 0;
  const hasReservas = p.res > 0;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${catStyle.accent}`,
        borderRadius: 12,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: expanded ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: catStyle.accent,
              background: catStyle.bg, padding: "2px 8px", borderRadius: 20,
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>{p.cat}</span>
            <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{p.c}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>{p.n}</div>
        </div>

        {/* Quick stock overview */}
        <div style={{ display: "flex", gap: 16, flexShrink: 0, alignItems: "center" }}>
          <StockPill value={p.cuc} label="Cúcuta" accent={catStyle.accent} />
          <StockPill value={p.baq} label="B/quilla" accent={catStyle.accent} />
          {hasNav && (
            <div style={{
              background: "#eff6ff", border: "1px solid #bfdbfe",
              borderRadius: 8, padding: "4px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", fontFamily: "'DM Mono', monospace" }}>
                {(p.d1 + p.d2).toLocaleString("es-CO", { maximumFractionDigits: 1 })}
              </div>
              <div style={{ fontSize: 10, color: "#3b82f6" }}>En tránsito</div>
            </div>
          )}
          {isVendedor && hasReservas && (
            <div style={{
              background: "#fff7ed", border: "1px solid #fed7aa",
              borderRadius: 8, padding: "4px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", fontFamily: "'DM Mono', monospace" }}>
                {p.res.toLocaleString("es-CO", { maximumFractionDigits: 1 })}
              </div>
              <div style={{ fontSize: 10, color: "#ea580c" }}>Reservado</div>
            </div>
          )}
          <div style={{
            fontSize: 10, color: "#94a3b8",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s", marginTop: 2,
          }}>▾</div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          marginTop: 16, paddingTop: 16,
          borderTop: "1px solid #f1f5f9",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          animation: "fadeIn 0.15s ease",
        }}>
          {/* Bodega cards */}
          <div style={{ background: catStyle.bg, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: catStyle.accent, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>📦 Stock en Bodega</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", fontFamily: "'DM Mono', monospace" }}>{fmt(p.cuc)}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Cúcuta · {p.u}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", fontFamily: "'DM Mono', monospace" }}>{fmt(p.baq)}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>B/quilla · {p.u}</div>
              </div>
            </div>
            {totalBodega > 0 && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${catStyle.accent}22` }}>
                <span style={{ fontSize: 11, color: catStyle.accent, fontWeight: 600 }}>Total: {totalBodega.toLocaleString("es-CO", { maximumFractionDigits: 1 })} {p.u}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          {hasNav && (
            <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>🚢 Próximas Llegadas</div>
              {p.d1 > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>Disp. 1 — más próximo</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#1e40af", fontFamily: "'DM Mono', monospace" }}>{fmt(p.d1)} <span style={{ fontSize: 12, fontWeight: 400 }}>{p.u}</span></div>
                  {p.eta1 && <div style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>📅 ETA: {p.eta1}</div>}
                </div>
              )}
              {p.d2 > 0 && (
                <div style={{ borderTop: p.d1 > 0 ? "1px solid #bfdbfe" : "none", paddingTop: p.d1 > 0 ? 8 : 0 }}>
                  <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>Disp. 2 — siguiente</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#1e40af", fontFamily: "'DM Mono', monospace" }}>{fmt(p.d2)} <span style={{ fontSize: 12, fontWeight: 400 }}>{p.u}</span></div>
                  {p.eta2 && <div style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>📅 ETA: {p.eta2}</div>}
                </div>
              )}
            </div>
          )}

          {/* Reservas — vendedor only */}
          {isVendedor && hasReservas && (
            <div style={{ background: "#fff7ed", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#c2410c", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>🔒 Reservas Activas</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#c2410c", fontFamily: "'DM Mono', monospace" }}>{fmt(p.res)} <span style={{ fontSize: 12, fontWeight: 400, color: "#ea580c" }}>{p.u}</span></div>
              <div style={{ fontSize: 11, color: "#ea580c", marginTop: 4 }}>Material bloqueado para clientes</div>
            </div>
          )}

          {/* No nav message */}
          {!hasNav && (
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Sin material en tránsito</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("vendedor");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Todos");
  const [filterStock, setFilterStock] = useState(false);
  const [filterNav, setFilterNav] = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (cat !== "Todos" && p.cat !== cat) return false;
      if (filterStock && (p.cuc + p.baq) <= 0) return false;
      if (filterNav && (p.d1 + p.d2) <= 0) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.n.toLowerCase().includes(q) || p.c.includes(q) || p.cat.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, cat, filterStock, filterNav]);

  const totalCuc = PRODUCTS.reduce((s, p) => s + p.cuc, 0);
  const totalBaq = PRODUCTS.reduce((s, p) => s + p.baq, 0);
  const totalNav = PRODUCTS.reduce((s, p) => s + p.d1 + p.d2, 0);
  const totalRes = PRODUCTS.reduce((s, p) => s + p.res, 0);
  const withNav = PRODUCTS.filter(p => p.d1 + p.d2 > 0).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #94a3b8; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "#0f172a",
        padding: "0 24px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🪨</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Stone Castle</div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Inventario en Tiempo Real</div>
            </div>
          </div>

          {/* View toggle */}
          <div style={{
            display: "flex", background: "#1e293b", borderRadius: 10,
            padding: 3, gap: 2,
          }}>
            {[
              { key: "vendedor", label: "👤 Vendedor" },
              { key: "distribuidor", label: "🏪 Distribuidor" },
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                background: view === v.key ? "#3b82f6" : "transparent",
                color: view === v.key ? "#fff" : "#64748b",
                transition: "all 0.15s",
              }}>{v.label}</button>
            ))}
          </div>

          <div style={{ fontSize: 11, color: "#475569" }}>
            Actualizado: 26 Feb 2026
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px" }}>

        {/* KPI Bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: view === "vendedor" ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          gap: 14, marginBottom: 24,
        }}>
          {[
            { label: "Stock Cúcuta", value: totalCuc.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / ml en bodega", color: "#0f172a", icon: "🏭" },
            { label: "Stock B/quilla", value: totalBaq.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / ml en bodega", color: "#0f172a", icon: "🏭" },
            { label: "En Tránsito", value: totalNav.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: `${withNav} referencias · DISP 1 + DISP 2`, color: "#1d4ed8", icon: "🚢" },
            ...(view === "vendedor" ? [{ label: "Reservas Activas", value: totalRes.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "bloqueado para clientes", color: "#c2410c", icon: "🔒" }] : []),
          ].map((k, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14,
              padding: "18px 20px", border: "1px solid #e2e8f0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>{k.label}</span>
                <span style={{ fontSize: 18 }}>{k.icon}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: k.color, fontFamily: "'DM Mono', monospace", letterSpacing: "-0.02em" }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, código..."
              style={{
                width: "100%", padding: "10px 12px 10px 36px",
                border: "1px solid #e2e8f0", borderRadius: 10,
                fontSize: 13, fontFamily: "inherit", outline: "none",
                background: "#fff", color: "#1e293b",
              }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.15s",
                borderColor: cat === c ? (CAT_COLORS[c]?.accent || "#3b82f6") : "#e2e8f0",
                background: cat === c ? (CAT_COLORS[c]?.bg || "#eff6ff") : "#fff",
                color: cat === c ? (CAT_COLORS[c]?.accent || "#1d4ed8") : "#64748b",
              }}>{c}</button>
            ))}
          </div>

          {/* Quick filters */}
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "filterStock", label: "Con stock", state: filterStock, set: setFilterStock },
              { key: "filterNav", label: "🚢 En tránsito", state: filterNav, set: setFilterNav },
            ].map(f => (
              <button key={f.key} onClick={() => f.set(!f.state)} style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", border: "1px solid",
                transition: "all 0.15s",
                borderColor: f.state ? "#3b82f6" : "#e2e8f0",
                background: f.state ? "#eff6ff" : "#fff",
                color: f.state ? "#1d4ed8" : "#64748b",
              }}>{f.label}</button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>{filtered.length} referencias</span>
          {(filterStock || filterNav || cat !== "Todos" || search) && (
            <button onClick={() => { setSearch(""); setCat("Todos"); setFilterStock(false); setFilterNav(false); }} style={{
              fontSize: 11, color: "#3b82f6", background: "none", border: "none",
              cursor: "pointer", padding: "2px 6px", borderRadius: 4,
              fontFamily: "inherit",
            }}>✕ Limpiar filtros</button>
          )}
        </div>

        {/* Product list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(p => (
            <ProductCard key={p.c} p={p} isVendedor={view === "vendedor"} />
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Sin resultados</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Prueba con otro término o categoría</div>
            </div>
          )}
        </div>

        {/* Footer note for distribuidores */}
        {view === "distribuidor" && (
          <div style={{
            marginTop: 32, padding: "14px 18px",
            background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
            fontSize: 12, color: "#64748b", lineHeight: 1.6,
          }}>
            <strong style={{ color: "#1e293b" }}>¿Quieres reservar material?</strong> Contacta a tu asesor Stone Castle con el código y cantidad.
            Las fechas ETA son estimadas y pueden variar. Disp. 1 = primer contenedor en llegar. Disp. 2 = siguiente.
          </div>
        )}
      </div>
    </div>
  );
}
