import { useSyncExternalStore } from "react";

export type AppState = {
  itemActual: Record<string, any>;
  items: any[];
  oferta: {
    numero: string;
    fecha: string;
    asesor: { nombre: string; email: string; telefono: string };
    cliente: { nombre: string; documento: string; tipoDocumento: string; genero: string; ciudad: string; email: string; telefono: string; direccion: string };
    items: any[];
    totales: {
      subtotalProductosSinIva: number;
      subtotalTransporteSinIva: number;
      ivaProductos: number;
      ivaTransporte: number;
      retenciones: number;
      total: number;
    };
    pesoTotalKg: number;
    tipoOferta: "corta" | "larga";
    transporte: {
      modalidad: "incluido" | "por_fuera";
      valorTonelada: number;
      conIva: boolean;
    };
    retenciones: number;
  };
  historial: any[];
  catalogo: {
    params: Record<string, string>;
    cotizaciones: any[];
    traducciones: any[];
    demo_precios: any[];
    alertas: any[];
  };
  motorData: {
    params: Record<string, string>;
    cotizaciones: any[];
    traducciones: any[];
    demo_precios: any[];
    alertas: any[];
  };
  catalogoUnificado: any[];
};

const initialState: AppState = {
  itemActual: {},
  items: [],
  oferta: {
    numero: "",
    fecha: "",
    asesor: { nombre: "", email: "", telefono: "" },
    cliente: { nombre: "", documento: "", tipoDocumento: "NIT", genero: "", ciudad: "", email: "", telefono: "", direccion: "" },
    items: [],
    totales: {
      subtotalProductosSinIva: 0,
      subtotalTransporteSinIva: 0,
      ivaProductos: 0,
      ivaTransporte: 0,
      retenciones: 0,
      total: 0,
    },
    pesoTotalKg: 0,
    tipoOferta: "corta",
    transporte: {
      modalidad: "incluido",
      valorTonelada: 0,
      conIva: true,
    },
    retenciones: 0,
  },
  historial: [],
  catalogo: {
    params: {},
    cotizaciones: [],
    traducciones: [],
    demo_precios: [],
    alertas: [],
  },
  motorData: {
    params: {},
    cotizaciones: [],
    traducciones: [],
    demo_precios: [],
    alertas: [],
  },
  catalogoUnificado: [],
};

let state: AppState = initialState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  set: <K extends keyof AppState>(key: K, value: AppState[K]) => {
    state = { ...state, [key]: value };
    emit();
  },
  setState: (patch: Partial<AppState>) => {
    state = { ...state, ...patch };
    emit();
  },
  reset: () => {
    state = initialState;
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector(initialState),
  );
}
