# Estructuras Contables

**Base path:** `/api/v1/chile`

4 endpoint(s).

## `GET /accounting_structure/assignments`

**Obtener asignaciones de estructuras contables**

Retorna las asignaciones filtradas por empresa_id o accounting_structure_id

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `empresa_id` | query | integer |  | ID de la empresa (requerido si no se proporciona accounting_structure_id) |
| `accounting_structure_id` | query | integer |  | ID de la estructura contable (requerido si no se proporciona empresa_id) |

### Respuestas

- **200** — Asignaciones encontradas exitosamente
- **400** — Parametros faltantes o inválidos
- **404** — Empresa o estructura no encontrada
- **401** — No autorizado - Sin permisos de lectura

---

## `GET /accounting_structure/export`

**Exportar datos contables**

Exporta los datos contables de una asignación. Soporta paginación opcional.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `accounting_structure_assignment_id` | query | integer | ✓ | ID de la asignación de estructura contable |
| `month` | query | integer | ✓ | Mes (1-12) |
| `year` | query | integer | ✓ | Año |
| `page` | query | integer |  | Número de página |
| `page_size` | query | integer |  | Tamaño de página |

### Respuestas

- **200** — Datos contables exportados exitosamente
- **400** — Parametros faltantes o inválidos
- **404** — Asignación no encontrada o variable no encontrada para el periodo especificado
- **401** — No autorizado - Sin permisos de lectura

---

## `GET /accounting_structure/export_process_differences`

**Contabilidad del reproceso con estructura contable**

Obtiene en formato json los datos de la contabilidad por las diferencias generadas en un subproceso a raíz de un reproceso, usando la estructura contable asignada

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `accounting_structure_assignment_id` | query | integer | ✓ | ID de la asignación de estructura contable. OBLIGATORIO |
| `process_id` | query | integer | ✓ | ID del subproceso. OBLIGATORIO |

### Respuestas

- **200** — Retorna la información contable correspondiente al reproceso de remuneraciones, formateada según la estructura contable asignada
- **400** — La petición enviada no cumple con el formato requerido
- **404** — No existe información para los parámetros ingresados
- **401** — No autorizado - Sin permisos de lectura

---

## `GET /accounting_structure/structures`

**Obtener estructuras contables de una empresa**

Retorna las estructuras contables asignadas a una empresa

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `empresa_id` | query | integer | ✓ | ID de la empresa |

### Respuestas

- **200** — Estructuras contables encontradas exitosamente
- **400** — Parametros faltantes o inválidos
- **404** — Empresa no encontrada
- **401** — No autorizado - Sin permisos de lectura

---
