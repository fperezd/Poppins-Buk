# Registros de Trabajo

**Base path:** `/api/v1/chile`

3 endpoint(s).

## `GET /piecework/worklogs`

**Listar Registros de Trabajo**

'Retornar Registros de Trabajo'

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | query | integer |  | (Opcional) ID del empleado asociado al Registro de Trabajo |
| `variable_id` | query | integer |  | (Opcional) ID del periodo asociado al Registro de Trabajo |
| `empresa_id` | query | integer |  |  |
| `area_id` | query | integer |  | (Opcional) ID del área a la que pertenece el empleado asociado al Registro de Trabajo |
| `page_size` | query | integer |  | (Opcional) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100]  |

---

## `POST /piecework/worklogs`

**Crear Registro de Trabajo**

Crea un nuevo Registro de Trabajo en el sistema. Los parámetros son:
  - day: Fecha del trato en formato YYYY-MM-DD.
  - employee_id: ID del empleado.
  - monetary_floor: [integer] Se define piso de la tarifa de forma manual. Requerido si tratos simplificado y no se tiene el calculo de piso por el sistema.
  - daily_base_floor: [boolean] Calcular piso del trato sin redondear (Opcional)
  - overwrite_existing: [boolean] (Opcional)
  - discount_day_amount: [boolean] (Opcional)
  - calculate_total_pay: [boolean] (Opcional)
  - sync_attendance: [integer] Posibles valores: 0 (no sincronizar), 1 (días trabajados), 2 (ausencias), 3 (días trabajados y ausencias).
  - informative: [boolean] (Opcional) Si es que el trato es del tipo informativo y no se debe considerar en la liquidación, informative debe ser true. (Default: false)
  - Worklogs: [array]
    - production: (Opcional) Cantidad de unidades producidas.
    - piecework_execution_id: ID de la tarifa.
    - rate_value: (Opcional) Valor de la tarifa aplicada.
    - total_pay: Valor que se pagará al empleado por este trato.
    - work_type: Tipo de Trabajo. Posibles valores: 'ausencia', 'dia', 'trato', 'bono'.
    - saved_in: Posibles valores: 'porcentaje', 'horas'.
    - worked_units: Unidades trabajadas. Debe ser consistente con el atributo 'saved_in'.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Registro de Trabajo` | body |  | ✓ | Objeto de tipo Registro de Trabajo |

---

## `PATCH /piecework/worklogs/{id}`

**Editar un Registro de Trabajo**

Edita un Registro de Trabajo existente en el sistema. Los parámetros son:
  - monetary_floor: [integer] Se define piso de la tarifa de forma manual. Requerido si tratos simplificado y no se tiene el calculo de piso por el sistema.
  - daily_base_floor: [boolean] Calcular piso del trato sin redondear (Opcional)
  - discount_day_amount: [boolean] (Opcional)
  - calculate_total_pay: [boolean] (Opcional)
  - sync_attendance: [integer] Posibles valores: 0 (no sincronizar), 1 (días trabajados), 2 (ausencias), 3 (días trabajados y ausencias).
  - informative: [boolean] (Opcional) Si es que el trato es del tipo informativo y no se debe considerar en la liquidación, informative debe ser true. (Default: false)
  - worklog [object]:
    - day: Fecha del trato en formato YYYY-MM-DD.
    - work_type: Tipo de Trabajo. Posibles valores: 'ausencia', 'dia', 'trato', 'bono'.
    - worked_units: Unidades trabajadas. Debe ser consistente con el atributo 'saved_in'.
    - production: Cantidad de unidades producidas.
    - rate_value: Valor de la tarifa aplicada.
    - total_pay: Valor que se pagará al empleado por este trato.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del registro de trabajo a modificar. |
| `Registro de Trabajo` | body |  | ✓ | Objeto de tipo Registro de Trabajo |

---
