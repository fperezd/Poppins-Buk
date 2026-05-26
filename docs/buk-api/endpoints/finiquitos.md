# Finiquitos

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /jobs/{id}/termination`

**Obtener finiquito**

Obtener finiquito mediante el id de un trabajo

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura'.
* Permitir ver información sensible en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del trabajo |

### Respuestas

- **200** — Como respuesta recibimos un objeto de tipo finiquito
- **404** — No Existe el recurso solicitado

---

## `POST /jobs/{id}/termination`

**Crear Finiquito**

Crear un Finiquito mediante un id de Trabajo y los datos del Finiquito

razon debe ser uno de los siguientes valores: mutuo_acuerdo, renuncia, muerte, vencimiento_plazo, fin_servicio, :caso_fortuito, falta_probidad, acoso_sexual, vias_de_hecho, injurias, conducta_inmoral, acoso_laboral, negociaciones_prohibidas, no_concurrencia, abandonar_trabajo, faltas_seguridad, perjuicio_material, incumplimiento, necesidades_empresa, desahucio_gerente


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de empleados en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del trabajo |
| `Finiquito` | body | `FiniquitoInputCountry` | ✓ | Parámetros de Finiquito |

### Respuestas

- **201** — Objeto de tipo Finiquito

---
