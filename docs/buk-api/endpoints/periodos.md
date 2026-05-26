# Períodos

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /process_periods`

**Listar períodos**

Retorna todos los períodos de la aplicación con sus datos y estado correspondiente.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con todos los períodos de la aplicación

---
