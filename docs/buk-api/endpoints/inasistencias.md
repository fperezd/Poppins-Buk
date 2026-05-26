# Inasistencias

**Base path:** `/api/v1/chile`

9 endpoint(s).

## `DELETE /absences/absence`

**Borrar Ausencias**

Elimina inasistencias usando los filtros que prefieras: puedes ingresar una lista de IDs de Colaboradores y/o un rango de fechas de inicio. Los filtros son opcionales, pero debes enviar al menos uno de los tres: employee_ids, start_date o end_date.


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

## `GET /absences/absence`

**Listar ausencias**

Retorna las ausencias registradas en el sistema en un rango de fechas (opcional).

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta Ausencia.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de Ausencia.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la Ausencia (opcional).
- custom_attributes: Atributos personalizados (opcional).
- justification: Texto complementario de justificación (opcional).
- absence_type_id: Id del tipo de inasistencia al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos inasistencia".
- absence_type_code: Código del tipo de inasistencia al que corresponde.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | Fecha de inicio del rango en formato YYYY-MM-DD. |
| `to` | query | string (date) |  | Fecha de término del rango en formato YYYY-MM-DD. |
| `page` | query | integer |  | (OPCIONAL) Página a consultar |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las ausencias
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /absences/absence`

**Crear Ausencia no justificada**

Crea una nueva inasistencia de tipo ausencia no justificada en el sistema.

Se debe enviar como JSON un objeto tipo Ausencia en el cuerpo de la petición.

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta Ausencia.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de Ausencia.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la Ausencia (opcional).
- custom_attributes: Atributos personalizados (opcional).
- justification: Texto complementario de justificación (opcional).
- absence_type_id: Id del tipo de permiso al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos inasistencias".
- justification: Texto complementario de justificación del permiso (opcional).
- medic_rut: Rut del médico (opcional).
- licence_number: Número de licencia (opcional).
- medic_name: Nombre del médico (opcional).


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Ausencia` | body | `Absences::Absence::Request` |  | Objeto tipo ausencia |

### Respuestas

- **201** — Respuesta de la api ante la creación de Ausencias
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/absence/types`

**Listar tipos de ausencias**

Retorna el listado de tipos de ausencias en el sistema.

El filtro con goce de sueldo (with_pay) es opcional.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `with_pay` | query | boolean |  | (OPCIONAL) Con goce de sueldo? |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con los tipo de ausencias

---

## `POST /absences/absence/types`

**Crear tipo de ausencia**

Crea una tipo de ausencia en el sistema.

Se debe enviar como JSON un objeto tipo LicenceType en el
cuerpo de la petición, compuesto por los siguientes atributos
 - code: Código único que identifica la ausencia
 - name: Nombre del tipo ausencia
 - description: Descripción del tipo de ausencia
 - with_pay: si posee o no goce de sueldo (opcional, por defecto false)
 - requestable: si el tipo de ausencia es solicitable por el Colaborador (opcional, por defecto false)


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

## `DELETE /absences/absence/types/{id}`

**Borrar un tipo de ausencia**

Borrar un tipo de ausencia dado su identificador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id del tipo de ausencia |

### Respuestas

- **200** — Como respuesta recibimos que efectivamente el recurso fue borrado
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/absence/types/{id}`

**Ver un tipo de ausencia**

Ver un tipo de ausencia dado su identificador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id del tipo de ausencia |

### Respuestas

- **200** — Como respuesta recibimos la información del tipo de ausencia solicitada
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `DELETE /absences/absence/{id}`

**Borrar una ausencia**

Borrar una ausencia dado su identificador.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id de la ausencia |

### Respuestas

- **200** — Como respuesta recibimos que efectivamente el recurso fue borrado
- **404** — Cuando no existe el recurso a borrar
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/absence/{id}`

**Ver una ausencia**

Ver una ausencia dado su identificador.

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta Ausencia.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de Ausencia.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la Ausencia (opcional).
- custom_attributes: Atributos personalizados (opcional).
- justification: Texto complementario de justificación (opcional).
- absence_type_id: Id del tipo de inasistencia al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos inasistencia".
- absence_type_code: Código del tipo de inasistencia al que corresponde.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id de la ausencia |

### Respuestas

- **200** — Como respuesta recibimos la información de la ausencia solicitada
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---
