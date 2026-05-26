# Flujos de Trabajo

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /workflow/alta/processes`

**Obtener flujos de alta**

Retorna solicitudes de alta de Colaboradores.
**Permisos requeridos para utilizar este endpoint:** 
* Permisos de Workflow en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `status` | query | integer |  | (OPCIONAL) Estado de la solicitud. En Progreso(1), Finalizado(2), Error(4), Cancelado(5) |
| `creation_start_date` | query | string (date) |  | (OPCIONAL) Fecha Creación de la solicitud (Desde), en formato YYYY-MM-DD |
| `creation_end_date` | query | string (date) |  | (OPCIONAL) Fecha Creación de la solicitud (Hasta), en formato YYYY-MM-DD |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Número de página |

### Respuestas

- **200** — Respuesta con los datos de/los flujos de alta
- **404** — Flujos de alta no encontrados
- **400** — Existe un error con los datos enviados → `bad_request`

---
