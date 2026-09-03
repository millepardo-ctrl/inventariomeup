import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
  CAT, CATS_MUESTRAS, CAT_TOKEN, KITS, ASESORES_MUESTRAS, CIUDADES,
  CarritoItem, MuestrasFamilia, TipoMuestra, SolicitudItem,
  lsGet, lsSet,
} from "@/data/muestras-catalog";
import { useToast } from "@/hooks/use-toast";

interface Props { asesorPreset?: string; }

const EMPTY_DEST = { nom:"", ced:"", cel:"", emp:"", dir:"", city:"", depto:"" };

export default function SolicitarView({ asesorPreset }: Props) {
  const { toast } = useToast();
  const [asesor, setAsesor]   = useState(asesorPreset ?? "");
  const [envio, setEnvio]     = useState<"estandar"|"urgente">("estandar");
  const [dest, setDest]       = useState({ ...EMPTY_DEST });
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [cat, setCat]         = useState<string>("Mármol");
  const [srch, setSrch]       = useState("");
  const [cityInput, setCityInput] = useState("");
  const [cityDrop, setCityDrop]   = useState<{c:string;d:string}[]>([]);
  const [dropOpen, setDropOpen]   = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filtered families
  const visible = useMemo(() => {
    const q = srch.trim().toLowerCase();
    if (!q) return CAT.filter(f => f.cat === cat);
    return CAT.filter(f =>
      f.fam.toLowerCase().includes(q) ||
      f.refs.some(r => r.cod.includes(srch.trim()) || r.l.toLowerCase().includes(q))
    );
  }, [cat, srch]);

  // City autocomplete
  function handleCityInput(v: string) {
    setCityInput(v);
    setDest(d => ({ ...d, city: v, depto: "" }));
    if (!v) { setCityDrop([]); setDropOpen(false); return; }
    const matches = CIUDADES.filter(x =>
      x.c.toLowerCase().includes(v.toLowerCase()) || x.d.toLowerCase().includes(v.toLowerCase())
    ).slice(0, 8);
    setCityDrop(matches);
    setDropOpen(matches.length > 0);
  }

  function selectCity(c: string, d: string) {
    setCityInput(c);
    setDest(prev => ({ ...prev, city: c, depto: d }));
    setDropOpen(false);
  }

  // Cart toggle logic
  function toggle(famId: string, refIdx: number, tp: string) {
    setCarrito(prev => {
      const arr = [...prev];
      if (tp === "pieza") {
        const i = arr.findIndex(c => c.familiaId === famId && c.refIdx === refIdx);
        if (i >= 0) arr.splice(i, 1);
        else arr.push({ familiaId: famId, refIdx, tipo: "pieza" });
      } else {
        // losa & borde: cycle none → muestra → ficha → none
        const iM = arr.findIndex(c => c.familiaId === famId && c.refIdx === refIdx && c.tipo === "muestra");
        const iF = arr.findIndex(c => c.familiaId === famId && c.refIdx === refIdx && c.tipo === "ficha");
        if (iM >= 0) arr[iM] = { ...arr[iM], tipo: "ficha" };
        else if (iF >= 0) arr.splice(iF, 1);
        else arr.push({ familiaId: famId, refIdx, tipo: "muestra" });
      }
      return arr;
    });
  }

  function applyKit(key: string) {
    if (key === "clear") { setCarrito([]); return; }
    const items = KITS[key] ?? [];
    setCarrito(prev => {
      const arr = [...prev];
      items.forEach(item => {
        if (!arr.find(c => c.familiaId === item.familiaId && c.refIdx === item.refIdx))
          arr.push({ ...item });
      });
      return arr;
    });
  }

  function removeFromCart(idx: number) {
    setCarrito(prev => prev.filter((_, i) => i !== idx));
  }

  function toggleCartTipo(idx: number) {
    setCarrito(prev => prev.map((it, i) =>
      i === idx ? { ...it, tipo: it.tipo === "muestra" ? "ficha" as TipoMuestra : "muestra" as TipoMuestra } : it
    ));
  }

  function crearSolicitud() {
    const items: SolicitudItem[] = carrito.map(item => {
      const fam = CAT.find(f => f.id === item.familiaId);
      const ref = fam?.refs[item.refIdx];
      return { codigo: ref?.cod ?? "", referencia: fam?.fam ?? "", acabado: ref?.l ?? "", tipo: item.tipo, m2ref: ref?.m2 ?? null };
    });
    const data = lsGet();
    data.push({
      id: Date.now().toString(), asesor, tipoEnvio: envio,
      destinatario: { ...dest }, items, estado: "pendiente",
      fechaSolicitud: new Date().toISOString(), fechaDespacho: null, origen: "panel",
    });
    lsSet(data);
    setCarrito([]);
    setDest({ ...EMPTY_DEST });
    setCityInput("");
    toast({ title: "Solicitud creada", description: `${items.length} referencias enviadas a bodega.` });
  }

  function copyTelegram() {
    const lines = [
      `*SOLICITUD MUESTRAS MeUp*`,
      `Asesor: ${asesor || "—"}`, ``,
      `👤 ${dest.nom || "(destinatario)"}`,
      dest.ced ? `🪪 Cédula ${dest.ced}` : null,
      dest.cel ? `📱 ${dest.cel}` : null,
      dest.emp ? `🏢 ${dest.emp}` : null,
      dest.dir ? `📍 ${dest.dir}` : null,
      dest.city ? `🏙 ${dest.city}${dest.depto ? ", " + dest.depto : ""}` : null,
      `🚚 ${envio === "urgente" ? "🚨 URGENTE" : "Estándar"}`, ``,
      ...carrito.map(item => {
        const fam = CAT.find(f => f.id === item.familiaId);
        const ref = fam?.refs[item.refIdx];
        const t = item.tipo === "muestra" ? "muestra 10×15" : item.tipo === "ficha" ? "ficha grande" : `pieza ${ref?.l}`;
        return `• ${fam?.fam} — ${ref?.l} (${t})`;
      }),
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines).then(() =>
      toast({ title: "Copiado", description: "Mensaje listo para pegar en Telegram." })
    );
  }

  const canCreate = carrito.length > 0 && !!asesor && !!dest.nom;

  return (
    <div className="max-w-[1400px] mx-auto flex gap-0 h-[calc(100vh-58px)]">
      {/* LEFT: form + catalog */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5 border-r border-border">
        {/* Asesor + envío */}
        <section>
          <Label>Asesor y envío</Label>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Asesor">
              <select value={asesor} onChange={e => setAsesor(e.target.value)} className={fieldCls}>
                <option value="">— selecciona —</option>
                {ASESORES_MUESTRAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Tipo de envío">
              <div className="flex gap-2">
                <ToggleBtn active={envio === "estandar"} onClick={() => setEnvio("estandar")}>Estándar</ToggleBtn>
                <ToggleBtn active={envio === "urgente"} urgent onClick={() => setEnvio("urgente")}>🚨 Urgente</ToggleBtn>
              </div>
            </Field>
          </div>
        </section>

        {/* Destinatario */}
        <section>
          <Label>Destinatario</Label>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre completo">
              <input value={dest.nom} onChange={e => setDest(d => ({ ...d, nom: e.target.value }))} className={fieldCls} placeholder="Juan Pablo Jaramillo" />
            </Field>
            <Field label="Cédula">
              <input value={dest.ced} onChange={e => setDest(d => ({ ...d, ced: e.target.value }))} className={fieldCls} placeholder="1035832710" />
            </Field>
            <Field label="Celular">
              <input value={dest.cel} onChange={e => setDest(d => ({ ...d, cel: e.target.value }))} className={fieldCls} type="tel" placeholder="3147720365" />
            </Field>
            <Field label="Empresa / Proyecto">
              <input value={dest.emp} onChange={e => setDest(d => ({ ...d, emp: e.target.value }))} className={fieldCls} placeholder="Opcional" />
            </Field>
            <Field label="Dirección" className="col-span-2">
              <input value={dest.dir} onChange={e => setDest(d => ({ ...d, dir: e.target.value }))} className={fieldCls} placeholder="Carrera 13 #12-26" />
            </Field>
            <Field label="Ciudad">
              <div className="relative" ref={cityRef}>
                <input
                  value={cityInput}
                  onChange={e => handleCityInput(e.target.value)}
                  onFocus={() => cityDrop.length > 0 && setDropOpen(true)}
                  className={fieldCls}
                  placeholder="Buscar ciudad…"
                  autoComplete="off"
                />
                {dropOpen && (
                  <ul className="absolute z-50 top-full mt-1 left-0 right-0 bg-card border border-border rounded-[10px] shadow-lg max-h-48 overflow-y-auto">
                    {cityDrop.map(x => (
                      <li
                        key={x.c + x.d}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent flex gap-2 items-baseline"
                        onMouseDown={() => selectCity(x.c, x.d)}
                      >
                        <span className="font-semibold text-foreground">{x.c}</span>
                        <span className="text-xs text-muted-foreground">{x.d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Field>
            <Field label="Departamento">
              <input value={dest.depto} readOnly className={`${fieldCls} bg-muted text-muted-foreground cursor-default`} placeholder="Auto" />
            </Field>
          </div>
        </section>

        <hr className="border-border" />

        {/* Kits */}
        <section>
          <Label>Kits rápidos</Label>
          <div className="flex flex-wrap gap-2">
            {[
              ["marmol","Kit Mármol"],["travertino","Kit Travertino"],["arquitecto","Kit Arquitecto"],
              ["piscinas","Kit Piscinas"],["fachada","Kit Fachada"],["mayorista","Kit Mayorista"],
            ].map(([k, label]) => (
              <button key={k} onClick={() => applyKit(k)}
                className="px-3 py-1.5 rounded-[9px] text-xs font-semibold border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary hover:bg-accent transition-all">
                {label}
              </button>
            ))}
            <button onClick={() => applyKit("clear")}
              className="px-3 py-1.5 rounded-[9px] text-xs font-semibold border border-dashed border-border bg-card text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/5 transition-all">
              Limpiar todo
            </button>
          </div>
        </section>

        <hr className="border-border" />

        {/* Catalog */}
        <section className="flex-1">
          <Label>Catálogo</Label>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={srch}
              onChange={e => setSrch(e.target.value)}
              placeholder="Buscar por nombre o código…"
              className={`${fieldCls} pl-9`}
            />
          </div>

          {/* Category nav */}
          <div className={`flex flex-wrap gap-1.5 mb-3 ${srch ? "opacity-40 pointer-events-none" : ""}`}>
            {CATS_MUESTRAS.map(c => {
              const tk = CAT_TOKEN[c];
              const active = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)}
                  className="px-2.5 py-1 rounded-[9px] text-[11px] font-bold border transition-all uppercase tracking-wider"
                  style={{
                    borderColor: active ? `hsl(var(--cat-${tk}))` : "hsl(var(--border))",
                    backgroundColor: active ? `hsl(var(--cat-${tk}-bg))` : "hsl(var(--card))",
                    color: active ? `hsl(var(--cat-${tk}-label))` : "hsl(var(--muted-foreground))",
                  }}>
                  {c}
                </button>
              );
            })}
          </div>

          {/* Note */}
          <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
            <strong className="text-foreground/70">Losas:</strong> 1er clic = muestra 10×15 · 2° = ficha · 3° = quitar ·{" "}
            <strong className="text-foreground/70">Bordes:</strong> 1er = muestra · 2° = pieza completa ·{" "}
            <strong className="text-foreground/70">Piezas:</strong> clic para seleccionar
          </p>

          {/* Family rows */}
          <div className="flex flex-col gap-0.5">
            {visible.map(fam => (
              <FamilyRow key={fam.id} fam={fam} carrito={carrito} toggle={toggle} showCat={!!srch} />
            ))}
            {visible.length === 0 && (
              <p className="text-center py-8 text-muted-foreground text-sm">Sin resultados</p>
            )}
          </div>
        </section>
      </div>

      {/* RIGHT: cart */}
      <aside className="w-[310px] flex-shrink-0 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-background">
        <div className="bg-card rounded-xl border border-border flex flex-col flex-1">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Solicitud</span>
            {carrito.length > 0 && (
              <span className="ml-auto bg-primary/15 text-primary text-[11px] font-bold px-2 py-px rounded-full">{carrito.length}</span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 max-h-[calc(100vh-260px)]">
            {carrito.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-xs leading-relaxed">
                Selecciona productos<br />del catálogo o elige un kit
              </p>
            ) : (
              carrito.map((item, i) => {
                const fam = CAT.find(f => f.id === item.familiaId);
                const ref = fam?.refs[item.refIdx];
                if (!fam || !ref) return null;
                const isBorde = fam.tp === "borde";
                const badgeLabel = item.tipo === "pieza"
                  ? ref.l
                  : item.tipo === "muestra" ? "10×15"
                  : isBorde ? ref.l : "Ficha";
                return (
                  <div key={i} className="flex items-start gap-2 py-2.5 border-b border-border/60 last:border-none">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-foreground leading-tight">{fam.fam}</div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{ref.l} · {ref.cod}</div>
                    </div>
                    {item.tipo === "pieza" ? (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] flex-shrink-0 ${chipCls("pieza")}`}>{badgeLabel}</span>
                    ) : (
                      <button
                        onClick={() => toggleCartTipo(i)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] flex-shrink-0 cursor-pointer transition-all ${chipCls(item.tipo)}`}
                      >{badgeLabel}</button>
                    )}
                    <button onClick={() => removeFromCart(i)} className="text-muted-foreground hover:text-destructive transition-colors text-base leading-none flex-shrink-0 mt-0.5">×</button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button onClick={copyTelegram} disabled={carrito.length === 0}
          className="w-full py-2 rounded-[10px] border border-border bg-card text-muted-foreground text-sm font-semibold disabled:opacity-30 hover:border-primary hover:text-primary transition-all">
          Copiar Telegram
        </button>
        <button onClick={crearSolicitud} disabled={!canCreate}
          className="w-full py-2.5 rounded-[10px] bg-primary text-primary-foreground text-sm font-bold disabled:opacity-30 hover:opacity-90 transition-opacity shadow-sm">
          Crear solicitud →
        </button>
      </aside>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface FamilyRowProps {
  fam: MuestrasFamilia;
  carrito: CarritoItem[];
  toggle: (id: string, idx: number, tp: string) => void;
  showCat: boolean;
}

function FamilyRow({ fam, carrito, toggle, showCat }: FamilyRowProps) {
  const tk = CAT_TOKEN[fam.cat] ?? "marmol";
  return (
    <div
      className="flex items-center gap-2 flex-wrap py-2 px-3 rounded-[9px] bg-card border border-border/60 hover:bg-accent/40 transition-colors"
      style={{ borderLeftWidth: 3, borderLeftColor: `hsl(var(--cat-${tk}))` }}
    >
      {showCat && (
        <span className="text-[10px] font-bold px-2 py-px rounded-full flex-shrink-0"
          style={{ background: `hsl(var(--cat-${tk}-bg))`, color: `hsl(var(--cat-${tk}-label))` }}>
          {fam.cat}
        </span>
      )}
      <span className="text-[13px] font-semibold text-foreground flex-1 min-w-[120px]">{fam.fam}</span>
      {(fam.tp === "pieza" || fam.tp === "borde") && (
        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-px rounded-full flex-shrink-0">
          {fam.tp}
        </span>
      )}
      <div className="flex gap-1.5 flex-wrap">
        {fam.refs.map((ref, idx) => {
          const inM = carrito.find(c => c.familiaId === fam.id && c.refIdx === idx && c.tipo === "muestra");
          const inF = carrito.find(c => c.familiaId === fam.id && c.refIdx === idx && c.tipo === "ficha");
          const inP = carrito.find(c => c.familiaId === fam.id && c.refIdx === idx && c.tipo === "pieza");
          let label = ref.l;
          let cls = "bg-muted text-muted-foreground border-transparent hover:border-primary hover:text-primary";
          if (fam.tp === "pieza") {
            if (inP) { label += " ✓"; cls = chipCls("pieza"); }
          } else if (fam.tp === "borde") {
            if (inM) { label += " ·10×15"; cls = chipCls("muestra"); }
            else if (inF) { label += " ·pieza"; cls = chipCls("ficha"); }
          } else {
            if (inM) { label += " ·m"; cls = chipCls("muestra"); }
            else if (inF) { label += " ·f"; cls = chipCls("ficha"); }
          }
          return (
            <button key={idx} onClick={() => toggle(fam.id, idx, fam.tp)} title={`Cód: ${ref.cod}`}
              className={`px-2.5 py-1 rounded-[7px] text-[12px] font-semibold border transition-all whitespace-nowrap ${cls}`}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function chipCls(tipo: string) {
  if (tipo === "muestra") return "bg-blue-50 text-blue-700 border-blue-300";
  if (tipo === "ficha")   return "bg-emerald-50 text-emerald-700 border-emerald-300";
  return "bg-violet-50 text-violet-700 border-violet-300";
}

const fieldCls = "w-full bg-muted/50 border border-border rounded-[9px] px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-muted-foreground";

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{children}</p>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function ToggleBtn({ active, urgent, onClick, children }: { active: boolean; urgent?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-2 rounded-[9px] text-[12px] font-semibold border transition-all ${
        active
          ? urgent ? "border-destructive bg-destructive/10 text-destructive" : "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground"
      }`}>
      {children}
    </button>
  );
}
