import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useServerFn } from "@/lib/ofertasApi";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/logo-meup.png";
import { calcularConMotor } from "@/lib/motor.functions";
import { guardarOfertaEnSheet } from "@/lib/oferta.functions";
import { enviarOfertaLarga, guardarOfertaRegistro } from "@/lib/oferta-larga.functions";
import { buscarFotosProductos } from "@/lib/fotos.functions";

import { leerMotorData, refrescarMotorData, calcularPrecioCOP, leerAsesores, type AsesorRow } from "@/lib/catalogo.functions";
import { store, useAppState } from "@/lib/ofertasStore";

interface MotorOfertasViewProps {
  onBack?: () => void;
}

export default function MotorOfertasView({ onBack }: MotorOfertasViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3 px-4 sm:px-5 h-[58px]">
          <div className="bg-card rounded-lg px-2.5 py-1 flex items-center">
            <img src={logo} alt="MeUp" className="h-7" />
          </div>
          <div className="h-7 w-px bg-header-foreground/15" />
          <span className="text-xs text-header-foreground/60 uppercase tracking-wider hidden sm:inline">
            Motor de Oferta
          </span>
          <div className="flex-1" />
          {onBack && (
            <button
              onClick={onBack}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/50 bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.6)] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Portal
            </button>
          )}
        </div>
      </header>
      <Dashboard />
    </div>
  );
}

type TipoOfertaMargen = "Mejor oferta" | "Primera versión" | "Oferta de presupuesto";

type Item = {
  id: string;
  producto: string; // Tipo de producto
  nombreComercial: string;
  espesor: string;
  acabado: string;
  formato: string;
  cantidad: number;
  valorTonelada: number;
  ancho: number;
  advertencia: string;
  // Motor (solo lectura)
  nombreUniversal: string;
  fobUsd: number;
  fobEstado: "vigente" | "extrapolado";
  fobFecha: string;
  fobVigencia: string;
  fobOrigen: string;

  costoCop: number;
  pvpSinIvaBase: number;
  pvpConIvaBase: number;
  margenBase: number;
  // Tipo de oferta + margen aplicado
  tipoOfertaMargen: TipoOfertaMargen | "";
  margen: number;
  margenValidado: boolean;
  // Transporte
  transporteIncluido: "incluido" | "fuera";
  transporteM2: number;
  transporteIvaIncluido: "incluido" | "no-incluido";
  // Precios aplicados (con margen)
  pvpSinIva: number;
  pvpConIva: number;
  // Peso real proveniente de DEMO_PRECIOS_CO (kg/m²)
  pesoMotor: number;
  // Producto nuevo (sin motor) — campos manuales
  pesoManual: number;
  origenManual: string;
  costoManual: number;
  modoPrecioNuevo: "manual" | "costo";
  // Valor crudo digitado en "PVP con IVA" (modo manual), sin redondear
  pvpConIvaManualRaw: number;
};

// Catálogo MeUp → tipo de producto → nombres comerciales disponibles
const CATALOGO: Record<string, string[]> = {
  "Porcelánico": ["MeUp Porcelain Pro", "MeUp Porcelain Lite"],
  "Mármol": ["MeUp Marble Classic", "MeUp Marble Statuario"],
  "Granito": ["MeUp Granite Stone", "MeUp Granite Black"],
  "Borde / Coping": ["MeUp Edge Coping", "MeUp Edge Rounded"],
  "Cuarzo": ["MeUp Quartz Premium", "MeUp Quartz Calacatta"],
  "Travertino": ["MeUp Travertine Natural", "MeUp Travertine Classic"],
};

const PRODUCTO_NUEVO = "Producto nuevo (sin motor)";
const PRODUCTOS = [...Object.keys(CATALOGO), PRODUCTO_NUEVO];
const ESPESORES = ["10", "12", "20", "30"]; // mm
const ACABADOS = ["Pulido", "Apomazado", "Flameado", "Mate"];
const FORMATOS = ["60x60", "60x120", "80x80", "Gran formato"];
const CIUDADES = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];

// Márgenes predefinidos por tipo de oferta (Excel)
const MARGEN_TIPO_OFERTA: Record<TipoOfertaMargen, number> = {
  "Mejor oferta": 35,
  "Primera versión": 45,
  "Oferta de presupuesto": 55,
};
const TIPOS_OFERTA_MARGEN = Object.keys(MARGEN_TIPO_OFERTA) as TipoOfertaMargen[];

const DENSIDAD = 2400; // kg/m3 (estimada)
const TRM = 4000; // COP por USD (referencia motor)
const MARGEN_MIN = 15;
const MARGEN_MAX = 60;

const newItem = (): Item => ({
  id: crypto.randomUUID(),
  producto: "",
  nombreComercial: "",
  espesor: "",
  acabado: "",
  formato: "",
  cantidad: 0,
  valorTonelada: 0,
  ancho: 0,
  advertencia: "",
  nombreUniversal: "",

  fobUsd: 0,
  fobEstado: "vigente",
  fobFecha: "",
  fobVigencia: "",
  fobOrigen: "Fábrica",
  costoCop: 0,
  pvpSinIvaBase: 0,
  pvpConIvaBase: 0,
  margenBase: 25,
  tipoOfertaMargen: "",
  margen: 0,
  margenValidado: false,
  transporteIncluido: "fuera",
  transporteM2: 0,
  transporteIvaIncluido: "no-incluido",
  pvpSinIva: 0,
  pvpConIva: 0,
  pesoMotor: 0,
  pesoManual: 0,
  origenManual: "",
  costoManual: 0,
  modoPrecioNuevo: "manual",
  pvpConIvaManualRaw: 0,
});

const fmt = (n: number) =>
  isFinite(n) ? n.toLocaleString("es-CO", { maximumFractionDigits: 2 }) : "0";

// Redondeo oficial a .900 → CEILING(n - 900, 1000) + 900
const redondear900 = (n: number) => {
  if (!isFinite(n) || n <= 0) return 0;
  return Math.ceil((n - 900) / 1000) * 1000 + 900;
};

// PVP sin IVA con margen real sobre precio: costo / (1 - m/100)
const pvpSinIvaConMargen = (costoCop: number, margenPct: number) => {
  const m = (margenPct || 0) / 100;
  if (!isFinite(costoCop) || costoCop <= 0 || m >= 1) return 0;
  return costoCop / (1 - m);
};

// Al cambiar atributos base del producto se limpian los valores del motor
// para que no quede "pegado" el precio anterior mientras se recalcula.
const RESET_MOTOR = {
  fobUsd: 0,
  fobEstado: undefined,
  fobFecha: "",
  fobVigencia: "",
  costoCop: 0,
  pesoMotor: 0,
  nombreUniversal: "",
  pvpSinIva: 0,
  pvpConIva: 0,
};



// Transporte por m² a partir del valor por tonelada y el peso kg/m²
const transportePorM2 = (pesoKgM2: number, valorTonelada: number) => {
  if (!isFinite(pesoKgM2) || !isFinite(valorTonelada)) return 0;
  return (pesoKgM2 / 1000) * valorTonelada;
};

// Calcula los campos derivados de transporte + totales (lógica oficial)
const buildTransporteCalc = (params: {
  pvpSinIvaMargen: number;
  pvpConIvaMargen: number;
  transporteIncluido: "incluido" | "fuera";
  valorTonelada: number;
  pesoKgM2: number;
  transporteIvaIncluido: "incluido" | "no-incluido";
  cantidad: number;
}) => {
  const { pvpSinIvaMargen, pvpConIvaMargen, transporteIncluido, valorTonelada, pesoKgM2, transporteIvaIncluido, cantidad } = params;
  const transporteM2 = transportePorM2(pesoKgM2, valorTonelada);
  // Cuando transporte está incluido en el precio, el IVA del transporte siempre es "incluido"
  const effectiveIva = transporteIncluido === "incluido" ? "incluido" : transporteIvaIncluido;
  const transporteM2Iva = effectiveIva === "incluido" ? transporteM2 : transporteM2 * 1.19;
  if (transporteIncluido === "incluido") {
    const pvpSinIvaFinal = redondear900(pvpSinIvaMargen + transporteM2);
    const pvpConIvaFinal = pvpSinIvaFinal * 1.19;
    return {
      transporteM2,
      transporteM2Iva,
      pvpSinIvaFinal,
      pvpConIvaFinal,
      precioUnitarioTotal: pvpConIvaFinal,
      totalItem: pvpConIvaFinal * cantidad,
    };
  }
  // Transporte fuera: reajustar PVP sin IVA a .900 al armar la oferta
  const pvpSinIvaFinal = redondear900(pvpSinIvaMargen);
  const pvpConIvaFinal = pvpSinIvaFinal * 1.19;
  const precioUnitarioTotal = pvpConIvaFinal + transporteM2Iva;
  return {
    transporteM2,
    transporteM2Iva,
    pvpSinIvaFinal,
    pvpConIvaFinal,
    precioUnitarioTotal,
    totalItem: pvpConIvaFinal * cantidad + transporteM2Iva * cantidad,
  };
};

const inputCls =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelCls = "text-xs font-medium uppercase tracking-wide text-muted-foreground";

