# Tarifas

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /piecework/executions`

**Listar Tarifas**

'Retornar tarifas desde la fecha de creación dada'

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `created_at` | query | string (date) |  | (OPCIONAL) Fecha en que fue creada la tarifa en YYYY-MM-DD. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100]  |

---

## `POST /piecework/executions`

**Crear tarifa**

Crea una nueva tarifa en el sistema. Los parámetros son:

- piecework_place_id : Id del lugar.
- piecework_task_id : Id del labor.
- piecework_unit_id : Id del unidad.
- piecework_product_id: Id del producto.
- formula : Valor de la tarifa, si la tarifa es simple no se requiere.
- start_date : Fecha de inicio de la tarifa.
- end_date: Fecha de finalización de la tarifa. OPCIONAL
- type_rate : Tipo de tarifa, normal(0) o simple(1). Por defecto es 0.
- monetary_floor : Se define piso de la tarifa de forma manual. Requerido si la tarifa es normal y no se tiene el calculo de piso por el sistema.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Tarifa` | body |  | ✓ | Objeto de tipo tarifa |

---
