import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PlantillaCorta } from "../components/PlantillaCorta";
import "../styles/oferta.css";
import { useAppState } from "../lib/store";

export const Route = createFileRoute("/print")({
  component: PrintPage,
});

const btn = (bg: string) => ({
  padding: "8px 16px",
  background: bg,
  color: "white",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
});

export default function PrintPage() {
  const ofertaStore = useAppState((s) => s.oferta);
  const [guardada, setGuardada] = useState<any>(null);
  const [verJson, setVerJson] = useState(false);

  useEffect(() => {
    document.title = "Oferta Comercial · MeUp";
    try {
      const raw = localStorage.getItem("ultimaOfertaCorta");
      if (raw) setGuardada(JSON.parse(raw));
    } catch {}
    return () => {
      document.title = "MeUp · Motor de Ofertas";
    };
  }, []);

  const oferta = ofertaStore?.items?.length ? ofertaStore : (guardada ?? ofertaStore);
  const json = JSON.stringify(oferta, null, 2);

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }} className="no-print">
        <button onClick={() => window.history.back()} style={btn("#6b7280")}>
          ← Volver
        </button>
        <button onClick={() => window.print()} style={btn("#1a73e8")}>
          Imprimir PDF
        </button>
        <button onClick={() => setVerJson((v) => !v)} style={btn("#0f766e")}>
          {verJson ? "Ocultar JSON" : "Ver JSON"}
        </button>
        <button onClick={() => navigator.clipboard.writeText(json)} style={btn("#7c3aed")}>
          Copiar JSON
        </button>
        <button
          onClick={() => {
            const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = `oferta-${oferta?.numero || "corta"}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={btn("#b45309")}
        >
          Descargar JSON
        </button>
      </div>

      {verJson && (
        <pre
          className="no-print"
          style={{
            background: "#0f172a",
            color: "#e2e8f0",
            padding: "16px",
            borderRadius: "8px",
            overflow: "auto",
            maxHeight: "500px",
            fontSize: "12px",
            marginBottom: "20px",
          }}
        >
          {json}
        </pre>
      )}

      <PlantillaCorta oferta={oferta} />
    </div>
  );
}


