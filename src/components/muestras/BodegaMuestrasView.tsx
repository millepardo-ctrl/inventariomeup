import { useState, useEffect, useCallback } from "react";
import { Copy, FileDown } from "lucide-react";
import meupLogo from "@/assets/logo-meup.png";
import { supabaseMuestras as supabase } from "@/integrations/supabase/muestras";
import { useToast } from "@/hooks/use-toast";

type Filtro = "pendiente" | "despachado_mes" | "del_mes";

interface Item {
  id: string;
  solicitud_id: string;
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
  items: Item[];
}

const REMITENTE = {
  nombre: "Paris Ingenieros SAS - MeUp",
  nit: "900.570.024-6",
  direccion: "Carrera 37 Calle 124 #400 Bodega 3",
  ciudad: "Barranquilla, Atlántico",
  telefono: "302 2381918",
};

function esMesActual(fecha: string) {
  const d = new Date(fecha);
  const hoy = new Date();
  return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
}

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
    ...s.items.map((it) => {
      const t = it.tipo_pieza === "muestra" ? "muestra 10×15" : it.tipo_pieza === "ficha" ? "ficha grande" : "pieza";
      const acab = it.acabado && it.acabado.trim() ? ` — ${it.acabado}` : "";
      return `• ${it.referencia}${acab} (${t})`;
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
  const logoUrl = meupLogo;

  const itemsHtml = s.items
    .map((it) => {
      const t = it.tipo_pieza === "muestra" ? "Muestra 10×15" : it.tipo_pieza === "ficha" ? "Ficha grande" : "Pieza";
      const acab = it.acabado && it.acabado.trim() ? it.acabado : "—";
      return `<tr><td>${it.referencia || "—"}</td><td>${acab}</td><td>${t}</td><td>${it.cantidad || 1}</td></tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Guía MeUp ${ref}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:Arial,sans-serif; font-size:11px; color:#111; padding:24px; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #111; padding-bottom:12px; margin-bottom:16px; }
  .logo-area { display:flex; align-items:center; gap:10px; }
  .logo-area img { height:40px; object-fit:contain; }
  .brand { font-size:22px; font-weight:900; letter-spacing:-1px; }
  .brand span { color:#2563eb; }
  .ref-box { text-align:right; }
  .ref-box .ref { font-size:20px; font-weight:900; font-family:monospace; }
  .ref-box .lbl { font-size:9px; color:#666; text-transform:uppercase; letter-spacing:1px; }
  .urgente-banner { background:#fef2f2; border:1.5px solid #dc2626; border-radius:6px; padding:6px 12px; text-align:center; font-weight:900; color:#dc2626; font-size:13px; margin-bottom:16px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; }
  .box { border:1px solid #d1d5db; border-radius:6px; padding:10px 14px; }
  .box-title { font-size:9px; text-transform:uppercase; letter-spacing:1px; color:#6b7280; font-weight:700; margin-bottom:8px; border-bottom:1px solid #e5e7eb; padding-bottom:4px; }
  .box p { margin-bottom:3px; line-height:1.5; }
  table { width:100%; border-collapse:collapse; }
  th { background:#f3f4f6; text-align:left; padding:6px 8px; font-size:10px; text-transform:uppercase; letter-spacing:.5px; border-bottom:1.5px solid #d1d5db; }
  td { padding:6px 8px; border-bottom:1px solid #e5e7eb; }
  tr:last-child td { border-bottom:none; }
  .footer { margin-top:16px; text-align:center; font-size:9px; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:10px; }
  @media print { body { padding:12px; } }
</style></head><body>
<div class="header">
  <div class="logo-area">
    <img src="${logoUrl}" alt="MeUp" onerror="this.style.display='none'">
    <div class="brand">Me<span>Up</span></div>
  </div>
  <div class="ref-box">
    <div class="lbl">Referencia</div>
    <div class="ref">${ref}</div>
    <div style="font-size:9px;color:#666;margin-top:2px;">${fecha}</div>
  </div>
</div>
${urgente ? `<div class="urgente-banner">🚨 ENVÍO URGENTE — Atención prioritaria</div>` : ""}
<div class="grid">
  <div class="box">
    <div class="box-title">Remitente</div>
    <p><strong>${REMITENTE.nombre}</strong></p>
    <p>NIT ${REMITENTE.nit}</p>
    <p>${REMITENTE.direccion}</p>
    <p>${REMITENTE.ciudad}</p>
    <p>Cel: ${REMITENTE.telefono}</p>
  </div>
  <div class="box">
    <div class="box-title">Destinatario</div>
    <p><strong>${s.dest_nombre || "—"}</strong></p>
    ${s.dest_cedula ? `<p>CC ${s.dest_cedula}</p>` : ""}
    ${s.dest_empresa ? `<p>${s.dest_empresa}</p>` : ""}
    ${s.dest_direccion ? `<p>${s.dest_direccion}</p>` : ""}
    <p>${[s.dest_ciudad, s.dest_depto].filter(Boolean).join(", ") || "—"}</p>
    ${s.dest_celular ? `<p>Cel: ${s.dest_celular}</p>` : ""}
    ${s.asesor_nombre ? `<p style="margin-top:8px;font-size:10px;color:#6b7280;">Asesor: ${s.asesor_nombre}</p>` : ""}
  </div>
</div>
<div class="box">
  <div class="box-title">Materiales solicitados — ${s.items.length} referencia${s.items.length !== 1 ? "s" : ""}</div>
  <table>
    <thead><tr><th>Referencia</th><th>Acabado</th><th>Tipo</th><th>Cant.</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
</div>
<div class="footer">${REMITENTE.nombre} · NIT ${REMITENTE.nit} · Guía generada el ${fecha}</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }
}

export default function BodegaMuestrasView() {
  const { toast } = useToast();
  const [filtro, setFiltro] = useState<Filtro>("pendiente");
  const [asesorSel, setAsesorSel] = useState("");
  const [ciudadSel, setCiudadSel] = useState("");
  const [orden, setOrden] = useState<"reciente" | "antiguo">("reciente");
  const [lista, setLista] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);


  const cargar = useCallback(async () => {
    setLoading(true);

    // Dos queries separados para evitar problemas con el join automático
    const { data: sols, error: errSols } = await supabase
      .from("solicitudes_muestras")
      .select("*")
      .order("fecha_solicitud", { ascending: true });

    if (errSols || !sols) {
      setLoading(false);
      return;
    }

    const ids = sols.map((s: { id: string }) => s.id);
    const { data: items } = await supabase.from("solicitudes_items").select("*").in("solicitud_id", ids);

    const merged = (sols as unknown as Solicitud[]).map((s) => ({
      ...s,
      items: ((items || []) as unknown as Item[]).filter((it) => it.solicitud_id === s.id),
    }));

    setLista(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filtrada = lista
    .filter((s) => {
      if (filtro === "pendiente") return s.estado === "pendiente";
      if (filtro === "despachado_mes") return s.estado === "despachado" && esMesActual(s.fecha_solicitud);
      if (filtro === "del_mes") return esMesActual(s.fecha_solicitud);
      return true;
    })
    .sort((a, b) => {
      if (a.tipo_envio === "urgente" && b.tipo_envio !== "urgente") return -1;
      if (a.tipo_envio !== "urgente" && b.tipo_envio === "urgente") return 1;
      return new Date(a.fecha_solicitud).getTime() - new Date(b.fecha_solicitud).getTime();
    });

  const counts = {
    pendiente: lista.filter((s) => s.estado === "pendiente").length,
    despachado_mes: lista.filter((s) => s.estado === "despachado" && esMesActual(s.fecha_solicitud)).length,
    del_mes: lista.filter((s) => esMesActual(s.fecha_solicitud)).length,
  };

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

  const FILTROS: { key: Filtro; label: string }[] = [
    { key: "pendiente", label: "Pendientes" },
    { key: "despachado_mes", label: "Despachadas mes" },
    { key: "del_mes", label: "Ref. del mes" },
  ];

  return (
    <div className="max-w-[900px] mx-auto px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-base font-bold text-foreground">Bodega · Alistamiento</h2>
        <div className="flex gap-1">
          {FILTROS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`px-3 py-1 rounded-[8px] text-[11px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                filtro === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              {label}
              <span className={`text-[10px] font-mono px-1 rounded ${filtro === key ? "bg-white/20" : "bg-muted"}`}>
                {counts[key]}
              </span>
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
          <div className="font-semibold">Sin solicitudes en esta vista</div>
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
      className={`bg-card border border-border/60 rounded-xl px-4 py-3.5 flex flex-col gap-2.5 shadow-sm transition-all ${hecho ? "opacity-60" : "hover:shadow-[var(--shadow-lift)]"}`}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: urgente
          ? "hsl(var(--destructive))"
          : hecho
            ? "hsl(var(--cat-travertino))"
            : "hsl(var(--primary))",
      }}
    >
      {/* Nombre + badges + fecha/hora */}
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

      {/* Asesor — debajo de la fila de fecha */}
      <div className="text-[11px] text-muted-foreground">{s.asesor_nombre || "Asesor desconocido"}</div>

      {/* Dirección */}
      {(s.dest_direccion || s.dest_ciudad) && (
        <div className="text-[12px] text-muted-foreground flex gap-1">
          <span>📍</span>
          <span>{[s.dest_direccion, s.dest_ciudad, s.dest_depto].filter(Boolean).join(" · ")}</span>
        </div>
      )}
      {s.dest_celular && <div className="text-[12px] text-muted-foreground">📱 {s.dest_celular}</div>}

      {/* Ítems */}
      <div className="flex flex-col gap-0.5">
        {s.items.map((it, i) => {
          const tipo = it.tipo_pieza || "pieza";
          const acab = it.acabado && it.acabado.trim() ? ` — ${it.acabado}` : "";
          return (
            <div key={i} className="flex items-baseline gap-2 text-[13px]">
              <span className="text-primary text-xs">•</span>
              <span className="text-foreground/80">
                {it.referencia}
                {acab}
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
          title="Copiar mensaje"
          className="flex items-center gap-1 px-3 py-1.5 rounded-[9px] text-xs font-semibold border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary transition-all"
        >
          <Copy className="w-3 h-3" /> Copiar
        </button>
        <button
          onClick={() => onGuia(s)}
          title="Descargar guía PDF"
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
