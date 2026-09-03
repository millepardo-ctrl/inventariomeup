# Rediseño visual del módulo de Muestras

Objetivo: que Muestras se sienta parte de la misma familia visual que Inventario (mismo header oscuro, mismos tokens, misma tipografía y radios), pero con más energía y color para que los asesores lo usen con gusto. Solo cambios visuales: la lógica del carrito, kits, solicitudes y reportes no se toca.

## Cambios propuestos

### 1. Header coherente con Inventario
- Mismo header oscuro de 58px con el logo MeUp en su tarjeta blanca (hoy Muestras no muestra logo).
- Título "SOLICITUD DE MUESTRAS" con el mismo estilo de etiqueta en mayúsculas.
- Botón "← Inventario" convertido en botón con borde suave, igual al de Bodega.
- Pestañas Solicitar / Bodega / Reportes con la píldora activa en color primario y el badge de pendientes en rojo con leve pulso.

### 2. Barra de bienvenida con vida
- Franja bajo el header con saludo al asesor ("Hola, {asesor}") y 3 mini-KPIs en tarjetas de color: referencias en el carrito, solicitudes pendientes, despachadas del mes.
- Fondo con gradiente muy suave derivado de los tokens de marca (no plano blanco).

### 3. Catálogo más alegre y legible
- Las píldoras de categoría pasan a ser chips con color de categoría más presente (fondo tintado + punto de color), tamaño táctil mayor.
- Filas de familia como tarjetas con hover elevado, sombra suave y borde izquierdo de color de categoría más grueso.
- Los chips de referencia usan tokens de categoría en lugar de gris uniforme; al seleccionarse hacen un pequeño "pop" (scale + color lleno).
- La nota de instrucciones (losas/bordes/piezas) se convierte en una tarjeta de ayuda con iconos, colapsable, en vez de texto denso.

### 4. Kits rápidos como tarjetas
- Cada kit pasa a ser una tarjeta pequeña con emoji/icono, nombre y número de referencias que agrega; hover con color de acento.
- "Limpiar todo" separado a la derecha en estilo discreto destructivo.

### 5. Carrito con mejor jerarquía
- Encabezado del carrito con contador grande y resumen por tipo (muestras / fichas / piezas).
- Ítems con borde izquierdo del color de su categoría e íconos por tipo.
- Estado vacío ilustrado (icono + microcopy amable) en lugar de solo texto.
- Botón "Crear solicitud" con gradiente de marca y estado de éxito animado; "Copiar Telegram" secundario.

### 6. Consistencia de tokens (corrección técnica)
- Hoy `SolicitarView` usa clases de color fijas (`bg-blue-50`, `text-emerald-700`, `violet`) que rompen el sistema de diseño. Se reemplazan por nuevos tokens semánticos `--muestra-*`, `--ficha-*`, `--pieza-*` en `index.css` + `tailwind.config.ts`.
- Bodega de Muestras y Reportes se alinean a las mismas tarjetas, badges y tipografía de la vista Bodega de Inventario.

## Detalles técnicos
- Archivos: `src/index.css` (tokens nuevos + gradientes), `tailwind.config.ts` (exponer tokens), `src/components/muestras/MuestrasPanel.tsx` (header, barra de KPIs), `SolicitarView.tsx` (catálogo, kits, carrito, chips), `BodegaMuestrasView.tsx` y `ReportesView.tsx` (tarjetas y badges consistentes).
- Sin cambios en `src/data/muestras-catalog.ts` ni en la lógica de estado; el localStorage y el formato del mensaje de Telegram quedan igual.
- Animaciones ligeras con utilidades Tailwind existentes (transition, scale, pulse); sin nuevas dependencias.
