import { useState, useEffect } from "react";
import { Package, Warehouse, BarChart3, ArrowLeft, Sparkles, Send, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import meupLogo from "@/assets/logo-meup.png";
import SolicitarView from "./SolicitarView";
import BodegaMuestrasView from "./BodegaMuestrasView";
import ReportesView from "./ReportesView";

type PanelTab = "solicitar" | "bodega" | "reportes";

interface Props {
  onBack: () => void;
  asesorPreset?: string;
}

const MuestrasPanel = ({ onBack, asesorPreset }: Props) => {
  const [tab, setTab] = useState<PanelTab>("solicitar");

  const hoy = new Date();
  const [pendientes, setPendientes] = useState(0);
  const [despachadasMes, setDespachadasMes] = useState(0);
  const [refsMes, setRefsMes] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: sols } = await supabase.from("solicitudes_muestras").const { data: sols } = await supabase.from("solicitudes_muestras").select("id, estado, fecha_solicitud");;
      if (!sols) return;
      const esMes = (f: string) => {
        const d = new Date(f);
        return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
      };
      const pend = sols.filter((s) => s.estado === "pendiente").length;
      const delMesIds = sols.filter((s) => esMes(s.created_at)).map((s) => s.id);
      const desp = sols.filter((s) => s.estado === "despachado" && esMes(s.created_at)).length;
      setPendientes(pend);
      setDespachadasMes(desp);
      if (delMesIds.length > 0) {
        const { data: its } = await supabase.from("solicitudes_items").select("id").in("solicitud_id", delMesIds);
        setRefsMes(its?.length ?? 0);
      }
    })();
  }, []);

  const nombre = (asesorPreset || "").split(" ")[0];
  const saludo = hoy.getHours() < 12 ? "Buenos días" : hoy.getHours() < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3 px-5 h-[58px]">
          <div className="bg-card rounded-lg px-2.5 py-1 flex items-center">
            <img src={meupLogo} alt="MeUp" className="h-7" />
          </div>
          <div className="h-7 w-px bg-secondary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider hidden md:inline">
            Solicitud de Muestras
          </span>

          <div className="flex-1" />

          {/* Tabs */}
          <nav className="flex gap-1">
            <TabBtn
              id="solicitar"
              current={tab}
              onClick={setTab}
              icon={<Package className="w-3.5 h-3.5" />}
              label="Solicitar"
            />
            <TabBtn
              id="bodega"
              current={tab}
              onClick={setTab}
              icon={<Warehouse className="w-3.5 h-3.5" />}
              label="Bodega"
              badge={pendientes}
            />
            <TabBtn
              id="reportes"
              current={tab}
              onClick={setTab}
              icon={<BarChart3 className="w-3.5 h-3.5" />}
              label="Reportes"
            />
          </nav>

          <div className="h-7 w-px bg-secondary" />

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inventario</span>
          </button>
        </div>
      </header>

      {/* Welcome strip */}
      <div className="border-b border-border" style={{ background: "var(--gradient-muestras)" }}>
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-[11px] flex items-center justify-center bg-card shadow-sm">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
            </span>
            <div>
              <div className="text-[15px] font-bold text-foreground leading-tight">
                {saludo}
                {nombre ? `, ${nombre}` : ""} 👋
              </div>
              <div className="text-[11px] text-muted-foreground">Arma tu kit de muestras en segundos</div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex gap-2 flex-wrap">
            <MiniKpi icon={<Send className="w-3.5 h-3.5" />} label="Pendientes" value={pendientes} tone="muestra" />
            <MiniKpi
              icon={<Truck className="w-3.5 h-3.5" />}
              label="Despachadas mes"
              value={despachadasMes}
              tone="ficha"
            />
            <MiniKpi icon={<Package className="w-3.5 h-3.5" />} label="Refs. del mes" value={refsMes} tone="pieza" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {tab === "solicitar" && <SolicitarView asesorPreset={asesorPreset} />}
        {tab === "bodega" && <BodegaMuestrasView />}
        {tab === "reportes" && <ReportesView />}
      </div>
    </div>
  );
};

const TONES: Record<string, string> = {
  muestra: "bg-muestra-bg border-muestra-border text-muestra-value",
  ficha: "bg-ficha-bg border-ficha-border text-ficha-value",
  pieza: "bg-pieza-bg border-pieza-border text-pieza-value",
};

function MiniKpi({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-[11px] border shadow-sm ${TONES[tone]}`}>
      {icon}
      <div className="leading-none">
        <div className="text-[16px] font-black font-mono">{value}</div>
        <div className="text-[9.5px] font-bold uppercase tracking-wider opacity-75 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

interface TabBtnProps {
  id: PanelTab;
  current: PanelTab;
  onClick: (t: PanelTab) => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const TabBtn = ({ id, current, onClick, icon, label, badge }: TabBtnProps) => {
  const active = id === current;
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-[0_2px_10px_-2px_hsl(var(--primary)/0.6)]"
          : "text-muted-foreground hover:text-header-foreground hover:bg-secondary/40"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-px rounded-full leading-none animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );
};

export default MuestrasPanel;
