# KPIs

**Base path:** `/api/v1/chile`

4 endpoint(s).

## `GET /kpi_data`

**Listar datos de KPI**

#<Proc:0x00007fd64ab96860 /usr/src/app/packs/nomina/core/kpis/app/controllers/api/v1/kpi_data_controller.rb:10 (lambda)>

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de datos de KPI en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `kpi_id` | query | integer |  | Filtra los datos de KPI asociados con el tipo de KPI indicado |
| `empresa_id` | query | integer |  |  |
| `area_id` | query | integer |  | Filtra los datos de KPI asociados con la área indicada |
| `employee_id` | query | integer |  | Filtra los datos de KPI asociados con el empleado indicado |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de los datos de KPI

---

## `POST /kpi_data`

**Ingresar un dato de KPI**

#<Proc:0x00007fd64ab937a0 /usr/src/app/packs/nomina/core/kpis/app/controllers/api/v1/kpi_data_controller.rb:66 (lambda)>

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de datos de KPI en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `kpi_datum` | body | `KPIDatum` | ✓ | Atributos del nuevo dato de KPI |

### Respuestas

- **201** — Respuesta en caso de haber registrado un dato de KPI de forma exitosa
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /kpi_data/{id}`

**Actualizar un dato de KPI**

Actualiza el dato de un KPI.

Se debe enviar en el body de la request un objeto tipo JSON el siguiente parámetro:
- **value:** Valor a sobreescribir en KPI.

Un ejemplo puede ser:

**PATH:** `/kpi_data/1`

**BODY:**
```json
  {
    "value": 100
  }
```


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de datos de KPI en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del kpi_data a modificar. |
| `value` | query | number (float) | ✓ | Valor a sobrescribir en KPI. |

### Respuestas

- **200** — Como respuesta obtenemos el KPI con los valores actualizados → `KPIDatum`

---

## `GET /kpis`

**Listar tipos de KPI**

Retorna todos los tipos de KPI registrados en el sistema

Un tipo de KPI posee los siguientes atributos
- id: identificador único del tipo de KPI
- name: nombre descriptivo
- code: código interno
- related_to: nombre de entidad a la que se asocia el tipo de KPI
- units: unidad de medida del tipo de KPI


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tipos de KPI en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `name` | query | string |  | Filtra los tipos de KPI con este nombre |
| `code` | query | string |  | Filtra los tipos de KPI con este código |
| `related_to` | query | string |  | Filtra los tipos de KPI con esta entidad asociada |
| `units` | query | string |  | Filtra los tipos de KPI con esta unidad de medida |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de los tipos de KPI

---
