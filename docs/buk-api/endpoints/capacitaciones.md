# Capacitaciones

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /training/sence_percents`

**Mostrar tramo sence de todos los empleados**

Retorna un listado con el id, rut y tramo sence de cada empleados del sistema que tenga una liquidación del mes abierto.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de capacitaciones en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Respuesta con el id, rut y porcentaje de tramo sence de cada empleados.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /training/sence_percents/{employee_id}`

**Mostrar el tramo sence de un empleados**

Recibimos la información específica del empleados cuya ID o RUT enviamos en la consulta

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de capacitaciones en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | string | ✓ |  ID o RUT sin puntos del empleados a consultar |

### Respuestas

- **200** — Retorna el porcentaje de tramo sence del empleados por medio del  ID o RUT. → `SencePercent`
- **404** — empleados no encontrado
- **400** — Existe un error con los datos enviados → `bad_request`

---
