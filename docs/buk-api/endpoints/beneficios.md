# Beneficios

**Base path:** `/api/v1/chile`

3 endpoint(s).

## `GET /benefits/benefit_requests`

**Lista todas las solicitudes de beneficios**

Este endpoint devuelve todas las solicitudes de beneficios


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de beneficios en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `status` | query | string |  | (OPCIONAL) Estado de la solicitud. Valores permitidos: in_process, approved, rejected, pre_approved, incomplete, cancel_request, canceled |
| `person_id` | query | integer |  | (OPCIONAL) ID de la persona que solicitó el beneficio. Se utiliza para filtrar solicitudes de una persona específica |
| `available_version_id` | query | integer |  | (OPCIONAL) ID de la versión específica del beneficio solicitado. |
| `requested_at_from` | query | string (date) |  | (OPCIONAL) Fecha desde la cual filtrar las solicitudes (formato: YYYY-MM-DD). Permite buscar solicitudes realizadas a partir de una fecha específica |
| `requested_at_to` | query | string (date) |  | (OPCIONAL) Fecha hasta la cual filtrar las solicitudes (formato: YYYY-MM-DD). Permite buscar solicitudes realizadas hasta una fecha específica |
| `page` | query | integer |  | (OPCIONAL) Número de página para la paginación de resultados. Por defecto es 1 si no se especifica |
| `per_page` | query | integer |  | (OPCIONAL) Cantidad de registros por página (máximo 100). Por defecto es 25 si no se especifica |
| `sort_by` | query | string |  | (OPCIONAL) Campo por el cual ordenar los resultados. Valores permitidos: id, person_id, approver_id, available_version_id, status, points_cost, requested_at, status_date, created_at |
| `sort_order` | query | string |  | (OPCIONAL) Dirección del ordenamiento. Valores permitidos: asc (ascendente), desc (descendente). Por defecto es desc |

### Respuestas

- **200** — Lista de solicitudes de beneficios

---

## `GET /benefits/benefit_requests/{id}`

**Obtiene una solicitud de beneficio específica**

Este endpoint devuelve una solicitud de beneficio según su ID


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de beneficios en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la solicitud de beneficio |

### Respuestas

- **200** — Solicitud de beneficio
- **404** — La solicitud de beneficio no fue encontrada

---

## `GET /benefits/benefit_versions/{id}`

**Obtiene información de una versión de beneficio**

Retorna la información de una versión de beneficio específica

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de beneficios en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la versión de beneficio |

### Respuestas

- **200** — Información de la versión de beneficio
- **404** — Versión de beneficio no encontrada

---
