# Recintos

**Base path:** `/api/v1/chile`

3 endpoint(s).

## `GET /recintos`

**Mostrar Recintos**

Entrega la información de cada Recinto

Un Recinto posee los siguientes atributos:
- name: Nombre del Recinto
- code: Código del Recinto
- location_id: Id de la Comuna del Recinto (puede revisar endpoint GET /locations)
- city: Ciudad
- address_name: Nombre la calle del Recinto
- address_number: Número de la dirección del Recinto
- address_optional: Referencia de la dirección
- latitude: Latitud del Recinto
- longitude: Longitud del Recinto
- postcode: Código Postal del Recinto
- integrated_with_ctrl: Integración con CTRL
- codigo_establecimiento: Código del Establecimiento


Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `code` | query | string |  | - code: Código del Recinto (OPCIONAL) |

### Respuestas

- **200** — Un arreglo (data) con la información de los Recintos.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /recintos`

**Crear un Recinto**

Crea un nuevo Recinto en el sistema. Los parámetros son:

- name: Nombre del Recinto
- code: Código del Recinto
- location_id: id de la localización del Recinto (puede revisar endpoint GET /locations)
- address_name: Nombre la calle del Recinto
- address_number: Numero de la dirección del Recinto
- address_optional: Referencia de la dirección (OPCIONAL)
- latitude: Latitud del Recinto (OPCIONAL)
- longitude: Longitud del Recinto (OPCIONAL)
- postcode: Código Postal del Recinto (OPCIONAL)
- codigo_establecimiento: Código del Establecimiento (OPCIONAL)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Recinto` | body | `Recinto::Create` | ✓ | Objeto de tipo Recinto |

### Respuestas

- **201** — Recinto creado.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /recintos/{code}`

**Actualiza un Recinto**

Actualiza un Recinto existente en el sistema. Los parámetros son:

Los valores ingresados sobrescribirán los datos del Recinto que se está editando

- identifier: Id del Recinto existente
- name: Nombre del Recinto (OPCIONAL)
- code: Código del Recinto (OPCIONAL)
- location_id: id de la localización del Recinto (puede revisar endpoint GET /locations) (OPCIONAL)
- address_name: Nombre la calle del Recinto (OPCIONAL)
- address_number: Numero de la dirección del Recinto (OPCIONAL)
- address_optional: Referencia de la dirección (OPCIONAL)
- latitude: Latitud del Recinto (OPCIONAL)
- longitude: Longitud del Recinto (OPCIONAL)
- postcode: Código Postal del Recinto (OPCIONAL)
- codigo_establecimiento: Código del Establecimiento (OPCIONAL)

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de asistencia en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `code` | path | string | ✓ | - Código del Recinto existente |
| `recinto` | body | `Recinto::Update` | ✓ | Objeto de tipo Recinto |

### Respuestas

- **202** — 
- **400** — Existe un error con los datos enviados → `bad_request`

---
