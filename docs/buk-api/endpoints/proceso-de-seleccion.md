# Proceso de selección

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /recruiting/selection_processes`

**Listar procesos de selección **

Retorna todos los procesos de selección en el sistema

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Número de página |
| `from` | query | string (date) |  | (OPCIONAL) Búsqueda de procesos de selección a partir de esta fecha. Si no se especifica, se usan los procesos de selección desde el inicio. Formato YYYY-MM-DD |
| `to` | query | string (date) |  | (OPCIONAL) Búsqueda de procesos de selección hasta esta fecha. Si no se especifica, se usan los procesos de selección hasta la fecha actual. Formato YYYY-MM-DD |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (selection_processes) con la información de los procesos de selección
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /recruiting/selection_processes`

**Crear proceso de selección**

Crea un nuevo proceso de selección en base a los parámetros entregados. De no especificar un template_id se usa la plantilla por defecto.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `selection_process` | body |  | ✓ | Parámetros de un proceso de selección |

### Respuestas

- **201** — Respuesta de la api ante la creación de un proceso de selección.
- **400** — Existe un error con los datos enviados → `bad_request`

---
