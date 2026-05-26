# Postulación

**Base path:** `/api/v1/chile`

3 endpoint(s).

## `GET /recruiting/applications`

**Listar postulaciones**

Mostrar postulación

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `selection_processes[]` | query | array |  | (OPCIONAL) Ids de los procesos de selección a consultar. (Devuelve las postulaciones si estan al menos en un proceso de selección) |
| `application_date` | query | string (date) |  | (OPCIONAL) Indica la fecha de postulación a consultar (Formato YYYY-MM-DD) |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | Nro de página |

### Respuestas

- **200** — Una lista de postulaciones que cumplan con el criterio de búsqueda.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /recruiting/applications`

**Añadir postulaciones**

Crea una postulación

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `application` | body |  | ✓ | Parámetros de una postulación |

### Respuestas

- **201** — 
- **400** — Existe un error con los datos enviados → `bad_request`
- **404** — No Existe el recurso solicitado

---

## `PATCH /recruiting/applications/{id}`

**Actualizar postulaciones**

Actualizar postulación

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | Id de la postulación a actualizar |
| `postulacion` | body | `ApplicationInput` | ✓ | Parámetros de una postulación |

### Respuestas

- **200** — Informacion de la postulación actualizada
- **400** — Existe un error con los datos enviados → `bad_request`
- **404** — No Existe el recurso solicitado

---
