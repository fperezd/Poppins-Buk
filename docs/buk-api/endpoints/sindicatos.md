# Sindicatos

**Base path:** `/api/v1/chile`

4 endpoint(s).

## `GET /unions`

**Mostrar sindicatos**

Recibimos la información relacionada a los sindicatos

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | Tamaño página |
| `page` | query | integer |  | Número de página |

### Respuestas

- **200** — Como respuesta recicibimos la información correspondiente a todos los sindicatos → `union`

---

## `POST /unions`

**Crear sindicato**

Crea un nuevo sindicato en el sistema. Los parámetros son: 

 - id : ID del sindicato

 - name: Nombre del sindicato

 - rut: RUT del sindicato

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `union` | body | `approved_union` | ✓ | Parámetros de un sindicato |

### Respuestas

- **201** — Respuesta en caso de haber creado un sindicato de forma exitosa
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PUT /unions/update`

**Actualizar información sindicato**

Permite indicar el nuevo nombre y rut de un sindicato

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `union` | body | `union_request` |  | Objeto tipo sindicato |

### Respuestas

- **200** — Respuesta al reemplazar sindicato
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /unions/{id}`

**Mostrar sindicato**

Recibimos la información relacionada al sindicato cuyo ID enviamos en la consulta
Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del sindicato |

### Respuestas

- **200** — Como respuesta recibimos la información correspondiente al sindicato buscado → `union`

---
