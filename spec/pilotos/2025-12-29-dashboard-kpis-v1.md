# SPEC (SDD) — Dashboard KPIs (v1.0)

## 1. Contexto
Se necesita una nueva pantalla de KPIs (dashboard) que muestre indicadores
agregados del sistema para dar visibilidad operativa básica.

Los KPIs definidos son:
- Número total de explotaciones.
- Número de crotales registrados por explotación.
- Número de lotes por técnico.

La pantalla debe ser consistente con los datos existentes y soportar filtros
básicos, evitando ambigüedad en las definiciones.

---

## 2. Objetivo (medible)
- O1: Mostrar los 3 KPIs con datos correctos y verificables.
- O2: Tiempo de carga del dashboard ≤ 2 segundos con un dataset típico de staging.
- O3: El cálculo de los KPIs debe ser reproducible (mismos inputs → mismos resultados).

---

## 3. Alcance
Incluye:
- Nueva pantalla “KPIs / Dashboard”.
- Visualización de los 3 KPIs definidos.
- Tabla paginada de crotales por explotación.
- Tabla de lotes por técnico.
- Filtros (v1):
  - Rango de fechas (aplica a crotales y lotes).
  - Técnico (aplica solo a lotes por técnico).
- Endpoint backend para servir los datos agregados.
- Tests unitarios, de integración y smoke test de UI.

---

## 4. No-alcance (v1)
- No incluye gráficas temporales o analíticas avanzadas.
- No incluye exportación (PDF, Excel, CSV).
- No incluye configuración de KPIs por usuario.
- No incluye drill-down a listados detallados.
- No incluye caching avanzado ni optimizaciones complejas.

---

## 5. Definiciones y reglas de negocio

### 5.1 Explotaciones
- El KPI “Número de explotaciones” muestra el **total actual** de explotaciones.
- Este KPI **NO** se ve afectado por filtros de fecha.

### 5.2 Crotales por explotación
- Un crotal registrado es una entidad asociada a una explotación.
- El KPI se presenta como una **tabla completa paginada**.
- El conteo de crotales:
  - Sí respeta el filtro de fechas (por fecha de creación/registro del crotal).
- Columnas mínimas:
  - Identificador o nombre de la explotación.
  - Número de crotales.

### 5.3 Lotes por técnico
- Un lote está asociado a un técnico.
- El KPI muestra una tabla con:
  - Técnico.
  - Número de lotes.
- El conteo:
  - Respeta el filtro de fechas (fecha de creación del lote).
  - Puede filtrarse por técnico concreto.
- La tabla se muestra ordenada por número de lotes descendente.

---

## 6. Criterios de aceptación (CA)

### CA-01 Acceso
Existe una pantalla “KPIs / Dashboard” accesible desde el menú para usuarios autorizados.

### CA-02 KPI Número de explotaciones
El dashboard muestra el número total actual de explotaciones, ignorando cualquier filtro de fechas.

### CA-03 KPI Crotales por explotación
El dashboard muestra una tabla paginada con:
- Explotación.
- Número de crotales.
- Información de paginación (página, tamaño de página, total de filas).

### CA-04 KPI Lotes por técnico
El dashboard muestra una tabla con técnico y número de lotes, ordenada de mayor a menor.

### CA-05 Consistencia de datos
Los valores mostrados en la UI coinciden exactamente con los valores devueltos por el endpoint backend.

### CA-06 Rendimiento
La carga completa del dashboard (API + renderizado) es ≤ 2 segundos en condiciones normales con datos de staging.

### CA-07 Manejo de datos vacíos
Si no hay datos para los filtros aplicados:
- Los KPIs muestran 0 o tablas vacías.
- Se muestra un mensaje “Sin datos para el filtro seleccionado”.
- No se producen errores en la UI.

### CA-08 Seguridad
Un usuario sin permisos no puede acceder ni a la pantalla ni al endpoint del dashboard.

---

## 7. Casos de prueba

| Caso | Precondición | Acción | Resultado esperado |
|------|--------------|--------|--------------------|
| P-01 | Usuario autorizado | Abrir dashboard | La pantalla carga correctamente |
| P-02 | Existen N explotaciones | Ver KPI | El valor mostrado es N |
| P-03 | Explotación con crotales | Ver tabla | Conteo correcto por explotación |
| P-04 | Técnicos con lotes | Ver tabla técnicos | Orden correcto por número de lotes |
| P-05 | Filtro sin datos | Aplicar filtro | KPIs a 0 / tablas vacías sin error |
| P-06 | Usuario sin permisos | Acceder a la ruta | Acceso denegado |
| P-07 | Dataset típico | Abrir dashboard | Tiempo de carga ≤ 2s |

---

## 8. Observabilidad
- Log del endpoint con:
  - Parámetros de filtros aplicados.
  - Tiempo de respuesta.
- Inclusión de `request_id` o identificador de correlación si existe.
