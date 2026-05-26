# Centro de costo

**Base path:** `/api/v1/chile`

6 endpoint(s).

## `GET /centro_costo_definitions`

**Mostrar centros de costo**

Recibimos la información relacionada a los centro de costo

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | Tamaño de la página |
| `page` | query | integer |  | Nro de página |

### Respuestas

- **200** — Como respuesta recicibimos la información correspondiente a todos los centro de costo → `CentroCostoDefinition`

---

## `POST /centro_costo_definitions`

**Crear centro de costo**

Crea un nuevo centro de costo en el sistema. Los parámetros son

- code : Código del centro de costo
- previred_code : Código para previred del centro de costo
- custom_attributes: Código y valor de atributos personalizados del centro de costo
:

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `centro_costo_definition` | body | `centro_costo_definition_detail` | ✓ | Parámetros de un centro de costo |

### Respuestas

- **201** — Respuesta en caso de haber creado un centro de costo de forma exitosa → `centro_costo_definition_response`
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /centro_costo_definitions/centro_costo`

**Indicar centro de costo del trabajo**

Permite indicar el centro de costo relacionad a un trabajo

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `centro_costo` | body | `centro_costo_request` |  | Objeto de tipo centro de costo |

### Respuestas

- **200** — Respuesta al crear centro de costo de trabajo
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PUT /centro_costo_definitions/update`

**Actualizar información centro de costo**

Permite indicar el nuevo código y código previred de un centro de costo

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `centro_costo_definition` | body | `centro_costo_definition_detail` |  | Objeto de tipo centro de costo definition |

### Respuestas

- **200** — Respuesta al reemplazar centro de costo
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /centro_costo_definitions/{id}`

**Mostrar centro de costo**

Recibimos la información relacionada al centro de costo cuyo ID enviamos en la consulta

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del centro de costo |

### Respuestas

- **200** — Como respuesta recibimos la información correspondiente al centro de costo buscado → `CentroCostoDefinition`

---

## `PATCH /centro_costo_definitions/{id}`

**Actualizar un centro de costo por ID**

Permite indicar el nuevo código, código previred y atributos personalizados de un centro de costo

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de contabilidad en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del centro de costo |
| `body` | body | `centro_costo_definition_detail` | ✓ |  |

### Respuestas

- **200** — Respuesta al reemplazar centro de costo → `centro_costo_definition_response`
- **400** — Existe un error con los datos enviados → `bad_request`

---
