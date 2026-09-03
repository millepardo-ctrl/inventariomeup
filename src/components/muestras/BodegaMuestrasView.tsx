import { useState } from "react";
import { lsGet, lsSet, Solicitud } from "@/data/muestras-catalog";
import { useToast } from "@/hooks/use-toast";

type Filtro = "pendiente" | "despachado" | "todos";

export default function BodegaMuestrasView() {
  const { toast } = useToast();
  const [filtro, setFiltro] = useState<Filtro>("pendiente");
  const [tick, setTick] = useState(0);

  const all = lsGet();
  const hoy = new Date().toDateString();

  const lista = all.filter(s => {
    if (filtro === "pendiente")  return s.estado === "pendiente";
    if (filtro === "despachado") return s.estado === "despachado" && s.fechaDespacho && new Date(s.fechaDespacho).toDateString() === hoy;
    return true;
  }).sort((a, b) => {
    if (a.tipoEnvio === "urgente" && b.tipoEnvio !== "urgente") return -1;
    if (a.tipoEnvio !== "urgente" && b.tipoEnvio === "urgente") return 1;
    return new Date(a.fechaSolicitud).getTime() - new Date(b.fechaSolicitud).getTime();
  });

  function despachar(id: string) {
    const data = lsGet();
    const i = data.findIndex(s => s.id === id);
    if (i >= 0 && data[i].estado === "pendiente") {
      data[i].estado = "despachado";
      data[i].fechaDespacho = new Date().toISOString();
      lsSet(data);
      setTick(t => t + 1);
      toast({ title: "✓ Despachado", description: "Solicitud marcada como despachada." });
    }
  }

  return (
    <div className="max-w-[900px] mx-auto px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-base font-bold text-foreground">Bodega · Alistamiento</h2>
        <div className="flex gap-1">
          {(["pendiente","despachado","todos"] as Filtro[]).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-1 rounded-[8px] text-[11px] font-bold uppercase tracking-wider border transition-all ${
                filtro === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
              }`}>
              {f === "pendiente" ? "Pendientes" : f === "despachado" ? "Hoy" : "Todos"}
            </button>
          ))}
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">📦</div>
          <div className="font-semibold">Sin solicitudes{filtro === "pendiente" ? " pendientes" : ""}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map(s => <SolicitudCard key={s.id} s={s} onDespachar={despachar} />)}
        </div>
      )}
    </div>
  );
}

function SolicitudCard({ s, onDespachar }: { s: Solicitud; onDespachar: (id: string) => void }) {
  const urgente = s.tipoEnvio === "urgente";
  const hecho   = s.estado === "despachado";
  const hora    = new Date(s.fechaSolicitud).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const fecha   = new Date(s.fechaSolicitud).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
  const loc     = [s.destinatario.city, s.destinatario.depto].filter(Boolean).join(", ");

  return (
    <div
      className={`bg-card border border-border/60 rounded-xl px-4 py-3.5 flex flex-col gap-2.5 shadow-sm transition-opacity ${hecho ? "opacity-60" : ""}`}
      style={{ borderLeftWidth: 3, borderLeftColor: urgente ? "hsl(var(--destructive))" : hecho ? "hsl(var(--cat-travertino))" : "hsl(var(--primary))" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-[15px] text-foreground">{s.destinatario.nom || "Sin nombre"}</span>
        {urgente && <Badge cls="bg-destructive/15 text-destructive border-destructive/20">🚨 Urgente</Badge>}
        <Badge cls={hecho ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
          {hecho ? "✓ Despachado" : "Pendiente"}
        </Badge>
        <span className="ml-auto text-[11px] text-muted-foreground font-mono">{fecha} {hora}</span>
      </div>

      {/* Meta */}
      <div className="text-[12px] text-muted-foreground">
        Asesor: {s.asesor}{s.destinatario.cel ? ` · ${s.destinatario.cel}` : ""}
      </div>
      {(s.destinatario.dir || loc) && (
        <div className="text-[12px] text-muted-foreground flex gap-1">
          <span>📍</span>
          <span>{[s.destinatario.dir, loc].filter(Boolean).join(" · ")}</span>
        </div>
      )}

      {/* Items */}
      <div className="flex flex-col gap-0.5">
        {s.items.map((it, i) => (
          <div key={i} className="flex items-baseline gap-2 text-[13px]">
            <span className="text-primary text-xs">•</span>
            <span className="text-foreground/80">{it.referencia} — {it.acabado}</span>
            <span className={`text-[11px] font-bold px-1.5 py-px rounded-[5px] ml-auto ${
              it.tipo === "muestra" ? "bg-blue-50 text-blue-700" :
              it.tipo === "ficha"   ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-violet-700"
            }`}>
              {it.tipo === "muestra" ? "muestra 10×15" : it.tipo === "ficha" ? "ficha" : it.acabado}
            </span>
          </div>
        ))}
      </div>

      {/* Action */}
      <button
        onClick={() => onDespachar(s.id)}
        disabled={hecho}
        className="self-start mt-1 px-4 py-1.5 rounded-[9px] bg-primary text-primary-foreground text-xs font-bold disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {hecho
          ? `✓ Despachado ${s.fechaDespacho ? new Date(s.fechaDespacho).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : ""}`
          : "Marcar como despachado"}
      </button>
    </div>
  );
}

function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-px rounded-full border uppercase tracking-wide ${cls}`}>{children}</span>
  );
}
