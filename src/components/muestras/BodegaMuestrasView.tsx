import { useState, useEffect, useCallback } from "react";
import { Copy, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Filtro = "pendiente" | "despachado" | "todos";

interface Item {
  codigo: string | null;
  referencia: string | null;
  acabado: string | null;
  tipo_pieza: string | null;
  cantidad: number | null;
  m2_unitario: number | null;
}

interface Solicitud {
  id: string;
  asesor_nombre: string | null;
  dest_nombre: string | null;
  dest_cedula: string | null;
  dest_celular: string | null;
  dest_empresa: string | null;
  dest_direccion: string | null;
  dest_ciudad: string | null;
  dest_depto: string | null;
  tipo_envio: string;
  estado: string;
  origen: string;
  fecha_solicitud: string;
  fecha_despacho: string | null;
  solicitudes_items: Item[];
}

const REMITENTE = {
  nombre: "MeUp S.A.S.",
  nit: "901.234.567-8",
  direccion: "Calle 10 #5-20, Bodega 3",
  ciudad: "Medellín, Antioquia",
  telefono: "604 444 5566",
};

function generarMensaje(s: Solicitud): string {
  return [
    `*SOLICITUD MUESTRAS MeUp*`,
    `Asesor: ${s.asesor_nombre || "—"}`,
    ``,
    `👤 ${s.dest_nombre || "—"}`,
    s.dest_cedula ? `🪪 Cédula ${s.dest_cedula}` : null,
    s.dest_celular ? `📱 ${s.dest_celular}` : null,
    s.dest_empresa ? `🏢 ${s.dest_empresa}` : null,
    s.dest_direccion ? `📍 ${s.dest_direccion}` : null,
    s.dest_ciudad ? `🏙 ${s.dest_ciudad}${s.dest_depto ? ", " + s.dest_depto : ""}` : null,
    `🚚 ${s.tipo_envio === "urgente" ? "🚨 URGENTE" : "Estándar"}`,
    ``,
    ...s.solicitudes_items.map((it) => {
      const t = it.tipo_pieza === "muestra" ? "muestra 10×15" : it.tipo_pieza === "ficha" ? "ficha grande" : "pieza";
      return `• ${it.referencia}${it.acabado ? ` — ${it.acabado}` : ""} (${t})`;
    }),
  ]
    .filter(Boolean)
    .join("\n");
}

function descargarGuia(s: Solicitud) {
  const ref = s.id.slice(0, 8).toUpperCase();
  const fecha = new Date(s.fecha_solicitud).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const urgente = s.tipo_envio === "urgente";
  const itemsHtml = s.solicitudes_items
    .map((it) => {
      const t = it.tipo_pieza === "muestra" ? "Muestra 10×15" : it.tipo_pieza === "ficha" ? "Ficha grande" : "Pieza";
      return `<tr><td>${it.referencia || "—"}</td><td>${it.acabado || "—"}</td><td>${t}</td><td>${it.cantidad || 1}</td></tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Guía MeUp ${ref}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #111; padding: 20px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 14px; }
  .brand { font-size: 22px; font-weight: 900; letter-spacing: -1px; }
  .brand span { color: #2563eb; }
  .ref-box { text-align: right; }
  .ref-box .ref { font-size: 18px; font-weight: 900; font-family: monospace; }
  .ref-box .lbl { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
  .urgente-banner { background: #fef2f2; border: 1.5px solid #dc2626; border-radius: 6px; padding: 6px 12px; text-align: center; font-weight: 900; color: #dc2626; font-size: 13px; margin-bottom: 14px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
  .box { border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 12px; }
  .box-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 700; margin-bottom: 6px; }
  .box p { margin-bottom: 2px; line-height: 1.5; }
  .box strong { font-weight: 700; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f3f4f6; text-align: left; padding: 5px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: .5px; border-bottom: 1px solid #d1d5db; }
  td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; }
  .footer { margin-top: 14px; text-align: center; font-size: 9px; color: #9ca3af; }
  @media print { body { padding: 10px; } }
</style></head><body>
<div class="header">
  <div class="brand">Me<span>Up</span></div>
  <div class="ref-box">
    <div class="lbl">Ref. solicitud</div>
    <div class="ref">${ref}</div>
    <div style="font-size:9px;color:#666;margin-top:2px;">${fecha}</div>
  </div>
</div>
${urgente ? `<div class="urgente-banner">🚨 ENVÍO URGENTE</div>` : ""}
<div class="grid">
  <div class="box">
    <div class="box-title">Remitente</div>
    <p><strong>${REMITENTE.nombre}</strong></p>
    <p>NIT ${REMITENTE.nit}</p>
    <p>${REMITENTE.direccion}</p>
    <p>${REMITENTE.ciudad}</p>
    <p>Tel: ${REMITENTE.telefono}</p>
  </div>
  <div class="box">
    <div class="box-title">Destinatario</div>
    <p><strong>${s.dest_nombre || "—"}</strong></p>
    ${s.dest_cedula ? `<p>CC ${s.dest_cedula}</p>` : ""}
    ${s.dest_empresa ? `<p>${s.dest_empresa}</p>` : ""}
    ${s.dest_direccion ? `<p>${s.dest_direccion}</p>` : ""}
    <p>${[s.dest_ciudad, s.dest_depto].filter(Boolean).join(", ") || "—"}</p>
    ${s.dest_celular ? `<p>Tel: ${s.dest_celular}</p>` : ""}
    ${s.asesor_nombre ? `<p style="margin-top:6px;font-size:10px;color:#6b7280;">Asesor: ${s.asesor_nombre}</p>` : ""}
  </div>
</div>
<div class="box">
  <div class="box-title">Materiales (${s.solicitudes_items.length} refs)</div>
  <table>
    <thead><tr><th>Referencia</th><th>Acabado</th><th>Tipo</th><th>Cant.</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
</div>
<div class="footer">MeUp · Guía generada automáticamente · ${fecha}</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }
}

export default function BodegaMuestrasView() {
  const { toast } = useToast();
  const [filtro, setFiltro] = useState<Filtro>("pendiente");
  const [lista, setLista] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("solicitudes_muestras")
      .select("*, solicitudes_items(*)")
      .order("fecha_solicitud", { ascending: true });
    if (!error && data) setLista(data as Solicitud[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const hoy = new Date().toDateString();
  const filtrada = lista
    .filter((s) => {
      if (filtro === "pendiente") return s.estado === "pendiente";
      if (filtro === "despachado")
        return s.estado === "despachado" && s.fecha_despacho && new Date(s.fecha_despacho).toDateString() === hoy;
      return true;
    })
    .sort((a, b) => {
      if (a.tipo_envio === "urgente" && b.tipo_envio !== "urgente") return -1;
      if (a.tipo_envio !== "urgente" && b.tipo_envio === "urgente") return 1;
      return new Date(a.fecha_solicitud).getTime() - new Date(b.fecha_solicitud).getTime();
    });

  async function despachar(id: string) {
    const { error } = await supabase
      .from("solicitudes_muestras")
      .update({ estado: "despachado", fecha_despacho: new Date().toISOString() })
      .eq("id", id);
    if (!error) {
      toast({ title: "✓ Despachado", description: "Solicitud marcada como despachada." });
      cargar();
    }
  }

  function copiarTelegram(s: Solicitud) {
    navigator.clipboard
      .writeText(generarMensaje(s))
      .then(() => toast({ title: "Copiado", description: "Mensaje listo para WhatsApp o Telegram." }));
  }

  return (
    <div className="max-w-[900px] mx-auto px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-base font-bold text-foreground">Bodega · Alistamiento</h2>
        <div className="flex gap-1">
          {(["pendiente", "despachado", "todos"] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1 rounded-[8px] text-[11px] font-bold uppercase tracking-wider border transition-all ${
                filtro === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              {f === "pendiente" ? "Pendientes" : f === "despachado" ? "Hoy" : "Todos"}
            </button>
          ))}
        </div>
        <button
          onClick={cargar}
          className="ml-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          ↻ Actualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
      ) : filtrada.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">📦</div>
          <div className="font-semibold">Sin solicitudes{filtro === "pendiente" ? " pendientes" : ""}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrada.map((s) => (
            <SolicitudCard key={s.id} s={s} onDespachar={despachar} onCopiar={copiarTelegram} onGuia={descargarGuia} />
          ))}
        </div>
      )}
    </div>
  );
}

function SolicitudCard({
  s,
  onDespachar,
  onCopiar,
  onGuia,
}: {
  s: Solicitud;
  onDespachar: (id: string) => void;
  onCopiar: (s: Solicitud) => void;
  onGuia: (s: Solicitud) => void;
}) {
  const urgente = s.tipo_envio === "urgente";
  const hecho = s.estado === "despachado";
  const hora = new Date(s.fecha_solicitud).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const fecha = new Date(s.fecha_solicitud).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

  return (
    <div
      className={`bg-card border border-border/60 rounded-xl px-4 py-3.5 flex flex-col gap-2.5 shadow-sm hover:shadow-[var(--shadow-lift)] transition-all ${hecho ? "opacity-60" : ""}`}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: urgente
          ? "hsl(var(--destructive))"
          : hecho
            ? "hsl(var(--cat-travertino))"
            : "hsl(var(--primary))",
      }}
    >
      {/* Header: nombre + badges + fecha */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-[15px] text-foreground">{s.dest_nombre || "Sin nombre"}</span>
        {urgente && <Badge cls="bg-destructive/15 text-destructive border-destructive/20">🚨 Urgente</Badge>}
        <Badge
          cls={
            hecho
              ? "bg-ficha-bg text-ficha-value border-ficha-border"
              : "bg-muestra-bg text-muestra-value border-muestra-border"
          }
        >
          {hecho ? "✓ Despachado" : "Pendiente"}
        </Badge>
        <span className="ml-auto text-[11px] text-muted-foreground font-mono">
          {fecha} {hora}
        </span>
      </div>

      {/* Asesor debajo de la fecha */}
      <div className="text-[11px] text-muted-foreground font-medium">{s.asesor_nombre || "Asesor desconocido"}</div>

      {/* Dirección */}
      {(s.dest_direccion || s.dest_ciudad) && (
        <div className="text-[12px] text-muted-foreground flex gap-1">
          <span>📍</span>
          <span>{[s.dest_direccion, s.dest_ciudad, s.dest_depto].filter(Boolean).join(" · ")}</span>
        </div>
      )}

      {/* Celular */}
      {s.dest_celular && <div className="text-[12px] text-muted-foreground">📱 {s.dest_celular}</div>}

      {/* Items */}
      <div className="flex flex-col gap-0.5">
        {s.solicitudes_items.map((it, i) => {
          const tipo = it.tipo_pieza || "pieza";
          return (
            <div key={i} className="flex items-baseline gap-2 text-[13px]">
              <span className="text-primary text-xs">•</span>
              <span className="text-foreground/80">
                {it.referencia}
                {it.acabado ? ` — ${it.acabado}` : ""}
              </span>
              <span
                className={`text-[11px] font-bold px-1.5 py-px rounded-[5px] ml-auto ${
                  tipo === "muestra"
                    ? "bg-muestra-bg text-muestra-value"
                    : tipo === "ficha"
                      ? "bg-ficha-bg text-ficha-value"
                      : "bg-pieza-bg text-pieza-value"
                }`}
              >
                {tipo === "muestra" ? "muestra 10×15" : tipo === "ficha" ? "ficha" : tipo}
              </span>
            </div>
          );
        })}
      </div>

      {/* Acciones */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onDespachar(s.id)}
          disabled={hecho}
          className="flex-1 py-1.5 rounded-[9px] text-primary-foreground text-xs font-bold disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-sm"
          style={hecho ? undefined : { background: "var(--gradient-primary)" }}
        >
          {hecho
            ? `✓ ${s.fecha_despacho ? new Date(s.fecha_despacho).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : "Despachado"}`
            : "Marcar como despachado"}
        </button>
        <button
          onClick={() => onCopiar(s)}
          title="Copiar mensaje para WhatsApp/Telegram"
          className="flex items-center gap-1 px-3 py-1.5 rounded-[9px] text-xs font-semibold border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary transition-all"
        >
          <Copy className="w-3 h-3" /> Copiar
        </button>
        <button
          onClick={() => onGuia(s)}
          title="Descargar guía de envío (PDF)"
          className="flex items-center gap-1 px-3 py-1.5 rounded-[9px] text-xs font-semibold border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary transition-all"
        >
          <FileDown className="w-3 h-3" /> Guía
        </button>
      </div>
    </div>
  );
}

function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-px rounded-full border uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  );
}
