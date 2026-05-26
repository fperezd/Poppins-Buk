# Colaboradores

**Base path:** `/api/v1/chile`

30 endpoint(s).

## `GET /docs/{id}`

**Obtener especificaciones de un documento**

Recibe un id de un documento, y entrega las especificaciones asociadas a dicho documento.
**Permisos requeridos para utilizar este endpoint:** 
* Permisos para ver y descargar documentos de empleados en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del documento |

### Respuestas

- **200** — Como respuesta recibimos un documento de empleado

---

## `GET /employees`

**Mostrar Colaboradores**

Entrega la información de todos los Colaboradores.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `status` | query | string |  | Estado del Colaborador. valores permitidos: activo, inactivo, pendiente |
| `document_number` | query | string |  | Número de Documento |
| `code_sheet` | query | string |  | Código de ficha del Colaborador |
| `company_id` | query | string |  | Id de la Empresa |
| `update_start_date` | query | string (date) |  | Fecha de actualización, en caso de usar el atributo company_id validara según esta fecha el trabajo activo en el momento para definir la información a mostrar, si esta vacio se considerará fecha actual |
| `custom_attr_job_name` | query | string |  | Nombre del atributo personalizado de trabajo |
| `custom_attr_job_value` | query | string |  | Valor del atributo personalizado de trabajo (si es más de uno, sepárelos por ::, por ejemplo Valor1::Valor2) |
| `email` | query | string |  | Email laboral del Colaborador |
| `code_recinto` | query | string |  | Código del Recinto |
| `page_size` | query | integer |  | Tamaño de la página |
| `page` | query | integer |  | Nro de página |
| `sort` | query | string |  | Parámetro para ordenar registros, el único valor posible es 'id', si no se envia se ordena por nombre |

### Respuestas

- **200** — Una lista de Colaboradores que cumplan con el criterio de bùsqueda. → `EmployeeResponseCountry`

---

## `POST /employees`

**Crear un Colaborador**

Permite almacenar la información de los Colaboradores. Si no se envía la key active con valor true se creará inactivo. El código de ficha "code_sheet" es opcional, si no se envía se autogenerará en caso que la persona no exista previamente (los datos personales a enviar no estén siendo usados por otro Colaborador).

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Employee` | body | `Employee::Response::Minimal` | ✓ | Objeto de tipo employee |

### Respuestas

- **201** — Colaborador creado.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/absences/absences`

**Ver ausencias de Colaboradores**

Ver las ausencias asociadas a Colaboradores.


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

 - format: Formato en que se encuentra, puede tomar valor electrónica (para inasistencia electrónica) o "física" (para inasistencia física).

 - absence_type_id: Id del tipo de inasistencia al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos  inasistencia".

 - absence_type_code: Código del tipo de inasistencia al que corresponde.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employees_id` | query | array |  | Ids Colaboradores |

### Respuestas

- **200** — Como respuesta recibimos la información de las ausencias solicitadas de los Colaboradores
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/absences/licences`

**Ver licencias de Colaboradores**

Ver las licencias asociadas a Colaboradores.

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
- format: Formato en que se encuentra, puede tomar valor electrónica (para licencias electrónica) o "física" (para licencias física).
- licence_type_id: Id del tipo de licencias al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos  licencias".
- licence_type_code: Código del tipo de licencias al que corresponde.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employees_id` | query | array |  | Ids Colaboradores |

### Respuestas

- **200** — Como respuesta recibimos la información de la licencias solicitadas de los Colaboradores
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/absences/permissions`

**Ver permisos de Colaboradores**

Ver los permisos asociadas a Colaboradores.


- format: Formato en que se encuentra, puede tomar valor electrónica (para permiso electrónica) o "física" (para permiso física).
- permission_type_id: Id del tipo de permiso al que corresponde, estas se pueden ver con la operacion GET para "Listar tipos permiso".
- permission_type_code: Código del tipo de permiso al que corresponde.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employees_id` | query | array |  | Ids Colaboradores |

### Respuestas

- **200** — Como respuesta recibimos la información de los permisos solicitados de los Colaboradores
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/active`

**Listar Colaboradores**

Retorna todos los Colaboradores vigentes en el sistema. Un Colaborador vigente es un Colaborador con plan y trabajo activos en la fecha seleccionada.<br><br> Como parámetro (opcional) recibe la fecha (en formato YYYY-MM-DD) en la que deben tener un contrato vigente, si no se proporciona este parámetro entonces se tomará la fecha de hoy del mes abierto en la aplicación.<br> Adicionalmente, puede recibir un parámetro opcional para excluir los Colaboradores que se encuentren pendientes.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `rut` | query | string |  | RUT |
| `code_sheet` | query | string |  | Código de ficha del Colaborador |
| `date` | query | string (date) |  | Fecha  en el cual evaluar si los Colaboradores tienen contrato vigente, en formato YYYY-MM-DD. En caso de no ingresar este parámetro se usará por defecto la fecha de hoy en el cual se encuentra la plataforma |
| `exclude_pending` | query | boolean |  | Se excluyen los Colaboradores pendientes en el caso de enviar este parámetro como `true` |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — 'Como respuesta recibimos un arreglo (data) con la información de los Colaboradores'


