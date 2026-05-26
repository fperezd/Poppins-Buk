# Centralización contable

**Base path:** `/api/v1/chile`

7 endpoint(s).

## `GET /accounting`

**Centralización contable**

Permite obtener la información contable correspondiente a un mes específico.
Los conceptos se encuentran agrupados por la liquidación a la cual pertenecen.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `month` | query | integer |  | Mes consultado (1 - 12). OBLIGATORIO si no se indica process_id. Si se indica process_id, MONTH sera ignorado. |
| `year` | query | integer |  | Año consultado. OBLIGATORIO si no se indica process_id. Si se indica process_id, YEAR sera ignorado. |
| `process_id` | query | integer |  | ID del proceso a consultar. OBLIGATORIO si no se indica año y mes |
| `company_id` | query | string |  | ID o RUT de la Empresa a consultar. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Retorna la información contable correspondiente al mes, agrupada por liquidación. Cada grupo tiene un identificador de la liquidación que la generó.
- **400** — La petición enviada no cumple con el formato adecuado
- **404** — No existe información para el mes y año ingresados

---

## `GET /accounting/export`

**Contabilidad**

Obtiene en formato json los datos de la contabilidad

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `month` | query | integer | ✓ | Mes consultado (1 - 12) |
| `year` | query | integer | ✓ | Año consultado |
| `company_id` | query | string |  | ID o RUT de la Empresa a consultar. |
| `subprocess_id` | query | integer |  | (OPCIONAL) ID de Subproceso |
| `page` | query | integer |  | (OPCIONAL) Número de la página a consultar. Por defecto, la primera página. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. |

### Respuestas

- **200** — Retorna la información contable correspondiente al mes.
- **404** — No se encuentra disponible este metodo

---

## `GET /accounting/export_detail`

**Contabilidad por Liquidación**

Obtiene en formato json los datos de la contabilidad, pero generando para cada liquidación por separado.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `month` | query | integer | ✓ | Mes consultado (1 - 12) |
| `year` | query | integer | ✓ | Año consultado |
| `company_id` | query | string |  | ID o RUT de la Empresa a consultar. |
| `page` | query | integer |  | (OPCIONAL) Número de la página a consultar. Por defecto, la primera página. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. |

### Respuestas

- **200** — Retorna la información contable correspondiente al mes, agrupada por liquidación y Empresa. Cada grupo tiene un identificador de la liquidación que la generó.
- **404** — No se encuentra disponible este metodo

---

## `GET /accounting/export_period`

**Contabilidad**

Obtiene en formato json los datos de la contabilidad

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `process_id` | query | integer | ✓ | ID de Proceso |
| `company_id` | query | string |  |  |
| `subprocess_id` | query | integer |  | (OPCIONAL) ID de Subproceso |
| `page` | query | integer |  | (OPCIONAL) Número de la página a consultar. Por defecto, la primera página. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. |

### Respuestas

- **200** — Retorna la información contable correspondiente al periodo del proceso.
- **404** — No se encuentra disponible este metodo

---

## `GET /accounting/export_process_differences`

**Contabilidad del reproceso**

Obtiene en formato json los datos de la contabilidad por las diferencias generadas en un subproceso a raíz de un reproceso

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `process_id` | query | integer | ✓ | ID del subproceso. OBLIGATORIO |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Retorna la información contable correspondiente al reproceso de remuneraciones.
- **400** — La petición enviada no cumple con el formato adecuado
- **404** — No existe información para el mes y año ingresados

---

## `GET /accounting/vacations/balance`

**Mostrar saldo de vacaciones por mes**

Recibimos el mes de donde obtener los saldos de vacaciones de los Colaboradores.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | query | integer |  | Identificador del Colaborador |
| `year` | query | integer | ✓ | Año consultado |
| `month` | query | integer | ✓ | Mes consultado (1 - 12) |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información particular del saldo de las vacaciones

---

## `GET /ledger_account`

**Listar cuentas contables**

Retorna todos las cuentas contables registrados en el sistema.

Cada cuenta contable se compone de
  - id: identificador unico
  - created_at: fecha de creacion
  - updated_at: fecha de actualizacion
  - name: nombre asociado al concepto
  - number: numero
  - type: [general, bono, descuento, credito, aporte, tipo_sobretiempo]
  - format: [detalle, resumen]
  - document_type: tipo de documento
  - group_code: codigo de agrupacion

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page` | query | integer |  | Número de página |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de las cuentas contables
- **400** — La petición enviada no cumple con el formato adecuado

---
