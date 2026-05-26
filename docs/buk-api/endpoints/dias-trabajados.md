# Días trabajados

**Base path:** `/api/v1/chile`

3 endpoint(s).

## `GET /working_days`

**Mostrar días trabajados**

Entrega la información de los días trabajados para cada Colaborador.

Un tipo de Día Trabajado posee los siguientes atributos
- employee_id: identificador único del Colaborador
- document_number: Número de Documento del Colaborador
- document_type: Tipo de Documento del Colaborador
- code: código de la ficha del Colaborador
- working_days: total de días trabajados
- working_days_dates: fechas de los días trabajados

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `from` | query | string (date) |  | (OPCIONAL) Indica la fecha inicial de días trabajados (Formato YYYY-MM-DD) |
| `to` | query | string (date) |  | (OPCIONAL) Indica la fecha final de días trabajados (Formato YYYY-MM-DD) |
| `document_number` | query | string |  | (OPCIONAL) Número de Documento del Colaborador |
| `code` | query | string |  | (OPCIONAL) Código de la ficha del Colaborador |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Nro de página |

### Respuestas

- **200** — Una lista de los días trabajados para cada Colaborador.

---

## `POST /working_days`

**Crear días trabajados**

Guarda los días trabajados para cada Colaborador. Los parámetros son:

- employee_id: Id del Colaborador
- month: Número del mes el cual se agregarán los días trabajados
- working_days: lista de días trabajados del mes que se indica, esta lista debe ser de una secuencia de números enteros, donde cada número representa un día del mes y separados por una coma.

Hay que considerar que los días trabajados se guardan en el mes indicado sobrescribiendo la entrada, en otras palabras, cada solicitud sobrescribirá los días trabajados.

Hay que considerar que si el trabajador tiene la liquidación cerrada para ese mes no se podrá asignar los días trabajados.

Hay que considerar que solo se agregar días trabajados en meses abiertos.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `WorkingDay` | body | `WorkingDay::Minimal` |  | Objeto de tipo WorkingDay |

### Respuestas

- **201** — Respuesta en caso de haber creado los días trabajados de forma exitosa

---

## `DELETE /working_days/{employee_id}/{monthyear}`

**Eliminar días trabajados**

Elimina los días trabajados para un Colaborador. Los parámetros son:

- employee_id: Id del Colaborador
- Fecha para eliminación de días trabajados(Formato MM-YYYY)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | integer | ✓ | - employee_id: Id del Colaborador |
| `monthyear` | path | string (date) | ✓ | - Fecha para eliminación de días trabajados(Formato MM-YYYY) |

### Respuestas

- **200** — Respuesta en caso de haber borrado los días trabajados de forma exitosa
- **404** — Cuando no hay recursos permitidos que borrar
- **400** — Existe un error con los datos enviados → `bad_request`

---
