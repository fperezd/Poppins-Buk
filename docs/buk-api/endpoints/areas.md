# Áreas

**Base path:** `/api/v1/chile`

7 endpoint(s).

## `GET /areas`

**Listar áreas**

Crea una nueva Área en el sistema.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `status` | query | string |  | (OPCIONAL) Filtra los resultados por el estado del área. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | Número de página |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de las áreas

---

## `GET /areas/{id}`

**Obtener un área en especifico por ID**

Retorna el área correspodiente al ID
Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del área a consultar |

### Respuestas

- **200** — Como respuesta recibirás un área

---

## `DELETE /organization/areas`

**Eliminar áreas por ID**

Elimina Áreas en el sistema. - `id`: Id del Área.
Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | query | integer | ✓ | Elimina Áreas en el sistema. - `id`: Id del Área. |

### Respuestas

- **200** — Recibirás una respuesta de éxito o de error
- **404** — Cuando no hay recursos permitidos que borrar
- **400** — Cuando hay un error al borrar un registro

---

## `POST /organization/areas`

**Crear Área**

Crea una nueva Área en el sistema.
- `parent_id`: [string] Id del Área padre.
- `name`: [string] Nombre del Área a crear.
- `accounting_prefix`: [string] Prefijo costos.
- `city`: [string] Ciudad del Área a crear.
- `address`: (opcional) [string] Dirección del Área a crear.
- `cost_center_id`: [string] Id del centro de costo.
- `location_id`: [integer] Id de la Location del Área a crear.
- `role_ids`: [array] Ids de los roles del Área a crear.
- `custom_attrs`: [object] Objeto con atributo custom y valor.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `body` | body | `Area::Create` | ✓ |  |

### Respuestas

- **201** — Como respuesta recibirás un área
- **404** — No Existe el recurso solicitado
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /organization/areas/`

**Listar áreas**

Retorna todas las áreas, incluyendo las de nivel 0 y nivel 1.


Descripción de Atributos:
- `id`: [string] Id del Área.
- `name`: [string] Nombre del Área.
- `address`: (opcional) [string] Dirección del Área.
- `children_area`: [object] Objeto con Área hijas.
- `parent_area`: [object] Objeto con Área padre.
- `first_level_id`: [string] Id del área de primer nivel del Área.
- `first_level_name`: [string] Nombre del área de primer nivel del Área.
- `second_level_id`: [string] Id del área de segundo nivel del Área.
- `second_level_name`: [string] Nombre del área de segundo nivel del Área.
- `depth`: [string] Nivel de Área.
- `cost_center`: [object] Centro de costo.
- `status`: [string] Estado del Área (activo o inactivo).
- `custom_attributes`: [string] Atributos personalizados.
- `city`: [string] Ciudad del Área.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `status` | query | string |  | (OPCIONAL) Filtra los resultados por el estado del área. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | Número de página |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con la información de las áreas

---

## `GET /organization/areas/{id}`

**Obtener un área en especifico por ID**

Retorna el área correspodiente al ID, incluyendo aquellas de nivel 0 y nivel 1.


Descripción de Atributos:
- `id`: [string] Id del Área.
- `name`: [string] Nombre del Área.
- `address`: (opcional) [string] Dirección del Área.
- `children_area`: [object] Objeto con Área hijas.
- `parent_area`: [object] Objeto con Área padre.
- `first_level_id`: [string] Id del área de primer nivel del Área.
- `first_level_name`: [string] Nombre del área de primer nivel del Área.
- `second_level_id`: [string] Id del área de segundo nivel del Área.
- `second_level_name`: [string] Nombre del área de segundo nivel del Área.
- `depth`: [string] Nivel de Área.
- `cost_center`: [object] Centro de costo.
- `status`: [string] Estado del Área (activo o inactivo).
- `custom_attributes`: [string] Atributos personalizados.
- `city`: [string] Ciudad del Área.
Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del área a consultar |

### Respuestas

- **200** — Como respuesta recibirás un área

---

## `PATCH /organization/areas/{id}`

**Actualizar un área por ID**

Edita un Área en el sistema.
- `name`: [string] Nombre del Área.
- `accounting_prefix`: [string] Prefijo costos.
- `city`: [string] Ciudad del Área.
- `address`: (opcional) [string] Dirección del Área.
- `cost_center_id`: [string] Id del centro de costo [string] Dirección del Área.
- `location_id`: [integer] Id de la Location del Área.
- `role_ids`: [array] Ids de los roles del Área.
- `custom_attrs`: [object] Objeto con atributo custom y valor.
- `active`: [boolean] Estado del Área.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del área a consultar |
| `body` | body | `Area::Update` | ✓ |  |

### Respuestas

- **200** — Como respuesta recibirás un área

---
