# Horas Extras

**Base path:** `/api/v1/chile`

5 endpoint(s).

## `GET /attendances/overtime`

**Listar horas extras**

Ver registros de horas extras

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | Fecha inicial del periodo de consulta en YYYY-MM-DD |
| `to` | query | string (date) |  | Fecha final del periodo de consulta en YYYY-MM-DD |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las horas extras → `Attendances::Overtime::Index`
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /attendances/overtime`

**Agregar horas extras**

Prefiera el uso del endpoint de **Sincronización datos de pago**

Permite sumar horas extras a un Colaborador para un mes determinado

Se debe enviar como JSON un objeto de tipo Horas Extras en el cuerpo de la petición, compuesto por:
 - day: Día con el cual se determinará a qué período pertenece las horas extras (opcional)
 - month: El mes correspondiente a las horas extras
 - year: El año que corresponden las horas extras
 - hours: Cantidad de horas extras a agregar
 - employee_id: Identificador del Colaborador a quien asociar las horas extras
 - type_id: Identificador del tipo de hora extra a agregar
 - centro_costo: Código de centro de costo al cual se cargarán las horas extras



**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Horas Extras` | body | `Attendances::Overtime::Request` |  | Objeto de tipo Horas Extras |

### Respuestas

- **200** — Respuesta al reemplazar las horas extra
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PUT /attendances/overtime`

**Agregar horas extras**

Prefiera el uso del endpoint de **Sincronización datos de pago**

Permite indicar la cantidad de horas extras que un Colaborador ejerció durante un mes determinado. Este método **reemplaza** la cantidad de horas extras, no suma a las existentes


Se debe enviar como JSON un objeto de tipo Horas Extras en el cuerpo de la petición, compuesto por:
 - day: Día con el cual se determinará a qué período pertenece las horas extras (opcional)
 - month: El mes correspondiente a las horas extras
 - year: El año que corresponden las horas extras
 - hours: Cantidad de horas extras a agregar
 - employee_id: Identificador del Colaborador a quien asociar las horas extras
 - type_id: Identificador del tipo de hora extra a agregar
 - centro_costo: Código de centro de costo al cual se cargarán las horas extras}

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Horas Extras` | body | `Attendances::Overtime::Request` |  | Objeto de tipo Horas Extras |

### Respuestas

- **200** — Respuesta al reemplazar las horas extra
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /attendances/overtime/types`

**Listar tipos de horas extras**

Genera una lista con los tipos de horas extras que existen en el sistema

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con los tipos de horas extras

---

## `GET /attendances/overtime/{id}`

**Ver un registro de sobretiempo**

Ver un registro de sobretiempo dado su identificador

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | Id del sobretiempo |

### Respuestas

- **200** — Como respuesta recibimos que la información de la sobretiempo
- **404** — Cuando no existe el recurso
- **400** — Existe un error con los datos enviados → `bad_request`

---
