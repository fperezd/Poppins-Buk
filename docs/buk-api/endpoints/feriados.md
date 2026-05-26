# Feriados

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /holidays`

**Listar días feriados**

Retorna todos los feriados registrados en el sistema.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | Obtiene solo los feriados posteriores a esta fecha. Si se omite, se usa por defecto el inicio de año |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las fechas de feriado

---
