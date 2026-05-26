# Licencias

**Base path:** `/api/v1/chile`

7 endpoint(s).

## `DELETE /absences/licence`

**Borrar licencias**

Elimina licencias usando los filtros que prefieras: puedes ingresar una lista de IDs de Colaboradores y/o un rango de fechas de inicio. Los filtros son opcionales, pero debes enviar al menos uno de los tres: employee_ids, start_date o end_date.


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

## `GET /absences/licence`

**Listar licencias**

Retorna las licencias registradas en el sistema en un rango de fechas (opcional).

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta licencia.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de licencia.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la licencia (opcional).
- custom_attributes: Atributos personalizados (opcional).
- motivo: Motivo de la contingencia causante.
- format: Formato en que se encuentra, puede tomar valor electrónica (para licencias electrónica) o "física" (para licencias física).
- licence_type_id: Id del tipo de licencias al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos  licencias".
- licence_type_code: Código del tipo de licencias al que corresponde.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | Fecha de inicio del rango en formato YYYY-MM-DD. |
| `to` | query | string (date) |  | Fecha de término del rango en formato YYYY-MM-DD. |
| `page` | query | integer |  | (OPCIONAL) Página a consultar |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las licencias
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /absences/licence`

**Crear una licencia**

Crea una nueva inasistencia de tipo licencia en el sistema.

Se debe enviar como JSON un objeto tipo licencia en el cuerpo de la petición.
Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta licencia.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de licencia.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la licencia (opcional).
- custom_attributes: Atributos personalizados (opcional).
- format: Formato en que se encuentra, puede tomar valor electrónica (para licencia electrónica) o "física" (para licencia física).
- licence_type_id: Id del tipo de licencia al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos  licencia".
- justification: Texto complementario de justificación del permiso (opcional).
- medic_rut: Rut del médico (opcional).
- licence_number: Número de licencia (opcional).
- medic_name: Nombre del médico (opcional).

Los Tipos de Licencia son los siguientes:
- <b>Chile:</b> accidente_comun, prorroga, pre_natal, post_natal, parental, niño_menor, accidente_trabajo, accidente_trayecto, enfermedad_profesional, embarazo
- <b>Perú:</b> paternidad, luto, descanso_medico, subsidio_incapacidad_temporal, subsidio_maternidad, subsidio_incapacidad_no_computable_para_cts
- <b>México:</b> riesgo_trabajo, enfermedad_general, maternidad, licencia_cuidado_hijos
- <b>Colombia:</b> remunerada, no_remunerada, maternidad_paternidad, luto, calamidad_domestica, suspension, dia_familia



**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `licencias` | body | `Absences::Licence::Request` |  | Objeto de tipo licencia |

### Respuestas

- **201** — Respuesta de la api ante la creación de %{licences}
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/licence/types`

**Listar tipos de licencias**

Retorna el listado de tipos de licencias en el sistema.

El filtro con goce de sueldo (with_pay) es opcional.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `with_pay` | query | boolean |  | (OPCIONAL) Con goce de sueldo? |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con los tipo de licencias

---

## `GET /absences/licence/types/{id}`

**Ver un tipo de licencia**

Ver un tipo de licencia dado su identificador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id del tipo de licencia |

### Respuestas

- **200** — Como respuesta recibimos la información del tipo de licencia solicitada
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `DELETE /absences/licence/{id}`

**Borrar una licencia**

Borrar una licencia dado su identificador.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id de la %{licence} |

### Respuestas

- **200** — Como respuesta recibimos que efectivamente el recurso fue borrado
- **404** — Cuando no existe el recurso a borrar
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /absences/licence/{id}`

**Ver una licencia**

Ver una licencia dado su identificador.

Descripción de los atributos:

- employee_id: Id del Colaborador asociado a esta licencia.
- start_date: Fecha de inicio.
- days_count: Cantidad de días de duración.
- day_percent: Porcentaje del día que se tomará el Colaborador. Acepta 0.5 o 1, es decir, medio día o día completo. Si se deja en blanco es día completo (opcional).
- workday_stage: etapa de la jornada, entre las entradas aceptadas se tiene "full_working_day" para day_percent igual a 1 y cuando day_percent igual a 0.5 los valores permitidos son "start_working_day" y "end_working_day" (opcional).
- type: Tipo de licencia.
- contribution_days: Cantidad de días que son aporte del empleador.
- application_date: Fecha en que se debe aplicar la licencia (opcional).
- custom_attributes: Atributos personalizados (opcional).

- motivo: Motivo de la contingencia causante.
- format: Formato en que se encuentra, puede tomar valor electrónica (para licencia electrónica) o "física" (para licencia física).
- licence_type_id: Id del tipo de licencia al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos  licencia".
- licence_type_code: Código del tipo de licencia al que corresponde.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id de la licencia |

### Respuestas

- **200** — Como respuesta recibimos la información de la licencia solicitada
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---
