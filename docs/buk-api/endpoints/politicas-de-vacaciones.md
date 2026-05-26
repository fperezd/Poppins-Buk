# Políticas de vacaciones

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /vacation_definitions`

**Listar Políticas de Vacaciones**

Retorna todas las políticas de vacaciones y su tipo de vacación asociado.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Nro de página |

### Respuestas

- **200** — Como respuesta recibimos un listado con las políticas de vacaciones disponibles. → `VacationDefinitionOutput`
- **400** — Existe un error con los datos enviados → `bad_request`

---
