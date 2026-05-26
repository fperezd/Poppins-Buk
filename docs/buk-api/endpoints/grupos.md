# Grupos

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /groups`

**Listar grupos**

Retorna la lista de grupos disponibles
**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | Cantidad de registros por página |
| `page` | query | integer |  | Número de página |

### Respuestas

- **200** — Lista de grupos

---

## `GET /groups/{id}`

**Mostrar grupo**

Retorna la información de un grupo y sus participantes
**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del grupo |
| `page_size` | query | integer |  | Cantidad de registros por página |
| `page` | query | integer |  | Número de página |

### Respuestas

- **200** — Información del grupo con sus participantes

---
