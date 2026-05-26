# Permisos

**Base path:** `/api/v1/chile`

9 endpoint(s).

## `DELETE /absences/permission`

**Borrar Permisos**

Elimina permisos usando los filtros que prefieras: puedes ingresar una lista de IDs de Colaboradores y/o un rango de fechas de inicio. Los filtros son opcionales, pero debes enviar al menos uno de los tres: employee_ids, start_date o end_date.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_ids` | query | array |  | Ingresa los IDs de los Colaboradores separados por comas. No utilices otros separadores ni paréntesis. Por ejemplo: 1,2,3 |
| `start_date` | query | string (date) |  | Fecha de inicio del periodo de consulta en YYYY-MM-DD |
| `end_date` | query | string (date) |  | Fecha de término del periodo de consulta en YYYY-MM-DD |

### Respuestas

- **200** — Como respuesta recibimos que efectivamente todos recursos fue borrados
- **404** — Cuando no hay recursos permitidos que borrar
- **400** — Cuando hay un error al borrar un registro

---

## `GET /absences/permission`

**Listar permisos**

Retorna los permisos registradas en el sistema en un rango de fechas (opcional).

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta Permiso.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de Permiso.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la Permiso (opcional).
- custom_attributes: Atributos personalizados (opcional).
- justification: Texto complementario de justificación (opcional).
- permission_type_id: Id del tipo de permiso al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos permisos".
- permission_type_code: Código del tipo de permiso al que corresponde.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | Fecha de inicio del rango en formato YYYY-MM-DD. |
| `to` | query | string (date) |  | Fecha de término del rango en formato YYYY-MM-DD. |
| `time_measure` | query | string |  | (OPCIONAL) tipo de Permiso |
| `start_time` | query | string |  | Hora de inicio |
| `end_time` | query | string |  | Hora de término |
| `page` | query | integer |  | (OPCIONAL) Página a consultar |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con los permisos

---

## `POST /absences/permission`

**Crear Permiso**

Crea un nuevo Permiso, con goce o sin goce de sueldo en el sistema.
Se debe enviar como JSON un objeto tipo Permiso en el cuerpo de la petición.

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta Permiso.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de Permiso.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la Permiso (opcional).
- custom_attributes: Atributos personalizados (opcional).
- justification: Texto complementario de justificación (opcional).
- permission_type_id: Id del tipo de permiso al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos permisos".

- justification: Texto complementario de justificación del permiso (opcional).
- medic_rut: Rut del médico (opcional).
- licence_number: Número de licencia (opcional).
- medic_name: Nombre del médico (opcional).
- time_measure: (OPCIONAL) tipo de Permiso ['per_day', 'per_hour', 'both']

  - <b>per_day:</b> Por día

  - <b>per_hour:</b> Por hora

  - <b>both:</b> Ambos

- start_time: Hora de salida. Formato hh:mm
- end_time: Hora de regreso. Formato hh:mm

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Permiso` | body | `Absences::Permission::Request` |  | Objeto tipo permiso |

### Respuestas

- **201** — Respuesta de la api ante la creación de Permisos
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/permission/types`

**Listar tipos de permiso**

Retorna el listado de tipos de permiso en el sistema.

El filtro con goce de sueldo (with_pay) es opcional.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `with_pay` | query | boolean |  | (OPCIONAL) Con goce de sueldo? |
| `time_measure` | query | string |  | (OPCIONAL) tipo de Permiso |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con los tipo de permisos

---

## `POST /absences/permission/types`

**Crear tipo de permiso**

Crea una tipo de permiso en el sistema.

Se debe enviar como JSON un objeto tipo LicenceType en el
cuerpo de la petición, compuesto por los siguientes atributos
 - code: Código único que identifica el permiso
 - name: Nombre del tipo permiso
 - description: Descripción del tipo de permiso
 - with_pay: si posee o no goce de sueldo (opcional, por defecto false)
 - requestable: si el tipo de permiso es solicitable por el Colaborador (opcional, por defecto false)


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `LicenceType` | body | `LicenceType::Request` |  | Objeto LicenceType |

### Respuestas

- **201** — Respuesta de la api ante la creación del tipo de permiso.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `DELETE /absences/permission/types/{id}`

**Borrar un tipo de permiso**

Borrar un tipo de permiso dado su identificador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id del tipo de permiso |

### Respuestas

- **200** — Como respuesta recibimos que efectivamente el recurso fue borrado
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/permission/types/{id}`

**Ver un tipo de permiso**

Ver un tipo de permiso dado su identificador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id del tipo de permiso |

### Respuestas

- **200** — Como respuesta recibimos la información del tipo de permiso solicitada
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `DELETE /absences/permission/{id}`

**Borrar un permiso**

Borrar un permiso dado su identificador

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id de permiso |

### Respuestas

- **200** — Como respuesta recibimos que efectivamente el recurso fue borrado
- **404** — Cuando no existe el recurso a borrar
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/permission/{id}`

**Ver un permiso**

Retorna los permisos registradas en el sistema en un rango de fechas (opcional).

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta Permiso.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de Permiso.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la Permiso (opcional).
- custom_attributes: Atributos personalizados (opcional).
- justification: Texto complementario de justificación (opcional).
- permission_type_id: Id del tipo de permiso al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos permisos".
- permission_type_code: Código del tipo de permiso al que corresponde.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id del permiso |

### Respuestas

- **200** — Como respuesta recibimos la información del permiso solicitada
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---
