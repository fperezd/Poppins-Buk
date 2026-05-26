# Evaluaciones

**Base path:** `/api/v1/chile`

3 endpoint(s).

## `GET /talent/evaluation_process/{id}/results/capacities`

**Mostrar resultados de Competencias de una evaluación de desempeño**

Entrega los resultados relacionados a las Competencias de la evaluación de desempeño consultada.
Un resultado de Competencias de una evaluación de desempeño posee los siguientes atributos:
- evaluation_id: identificador único de la evaluación de desempeño
- evaluation_status: estado del evaluado
- evaluated_name: nombre del evaluado
- evaluated_rut: RUT del evaluado
- evaluated_document_number: Número de Documento del evaluado
- evaluated_document_type: Tipo de Documento del evaluado
- role: cargo del evaluado
- role_family: familia de cargo del evaluado
- division: división del evaluado
- area: área del evaluado
- sub_area: sub área del evaluado
- evaluation_type: tipo de evaluación
- evaluator_name: nombre del evaluador
- evaluator_rut: RUT del evaluador
- evaluator_document_number: Número de Documento del evaluador
- evaluator_document_type: Tipo de Documento del evaluador
- score_by_capacity: nota por Competencia
- capacities_score: nota final de Competencias
- score: nota final de la evaluación

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de evaluaciones en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la evaluación de desempeño a consultar |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Número de página |

### Respuestas

- **200** — Como respuesta recibimos los resultados relacionados a las Competencias de la evaluación de desempeño.
- **404** — Evaluación de desempeño no encontrada
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /talent/evaluation_process/{id}/results/goals`

**Mostrar resultados de Metas de una evaluación de desempeño**

Entrega los resultados relacionados a los Metas de la evaluación de desempeño consultada.
Un resultado de Metas de una evaluación de desempeño posee los siguientes atributos:
- evaluation_id: identificador único de la evaluación de desempeño
- evaluation_status: estado del evaluado
- evaluated_name: nombre del evaluado
- evaluated_rut: RUT del evaluado
- evaluated_document_number: Número de Documento del evaluado
- evaluated_document_type: Tipo de Documento del evaluado
- role: cargo del evaluado
- role_family: familia de cargo del evaluado
- division: división del evaluado
- area: área del evaluado
- sub_area: sub área del evaluado
- evaluation_type: tipo de evaluación
- evaluator_name: nombre del evaluador
- evaluator_rut: RUT del evaluador
- evaluator_document_number: Número de Documento del evaluador
- evaluator_document_type: Tipo de Documento del evaluador
- score_by_goal: nota por Meta
- goals_score: nota final de Metas
- score: nota final de la evaluación

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de evaluaciones en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID de la evaluación de desempeño a consultar |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Número de página |

### Respuestas

- **200** — Como respuesta recibimos los resultados relacionados a los Metas de la evaluación de desempeño.
- **404** — Evaluación de desempeño no encontrada
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /talent/evaluation_processes`

**Mostrar evaluaciones de desempeño**

Entrega los datos de las evaluaciones de desempeño disponibles.
Cada evaluación de desempeño posee los siguientes atributos:
- id: identificador único de la evaluación de desempeño
- name: nombre de la evaluación de desempeño
- participants: número de participantes agregados a la evaluación de desempeño
- status: estado de la evaluación de desempeño
- start_date: fecha de inicio de la evaluación de desempeño
- end_date: fecha de finalización de la evaluación de desempeño
- global_progress: porcentaje de formularios finalizados 
- stages: etapas configuradas para la evaluación de desempeño

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de evaluaciones en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | (OPCIONAL) Número de página |

### Respuestas

- **200** — Como respuesta recibimos las evaluaciones de desempeño existentes.
- **400** — Existe un error con los datos enviados → `bad_request`

---
