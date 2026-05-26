# Créditos

**Base path:** `/api/v1/chile`

7 endpoint(s).

## `GET /credits`

**Listar créditos**

Retorna todos los descuentos de caja y créditos

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `date` | query | string (date) | ✓ | Filtra los créditos que son vigentes para esta fecha |
| `name` | query | string |  | Filtra los créditos con este nombre |
| `type` | query | string |  | Filtra los créditos del tipo especificado (["credito_personal", "dental", "leasing", "seguro_vida", "credito_otro"]) |
| `page_size` | query | integer |  | Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de los créditos
- **400** — Existe un error con los datos enviados → `bad_request`
- **404** — No Existe el recurso solicitado

---

## `POST /credits/create`

**Asignar créditos**

Crear asignaciones de créditos a un employee_id

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `employee_id` | query | integer (date) | ✓ | ID del Empleado al cual se le asigna el crédito |
| `nombre` | query | string | ✓ | Nombre -humano- para identificar el crédito |
| `tipo` | query | string | ✓ | Tipo de crédito a asignar |
| `start_date` | query | string (date) | ✓ | Fecha de inicio del periodo donde aplica el crédito, formato YYYY-MM-DD |
| `moneda` | query | string | ✓ | Si usa peso(0) o UF(1) |
| `amount` | query | integer | ✓ | Valor de la cuota |
| `cuota_actual` | query | integer | ✓ | periodo actual en el que se encuentra, default 1 |
| `duracion` | query | integer | ✓ | Cantidad de periodos a descontar |
| `comentario` | query | string |  | Comentario |
| `dia_uf` | query | string |  | Dia del cual tomar la uf en caso de ser cobrado en uf |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de los créditos → `Credit`
- **400** — Existe un error con los datos enviados → `bad_request`
- **404** — No Existe el recurso solicitado

---

## `DELETE /credits/{id}`

**Eliminar un crédito**

Elimina un crédito

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | id del crédito a eliminar |

### Respuestas

- **200** — Como respuesta recibimos un mensaje indicando que el crédito se eliminó exitosamente
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /credits/{id}`

**Mostrar un crédito**

Se muestra toda la información relacionada a un crédito dado un año y un mes

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del crédito a consultar |
| `year` | query | integer | ✓ | Año a consultar en YYYY |
| `month` | query | integer | ✓ | Mes a consultar (1 - 12) |

### Respuestas

- **200** — Como respuesta recibimos todos los campos correspondiente a la información del crédito
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /credits/{id}`

**Editar un crédito**

Edita un crédito. Los campos fecha_primera_cuota y end_date no son editables. Si se edita alguno de los campos start_date o duracion, el campo end_date se calculará y actualizará


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | id del crédito a editar |
| `Créditos` | body |  | ✓ | Objeto de tipo crédito |

### Respuestas

- **200** — Como respuesta recibimos la información del crédito editado
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /credits/{id}/resume`

**reanudar un crédito**

reanudar un crédito.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del crédito a consultar |

### Respuestas

- **200** — Crédito reanudado
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /credits/{id}/suspend`

**Suspender un crédito**

Suspende un crédito.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de ítems en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del crédito a consultar |
| `Créditos` | body |  | ✓ | Objeto de tipo crédito |

### Respuestas

- **200** — Crédito suspendido
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---
