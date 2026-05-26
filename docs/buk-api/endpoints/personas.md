# Personas

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /people/{id}`

**Obtener datos básicos de una persona**

Devuelve la información básica de una persona específica, incluyendo su id, nombre, apellido y número de identificación.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de personas en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la persona |

### Respuestas

- **200** — Detalles de la persona
- **404** — Persona no encontrada

---
