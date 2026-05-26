# Horas no trabajadas

**Base path:** `/api/v1/chile`

7 endpoint(s).

## `GET /attendances/non-worked-hours`

**Listar horas no trabajadas**

Ver registros de horas no trabajadas

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | Fecha inicial del periodo de consulta en YYYY-MM-DD |
| `to` | query | string (date) |  | Fecha final del periodo de consulta en YYYY-MM-D |
| `sort` | query | string |  | (OPCIONAL) Párametro para ordenar registros por su id, el único valor posible es 'id' |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las horas no trabajadas → `Attendances::NonWorkedHours::Index`
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /attendances/non-worked-hours`

**Agregar horas no trabajadas**

Permite indicar la cantidad de horas no trabajadas de un Colaborador en un mes determinado.

Se debe enviar como JSON un objeto tipo NonWorkedHours en el cuerpo de la petición, se compone de:
 - day: Día con el cual se determinará a qué período pertenece las horas no trabajadas (opcional)
 - month: Mes al que corresponden las horas no trabajadas
 - year: Año al que corresponden las horas no trabajadas
 - hours: Cantidad de horas a agregar
 - employee_id: Identificador del Colaborador al que se agregan las horas
 - type_id: Identificador de Tipo de Hora no trabajada

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Horas no Trabajadas` | body | `Attendances::NonWorkedHours::Request` |  | Objeto tipo Horas No Trabajadas |

### Respuestas

- **200** — Respuesta al agregar horas de ausencia
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PUT /attendances/non-worked-hours`

**Indicar horas no trabajadas**

Permite indicar la cantidad de horas no trabajadas de un Colaborador en un mes determinado. Este método **reemplaza** la cantidad de horas no trabajadas que tiene el Colaborador


Se debe enviar como JSON un objeto tipo NonWorkedHours en el cuerpo de la petición, se compone de:
 - day: Día con el cual se determinará a qué período pertenece las horas no trabajadas (opcional)
 - month: Mes al que corresponden las horas no trabajadas
 - year: Año al que corresponden las horas no trabajadas
 - hours: Cantidad de horas a agregar
 - employee_id: Identificador del Colaborador al que se agregan las horas
 - type_id: Identificador de Tipo de Hora no trabajada

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Horas no Trabajadas` | body | `Attendances::NonWorkedHours::Request` |  | Objeto de tipo Horas no Trabajadas |

### Respuestas

- **200** — Respuesta al reemplazar horas de ausencia
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /attendances/non-worked-hours/types`

**Listar tipos de horas no trabajadas**

'Obtiene la lista de tipos de horas no trabajadas'

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con los tipos de horas no trabajadas

---

## `POST /attendances/non-worked-hours/types`

**Crear una tipo de Hora no Trabajada**

Crea un nuevo tipo de hora no trabajada en el sistema.

Se debe enviar como JSON un objeto tipo NonWorkedHourType en el cuerpo de la petición,
compuesto por los siguientes atributos

 - name: Nombre del tipo de hora no trabajada
 - paid_leave: Boolean indicando si es con o sin goce de sueldo

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `NonWorkedHourType` | body | `Attendances::NonWorkedHours::TypeModel::Request` |  | Objeto de tipo NonWorkedHourType  |

### Respuestas

- **201** — Respuesta de la api ante la creación de NonWorkedHourType.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `DELETE /attendances/non-worked-hours/types/{id}`

**Borrar un tipo de hora no trabajada**

Borrar un tipo de hora no trabajado dado su identificador

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | ID del tipo de hora no trabajada |

### Respuestas

- **200** — Se entrega un mensaje de que el recurso ha sido eliminado exitosamente
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /attendances/non-worked-hours/{id}`

**Ver un registro de hora no trabajada**

Ver un registro de hora no trabajada dado su identificador

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id de la hora no trabajada |

### Respuestas

- **200** — Como respuesta recibimos que la información de la hora no trabajada
- **404** — Cuando no existe el recurso
- **400** — Existe un error con los datos enviados → `bad_request`

---
