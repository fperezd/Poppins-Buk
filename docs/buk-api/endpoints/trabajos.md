# Trabajos

**Base path:** `/api/v1/chile`

6 endpoint(s).

## `GET /jobs/events/hires`

**Listar los altas de trabajos para los Colaboradores**

Retorna las altas de Colaborador. Posee fecha de inicio y término para especificar un periodo de consulta.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `start_date` | query | string (date) |  | Fecha de inicio del periodo de consulta en YYYY-MM-DD. |
| `end_date` | query | string (date) |  | Fecha de término del periodo de consulta en YYYY-MM-DD. |
| `sort` | query | string |  | Parámetro para ordenar registros, el único valor posible es 'id', si no se envia se ordena por nombre |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Página de trabajos a obtener. Por defecto se muestra la primera. |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de los movimientos recuperados
- **400** — La petición enviada no cumple con el formato adecuado

---

## `GET /jobs/events/movements`

**Listar los movimientos de trabajos para los Colaboradores**

Retorna la lista de movimiento de Colaborador. Posee fecha de inicio y término para especificar un periodo de consulta.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `start_date` | query | string (date) |  | Fecha de inicio del periodo de consulta en YYYY-MM-DD. |
| `end_date` | query | string (date) |  | Fecha de término del periodo de consulta en YYYY-MM-DD. |
| `sort` | query | string |  | Parámetro para ordenar registros, el único valor posible es 'id', si no se envia se ordena por nombre |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Página de trabajos a obtener. Por defecto se muestra la primera. |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de los movimientos recuperados
- **400** — La petición enviada no cumple con el formato adecuado

---

## `GET /jobs/events/terminations`

**Listar las bajas**

Retorna los trabajos finalizados cuya fecha de término sea entre la fecha de inicio (start_date) y fecha de término (end_date).

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `start_date` | query | string (date) |  | Fecha de inicio del periodo de consulta |
| `end_date` | query | string (date) |  | Fecha de término del periodo de consulta |
| `sort` | query | string |  | Parámetro para ordenar registros, el único valor posible es 'id', si no se envia se ordena por nombre |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Página de trabajos a obtener. Por defecto se muestra la primera. |

### Respuestas

- **200** — Resultados paginados de las bajas en el periodo indicado.
- **400** — La petición enviada no cumple con el formato adecuado

---

## `PATCH /jobs/{id}/terminate`

**Termina el trabajo con id entregado.**

Termina el trabajo del id entregado. Requiere fecha de término y razón de término (a menos que sea contrato a honorarios). Los parámetros son:
- end_date: Fecha de término del trabajo.
- termination_reason: Razón de término del trabajo. Las razones aceptadas son:

"Chile: ["mutuo_acuerdo", "renuncia", "muerte", "vencimiento_plazo", "fin_servicio", "caso_fortuito", "falta_probidad", "acoso_sexual", "vias_de_hecho", "injurias", "conducta_inmoral", "acoso_laboral", "negociaciones_prohibidas", "no_concurrencia", "abandonar_trabajo", "faltas_seguridad", "perjuicio_material", "incumplimiento", "necesidades_empresa", "desahucio_gerente"]"

"Perú: ["renuncia", "renuncia_con_incentivos", "despido", "cese_colectivo", "jubilacion", "invalidez_absoluta_permanente", "terminacion_de_la_obra", "mutuo_disenso", "fallecimiento", "sucesion_en_posicion_empleador", "extincion_o_liquidacion_empleador", "no_se_inicio_relacion_laboral", "limite_edad", "injustificado"]"

"México: ["renuncia_voluntaria", "muerte", "causa_imputable_patron", "despido_injustificado", "despido_justificado", "terminacion_natural", "incapacidad_permanente", "invalidez_trabajador", "reajuste_maquina", "clausura", "abandono_empleo", "ausentismo", "jubilacion", "otras"]"

"Colombia: ["renuncia_voluntaria", "causa_justa_empleador", "termino_mutuo_acuerdo", "vencimiento_plazo", "termino_obra", "termino_sentencia", "muerte", "termino_abandono", "sustitucion_patronal", "abandono_cargo", "decision_unilateral"]"

- comment: Comentario interno del término del trabajo (OPCIONAL)
- employee_final_state: Estado final del Colaborador, por defecto queda inactivo: ["pendiente", "inactivo"] (OPCIONAL)
- notice_date: Fecha de aviso de término de trabajo en YYYY-MM-DD, en caso de no agregar este campo se considerará el end_date. (OPCIONAL)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer |  | ID del trabajo a terminar. |
| `Job` | body | `JobTerminateInput` | ✓ | Objeto de tipo Job actualizado |

### Respuestas

- **200** — Como respuesta se recibe el trabajo del Colaborador que ha terminado correctamente.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /jobs/{id}/undo`

**Deshacer el último movimiento y vuelve al trabajo anterior**

Deshacer el último movimiento y vuelve al trabajo anterior
**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del job a consultar. |

### Respuestas

- **201** — Como respuesta recibimos la información del trabajo restaurado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /jobs/{id}/undo_terminate`

**Anulación de término**

Anula el término de un trabajo.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del job a anular. |

### Respuestas

- **200** — Como respuesta recibimos la información del trabajo restaurado
- **400** — Existe un error con los datos enviados → `bad_request`

---
