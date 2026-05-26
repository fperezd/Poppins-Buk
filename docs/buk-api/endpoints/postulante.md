# Postulante

**Base path:** `/api/v1/chile`

6 endpoint(s).

## `POST /recruiting/applicants`

**Añadir postulante**

Crea un nuevo postulante.

Para parámetros con valores entre paréntesis de corchetes se debe elegir 1. Ej. document_type

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Postulante` | body |  | ✓ | Parámetros de un postulante |

### Respuestas

- **201** — El postulante creado.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /recruiting/applicants/`

**Listar postulantes**

Retorna el listado de postulantes

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `selection_processes[]` | query | array |  | (OPCIONAL) Ids de los procesos de selección a consultar. (Devuelve los postulantes si estan al menos en un proceso de selección) |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Número de página |

### Respuestas

- **200** — Respuesta con el listado de postulantes consultados
- **404** — No existe el recurso solicitado  
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /recruiting/applicants/search_by_email`

**Mostrar postulante**

Retorna el postulante por medio de su ID o RUT.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `email` | body |  | ✓ | Email de un postulante |

### Respuestas

- **200** — Respuesta con los datos del postulante consultado
- **404** — Postulante no encontrado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /recruiting/applicants/{id}`

**Mostrar postulante**

Retorna el postulante por medio de su ID o RUT.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID o RUT del postulante por el cual se está consultando. El RUT solo es permitido sin puntos, puede ser con o sin el caracter de guión. |

### Respuestas

- **200** — Respuesta con los datos del postulante consultado
- **404** — Postulante no encontrado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /recruiting/applicants/{id}`

**Actualizar postulantes.**

Actualizar un postulante

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del postulante que se está actualizando. |
| `postulante` | body | `ApplicantInput` | ✓ | Parámetros de un postulante. |

### Respuestas

- **200** — Información del postulante actualizada.
- **400** — Existe un error con los datos enviados → `bad_request`
- **404** — No Existe el recurso solicitado

---

## `GET /recruiting/applicants/{id}/applications`

**Listar postulaciones por postulante**

Retorna todas las postulaciones asociadas al postulante, por medio de su ID o RUT.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID o RUT del postulante por el cual se está consultando. El RUT solo es permitido sin puntos, puede ser con o sin el caracter de guión. |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (applications) con la información de las postulaciones por el postulante consultado.
- **400** — Existe un error con los datos enviados → `bad_request`

---
