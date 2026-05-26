# Empresas

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /companies`

**Listar Empresas**

Retorna todas las Empresas registradas en el sistema.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de las Empresas

---
