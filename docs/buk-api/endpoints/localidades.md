# Localidades

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /locations`

**Mostrar localidades**

Recibimos la información relacionada a las localidades de un país dada una profundidad

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `depth` | query | integer |  | Profundidad |
| `page_size` | query | integer |  | Tamaño de la página |
| `page` | query | integer |  | Nro de página |

### Respuestas

- **200** — Como respuesta recibimos la información correspondiente a las localidades que cumplan con los criterios de profundidad proporcionados. → `Location::Minimal`

---

## `GET /locations/{id}`

**Mostrar localidad**

Recibimos la información relacionada a una localidad cuyo ID enviamos en la consulta

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la localidad  |

### Respuestas

- **200** — Como respuesta recibimos la información correspondiente a la localidad y el padre al cual pertenece (en caso de que tenga alguno) recursivamente. Un padre será tambien una localidad, por tanto tendrá el mismo formato. → `Location`

---
