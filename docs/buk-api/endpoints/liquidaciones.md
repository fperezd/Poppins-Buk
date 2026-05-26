# Liquidaciones

**Base path:** `/api/v1/chile`

5 endpoint(s).

## `GET /employees/{employee_id}/payroll_detail`

**Mostar detalle del Colaborador**

Recibimos la id o rut del Colaborador y rango de fecha opcional

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.
* Permitir ver información sensible en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | path | string | ✓ | ID o RUT del postulante por el cual se está consultando. El RUT solo es permitido sin puntos, puede ser con o sin el caracter de guión. |
| `period_type` | query | string (date) |  | Tipo de periodo por el que quieres consultar, puede ser weekly, semi_monthly o monthly. Es monthly por defecto. |
| `start` | query | string (date) |  | Fecha de inicio de la liquidacion (Formato DD-MM-YYYY) |
| `end` | query | string (date) |  | Fecha de término de la liquidacion (Formato DD-MM-YYYY) |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos todo el detalle del Colaborador consultado

---

## `GET /employees/{id}/statements/{year}-{month}.pdf`

**Archivo de la Liquidación**

Obtiene el archivo pdf de la Liquidación del Colaborador asociada a un mes y año dado.
Obtiene el archivo pdf de la Liquidación del Colaborador asociada a un mes y año dado.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.
* Permitir ver información sensible en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | Identificador del Colaborador |
| `year` | path | integer | ✓ | Año consultado |
| `month` | path | integer | ✓ | Mes consultado (1 - 12) |

### Respuestas

- **200** — Retorna la información de la Liquidación PDF correspondiente al mes."
- **400** — La petición enviada no cumple con el formato adecuado
- **404** — No existe información para el mes y año ingresados

---

## `GET /payroll_detail/month`

**Listar Liquidaciones**

Retorna todas las Liquidaciones del mes indicado.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.
* Permitir ver información sensible en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `date` | query | string (date) |  | La fecha en la que deben extraer las Liquidaciones de lo Colaboradores (Formato DD-MM-YYYY) |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos todo el detalle de las Liquidaciones del mes consultado

---

## `GET /payroll_detail/semi_month`

**Listar Liquidaciones**

Retorna todas las Liquidaciones de la quincena indicada.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.
* Permitir ver información sensible en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `date` | query | string (date) |  | La fecha en la que deben extraer las Liquidaciones de lo Colaboradores (Formato DD-MM-YYYY) |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos todo el detalle de las Liquidaciones de la quincena consultada

---

## `GET /payroll_detail/week`

**Listar Liquidaciones**

Retorna todas las Liquidaciones de la semana indicada.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.
* Permitir ver información sensible en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `date` | query | string (date) |  | La fecha en la que deben extraer las Liquidaciones de lo Colaboradores (Formato DD-MM-YYYY) |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos todo el detalle de las Liquidaciones de la semana consultada

---
