import { useState, useEffect, useCallback } from "react";
import { Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Filtro = "pendiente" | "despachado" | "todos";

interface Item {
  codigo: string | null;
  referencia: string | null;
  acabado: string | null;
  tipo_pieza: string | null;
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
  tipo_envio: string;
  estado: string;
  created_at: string;
  fecha_despacho: string | null;
  solicitudes_items: Item[];
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
    s.dest_ciudad ? `🏙 ${s.dest_ciudad}` : null,
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
      .order("created_at", { ascending: true });
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
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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
            <SolicitudCard key={s.id} s={s} onDespachar={despachar} onCopiar={copiarTelegram} />
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
}: {
  s: Solicitud;
  onDespachar: (id: string) => void;
  onCopiar: (s: Solicitud) => void;
}) {
  const urgente = s.tipo_envio === "urgente";
  const hecho = s.estado === "despachado";
  const hora = new Date(s.created_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const fecha = new Date(s.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

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

      <div className="text-[12px] text-muted-foreground">
        Asesor: {s.asesor_nombre || "—"}
        {s.dest_celular ? ` · ${s.dest_celular}` : ""}
      </div>
      {(s.dest_direccion || s.dest_ciudad) && (
        <div className="text-[12px] text-muted-foreground flex gap-1">
          <span>📍</span>
          <span>{[s.dest_direccion, s.dest_ciudad].filter(Boolean).join(" · ")}</span>
        </div>
      )}

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

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onCopiar(s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-semibold border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary transition-all"
        >
          <Copy className="w-3 h-3" /> Copiar mensaje
        </button>
        <button
          onClick={() => onDespachar(s.id)}
          disabled={hecho}
          className="flex-1 py-1.5 rounded-[9px] text-primary-foreground text-xs font-bold disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-sm"
          style={hecho ? undefined : { background: "var(--gradient-primary)" }}
        >
          {hecho
            ? `✓ Despachado ${s.fecha_despacho ? new Date(s.fecha_despacho).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : ""}`
            : "Marcar como despachado"}
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