---

## `GET /employees/overtimes`

**Listar horas extras asociadas a Colaboradores**

Ver registros de horas extras asociadas a ciertos Colaboradores

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employees_id` | query | array |  | Ids Colaboradores |
| `overtime_type_id` | query | integer |  | (Opcional) Id del tipo de sobretiempo |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las horas extras de los Colaboradores

---

## `GET /employees/{employee_id}/family_responsibilities/{id}`

**Mostrar Grupo Familiar de un Colaborador**

Retorna la información de un Grupo Familiar asociado a un Colaborador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

**General requerida para utilizar este endpoint:** 
* Habilitar grupo familiar, valor: true.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | string | ✓ | ID del Colaborador a consultar. |
| `id` | path | string | ✓ | ID del Grupo Familiar a consultar. |

### Respuestas

- **200** — La información del Grupo Familiar asociado al Colaborador.
- **404** — No Existe el recurso solicitado

---

## `PATCH /employees/{employee_id}/jobs/{id}`

**Actualizar un trabajo a un Colaborador**

Crea un nuevo trabajo para el Colaborador en el sistema

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | string | ✓ | ID del Colaborador a actualizar. |
| `id` | path | string | ✓ | ID del trabajo a actualizar. |
| `Job` | body | `JobInputCountry` | ✓ | Objeto de tipo job |

### Respuestas

- **201** — Como respuesta recibimos un arreglo (data) con la información del trabajo actualizado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /employees/{employee_id}/jobs/{job_id}/cost_centers`

**Actualizar centro de costos en un trabajo a un Colaborador**

Se reemplazan los centros de costos de un trabajo, es decir, se borran los existentes y se agregan los nuevos.



Recuerda que los pesos deben sumar 100.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | integer |  |  |
| `job_id` | path | integer |  |  |
| `cost center` | body |  | ✓ |  |

### Respuestas

- **201** — Como respuesta se recibe la información de los centros de costos del trabajo actualizados

---

## `GET /employees/{employee_id}/plans/{id}`

**Mostrar plan de un empleado**

Retorna la información de un plan asociado a un Colaborador.
(endpoint no implementado para México)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | string | ✓ | ID del Colaborador a consultar. |
| `id` | path | string | ✓ | ID del plan a consultar. |

### Respuestas

- **200** — La información del plan asociado al Colaborador.

---

## `PATCH /employees/{employee_id}/plans/{id}`

**Actualizar un plan a empleado**

Actualiza un plan asociado a un Colaborador en el sistema
(endpoint no implementado para México)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | string | ✓ | ID del Colaborador a actualizar. |
| `id` | path | string | ✓ | ID del plan a actualizar. |
| `Plan` | body | `PlanInputCountry` | ✓ | Objeto de tipo plan |

### Respuestas

- **201** — Como respuesta recibimos un arreglo (data) con la información del plan actualizado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}`

**Mostrar Colaborador**

'Recibimos la información específica del Colaborador cuya ID o RUT enviamos en la consulta.'


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID o Número de Documento del Colaborador a consultar. En caso de ser Número de Documento, no debe tener puntos ni guion. |

### Respuestas

- **200** — 'Como respuesta recibimos todos los campos correspondiente a la información del Colaborador consultado'
 → `EmployeeResponseCountry`

---

## `PATCH /employees/{id}`

**Actualizar Colaborador**

Actualiza la información del Colaborador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID o Número de Documento del Colaborador a consultar. En caso de ser Número de Documento, no debe tener puntos ni guion. |
| `Employee` | body | `EmployeeResponsePatch` | ✓ | Objeto de tipo employee |

### Respuestas

- **200** — Colaborador actualizado.

---

## `POST /employees/{id}/clone`

**Crear una nueva ficha para un Colaborador**

Permite crear una nueva ficha tomando como referencia otra existente. Esto incluye el detalle de cada una de las cargas de su grupo familiar. Recibe los campos que serán distintos, los demás serán copiados de la ficha de referencia.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

**General requerida para utilizar este endpoint:** 
* Doble trabajo, valor: true.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del Colaborador a clonar. |
| `Employee` | body | `EmployeeInputCloneCountry` | ✓ | Objeto de tipo employee |

### Respuestas

- **201** — Colaborador creado.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/docs`

