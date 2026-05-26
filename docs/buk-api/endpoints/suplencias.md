# Suplencias

**Base path:** `/api/v1/chile`

4 endpoint(s).

## `GET /substitutions`

Obtener suplencias

Descripción de atributos:
- `id`: Identificador único de la suplencia.
- `active`: Estado de la suplencia.
- `employee_id`: Id del Colaboradores.
- `substitute_id`: Id del Colaboradores suplente.
- `start_date`: Fecha de inicio de la suplencia.
- `end_date`: Fecha de termino de la suplencia.
- `reason`: Causal de la suplencia.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page` | query | integer |  | Parámetros de consulta opcionales para filtrar y paginar las suplencias  |
| `page_size` | query | integer |  | Parámetros de consulta opcionales para filtrar y paginar las suplencias  |

### Respuestas

- **200** — Respuesta de la API al obtener las suplencias con paginación y detalles de cada suplencia


---

## `POST /substitutions`

Crear una nueva suplencia

Descripción de atributos:
- `active`: Estado de la suplencia.
- `employee_id`: Id del Colaboradores.
- `substitute_id`: Id del Colaboradores suplente.
- `start_date`: Fecha de inicio de la suplencia.
- `end_date`: Fecha de termino de la suplencia.
- `reason`: Causal de la suplencia.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `substitution` | body | `EmployeeSubstitutionInput` | ✓ | Datos de la nueva suplencia a crear, incluyendo identificadores de Colaborador y sustituto, fechas de inicio y fin, y estado  |

### Respuestas

- **201** — Respuesta de la API al crear una nueva suplencia, incluyendo detalles de la suplencia creada
 → `EmployeeSubstitutionDetail`
- **400** — Entrada inválida


---

## `DELETE /substitutions/{id}`

Eliminar una suplencia específica

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la suplencia a eliminar  |

### Respuestas

- **200** — Respuesta de la API tras la eliminación exitosa de una suplencia

- **404** — Suplencia no encontrada

- **422** — No se pudo eliminar la suplencia


---

## `PATCH /substitutions/{id}`

Actualizar una suplencia específica
Descripción de atributos:
- `active`: Estado de la suplencia.
- `employee_id`: Id del Colaboradores.
- `substitute_id`: Id del Colaboradores suplente.
- `start_date`: Fecha de inicio de la suplencia.
- `end_date`: Fecha de termino de la suplencia.
- `reason`: Causal de la suplencia.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la suplencia a actualizar  |
| `substitution` | body | `EmployeeSubstitutionInput` | ✓ | Datos para actualizar en la suplencia existente, como fechas de inicio y fin o estado  |

### Respuestas

- **200** — Respuesta de la API tras la actualización exitosa de una suplencia
 → `EmployeeSubstitutionDetail`
- **400** — Entrada inválida

- **404** — Suplencia no encontrada


---
