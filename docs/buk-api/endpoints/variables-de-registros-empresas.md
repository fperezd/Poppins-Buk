# Variables de Registros Empresas

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /company_variable_registries/{id}`

**Listar registros de variables de Empresas**

Retorna todos los registros de variables de Empresas registros por company_variable_registries_id en el sistema.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `id` | path | integer | ✓ | Id de variable Empresa registro de la cual se desea listar. |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de los registros de variables Empresas

---