**Obtener documentos de empleado**

Se obtiene información de los documentos del empleado según los filtros de fecha ingresados

**Permisos requeridos para utilizar este endpoint:** 
* Permisos para ver y descargar documentos de empleados en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del empleado a consultar. |
| `from` | query | string (date) |  | Desde - Rango de fechas de la creación del documento. Ejemplo: 2020/12/10 |
| `to` | query | string (date) |  | Hasta - Rango de fechas de la creación del documento. Ejemplo 2020/12/11 |

### Respuestas

- **200** — Como respuesta recibimos un arreglo con los documentos del empleado → `EmployeeFileListDetail[]`

---

## `POST /employees/{id}/docs`

**Añadir un documento a empleado**

Recibimos un documento, el cual estará relacionado al empleado.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos para subir documentos en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del empleado a consultar. |
| `file` | formData | file |  | Documento a cargar. |
| `file_base64` | formData |  |  | Documento (codificado en base64) a cargar.  Se debe enviar como JSON un objeto compuesto por los siguientes atributos: - content: Contenido codificado en base64. - filename: Nombre que tendrá el documento cargado junto con la extensión (ejm: filename.pdf).  |
| `visible` | query | boolean |  | Visible por el empleado. Por defecto: false |
| `signable_by_employee` | query | boolean |  | Requiere la firma del empleado. Por defecto: false |
| `signable_by_legal_agent` | query | boolean |  | Requiere la firma del representante legal. Por defecto: false |
| `signable_by_second_legal_agent` | query | boolean |  | Requiere la firma de un segundo representante legal. Por defecto: false |
| `overwrite` | query | boolean |  | Sobreescribir archivo. Aplica solo para documentos que no tengan todas las firmas requeridas. Por defecto: false |
| `start_signature_workflow` | query | boolean |  | Iniciar flujo de firma automático. El documento debe estar visible y debe tener requisitos de firmas o revisión para seleccionar esta opción. Por defecto: false |
| `path` | query | string |  | Ruta donde se guardará el archivo. Si se deja en blanco se creará en la carpeta raíz del empleado. Ejemplo: personales/seguridad |
| `signatures` | query |  |  | Arreglo de objetos de tipo firma. Es un parámetro opcional, si se utiliza este no se tomarán en cuenta los otros parámetros relacionados con la firma. |
| `reviewer_id` | query | integer |  | Id del person del revisor. Es un parámetro opcional, si no quieres asignar revisor deja este campo vacío |

### Respuestas

- **201** — Respuesta de la api ante la creación de documentos.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/docs/{file_id}`

**Obtiene un documento de empleado**

Los file ids posibles están en el endpoint GET `/employees/{id}/docs`.

Se devuelve la redirección del documento de file_id ingresado, por lo que hay que seguirla.

* Para seguir la redirección se añade la opción `-L`
* Para guardar la respuesta en un archivo se debe agregar la opción `-o` y pasarle el nombre del archivo

**Example**
```curl -L -X GET --header 'Accept: */*' --header 'auth_token: [AUTH TOKEN]' 'http://www.[COMPANY SUBDOMAIN].buk.cl/api/v1/employees/1/docs/1156' -o [NOMBRE ARCHIVO]```

Prueba con `curl`, el botón Pruébalo no funciona para documentos.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos para ver y descargar documentos de empleados en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del empleado |
| `file_id` | path | string | ✓ | ID del documento |

### Respuestas

- **200** — Como respuesta recibimos un documento de empleado → `EmployeeFileDetail`

---

## `GET /employees/{id}/earned_vacations`

**Mostrar detalle de vacaciones percibidas y simulación de proporcionales**

Recibimos el detalle de las vacaciones percibidas y simulación de proporcionales hasta cierta fecha.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID o Número de Documento del Colaborador a consultar. En caso de ser Número de Documento, no debe tener puntos ni guion. |
| `date` | query | string (date) |  | 'La fecha en la que se calculará las vacaciones percibidas y fecha hasta que se simularán las proporcionales (Formato: DD-MM-YYYY), por defecto será el día de hoy'  |
| `page` | query | integer |  | (OPCIONAL) Página a consultar |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — 'Como respuesta recibimos un arreglo (data) con la información de las vacaciones percibidas y proporcionales del Colaborador'

- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/jobs`

**Mostrar trabajos de un Colaborador**

Retorna la información de los trabajos asociados a un Colaborador.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del Colaborador a consultar. |

### Respuestas

- **200** — Un arreglo (data) con la información de los trabajos asociados al Colaborador.

---

## `POST /employees/{id}/jobs`