function Dashboard() {
  const [cliente, setCliente] = useState({
    clienteEmpresa: "",
    documento: "",
    tipoDocumento: "NIT",
    genero: "",
    ciudad: "",
    email: "",
    telefono: "",
    proyecto: "",
    direccion: "",
  });
  const [asesor, setAsesor] = useState("");
  const [asesores, setAsesores] = useState<AsesorRow[]>([]);
  const asesorSel = asesores.find((a) => a.asesor_nombre === asesor);
  const asesorData = {
    asesor_nombre: asesorSel?.asesor_nombre ?? asesor,
    asesor_cargo: asesorSel?.asesor_cargo ?? "",
    asesor_cel: asesorSel?.asesor_cel ?? "",
    asesor_email: asesorSel?.asesor_email ?? "",
  };
  const [items, setItems] = useState<Item[]>([newItem()]);
  const [validezMeses, setValidezMeses] = useState<string>("1");
  const [tiempoEntregaDias, setTiempoEntregaDias] = useState<string>("");
  const [tipoOferta, setTipoOferta] = useState<"corta" | "larga">("corta");
  const [ofertaLargaLoading, setOfertaLargaLoading] = useState(false);
  const [ofertaLargaError, setOfertaLargaError] = useState("");
  const [ofertaLargaLinks, setOfertaLargaLinks] = useState<{ word?: string; pdf?: string } | null>(null);
  // Última oferta generada con éxito (habilita "Guardar oferta")
  const [ultimaGenerada, setUltimaGenerada] = useState<{ payload: any; tipo: "corta" | "larga" } | null>(null);
  const [ofertaGuardada, setOfertaGuardada] = useState(false);

  // ---- Persistencia del formulario (sobrevive a navegar a /print y volver) ----
  const DRAFT_KEY = "cotizadorDraft";
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d?.cliente) setCliente(d.cliente);
        if (typeof d?.asesor === "string") setAsesor(d.asesor);
        if (Array.isArray(d?.items) && d.items.length) setItems(d.items);
        if (typeof d?.validezMeses === "string") setValidezMeses(d.validezMeses);
        if (typeof d?.tiempoEntregaDias === "string") setTiempoEntregaDias(d.tiempoEntregaDias);
      }
    } catch {}
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ cliente, asesor, items, validezMeses, tiempoEntregaDias }),
      );
    } catch {}
  }, [draftLoaded, cliente, asesor, items, validezMeses, tiempoEntregaDias]);

  const nuevaOferta = () => {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    setCliente({ clienteEmpresa: "", documento: "", tipoDocumento: "NIT", genero: "", ciudad: "", email: "", telefono: "", proyecto: "", direccion: "" });
    setAsesor("");
    setItems([newItem()]);
    setValidezMeses("1");
    setTiempoEntregaDias("");

    setOfertaLargaError("");
    setOfertaLargaLinks(null);
    setUltimaGenerada(null);
    setOfertaGuardada(false);
    store.setState({ items: [], itemActual: {} } as any);
    toast.success("Formulario limpio para una nueva oferta.");
  };


  const generarOfertaLarga = async () => {
    if (ofertaLargaLoading) return null;
    setOfertaLargaLoading(true);
    setOfertaLargaError("");
    setOfertaLargaLinks(null);

    let payload: any = null;
    try {
      // Mismo motor y mismo objeto que la oferta corta
      const oferta = construirOferta(items, "larga");

      // Fotos principales desde Google Drive (no debe romper el flujo si falla)
      let fotos: Record<string, string[]> = {};
      try {
        const nombres = (oferta.items ?? []).map((it: any) => it.nombreComercial ?? "");
        fotos = await buscarFotosProductos({ data: nombres });
      } catch {
        fotos = {};
      }
      const itemsConFoto = (oferta.items ?? []).map((it: any) => ({
        ...it,
        fotos: fotos[String(it.nombreComercial ?? "").trim()] ?? [],
      }));


      payload = {
        ...oferta,
        items: itemsConFoto,
        cliente_nombre: oferta.cliente?.nombre ?? "",
        cliente_ciudad: oferta.cliente?.ciudad ?? "",
        cliente_direccion: oferta.cliente?.direccion ?? "",
        cliente_email: oferta.cliente?.email ?? "",
        cliente_telefono: oferta.cliente?.telefono ?? "",
        direccion_entrega: cliente.direccion || "",
        proyecto: cliente.proyecto || "",
        asesor_nombre: asesorData.asesor_nombre || (oferta.asesor?.nombre ?? ""),
        asesor_cargo: asesorData.asesor_cargo || "Asesora comercial",
        asesor_cel: asesorData.asesor_cel || (oferta.asesor?.telefono ?? ""),
        asesor_email: asesorData.asesor_email || (oferta.asesor?.email ?? ""),
        ciudad_entrega: cliente.ciudad || "",
        validezMeses: Number(validezMeses) > 0 ? Number(validezMeses) : 1,
        tiempoEntregaDias:
          tiempoEntregaDias.trim() !== "" && Number(tiempoEntregaDias) > 0
            ? Number(tiempoEntregaDias)
            : null,
      };


      const res: any = await enviarOfertaLarga({ data: payload });
      const b = res?.body ?? {};
      const nodo = Array.isArray(b) ? (b[0] ?? {}) : b;
      const word =
        nodo?.links?.word ?? nodo?.word ?? nodo?.word_url ?? nodo?.docx ?? nodo?.wordUrl;
      const pdf = nodo?.links?.pdf ?? nodo?.pdf ?? nodo?.pdf_url ?? nodo?.pdfUrl;

      if (!res?.ok) {
        setOfertaLargaError(`Error del servidor (${res?.status ?? "?"}). Intenta de nuevo.`);
        payload = null;
      } else if (word || pdf) {
        setOfertaLargaLinks({ word, pdf });
        setUltimaGenerada({ payload, tipo: "larga" });
        setOfertaGuardada(false);
      } else {
        setOfertaLargaError(
          "La oferta se envió pero n8n no devolvió los enlaces de descarga (respuesta vacía).",
        );
        payload = null;
      }
    } catch (e: any) {
      setOfertaLargaError(`Error generando la oferta: ${e?.message ?? "desconocido"}`);
      payload = null;
    } finally {
      setOfertaLargaLoading(false);
    }
    return payload;
  };


  const [calculandoId, setCalculandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const construirOferta = (itemsLocales: any[], tipo: "corta" | "larga" = "corta") => {

    const sPrev = store.get();
    store.set("oferta", {
      ...sPrev.oferta,
      cliente: {
        nombre: cliente.clienteEmpresa,
        documento: cliente.documento,
        tipoDocumento: cliente.tipoDocumento,
        genero: cliente.genero,
        ciudad: cliente.ciudad,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
      },
    });

    const s = store.get();
    const itemsStore = itemsLocales;
    const { modalidad, valorTonelada, conIva } = s.oferta.transporte ?? {
      modalidad: "por_fuera" as const,
      valorTonelada: 0,
      conIva: false,
    };
    const retenciones = s.oferta.retenciones ?? 0;

    const itemsCalculados = itemsStore.map((item: any) => {
      const pvpSinIva = item.pvpSinIva ?? item.pvpSinIVA ?? 0;
      // Mismo criterio que calc(): manual para producto nuevo, motor si existe,
      // y fallback por densidad/espesor cuando el motor no trae peso.
      const espMetrosItem = (Number(item.espesor) || 0) / 1000;
      const pesoM2 =
        item.producto === PRODUCTO_NUEVO
          ? Number(item.pesoManual) || 0
          : Number(item.pesoMotor) > 0
            ? Number(item.pesoMotor)
            : Number(item.pesoKgM2) > 0
              ? Number(item.pesoKgM2)
              : DENSIDAD * espMetrosItem;
      const cantidad = item.cantidad ?? 1;
      // Usar la config de transporte del propio item (no la global)
      const itemModalidad: "incluido" | "por_fuera" =
        item.transporteIncluido === "incluido" ? "incluido" : "por_fuera";
      const itemValorTon = item.valorTonelada ?? valorTonelada ?? 0;
      const transpM2Raw = (pesoM2 / 1000) * itemValorTon;

      // Precio unitario final calculado por el motor:
      //  - incluido: pvp + transporte, redondeado a .900
      //  - por_fuera: solo pvp (transporte se muestra aparte)
      const vrUnitario =
        itemModalidad === "incluido"
          ? redondear900(pvpSinIva + transpM2Raw)
          : pvpSinIva;

      const transpM2Display = itemModalidad === "por_fuera" ? transpM2Raw : 0;

      const subtotalProd = vrUnitario * cantidad;
      const subtotalTrans = transpM2Display * cantidad;
      const ivaProducto = subtotalProd * 0.19;
      const itemIvaTransporteFlag = item.transporteIvaIncluido === "incluido";
      const ivaTransporte =
        itemModalidad === "por_fuera" && itemIvaTransporteFlag ? subtotalTrans * 0.19 : 0;
      const totalItem = subtotalProd + subtotalTrans + ivaProducto + ivaTransporte;

      const origenDesc = item.esNuevo && item.origenManual?.trim()
        ? ` · Origen: ${item.origenManual.trim()}`
        : "";
      const nombreItem = String(item.nombreComercial ?? item.nombreMeUp ?? "").trim();
      const normNom = (s: string) =>
        String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
      const cont = ((catalogo as any)?.contenido ?? []).find(
        (c: any) => normNom(c.nombre_meup) === normNom(nombreItem),
      );
      return {
        descripcion: `${item.nombreComercial ?? item.nombreMeUp} · ${item.espesor} · ${item.acabado} · ${item.formato}${origenDesc}`,
        nombreComercial: item.nombreComercial ?? item.nombreMeUp,
        descripcion1: cont?.descripcion_1 ?? "",
        descripcion2: cont?.descripcion_2 ?? "",
        descripcion3: cont?.descripcion_3 ?? "",
        descripcionCompleta: [cont?.descripcion_1, cont?.descripcion_2, cont?.descripcion_3]
          .filter((t: string) => String(t ?? "").trim())
          .join("\n\n"),
        clasificacion: cont?.clasificacion ?? "",
        compresion: cont?.compresion ?? "",
        flexion: cont?.flexion ?? "",
        absorcion: cont?.absorcion ?? "",
        densidad: cont?.densidad ?? "",
        selladoRecomendado: cont?.sellado ?? "",
        usosRecomendados: cont?.usos ?? "",
        adhesivoRecomendado: cont?.adhesivo ?? "",
        fichaTecnica: [
          ["Clasificación", cont?.clasificacion],
          ["Compresión", cont?.compresion],
          ["Flexión", cont?.flexion],
          ["Absorción", cont?.absorcion],
          ["Densidad", cont?.densidad],
          ["Sellado recomendado", cont?.sellado],
          ["Usos recomendados", cont?.usos],
          ["Adhesivo recomendado", cont?.adhesivo],
        ]
          .filter(([, v]) => String(v ?? "").trim())
          .map(([etiqueta, valor]) => ({ etiqueta, valor: String(valor).trim() })),
        espesor: item.espesor,
        acabado: item.acabado,
        formato: item.formato,
        unidad: "Mt2",
        cantidad,
        vrUnitario,
        vrUnitarioConIva: vrUnitario * 1.19,
        transporteM2: transpM2Display,
        transporteM2ConIva: transpM2Display * 1.19,
        vrBruto: subtotalProd,
        subtotalTransporte: subtotalTrans,
        ivaProducto,
        ivaTransporte,
        totalItem,
        pesoKg: pesoM2 * cantidad,
        margen: item.margen ?? 0,
        fobUsdM2: item.fobUsd ?? 0,
        fobEstado: (item.fobEstado ?? "vigente") as "vigente" | "extrapolado",
        costoCOP: item.costoCop ?? 0,
      };
    });

    const subtotalProductosSinIva = itemsCalculados.reduce((a, i) => a + i.vrBruto, 0);
    const subtotalTransporteSinIva = itemsCalculados.reduce(
      (a, i) => a + i.subtotalTransporte,
      0,
    );
    const ivaProductos = itemsCalculados.reduce((a, i) => a + i.ivaProducto, 0);
    const ivaTransporte = itemsCalculados.reduce((a, i) => a + i.ivaTransporte, 0);
    const pesoTotalKg = itemsCalculados.reduce((a, i) => a + i.pesoKg, 0);
    const total =
      subtotalProductosSinIva +
      subtotalTransporteSinIva +
      ivaProductos +
      ivaTransporte -
      retenciones;

    const fecha = new Date().toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const ofertaFinal = {
      ...s.oferta,
      numero: Date.now().toString().slice(-5),
      fecha,
      asesor: {
        nombre: asesorData.asesor_nombre || "Andrea Arboleda",
        cargo: asesorData.asesor_cargo || "Asesora comercial",
        email: asesorData.asesor_email || "andrea@meup.co",
        telefono: asesorData.asesor_cel || "+57 301 416 8588",
      },
      asesor_nombre: asesorData.asesor_nombre || "Andrea Arboleda",
      asesor_cargo: asesorData.asesor_cargo || "Asesora comercial",
      asesor_cel: asesorData.asesor_cel || "+57 301 416 8588",
      asesor_email: asesorData.asesor_email || "andrea@meup.co",
      cliente: s.oferta.cliente,
      items: itemsCalculados,
      totales: {
        subtotalProductosSinIva,
        subtotalTransporteSinIva,
        ivaProductos,
        ivaTransporte,
        retenciones,
        total,
      },
      pesoTotalKg: Math.round(pesoTotalKg),
      tipoOferta: tipo,
    };

    store.set("oferta", ofertaFinal);
    return ofertaFinal;
  };

  const consolidarOferta = (itemsLocales: any[]) => {
    const ofertaFinal = construirOferta(itemsLocales, "corta");
    try {
      localStorage.setItem("ultimaOfertaCorta", JSON.stringify(ofertaFinal));
    } catch {}
    setUltimaGenerada({ payload: ofertaFinal, tipo: "corta" });
    setOfertaGuardada(false);
    navigate("/oferta/imprimir");
  };



  const motorFn = useServerFn(calcularConMotor);
  const guardarOfertaFn = useServerFn(guardarOfertaEnSheet);
  const leerMotorDataFn = useServerFn(leerMotorData);
  const refrescarMotorDataFn = useServerFn(refrescarMotorData);
  const [refrescando, setRefrescando] = useState(false);
  const leerAsesoresFn = useServerFn(leerAsesores);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await leerAsesoresFn();
        if (!cancelled) setAsesores(data ?? []);
      } catch {
        if (!cancelled) setAsesores([]);
      }
    })();
    return () => { cancelled = true; };
  }, [leerAsesoresFn]);
  const motorData = useAppState((s) => s.motorData);
  const catalogoUnificado = useAppState((s) => s.catalogoUnificado);
  const catalogo = motorData;

  // Carga inicial de motorData desde Google Sheets (1 sola llamada)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        console.log("[debug] leerMotorData: llamada iniciada");
        const data = await leerMotorDataFn();
        console.log("[debug] leerMotorData: respuesta", {
          cotizaciones: data.cotizaciones?.length,
          traducciones: data.traducciones?.length,
          demo_precios: data.demo_precios?.length,
          alertas: data.alertas?.length,
        });
        if (cancelled) return;
        // Catálogo unificado: COTIZACIONES (estructura) + DEMO_PRECIOS_CO (costos) + TRADUCCIONES (alias)
        const unificado = (data.cotizaciones ?? []).map((c: any) => {
          // c.nombre_comercial = UniversalName (clave de join)
          // Buscar en DEMO_PRECIOS por nombre_universal (también UniversalName)
          const precio = (data.demo_precios ?? []).find(
            (p: any) =>
              p.nombre_universal === c.nombre_comercial &&
              String(p.espesor_mm) === String(c.espesor_mm) &&
              p.acabado === c.acabado &&
              p.formato === c.formato,
          ) ?? (data.demo_precios ?? []).find(
            (p: any) => p.nombre_universal === c.nombre_comercial,
          );
          // trad.nombre_comercial = UniversalName (join), trad.nombre_universal = NombreMeUp (display)
          const trad = (data.traducciones ?? []).find(
            (t: any) => t.nombre_comercial === c.nombre_comercial,
          );
          return {
            tipo_producto: c.tipo_producto,
            nombre_comercial: trad?.nombre_universal || c.nombre_comercial,  // NombreMeUp para UI
            nombre_universal: c.nombre_comercial,  // UniversalName para referencia
            espesor_mm: String(c.espesor_mm),
            acabado: c.acabado,
            formato: c.formato,
            fob_usd_m2: c.fob_usd_m2 || precio?.fob_usd_m2 || 0,
            fob_estado: (c.fob_estado ?? "vigente") as "vigente" | "extrapolado",
            costo_cop_m2: precio?.costo_cop_m2 ?? 0,
            peso_kg_m2: precio?.peso_kg_m2 ?? 0,
            origen: precio?.origen ?? c.origen ?? "",
            advertencia: precio?.advertencia ?? "",
          };
        });
        console.log("[debug] unificado.length:", unificado.length);
        store.setState({ motorData: data, catalogo: data, catalogoUnificado: unificado });
      } catch (e) {
        console.log("[debug] leerMotorData: error", e);
        const msg = e instanceof Error ? e.message : "No se pudo cargar el catálogo.";
        toast.error(`Catálogo: ${msg}`);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refrescarCatalogo = async () => {
    setRefrescando(true);
    try {
      const data: any = await refrescarMotorDataFn({});
      const unificado = (data.cotizaciones ?? []).map((c: any) => {
        const precio = (data.demo_precios ?? []).find(
          (p: any) =>
            p.nombre_universal === c.nombre_comercial &&
            String(p.espesor_mm) === String(c.espesor_mm) &&
            p.acabado === c.acabado &&
            p.formato === c.formato,
        ) ?? (data.demo_precios ?? []).find((p: any) => p.nombre_universal === c.nombre_comercial);
        const trad = (data.traducciones ?? []).find((t: any) => t.nombre_comercial === c.nombre_comercial);
        return {
          tipo_producto: c.tipo_producto,
          nombre_comercial: trad?.nombre_universal || c.nombre_comercial,
          nombre_universal: c.nombre_comercial,
          espesor_mm: String(c.espesor_mm),
          acabado: c.acabado,
          formato: c.formato,
          fob_usd_m2: c.fob_usd_m2 || precio?.fob_usd_m2 || 0,
          fob_estado: (c.fob_estado ?? "vigente") as "vigente" | "extrapolado",
          costo_cop_m2: precio?.costo_cop_m2 ?? 0,
          peso_kg_m2: precio?.peso_kg_m2 ?? 0,
          origen: precio?.origen ?? c.origen ?? "",
          advertencia: precio?.advertencia ?? "",
        };
      });
      store.setState({ motorData: data, catalogo: data, catalogoUnificado: unificado });
      toast.success(`Catálogo actualizado (${unificado.length} referencias)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo refrescar el catálogo.");
    } finally {
      setRefrescando(false);
    }
  };

  // Carga datos de ejemplo para probar el motor (FOB, Costo, totales, etc.)
  const cargarDatosEjemplo = () => {
    const primerDemo = motorData.demo_precios?.[0];
    const ejemplo: Item = {
      ...newItem(),
      producto: "Granito Losa",
      nombreComercial: "Granito Perla",
      espesor: "1.8cm",
      acabado: "Brillante",
      formato: "40x60 cm",
      cantidad: 120,
      valorTonelada: 180000,
      ancho: 1.2,
      tipoOfertaMargen: "Mejor oferta",
      margen: 30,
      margenValidado: true,
      transporteIncluido: "fuera",
      transporteIvaIncluido: "no-incluido",
    };
    setCliente({
      clienteEmpresa: "Constructora Demo S.A.S.",
      documento: "900.123.456-7",
      tipoDocumento: "NIT",
      genero: "",
      ciudad: "Bogotá",
      email: "demo@constructora.com",
      telefono: "+57 300 123 4567",
      proyecto: "Torre Ejemplo · Piso 12",
      direccion: "Calle 100 #15-20",
    });
    setAsesor("Asesor Demo");
    setItems([ejemplo]);
    toast.success("Datos de ejemplo cargados — el motor calculará automáticamente.");
  };

  const calcularItemConMotor = async (it: Item) => {
    if (!it.producto || !it.nombreComercial || !it.espesor || !it.acabado || !it.formato) {
      toast.error("Completa tipo, nombre comercial, espesor, acabado y formato antes de calcular.");
      return;
    }
    setCalculandoId(it.id);
    try {
      // Catálogo unificado (COTIZACIONES + DEMO_PRECIOS_CO + TRADUCCIONES)
      const unificado = store.get().catalogoUnificado as any[];
      const producto = unificado.find((p) =>
        p.tipo_producto === it.producto &&
        p.nombre_comercial === it.nombreComercial &&
        String(p.espesor_mm) === String(it.espesor) &&
        p.acabado === it.acabado &&
        p.formato === it.formato,
      ) ?? unificado.find((p) =>
        p.tipo_producto === it.producto &&
        p.nombre_comercial === it.nombreComercial,
      );

      // Params (TRM opcional) + alertas
      const trmParam = Number(catalogo.params?.["TRM"]) || TRM;
      const alerta = catalogo.alertas.find((a: any) => {
        const cond = String(a?.condicion ?? "").toLowerCase();
        if (!cond) return false;
        return (
          cond.includes(String(it.producto).toLowerCase()) ||
          cond.includes(String(it.nombreComercial).toLowerCase())
        );
      });

      // Coeficientes del motor (de PARAMS — raramente cambian)
      const CESP: Record<string,number> = {
        "1.0cm":0.90,"1.2cm":1.08,"1.5cm":1.00,"1.8cm":1.00,"2cm":1.12,
        "2.2cm":1.30,"3cm":1.75,"4cm":2.00,"5cm":2.50,"6cm":3.00,"8cm":4.00,"12cm":6.00,
      };
      const CACAB: Record<string,number> = {
        "Pulido":1.00,"Mate":0.96,"Apomazado":0.97,"Cepillado":0.97,"Honed":1.04,
        "Flameado":1.05,"Cepillado+Flameado":1.08,"Abujardado":1.10,"Arenado":1.04,
        "Tumbled":1.10,"Splitface":1.12,
      };
      const CFMT: Record<string,number> = {
        "30x30 cm":1.10,"30x60 cm":1.05,"30xLL":1.00,"32xLL":1.00,
        "40x40 cm":1.05,"40x60 cm":1.00,"40x80 cm":1.05,"40xLL":0.95,
        "40.6xLL":1.00,"40.6x61":1.05,"60x60 cm":1.00,"60x120 cm":1.05,
        "80x80 cm":1.08,"80x80":1.08,"80x160 cm":1.15,"80x160":1.15,
        "30.5xLL":1.05,"30.5x61":1.05,"30.5x100":1.05,"61x122":1.25,
        "15x30":1.10,"20x80":1.10,"7x25":1.15,"5x20":1.20,
        "10x10":1.20,"10x20":1.15,"10x20 cm":1.15,"40x40":1.05,
        "30x100":1.05,"30x50":1.08,"40x50":1.03,"40x100":1.05,"A medida":1.10,
      };
      const M2C: Record<string,number> = {
        "1.0cm":700,"1.2cm":700,"1.5cm":540,"1.8cm":540,
        "2cm":488,"2.2cm":330,"3cm":330,"4cm":250,"5cm":200,"6cm":161,"8cm":121,"12cm":200,
      };
      const DENS: Record<string,number> = {
        "Granito":2750,"Mármol":2700,"Travertino":2400,"Especial":2700,
      };
      const pn = (v: unknown) => {
        const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
        return isFinite(n) ? n : 0;
      };

      // Datos ya cargados en catalogo — sin llamadas extra al Sheet
      const cots  = (catalogo.cotizaciones  ?? []) as any[];
      const trads = (catalogo.traducciones  ?? []) as any[];
      const prms  = (catalogo.params        ?? {}) as Record<string,string>;

      // 1. UniversalName desde Traducciones
      const trad = trads.find((t: any) => t.nombre_universal === it.nombreComercial);
      if (!trad) {
        toast.error(`"${it.nombreComercial}" no encontrado en TRADUCCIONES`);
        return;
      }
      const univName = String(trad.nombre_comercial);

      // 2. Filas del producto en Cotizaciones
      const prodRows = cots.filter((c: any) => c.nombre_comercial === univName);
      if (!prodRows.length) {
        toast.error(`Sin cotización para "${univName}"`);
        return;
      }
      const cotBase   = prodRows[0];
      const origenPais = String(cotBase.origen ?? "");
      const tipoMat   = String(cotBase.tipo_producto ?? "Mármol").split(" ")[0];

      // 3. FOB: combinación exacta o extrapolado con coeficientes
      // Normaliza variantes del Sheet: "60x120" ≡ "60x120 cm", tildes y mayúsculas
      const nrm = (s: unknown) =>
        String(s ?? "")
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s*cm\s*$/, "")
          .replace(/\s+/g, "")
          .trim();
      const exact = prodRows.find((c: any) =>
        nrm(c.espesor_mm) === nrm(it.espesor) && nrm(c.acabado) === nrm(it.acabado) &&
        nrm(c.formato) === nrm(it.formato) && pn(c.fob_usd_m2) > 0
      );
      let fobUsd: number;
      let fobEstado: "vigente" | "extrapolado";
      let fobFecha = "";
      let fobVigencia = "";
      const fmtFechaCorta = (iso: string) => {
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? "");
        return m ? `${m[3]}-${m[2]}-${m[1].slice(2)}` : (iso ?? "");
      };
      if (exact) {
        fobUsd      = pn(exact.fob_usd_m2);
        fobEstado   = "vigente";
        fobFecha    = fmtFechaCorta(String(exact.fecha ?? ""));
        fobVigencia = exact.fob_estado === "vigente" ? "✓ Vigente" : "✗ Vencida";
      } else {
        const conFob   = prodRows.filter((c: any) => pn(c.fob_usd_m2) > 0);
        const vigentes = conFob.filter((c: any) => c.fob_estado === "vigente");
        const pool     = vigentes.length > 0 ? vigentes : conFob;
        if (!pool.length) { toast.error(`Sin precio FOB para "${univName}"`); return; }
        const base     = pool.reduce((b: any, c: any) =>
          pn(c.fob_usd_m2) < pn(b.fob_usd_m2) ? c : b, pool[0]);
        fobUsd =
          pn(base.fob_usd_m2)
          * ((CESP[it.espesor]  ?? 1) / (CESP[String(base.espesor_mm)]  ?? 1))
          * ((CACAB[it.acabado] ?? 1) / (CACAB[String(base.acabado)]    ?? 1))
          * ((CFMT[it.formato]  ?? 1) / (CFMT[String(base.formato)]     ?? 1));
        fobEstado   = "extrapolado";
        fobFecha    = "";
        fobVigencia = "";
      }


      // 4. Costos de transporte desde PARAMS (ya cargados)
      const fleteUSD   = pn(prms[`flete_${origenPais}`]);
      const navieraUSD = pn(prms[`naviera_${origenPais}`]);
      const trm        = pn(prms["TRM"]) || 3800;
      const nac        = pn(prms["Aduana"]) + pn(prms["Portuario"]) +
                         pn(prms["Transporte local"]) + pn(prms["ITR"]);
      const m2c        = M2C[it.espesor] ?? 488;

      if (!fleteUSD) {
        toast.error(`Sin flete para "${origenPais}". Verificar pestaña PARAMS del Sheet.`);
        return;
      }

      // 5. Fórmula CostoCOP (habilidad meup-motor-precios)
      const costoCop = Math.round(
        ((fleteUSD + navieraUSD) / m2c) * trm + nac / m2c + fobUsd * trm
      );

      // 6. Peso kg/m²
      const densidad = DENS[tipoMat] ?? 2700;
      const espCm    = pn(it.espesor);
      const pesoKgM2 = Math.round(densidad * (espCm / 100) * 10) / 10;

      // Recalcular PVP con el margen vigente para que el precio no quede "pegado"
      const margenVigente = it.margen || 0;
      const pvpSinRecalc = margenVigente > 0 ? redondear900(pvpSinIvaConMargen(costoCop, margenVigente)) : 0;
      const pvpConRecalc = pvpSinRecalc > 0 ? pvpSinRecalc * 1.19 : 0;

      updateItem(it.id, {
        nombreUniversal: univName,
        fobUsd: Math.round(fobUsd * 100) / 100,
        fobEstado,
        fobFecha,
        fobVigencia,
        costoCop,
        pesoMotor: pesoKgM2,
        fobOrigen: origenPais,
        advertencia: alerta?.mensaje ?? "",
        ...(margenVigente > 0 ? { pvpSinIva: pvpSinRecalc, pvpConIva: pvpConRecalc } : { pvpSinIva: 0, pvpConIva: 0 }),
      });


      store.set("itemActual", {
        tipo_producto:    it.producto,
        nombre_comercial: it.nombreComercial,
        nombre_universal: univName,
        fob_usd_m2:       Math.round(fobUsd * 100) / 100,
        fob_estado:       fobEstado,
        costo_cop_m2:     costoCop,
        peso_kg_m2:       pesoKgM2,
        origen:           origenPais,
        tipo_material:    tipoMat,
        advertencia:      alerta?.mensaje ?? "",
      });

      const nombreUniversal = univName;
      const origen = origenPais;

      toast.success(`Motor: ${nombreUniversal} · ${origen}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(msg);
    } finally {
      setCalculandoId(null);
    }
  };


  const calc = (it: Item) => {
    const esNuevo = it.producto === PRODUCTO_NUEVO;
    const espMetros = (Number(it.espesor) || 0) / 1000;
    // Peso oficial: DEMO_PRECIOS_CO (it.pesoMotor). Fallback densidad si no hay dato.
    const pesoM2 = esNuevo
      ? (it.pesoManual || 0)
      : (it.pesoMotor > 0 ? it.pesoMotor : DENSIDAD * espMetros);
    const pesoTotal = pesoM2 * it.cantidad;
    const costoCop = it.costoCop || it.fobUsd * TRM;
    const t = buildTransporteCalc({
      pvpSinIvaMargen: it.pvpSinIva,
      pvpConIvaMargen: it.pvpConIva,
      transporteIncluido: it.transporteIncluido,
      valorTonelada: it.valorTonelada,
      pesoKgM2: pesoM2,
      transporteIvaIncluido: it.transporteIvaIncluido,
      cantidad: it.cantidad,
    });
    const transporteTotal = it.transporteIncluido === "fuera" ? t.transporteM2 * it.cantidad : 0;
    return {
      esNuevo, pesoM2, transporteM2: t.transporteM2, transporteM2ConIva: t.transporteM2Iva,
      pesoTotal, transporteTotal, costoCop,
      pvpSinIvaFinal: t.pvpSinIvaFinal,
      pvpConIvaFinal: t.pvpConIvaFinal,
      precioUnitTotalConIva: t.precioUnitarioTotal,
      totalItem: t.totalItem,
    };
  };

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        return { ...it, ...patch };
      }),
    );

  // Auto-ejecutar el motor cuando los campos base estén completos
  // y el producto no sea "Producto nuevo (sin motor)"
  const motorRunRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    items.forEach((it) => {
      if (it.producto === PRODUCTO_NUEVO) return;
      if (!it.producto || !it.nombreComercial || !it.espesor || !it.acabado || !it.formato) return;
      const key = `${it.id}|${it.producto}|${it.nombreComercial}|${it.espesor}|${it.acabado}|${it.formato}`;
      if (motorRunRef.current.has(key)) return;
      if (calculandoId === it.id) return;
      motorRunRef.current.add(key);
      calcularItemConMotor(it);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);


  const totales = useMemo(() => {
    let subtotalSinIva = 0;
    let pesoTotalOferta = 0;
    let transporteFueraSinIva = 0;
    let ivaTransporte = 0;
    items.forEach((it) => {
      const c = calc(it);
      subtotalSinIva += c.pvpSinIvaFinal * it.cantidad;
      pesoTotalOferta += c.pesoTotal;
      if (it.transporteIncluido === "fuera") {
        transporteFueraSinIva += c.transporteTotal;
        // Solo se suma IVA al transporte cuando el item indica "IVA incluido"
        // (es decir, la oferta cobra IVA sobre el transporte).
        // Si está en "no-incluido", el transporte va exento → IVA = 0.
        if (it.transporteIvaIncluido === "incluido") {
          ivaTransporte += c.transporteTotal * 0.19;
        }
      }
    });
    const ivaProductos = subtotalSinIva * 0.19;
    const totalGeneral = subtotalSinIva + transporteFueraSinIva + ivaProductos + ivaTransporte;
    return { subtotalSinIva, pesoTotalOferta, transporteTotalSinIva: transporteFueraSinIva, ivaProductos, ivaTransporte, totalGeneral, allToggleOff: transporteFueraSinIva > 0 };
  }, [items]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="MeUp" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-primary">Motor de Ofertas</h1>
              <p className="text-sm text-muted-foreground">Generador comercial inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={cargarDatosEjemplo}
              className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
            >
              Cargar datos de ejemplo
            </button>
            <span className="hidden rounded-full bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary md:inline">
              v1.0 · MeUp
            </span>
          </div>
        </header>

        <div className="space-y-6">
            {/* BLOQUE 1 — Cliente */}
            <Card title="Datos del Cliente" step="01">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Cliente / Empresa">
                <input className={inputCls} value={cliente.clienteEmpresa}
                  onChange={(e) => setCliente({ ...cliente, clienteEmpresa: e.target.value })} />
              </Field>
              <Field label="Documento">
                <div className="flex gap-2">
                  <select className={`${inputCls} !w-20 shrink-0`} value={cliente.tipoDocumento}
                    onChange={(e) => setCliente({ ...cliente, tipoDocumento: e.target.value })}>
                    <option value="NIT">NIT</option>
                    <option value="CC">CC</option>
                  </select>
                  <input className={inputCls} value={cliente.documento}
                    onChange={(e) => setCliente({ ...cliente, documento: e.target.value })} />
                </div>
              </Field>
              <Field label="Ciudad">
                <input className={inputCls} list="ciudades-list" value={cliente.ciudad}
                  placeholder="Escribe la ciudad…"
                  onChange={(e) => setCliente({ ...cliente, ciudad: e.target.value })} />
                <datalist id="ciudades-list">
                  {CIUDADES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Correo electrónico">
                <input type="email" className={inputCls} value={cliente.email}
                  onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
              </Field>
              <Field label="Teléfono">
                <input type="tel" className={inputCls} value={cliente.telefono}
                  onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Nombre del Proyecto">
                <input className={inputCls} value={cliente.proyecto}
                  onChange={(e) => setCliente({ ...cliente, proyecto: e.target.value })} />
              </Field>
              <Field label="Dirección">
                <input className={inputCls} value={cliente.direccion}
                  onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} />
              </Field>
              <Field label="Asesor">
                <select className={inputCls} value={asesor}
                  onChange={(e) => setAsesor(e.target.value)}>
                  <option value="">Selecciona un asesor…</option>
                  {asesores.map((a) => (
                    <option key={a.asesor_nombre} value={a.asesor_nombre}>{a.asesor_nombre}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Género">
                <select className={inputCls} value={cliente.genero}
                  onChange={(e) => setCliente({ ...cliente, genero: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                </select>
              </Field>
              <Field label="Validez de la oferta (meses)">
                <input type="number" min={1} className={inputCls} value={validezMeses}
                  onChange={(e) => setValidezMeses(e.target.value)} />
              </Field>
              <Field label="Tiempo de entrega (días)">
                <input type="number" min={0} placeholder="60-90 días" className={inputCls}
                  value={tiempoEntregaDias}
                  onChange={(e) => setTiempoEntregaDias(e.target.value)} />
              </Field>
            </div>

          </div>
        </Card>

        {/* BLOQUE 2 — Items */}
        <Card title="Items de la Oferta" step="02"
          action={
            <div className="flex items-center gap-2">
            <button onClick={refrescarCatalogo} disabled={refrescando}
              className="rounded-md border border-[var(--beige)] px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50">
              {refrescando ? "Actualizando…" : "↻ Actualizar catálogo"}
            </button>
            <button onClick={() => {
              const last = items[items.length - 1];
              if (!last) {
                setItems([...items, newItem()]);
                return;
              }
              const baseOk =
                !!last.producto &&
                !!last.nombreComercial &&
                !!last.espesor &&
                !!last.acabado &&
                !!last.formato &&
                last.cantidad > 0;
              const c = calc(last);
              const preciosOk =
                c.pvpConIvaFinal > 0 &&
                c.precioUnitTotalConIva > 0 &&
                c.totalItem > 0;
              if (!baseOk || !preciosOk) {
                toast.error("Completa el ítem actual antes de agregar otro.");
                return;
              }
              setItems([...items, newItem()]);
              toast.success("Nuevo ítem agregado.");
            }}
              className="rounded-md bg-[var(--terracotta)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90">
              + Agregar ítem
            </button>
            </div>
          }>
          <div className="space-y-6">
            {items.map((it, idx) => {
              const c = calc(it);
              const esBorde = it.producto === "Borde / Coping";
              // Fuente única para dropdowns: catalogoUnificado (filtrado por tipo de producto).
              const unif = (catalogoUnificado as any[]) ?? [];
              const tieneCatalogo = unif.length > 0;
              const uniq = <T,>(arr: T[]) =>
                Array.from(new Set(arr.filter((v) => v !== "" && v != null)));
              // Tipos de producto: derivados del catálogo unificado.
              const tiposFromSheet = tieneCatalogo ? uniq(unif.map((p) => p.tipo_producto)) : [];
              const tiposProducto = tieneCatalogo
                ? [...tiposFromSheet, PRODUCTO_NUEVO]
                : PRODUCTOS;
              // Dropdowns filtrados por tipo_producto seleccionado.
              const porTipo = tieneCatalogo && it.producto && it.producto !== PRODUCTO_NUEVO
                ? unif.filter((p) => p.tipo_producto === it.producto)
                : [];
              const nombresComerciales = tieneCatalogo && it.producto !== PRODUCTO_NUEVO
                ? uniq(porTipo.map((p) => p.nombre_comercial))
                : (CATALOGO[it.producto] ?? []);
              // Listas estáticas por categoría de material (según tipo_producto del producto seleccionado).
              const OPCIONES_MATERIAL: Record<string, { esp: string[]; acab: string[]; fmt: string[] }> = {
                Granito: {
                  esp: ["1.8cm", "2cm", "3cm", "6cm", "8cm"],
                  acab: ["Natural", "Mate", "Brillante", "Flameado", "Cepillado+Flameado", "Abujardado", "Cepillado", "Apomazado"],
                  fmt: ["10x20 cm", "30x30 cm", "30x60 cm", "40x40 cm", "40x60 cm", "40x80 cm", "40xLL", "60x60 cm", "60x120 cm", "80x80 cm", "80x160 cm", "A medida"],
                },
                Marmol: {
                  esp: ["1.2cm", "1.5cm", "1.8cm", "2cm", "3cm", "1cm"],
                  acab: ["Natural", "Cepillado", "Mate", "Pulido Mate", "Arenado", "Acid", "Tomboleado", "Brillante", "Flameado", "Cepillado+Flameado"],
                  fmt: ["40xLL", "30xLL", "40.6xLL", "40x60 cm", "40x80 cm", "40.6x61", "30.5x61", "61x122", "60x60 cm", "60x120 cm", "80x80 cm", "80x160 cm", "30x50", "30x100", "40x50", "40x100", "A medida"],
                },
                Travertino: {
                  esp: ["1.2cm", "1.5cm", "2cm", "3cm"],
                  acab: ["Natural", "Tomboleado", "Mate", "Pulido Mate", "Arenado", "Cepillado"],
                  fmt: ["40.6x61", "40.6xLL", "30.5x61", "30xLL", "40xLL", "60x60 cm", "61x122", "60x120 cm", "30x50", "30x100", "40x50", "40x100", "A medida"],
                },
                Especial: {
                  esp: ["1.2cm", "1.5cm", "2cm", "2.2cm", "3cm", "4cm", "5cm", "12cm"],
                  acab: ["Natural", "Mate", "Arenado", "Tomboleado", "Brillante", "Cepillado+Flameado", "Cepillado"],
                  fmt: ["30.5x100", "30.5x61", "15x30", "20x80", "7x25", "5x20", "10x10", "40x40", "30x50", "30x100", "40x50", "40x100", "A medida"],
                },
              };
              const detectarCategoria = (tipoProd: string): keyof typeof OPCIONES_MATERIAL => {
                const t = String(tipoProd ?? "");
                if (!/losa/i.test(t)) {
                  if (t && t !== PRODUCTO_NUEVO) return "Especial";
                }
                if (/granito/i.test(t)) return "Granito";
                if (/m[aá]rmol/i.test(t)) return "Marmol";
                if (/travertino/i.test(t)) return "Travertino";
                return "Especial";
              };
              const categoria = OPCIONES_MATERIAL[detectarCategoria(it.producto)];
              const espesores = categoria.esp;
              const acabados = categoria.acab;
              const formatos = categoria.fmt;
              const espMedida = it.espesor === "A medida" || (!!it.espesor && !espesores.includes(it.espesor));
              const fmtMedida = it.formato === "A medida" || (!!it.formato && !formatos.includes(it.formato));
              const margenOk = it.margen >= MARGEN_MIN && it.margen <= MARGEN_MAX;
              // Cálculos base del motor (derivados de FOB) — margen real sobre precio
              const costoCopBase = it.costoCop || it.fobUsd * TRM;
              const pvpSinIvaBase = redondear900(pvpSinIvaConMargen(costoCopBase, it.margenBase));
              const pvpConIvaBase = pvpSinIvaBase * 1.19;
              // Precios con margen aplicado (recalculan en vivo) — con redondeo .900
              const pvpSinIvaAplicado = redondear900(pvpSinIvaConMargen(costoCopBase, it.margen || 0));
              const pvpConIvaAplicado = pvpSinIvaAplicado * 1.19;
              return (
                <div key={it.id} className="rounded-lg border border-border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      Ítem #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button onClick={() => setItems(items.filter((x) => x.id !== it.id))}
                        className="text-xs font-medium text-[var(--terracotta)] hover:underline">
                        Eliminar
                      </button>
                    )}
                  </div>

                  {/* Selección base */}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                    <Field label="Tipo de producto">
                      <select className={inputCls} value={it.producto}
                        onChange={(e) => updateItem(it.id, { producto: e.target.value, nombreComercial: "", ...RESET_MOTOR })}>
                        <option value="">—</option>
                        {tiposProducto.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="NOMBRE MEUP">
                      {it.producto === PRODUCTO_NUEVO ? (
                        <input type="text" className={inputCls} value={it.nombreComercial}
                          placeholder="Nombre comercial…"
                          onChange={(e) => updateItem(it.id, { nombreComercial: e.target.value })} />
                      ) : (
                        <select className={inputCls} value={it.nombreComercial}
                          disabled={!it.producto}
                          onChange={(e) => updateItem(it.id, { nombreComercial: e.target.value, ...RESET_MOTOR })}>
                          <option value="">—</option>
                          {nombresComerciales.map((n) => <option key={n}>{n}</option>)}
                        </select>
                      )}
                    </Field>
                    <Field label="ESPESOR (CM)">
                      <select className={inputCls} value={espMedida ? "A medida" : it.espesor}
                        onChange={(e) => updateItem(it.id, { espesor: e.target.value, ...RESET_MOTOR })}>
                        <option value="">—</option>
                        {espesores.map((p) => <option key={p}>{p}</option>)}
                        {!espesores.includes("A medida") && <option value="A medida">A medida</option>}
                      </select>
                      {espMedida && (
                        <input type="text" className={inputCls + " mt-1"} placeholder="Ej: 1.8cm"
                          value={it.espesor === "A medida" ? "" : it.espesor}
                          onChange={(e) => updateItem(it.id, { espesor: e.target.value || "A medida", ...RESET_MOTOR })} />
                      )}
                    </Field>
                    <Field label="Acabado">
                      <select className={inputCls} value={it.acabado}
                        onChange={(e) => updateItem(it.id, { acabado: e.target.value, ...RESET_MOTOR })}>
                        <option value="">—</option>
                        {acabados.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Formato">
                      <select className={inputCls} value={fmtMedida ? "A medida" : it.formato}
                        onChange={(e) => updateItem(it.id, { formato: e.target.value, ...RESET_MOTOR })}>
                        <option value="">—</option>
                        {formatos.map((p) => <option key={p}>{p}</option>)}
                        {!formatos.includes("A medida") && <option value="A medida">A medida</option>}
                      </select>
                      {fmtMedida && (
                        <input type="text" className={inputCls + " mt-1"} placeholder="Ej: 45x90 cm"
                          value={it.formato === "A medida" ? "" : it.formato}
                          onChange={(e) => updateItem(it.id, { formato: e.target.value || "A medida", ...RESET_MOTOR })} />
                      )}
                    </Field>
                    <Field label="Cantidad m²">
                      <input type="number" className={inputCls} value={it.cantidad || ""}
                        onChange={(e) => updateItem(it.id, { cantidad: Number(e.target.value) })} />
                    </Field>
                    {esBorde && (
                      <Field label="Ancho (cm)">
                        <input type="number" className={inputCls} value={it.ancho || ""}
                          onChange={(e) => updateItem(it.id, { ancho: Number(e.target.value) })} />
                      </Field>
                    )}
                  </div>

                  {/* 01. Cajita informativa del motor (solo lectura) — oculto para "Producto nuevo" */}
                  {!c.esNuevo && (
                    <div className="mt-4 rounded-lg border-2 border-[var(--beige)] bg-primary/5 p-4">
                      <p className={labelCls + " mb-3 flex items-center gap-2"}>
                        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                        01 · Datos del motor (solo lectura)
                        {calculandoId === it.id && (
                          <span className="ml-2 text-[10px] font-normal text-muted-foreground">Calculando…</span>
                        )}
                      </p>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                        <ReadOnly label="Nombre universal" value={it.nombreUniversal || "—"} />
                        <ReadOnly
                          label="FOB USD/m²"
                          value={
                            it.fobUsd > 0 ? (
                              <span className="flex items-center gap-2 flex-wrap">
                                <span className={it.fobEstado === "extrapolado" ? "text-orange-600" : "text-primary"}>
                                  ${it.fobUsd.toFixed(2)}
                                </span>
                                <span
                                  className={
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium " +
                                    (it.fobEstado === "vigente"
                                      ? "bg-green-100 text-green-700 border border-green-200"
                                      : "bg-amber-100 text-amber-800 border border-amber-200")
                                  }
                                >
                                  {it.fobEstado === "vigente" ? "✓ Lista" : "~ Extrapolado"}
                                </span>
                                {it.fobFecha && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {it.fobFecha} · {it.fobVigencia}
                                  </span>
                                )}
                              </span>
                            ) : (
                              "—"
                            )
                          }
                        />

                        <ReadOnly label="Costo COP/m²" value={`$${fmt(costoCopBase)}`} />
                        <ReadOnly label="Peso kg/m²" value={`${fmt(c.pesoM2)} kg`} />
                        <ReadOnly label="Origen del material" value={it.fobOrigen} />
                      </div>
                    </div>
                  )}

                  {/* 01b. Producto nuevo — inputs manuales (PVP con IVA; el redondeo a .900 se aplica al armar la oferta) */}
                  {c.esNuevo && (() => {
                    const modo = it.modoPrecioNuevo ?? "manual";
                    const setPrecios = (con: number) => {
                      // Guarda el valor crudo digitado y calcula el sin IVA con regla .900
                      const sin = con > 0 ? redondear900(con / 1.19) : 0;
                      const conAjustado = sin > 0 ? sin * 1.19 : 0;
                      updateItem(it.id, { pvpSinIva: sin, pvpConIva: conAjustado, pvpConIvaManualRaw: con });
                      store.setState({
                        itemActual: {
                          ...store.get().itemActual,
                          pvp_con_iva_manual: con,
                          pvp_sin_iva_margen: sin,
                          pvp_con_iva_margen: conAjustado,
                        },
                      });
                    };
                    const recalcDesdeCosto = (costo: number, margenPct: number) => {
                      const sin = redondear900(pvpSinIvaConMargen(costo, margenPct));
                      const con = sin > 0 ? sin * 1.19 : 0;
                      updateItem(it.id, { pvpSinIva: sin, pvpConIva: con, pvpConIvaManualRaw: con });
                      store.setState({
                        itemActual: {
                          ...store.get().itemActual,
                          pvp_con_iva_manual: con,
                          pvp_sin_iva_margen: sin,
                          pvp_con_iva_margen: con,
                        },
                      });
                    };
                    const _nn = (s: any) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
                    const contMatch = ((catalogo as any)?.contenido ?? []).find(
                      (c: any) => _nn(c.nombre_meup) === _nn(it.nombreComercial),
                    );
                    return (
                      <div className="mt-4 rounded-lg border-2 border-dashed border-[var(--beige)] bg-amber-50/40 p-4">
                        <p className={labelCls + " mb-3"}>01 · Producto nuevo (datos manuales)</p>
                        {it.nombreComercial?.trim() && (
                          <p className={`mb-3 text-xs font-semibold ${contMatch ? "text-emerald-700" : "text-amber-700"}`}>
                            {contMatch
                              ? "✓ Descripción y ficha técnica encontradas en el Sheet de contenido"
                              : "⚠ Sin descripción en el Sheet de contenido para este nombre"}
                          </p>
                        )}



                        <div className="mb-3 flex flex-wrap gap-3">
                          {([
                            ["costo", "Calcular desde costo + margen"],
                            ["manual", "Precio manual (PVP)"],
                          ] as const).map(([v, label]) => (
                            <label key={v}
                              onClick={() => {
                                updateItem(it.id, { modoPrecioNuevo: v });
                                if (v === "costo") recalcDesdeCosto(it.costoManual || 0, it.margen || 0);
                              }}
                              className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                                modo === v
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-white text-foreground hover:border-primary"
                              }`}>
                              {label}
                            </label>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          {modo === "costo" && (
                            <>
                              <Field label="Costo (COP/m²)">
                                <input type="number" className={inputCls} value={it.costoManual || ""}
                                  placeholder="Costo del material"
                                  onChange={(e) => {
                                    const costo = Number(e.target.value);
                                    updateItem(it.id, { costoManual: costo, costoCop: costo });
                                    recalcDesdeCosto(costo, it.margen || 0);
                                  }} />
                              </Field>
                              <Field label="Margen aplicado (%)">
                                <input type="number" className={inputCls} value={it.margen || ""}
                                  placeholder="Ej: 35"
                                  onChange={(e) => {
                                    const m = Number(e.target.value);
                                    updateItem(it.id, { margen: m });
                                    recalcDesdeCosto(it.costoManual || 0, m);
                                  }} />
                              </Field>
                            </>
                          )}

                          {modo === "manual" && (
                            <>
                              <Field label="PVP con IVA (COP/m²)">
                                <input type="number" className={inputCls}
                                  value={it.pvpConIvaManualRaw || ""}
                                  placeholder="Precio de venta con IVA"
                                  onChange={(e) => setPrecios(Number(e.target.value))} />
                              </Field>
                              <Field label="PVP sin IVA (.900, calculado)">
                                <input type="number" className={inputCls + " bg-muted cursor-not-allowed"}
                                  value={it.pvpSinIva ? Math.round(it.pvpSinIva) : ""}
                                  readOnly />
                              </Field>
                            </>
                          )}

                          <Field label="Peso kg/m²">
                            <input type="number" className={inputCls} value={it.pesoManual || ""}
                              onChange={(e) => updateItem(it.id, { pesoManual: Number(e.target.value) })} />
                          </Field>
                          <Field label="Origen">
                            <input type="text" className={inputCls} value={it.origenManual}
                              placeholder="Origen del material…"
                              onChange={(e) => updateItem(it.id, { origenManual: e.target.value })} />
                          </Field>
                        </div>

                        {/* Precios con redondeo .900 aplicado en vivo */}
                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Metric highlight label="PVP sin IVA (margen aplicado)" value={`$${fmt(it.pvpSinIva)}`} />
                          <Metric highlight label="PVP con IVA (margen aplicado)" value={`$${fmt(it.pvpConIva)}`} />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          El redondeo a .900 del precio unitario sin IVA se aplica en vivo y al generar la oferta.
                        </p>
                      </div>
                    );
                  })()}


                  {/* 02. Tipo de oferta → Margen sugerido → Margen aplicado → Validación */}
                  <div className="mt-4 rounded-lg border border-border bg-white p-4">
                    <p className={labelCls + " mb-3"}>02 · Tipo de oferta y margen aplicado</p>
                    {(() => {
                      const base = it.tipoOfertaMargen ? MARGEN_TIPO_OFERTA[it.tipoOfertaMargen] : it.margenBase;
                      const rangoMin = Math.max(MARGEN_MIN, base - 5);
                      const rangoMax = Math.min(MARGEN_MAX, base + 5);
                      const rangoTxt = it.tipoOfertaMargen || it.margenBase ? `${rangoMin}% – ${rangoMax}%` : "—";
                      const applyMargen = (m: number, tipo?: TipoOfertaMargen | "") => {
                        const baseCop = it.costoCop || it.fobUsd * TRM;
                        const pvpSin = redondear900(pvpSinIvaConMargen(baseCop, m));
                        const pvpCon = pvpSin * 1.19;
                        const t = buildTransporteCalc({
                          pvpSinIvaMargen: pvpSin,
                          pvpConIvaMargen: pvpCon,
                          transporteIncluido: it.transporteIncluido,
                          valorTonelada: it.valorTonelada,
                          pesoKgM2: c.pesoM2,
                          transporteIvaIncluido: it.transporteIvaIncluido,
                          cantidad: it.cantidad,
                        });
                        updateItem(it.id, {
                          ...(tipo !== undefined ? { tipoOfertaMargen: tipo } : {}),
                          margen: m,
                          pvpSinIva: pvpSin,
                          pvpConIva: pvpCon,
                        });
                        store.setState({
                          itemActual: {
                            ...store.get().itemActual,
                            margen_aplicado: m,
                            pvp_sin_iva_margen: pvpSin,
                            pvp_con_iva_margen: pvpCon,
                            transporte_m2: t.transporteM2,
                            transporte_m2_iva: t.transporteM2Iva,
                            precio_unitario_total: t.precioUnitarioTotal,
                            total_item: t.totalItem,
                          },
                        });
                      };
                      return (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
                          {!c.esNuevo && (
                            <Field label="Tipo de oferta">
                              <select className={inputCls} value={it.tipoOfertaMargen}
                                onChange={(e) => {
                                  const tipo = e.target.value as TipoOfertaMargen | "";
                                  // No se aplica margen automáticamente: el asesor debe escribirlo.
                                  updateItem(it.id, { tipoOfertaMargen: tipo });
                                }}>
                                <option value="">—</option>
                                {TIPOS_OFERTA_MARGEN.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </Field>
                          )}
                          {!c.esNuevo && (
                            <Field label="Margen sugerido (rango)">
                              <input className={inputCls + " bg-muted cursor-not-allowed"} value={rangoTxt} readOnly />
                            </Field>
                          )}
                          {!c.esNuevo && (
                            <Field label="Margen aplicado (%) *">
                              <input type="number" className={inputCls + (it.margen > 0 ? "" : " border-amber-500 animate-pulse-border")}
                                placeholder={base ? `Sugerido: ${base}%` : "Escribe el margen"}
                                value={it.margen || ""}
                                onChange={(e) => applyMargen(Number(e.target.value))} />
                            </Field>
                          )}
                          <div>
                            {margenOk ? (
                              <div className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                                ✓ Validación del margen: OK
                              </div>
                            ) : it.margen > 0 ? (
                              <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                                Fuera de rango ({MARGEN_MIN}–{MARGEN_MAX}%)
                              </div>
                            ) : (
                              <div className="rounded-md border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                                ⚠ Ingresa el margen
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Precios recalculados (en vivo) — solo si NO es producto nuevo */}
                    {!c.esNuevo && (
                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Metric highlight label="PVP sin IVA (margen aplicado)" value={`$${fmt(pvpSinIvaAplicado)}`} />
                        <Metric highlight label="PVP con IVA (margen aplicado)" value={`$${fmt(pvpConIvaAplicado)}`} />
                      </div>
                    )}
                    {(fmtMedida || espMedida) && (
                      <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                        ⚠ Precio referencial — confirmar con fábrica según dimensiones exactas
                      </div>
                    )}
                  </div>


                  {/* 03. Transporte — inputs SIEMPRE visibles */}
                  <div className="mt-4 rounded-lg border border-border bg-white p-4">
                    <p className={labelCls + " mb-3"}>03 · Transporte</p>
                    {(() => {
                      const applyTransporte = (patch: Partial<Item>) => {
                        const next: Item = { ...it, ...patch };
                        // Cuando transporte es incluido, forzar IVA incluido
                        if (patch.transporteIncluido === "incluido") {
                          next.transporteIvaIncluido = "incluido";
                        }
                        const espM = (Number(next.espesor) || 0) / 1000;
                        const pesoNext = next.producto === PRODUCTO_NUEVO ? (next.pesoManual || 0) : DENSIDAD * espM;
                        const t = buildTransporteCalc({
                          pvpSinIvaMargen: next.pvpSinIva,
                          pvpConIvaMargen: next.pvpConIva,
                          transporteIncluido: next.transporteIncluido,
                          valorTonelada: next.valorTonelada,
                          pesoKgM2: pesoNext,
                          transporteIvaIncluido: next.transporteIvaIncluido,
                          cantidad: next.cantidad,
                        });
                        updateItem(it.id, { ...patch, transporteM2: t.transporteM2, transporteIvaIncluido: next.transporteIvaIncluido });
                        store.setState({
                          itemActual: {
                            ...store.get().itemActual,
                            transporte_incluido: next.transporteIncluido,
                            transporte_tonelada: next.valorTonelada,
                            transporte_m2: t.transporteM2,
                            transporte_m2_iva: t.transporteM2Iva,
                            pvp_sin_iva_margen: t.pvpSinIvaFinal,
                            pvp_con_iva_margen: t.pvpConIvaFinal,
                            precio_unitario_total: t.precioUnitarioTotal,
                            total_item: t.totalItem,
                          },
                        });
                      };
                      return (
                        <>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                            <Field label="Transporte">
                              <select className={inputCls} value={it.transporteIncluido}
                                onChange={(e) => applyTransporte({ transporteIncluido: e.target.value as "incluido" | "fuera" })}>
                                <option value="incluido">Transporte incluido en el precio</option>
                                <option value="fuera">Transporte fuera del precio</option>
                              </select>
                            </Field>
                            <Field label="Transporte Ton (Sin IVA)">
                              <input type="number" className={inputCls} value={it.valorTonelada || ""}
                                onChange={(e) => applyTransporte({ valorTonelada: Number(e.target.value) })} />
                            </Field>
                            <Field label="TRANSPORTE POR M² (CALCULADO)">
                              <input className={inputCls + " bg-muted cursor-not-allowed"}
                                value={`$${fmt(c.transporteM2)}`} readOnly />
                            </Field>
                            {it.transporteIncluido === "fuera" && (
                              <Field label="IVA del transporte">
                                <select className={inputCls} value={it.transporteIvaIncluido}
                                  onChange={(e) => applyTransporte({ transporteIvaIncluido: e.target.value as "incluido" | "no-incluido" })}>
                                  <option value="incluido">IVA incluido</option>
                                  <option value="no-incluido">IVA no incluido</option>
                                </select>
                              </Field>
                            )}
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Metric label="Precio unitario sin IVA" value={`$${fmt(it.transporteIncluido === "incluido" ? c.pvpSinIvaFinal : c.pvpSinIvaFinal)}`} />
                            <Metric label="Precio unitario con IVA" value={`$${fmt(it.transporteIncluido === "incluido" ? c.pvpConIvaFinal : c.pvpConIvaFinal)}`} />
                            <Metric highlight label="Total ítem" value={`$${fmt(c.totalItem)}`} />
                          </div>
                        </>
                      );
                    })()}
                  </div>


                  {/* Advertencias — solo si NO es producto nuevo */}
                  {!c.esNuevo && (
                    <div className="mt-4">
                      <p className={labelCls + " mb-2"}>Advertencias del motor</p>
                      <input className={inputCls + " border-dashed text-xs"} placeholder="Sin advertencias…"
                        value={it.advertencia}
                        onChange={(e) => updateItem(it.id, { advertencia: e.target.value })} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
              {/* BLOQUE 3 — Resumen */}
              <Card title="Resumen General" step="03">
          {/* A. Tabla resumen por ítem */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-primary text-left text-xs font-bold uppercase tracking-wide text-primary-foreground">
                <tr>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2 text-right">Precio unit. IVA incl.</th>
                  <th className="px-3 py-2 text-right">Transporte m² IVA incl.</th>
                  <th className="px-3 py-2 text-right">Precio unit. total</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2 text-right">Total por ítem (sin IVA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {items.map((it) => {
                  const c = calc(it);
                  return (
                    <tr key={it.id}>
                      <td className="px-3 py-2 font-semibold">{it.nombreComercial || it.producto || "—"}</td>
                      <td className="px-3 py-2 text-right">${fmt(c.pvpConIvaFinal)}</td>
                      <td className="px-3 py-2 text-right">
                        {it.transporteIncluido === "fuera" ? `$${fmt(c.transporteM2ConIva)}` : (it.transporteIncluido === "incluido" ? "Incluido en precio" : "—")}
                      </td>
                      <td className="px-3 py-2 text-right">${fmt(c.precioUnitTotalConIva)}</td>
                      <td className="px-3 py-2 text-right">{fmt(it.cantidad)}</td>
                      <td className="px-3 py-2 text-right font-bold text-primary">${fmt(c.pvpSinIvaFinal * (it.cantidad || 0))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* B. Totales globales */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Summary label="Peso total oferta" value={`${fmt(totales.pesoTotalOferta)} kg`} inline valueAlign="left" />
            <Summary label="Subtotal productos (sin IVA)" value={`$${fmt(totales.subtotalSinIva)}`} inline />
            <Summary label="Transporte total (sin IVA)"
              value={totales.allToggleOff ? `$${fmt(totales.transporteTotalSinIva)}` : "Incluido en ítems"} inline />
            <Summary label="IVA productos" value={`$${fmt(totales.ivaProductos)}`} inline />
            <Summary label="IVA transporte" value={`$${fmt(totales.ivaTransporte)}`} inline />
            <Summary label="Total general" value={`$${fmt(totales.totalGeneral)}`} highlight inline />
          </div>

          {/* C. Selector tipo oferta */}
          <div className="mt-6 rounded-lg border border-border bg-[var(--beige)]/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className={labelCls}>Tipo de oferta a generar</p>
              <button
                type="button"
                onClick={nuevaOferta}
                className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary">
                Nueva oferta
              </button>
            </div>
            {(() => {
              const itemsSinMargen = items.filter(
                (x) =>
                  !(x.margen > 0) &&
                  !(x.producto === PRODUCTO_NUEVO && (x.pvpConIva > 0 || x.pvpSinIva > 0)),
              );
              const bloqueado = itemsSinMargen.length > 0;
              return (
                <>
                  <div className="flex flex-wrap gap-3">
                    {(["corta", "larga"] as const).map((t) => (
                      <label key={t}
                        onClick={() => {
                          if (bloqueado) {
                            toast.error("Escribe el margen aplicado (%) en todos los ítems antes de generar la oferta.");
                            return;
                          }
                          if (t === "corta") {
                            setTipoOferta("corta");
                            consolidarOferta(items);
                          } else {
                            setTipoOferta("larga");
                            generarOfertaLarga();
                          }
                        }}
                        className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition ${
                          bloqueado
                            ? "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-60"
                            : tipoOferta === t
                            ? "cursor-pointer border-primary bg-primary text-primary-foreground"
                            : "cursor-pointer border-border bg-white text-foreground hover:border-primary"
                        } ${t === "larga" && ofertaLargaLoading ? "pointer-events-none opacity-70" : ""}`}>
                        <input type="radio" name="tipoOferta" className="hidden"
                          checked={tipoOferta === t} onChange={() => setTipoOferta(t)} />
                        {t === "larga" && ofertaLargaLoading ? "Generando oferta..." : `Oferta ${t}`}
                      </label>
                    ))}
                  </div>
                  {bloqueado && (
                    <p className="mt-3 text-sm font-medium text-rose-600">
                      Falta el margen aplicado (%) en {itemsSinMargen.length} ítem(s).
                    </p>
                  )}
                </>
              );
            })()}

            {ofertaLargaError && (
              <p className="mt-3 text-sm font-medium text-red-600">{ofertaLargaError}</p>
            )}


            {ofertaLargaLinks && (
              <div className="mt-3 flex flex-wrap gap-3">
                {ofertaLargaLinks.word && (
                  <a href={ofertaLargaLinks.word} target="_blank" rel="noopener noreferrer"
                    className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10">
                    Descargar Word
                  </a>
                )}
                {ofertaLargaLinks.pdf && (
                  <a href={ofertaLargaLinks.pdf} target="_blank" rel="noopener noreferrer"
                    className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10">
                    Descargar PDF
                  </a>
                )}
              </div>
            )}
          </div>


          {/* D. Botón final */}
          <button
            disabled={guardando || ofertaGuardada}
            onClick={async () => {
              setGuardando(true);
              try {
                // Si la última oferta generada no es larga, primero generamos la oferta larga
                // (igual que si el usuario hubiera presionado "Oferta larga").
                let payload = ultimaGenerada?.tipo === "larga" ? ultimaGenerada.payload : null;
                if (!payload) {
                  payload = await generarOfertaLarga();
                }
                if (!payload) {
                  toast.error("No se pudo generar la oferta larga para guardar.");
                  return;
                }
                const res: any = await guardarOfertaRegistro({
                  data: {
                    ...payload,
                    id_oferta: crypto.randomUUID(),
                    guardadoEn: new Date().toISOString(),
                    proyecto: cliente.proyecto || "",
                    tipoOfertaGenerada: "larga",
                    linkWord: ofertaLargaLinks?.word ?? "",
                    linkPdf: ofertaLargaLinks?.pdf ?? "",
                  },
                });
                if (res?.ok) {
                  setOfertaGuardada(true);
                  toast.success("Oferta guardada en el registro");
                } else {
                  toast.error(`No se pudo guardar la oferta (${res?.status ?? "?"}).`);
                }
                // El formulario NO se limpia aquí: solo con "Nueva oferta".
              } catch (e) {
                const msg = e instanceof Error ? e.message : "Error al guardar la oferta.";
                toast.error(msg);
              } finally {
                setGuardando(false);
              }
            }}
            className="mt-6 w-full rounded-lg bg-primary py-4 text-lg font-black tracking-wide text-primary-foreground shadow-lg transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
            {guardando ? "Guardando…" : ofertaGuardada ? "Oferta guardada ✓" : "Guardar oferta"}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Si aún no has generado la oferta larga, se creará automáticamente al guardar.
          </p>
        </Card>
        </div>
      </div>
    </main>
  );
}

function Card({ title, step, action, children }: { title: string; step: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border-2 border-[var(--beige)] bg-card p-6 shadow-[0_4px_20px_-8px_rgba(36,63,113,0.15)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-[var(--beige)] px-2 py-1 text-xs font-black text-primary">{step}</span>
          <h2 className="text-lg font-black text-primary">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-md border px-3 py-2 ${highlight ? "border-primary bg-primary/5" : "border-border bg-white"}`}>
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function Summary({ label, value, highlight, inline, valueAlign = "right" }: { label: string; value: string; highlight?: boolean; inline?: boolean; valueAlign?: "left" | "right" }) {
  const boxClass = highlight
    ? "rounded-lg border-2 border-[var(--beige)] bg-primary p-5 text-primary-foreground shadow-lg"
    : "rounded-lg border border-border bg-white p-4";
  if (inline) {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-4">
          <div className={`min-w-[180px] text-xs font-medium uppercase tracking-wide ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</div>
          <div className={`flex-1 font-black tabular-nums ${valueAlign === "left" ? "text-left" : "text-right"} ${highlight ? "text-3xl" : "text-xl"}`}>{value}</div>
        </div>
      </div>
    );
  }
  return (
    <div className={boxClass}>
      <div className={`text-xs font-medium uppercase tracking-wide ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</div>
      <div className={`mt-1 font-black ${highlight ? "text-3xl" : "text-xl"}`}>{value}</div>
    </div>
  );
}

function ReadOnly({ label, value, valueClass }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className="rounded-md border border-[var(--beige)] bg-white/70 px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-bold ${valueClass ?? "text-primary"}`}>{value}</div>
    </div>
  );
}
