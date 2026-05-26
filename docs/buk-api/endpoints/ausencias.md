# Ausencias

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /absences`

**Listar inasistencias**

Retorna las inasistencias de cada tipo registradas en el sistema en un rango de fechas(opcional).

Los tipos de inasistencia son:

  - licence: Para una licencia Médica
  - absence: Para una inasistencia no justificada
  - leave: Para un permiso sin goce de sueldo
  - paid_leave: Para un permiso con goce de sueldo

Las fechas deben estar en formato YYYY-MM-DD.

Los filtros por tipo y fecha son opcionales.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | Fecha de inicio del rango en formato YYYY-MM-DD. |
| `to` | query | string (date) |  | Fecha de término del rango en formato YYYY-MM-DD. |
| `type` | query | string |  | Tipo de inasistencia |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las inasistencias

---
