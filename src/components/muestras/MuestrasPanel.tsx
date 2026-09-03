import { useState } from "react";
import { Package, Warehouse, BarChart3 } from "lucide-react";
import { lsGet } from "@/data/muestras-catalog";
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

  const pendientes = lsGet().filter(s => s.estado === "pendiente").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3 px-5 h-[58px]">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-header-foreground transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            ← Inventario
          </button>
          <div className="h-5 w-px bg-secondary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline">
            Solicitud de Muestras
          </span>

          <div className="flex-1" />

          {/* Tabs */}
          <nav className="flex gap-1">
            <TabBtn id="solicitar" current={tab} onClick={setTab} icon={<Package className="w-3.5 h-3.5" />} label="Solicitar" />
            <TabBtn id="bodega"    current={tab} onClick={setTab} icon={<Warehouse className="w-3.5 h-3.5" />} label="Bodega" badge={pendientes} />
            <TabBtn id="reportes" current={tab} onClick={setTab} icon={<BarChart3 className="w-3.5 h-3.5" />} label="Reportes" />
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        {tab === "solicitar" && <SolicitarView asesorPreset={asesorPreset} />}
        {tab === "bodega"    && <BodegaMuestrasView />}
        {tab === "reportes"  && <ReportesView />}
      </div>
    </div>
  );
};

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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-all ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-header-foreground hover:bg-secondary/40"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-px rounded-full leading-none">
          {badge}
        </span>
      )}
    </button>
  );
};

export default MuestrasPanel;