**Añadir un trabajo a Colaborador**

Crea un nuevo trabajo para el Colaborador en el sistema

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del Colaborador a consultar. |
| `Job` | body | `JobInputCountryPost` | ✓ | Objeto de tipo job |

### Respuestas

- **201** — Como respuesta recibimos un arreglo (data) con la información del trabajo creado
- **409** — Se están intentando actualizar registros de forma concurrente.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/pension_savings`

**Mostrar ahorros previsionales**

Obtener los ahorros previsionales mediante el id de un Colaborador

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.
* Permisos de ítems en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | Colaborador ID |
| `date` | query | string (date) |  | Filtra los ahorros previsionales que son vigentes para esta fecha |

### Respuestas

- **200** — Como respuesta recibimos una lista de objetos de tipo ahorro previsional
- **404** — No Existe el recurso solicitado

---

## `GET /employees/{id}/plans`

**Mostrar planes de un empleado**

Retorna la información de los planes asociados a un Colaborador.
(endpoint no implementado para México)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del Colaborador a consultar. |

### Respuestas

- **200** — Un arreglo (data) con la información de los planes asociados al Colaborador.

---

## `POST /employees/{id}/plans`

**Añadir un plan a empleado**

Crea un nuevo plan para el Colaborador en el sistema
(endpoint no implementado para México)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del Colaborador a consultar. |
| `Plan` | body | `PlanInputCountry` | ✓ | Objeto de tipo plan |

### Respuestas

- **201** — Como respuesta recibimos un arreglo (data) con la información del plan creado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/subordinates`

**Mostrar Colaboradores subordinados a otro Colaborador**

Recibimos la lista de Colaboradores que sean subordinados.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID o Número de Documento del Colaborador a consultar. En caso de ser Número de Documento, no debe tener puntos ni guion. |
| `date` | query | string (date) |  | Fecha en el cual evaluar si los Colaboradores subordinados tienen contrato vigente, en formato YYYY-MM-DD. En caso de no ingresar este parámetro se usará por defecto la fecha de hoy en el cual se encuentra la plataforma. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — 'Como respuesta recibimos un arreglo (data) con la información de los Colaboradores'


---

## `GET /employees/{id}/vacation_definitions`

**Listar políticas de vacaciones asociadas al empleados**

Retorna un array con las políticas de vacaciones asociadas a un empleados.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.
* Permisos de vacaciones en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | Id del empleados |

### Respuestas

- **200** — Como respuesta recibimos un listado con las políticas de vacaciones asociadas al empleados. → `VacationDefinitionOutput`
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /employees/{id}/vacation_definitions`

**Asignar una política de vacación al empleados**

Asignar una política de vacación al empleados. Los parametros son:
- employee_id : (OBLIGATORIO) Id del empleados
- body : (OBLIGATORIO) JSON con el código de la política de vacaciones a asignar.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.
* Permisos de vacaciones en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | Id del empleados |
| `VacationConfigDefinition` | body | `VacationDefinitionInput` | ✓ | Objeto con el código de la política a asignar. |

### Respuestas

- **201** — Como respuesta recibimos un mensaje de confirmación.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `DELETE /employees/{id}/vacation_definitions/{code}`

**Desasigna una política de vacación del empleado**

Desasignar una política de vacaciones para un empleado. Los párametros son:
- employee_id : (OBLIGATORIO) Id del empleados
- code : (OBLIGATORIO) Code de la política de vacaciones a desasignar.
- date : (OPCIONAL) Fecha de desasignación en formato YYYY-MM-DD. Si no se envía, se usa la fecha de hoy.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.
* Permisos de vacaciones en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | Id del empleado |
| `code` | path | string | ✓ | Código de la política de vacaciones. |
| `date` | query | string (date) |  | Fecha de desasignación (formato YYYY-MM-DD). Si no se envía, se usa la fecha de hoy. |

### Respuestas

- **200** — Como respuesta recibimos un mensaje de confirmación.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/vacations_available`

**Mostrar cantidad de días disponible para vacaciones**

Recibimos la cantidad de días.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de vacaciones en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID o Número de Documento del Colaborador a consultar. En caso de ser Número de Documento, no debe tener puntos ni guion. |
| `discount` | query | boolean |  | Descontar vacaciones tomadas a futuro. (true, false) |
| `date` | query | string (date) |  | La fecha en la que se calculará las vacaciones pendientes (Formato: DD-MM-YYYY), por defecto será el último día del mes abierto |

### Respuestas

- **200** — 'Como respuesta recibimos un arreglo (data) con la información del Colaborador y sus vacaciones'
 → `VacationsAvailable`
- **400** — Existe un error con los datos enviados → `bad_request`

---
