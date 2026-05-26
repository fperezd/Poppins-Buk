# Sincronización datos de pago

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `POST /employees/{employee_id}/payment_data/{period_id}`

**Crea o actualiza las asignaciones y sobretiempos de un determinado Colaborador para una periodo dado.**

Se guardarán los datos enviados solo si ningún objeto presenta errores.
De lo contrario, se retornarán los objetos que posean uno o más errores.
En el caso de que el objeto ya exista previamente, este será actualizado con los datos enviados.

Cada asignación se compone de
- id: ID de la Asignación a eliminar (opcional)
- _destroy: boolean (opcional) (para poder eliminar un Asignación debe estar id y _destroy en el objeto en cuestión)
- item_id: ítem asignado al Colaborador
- amount: para ítems configurados con monto "distinto por persona", este valor corresponde al ingresado
  en la asignación y para ítems configurados con monto "igual para todos" este valor será el monto del
  ítem ingresado en su creación. Para un ítem formulado representa el valor de `item.monto`
- end_date: periodo de término para la asignación. De no ser enviado, la asignación se considerará vigente de forma indefinida
- custom_attrs: objeto con atributo custom y valor

Cada sobretiempo se compone de:
- day: Día el cual se realizó las horas extras (opcional)
- hours: Cantidad de horas extras a agregar
- type_id: Identificador del tipo de hora extra a agregar
- centro_costo: Código de centro de costo al cual se cargarán las horas extras

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.
* Permisos de ítems en: 'Lectura y Modificación'.
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | integer | ✓ |  |
| `period_id` | path | integer | ✓ |  |
| `body` | body |  |  | Objeto con asignaciones y sobretiempos. |

### Respuestas

- **200** — Se devuelve data con asignaciones y sobretiempos creados para un cierto periodo.
- **404** — El Colaborador 'employee_id' o el periodo 'period_id' no existen.

---
