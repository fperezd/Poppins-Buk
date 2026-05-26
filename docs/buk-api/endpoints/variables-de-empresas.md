# Variables de Empresas

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /company_variables/{empresa_id}`

**Listar variables de Empresas**

Retorna todas la variables de Empresas por Empresas registradas en el sistema

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `empresa_id` | path | integer | ✓ | Id de Empresa de la cual se desea listar sus variables de Empresa |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de las variables de Empresas

---
