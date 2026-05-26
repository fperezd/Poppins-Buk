# Notas

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `POST /recruiting/notes`

**Crear comentario**

Crea un nuevo comentario asociado a un postulante usando su email

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de selección en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `note` | body |  | ✓ | Parámetros del comentario |

### Respuestas

- **201** — Comentario creado exitosamente
- **400** — Existe un error con los datos enviados → `bad_request`
- **404** — No Existe el recurso solicitado

---
