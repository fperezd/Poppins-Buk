# Vacaciones

**Base path:** `/api/v1/chile`

6 endpoint(s).

## `DELETE /vacations`

**Borrar una vacación**

Borrar una vacación específica de acuerdo a el id del empleado, fecha inicio y fecha de término.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | query | integer | ✓ | ID del empleado |
| `start_date` | query | string | ✓ | Fecha de inicio de la vacación |
| `end_date` | query | string | ✓ | Fecha de término de la vacación |

### Respuestas

- **200** — Se entrega un mensaje de que el recurso ha sido eliminado exitosamente
- **404** — No se ha podido encontrar la vacación con los campos requeridos
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /vacations`

**Listar vacaciones**

Retorna todas las vacaciones aprobadas en el sistema, como parámetro (opcional) recibe la fecha (en formato YYYY-MM-DD) de inicio de las vacaciones.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `date` | query | string (date) |  | (OPCIONAL) La fecha en la cual deben iniciar las vacaciones en YYYY-MM-DD |
| `end_date` | query | string (date) |  | (OPCIONAL) Busca las vacaciones que empezaron antes de una fecha en YYYY-MM-DD |
| `end_after` | query | string (date) |  | (OPCIONAL) Busca las vacaciones que terminaron despues de una fecha en YYYY-MM-DD |
| `start_before` | query | string (date) |  | (OPCIONAL) Busca las vacaciones que empezaron antes de una fecha en YYYY-MM-DD |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información particular de las vacaciones

---

## `POST /vacations`

**Crear una vacacion**

Crea una nueva vacación en el sistema. Los parámetros son:

- employee_id : Id del empleado
- start_date : Fecha de inicio del periodo de vacaciones en formato YYYY-MM-DD
- end_date : Fecha de término del periodo de vacaciones en formato YYYY-MM-DD
- type: Corresponde al tipo de vacaciones, puede ser: legales, progresivas o dias_administrativos (en caso de estar activadas).
- percent_day : Corresponde a la fracción del último día del periodo de vacaciones que se considera como tal.
  Mayor a 0 y menor o igual a 1. Se envía 1 para indicar que el último día es completo
- workday_stage : Indica la parte de la jornada que será parcial si es que percent_day es distinto de 1.
  Puede ser start_working_day si es al inicio de la jornada o end_working_day si es al final. Si percent_day
  es 1, sólo puede ser full_working_day. Este campo es opcional. Si no se envía se asignará automáticamente a
  partir del valor de percent_day (full_working_day si es 1 o start_working_day si es menor).

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `vacation` | body | `approved_vacation` | ✓ | Parámetros de una vacación |

### Respuestas

- **201** — Respuesta en caso de haber creado una vacación de forma exitosa
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /vacations/business_days`

**Mostrar cantidad de días hábiles**

Recibimos el rango fechas a calcular.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `start_date` | query | string (date) | ✓ | Fecha de inicio (inclusive, formato YYYY-MM-DD) |
| `end_date` | query | string (date) | ✓ | Fecha de término (inclusive, formato YYYY-MM-DD) |

### Respuestas

- **200** — Como respuesta recibimos la cantidad de días hábiles en el rango de fecha dado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /vacations/requested`

**Listar Vacaciones**

Retorna todas las vacaciones aprobadas en el sistema, como parámetro (opcional) recibe la fecha (en formato YYYY-MM-DD) de inicio de las vacaciones.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `date` | query | string (date) |  | (OPCIONAL) La fecha en la cual deben iniciar las vacaciones en YYYY-MM-DD |
| `end_date` | query | string (date) |  | (OPCIONAL) La fecha tope del periodo de consulta de las vacaciones en YYYY-MM-DD |
| `end_after` | query | string (date) |  | (OPCIONAL) Busca las vacaciones que terminaron después de una fecha en YYYY-MM-DD |
| `start_before` | query | string (date) |  | (OPCIONAL) Busca las vacaciones que empezaron antes de una fecha en YYYY-MM-DD |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `status` | query | string |  | (OPCIONAL) Busca las vacaciones que tienen como status algunos de los valores permitidos (submitted, approved, rejected, pre_approved, signature_required) |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información particular de las vacaciones.

---

## `GET /vacations/{id}`

**Mostrar una vacación**

Se muestran toda la información relacionada a vacación solicitada.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID de la vacación a consultar |

### Respuestas

- **200** — Como respuesta recibimos todos los campos correspondiente a la información del empleado consultado
- **400** — Existe un error con los datos enviados → `bad_request`

---
