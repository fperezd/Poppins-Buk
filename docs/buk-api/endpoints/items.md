# Items

**Base path:** `/api/v1/chile`

5 endpoint(s).

## `POST /assigns`

**Asignar un ítem**

No se recomienda el uso de este endpoint para cliente grandes. Para operaciones masivas se recomienda usar el endpoint de **Sincronización datos de pago**.

Asigna un nuevo ítem a un empleado en el sistema.

  - `employee_id`: Id del empleado al cual se asignará un ítem.
  - `item_id`: Id del ítem el cual se asignará al usuario.
  - `start_date`: Mes de inicio para esta asignación.
  - `end_date`: (opcional) Mes de término para esta asignación.
  - `description`: (opcional) Descripción a mostrar en la liquidación.
  - `amount`: Monto de la asignación. Requerido sólo para ítems de tipo variable.
  - `advance_payment_day`: (opcional) Día del mes en el que se paga el ítem si es de tipo anticipo.
  - `overwrite_existing_assign`: (opcional) [boolean] Indica que se quiere emular el
    comportamiento del importador masivo. Esto es, permitir sobreescribir la asignación en caso de que ya exista.
  - `cost_center`: (opcional) [string] Centro de costo, debe estar habilitada la general Habilitar Centro Costo Bonos.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `body` | body | `Assign::Create` | ✓ |  |

### Respuestas

- **200** — Se devuelve la asignación creada.
- **400** — Faltan datos que son obligatorios.
- **404** — El empleado `employee_id` o el bono `item_id` no existen.

---

## `DELETE /assigns/{id}`

**Eliminar una asignación**

Elimina una asignación.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | id de la asignación |

### Respuestas

- **200** — Respuesta de la api ante la eliminación de la asignación.
- **503** — No se pudo procesar la solicitud. Intente nuevamente.
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /assigns/{id}`

**Editar una asignación**

Prefiera el uso del endpoint de **Sincronización datos de pago**

Se modifica una Asignación del sistema.

Se debe enviar como JSON un objeto tipo Assign en el cuerpo de la petición,
compuesto por los siguientes atributos

  - `cost_center`: (opcional) [string] Centro de costo, debe estar habilitada la general Habilitar Centro Costo Bonos.
  - `amount`: Monto de la asignación. Requerido solo para ítems de tipo variable

La asignación tiene que ser de un bono variable para poder cambiar el monto.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | id de la asignación |
| `Assign` | body |  |  | Objeto de tipo assign |

### Respuestas

- **200** — Respuesta de la api ante el termino de la asignación.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /assigns/{id}/terminate`

**Terminar una asignación de ítem**

Termina la asignación de un ítem.

Se debe enviar como JSON la fecha de término (opcional) en el cuerpo de la petición,
en caso de no enviarla su valor será el período actual.

La fechas deben estar en formato YYYY-MM-DD.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | id de la asignación |
| `Assign` | body |  |  | fecha de término |

### Respuestas

- **200** — Respuesta de la api ante el termino de la asignación.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/assigns`

**Mostrar asignaciones de ítems de un empleado**

Retorna las asignaciones vigentes de un empleado
junto con información básica del ítem asignado.

Cada asignación se compone de
- id: identificador único de la asignación
- item: ítem asignado al empleado
- amount: para ítems configurados con monto "distinto por persona", este valor corresponde al ingresado
  en la asignación y para ítems configurados con monto "igual para todos" este valor será el monto del
  ítem ingresado en su creación. Para un ítem formulado representa el valor de `item.monto`
- start_date: periodo de inicio para esta asignación
- end_date: periodo de término para la asignación
- custom_attrs: el objeto incluye un atributo personalizado con su respectivo valor. Si no se tiene
  ningún atributo personalizado configurado, este no aparecerá en la respuesta

Cada ítem se compone de
- id: identificador único del ítem
- code: código del ítem

Se debe enviar como JSON la fecha de inicio del periodo (opcional) en el cuerpo de la petición,

La fecha debe estar en formato YYYY-MM-DD.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.
* Permisos de ítems en: 'Lectura'.
* Permitir ver información sensible en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del empleado a consultar |
| `date` | query | string (date) |  | Filtra las asignaciones que son vigentes para esta fecha |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100]  |
| `page` | query | integer |  | Número de página |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de las asignaciones
- **400** — Existe un error con los datos enviados → `bad_request`

---
