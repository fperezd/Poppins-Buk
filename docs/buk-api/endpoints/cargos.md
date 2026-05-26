# Cargos

**Base path:** `/api/v1/chile`

5 endpoint(s).

## `GET /role_families`

**Listar familia de cargos**

'Retorna todas las familias de cargos registradas en el sistema'

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `search` | query | string |  | Filtra las familias de cargos por nombre |
| `page_size` | query | integer |  | (OPCIONAL) Número de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con las familias de cargos

---

## `GET /roles`

**Listar cargos**

'Retorna todos los cargos registrados en el sistema'

Este endpoint no requiere permisos especiales.


Descripción de atributos:
- `id`: [string] Id del Cargo.
- `code`: [string] Codigo.
- `name`: [string] Nombre.
- `description`: [string] Descripción.
- `requirements`: [string] Requisitos.
- `role_family`: [object] Familia de cargo.
- `area_ids`: [array] Área al que pertenece el cargo.
- `custom_attributes`: [object] Atributos personalizados del cargo.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `search` | query | string |  | Filtra los cargos por nombre |
| `code` | query | string |  | Filtra los cargos por código |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |

### Respuestas

- **200** — Como respuesta recibimos un arreglo (data) con los cargos

---

## `POST /roles`

**Crear un cargo**

Crea un nuevo cargo en el sistema. Los parámetros son:
- name: Nombre del cargo
- code: Código del cargo
- description: Descripción del cargo (OPCIONAL)
- requirements: Requisitos del cargo (OPCIONAL)
- area_ids: IDs de las áreas del cargo (OPCIONAL)
- custom_attributes: Atributos personalizados del cargo (OPCIONAL)
- role_family_id: Id de la familia de cargo (OPCIONAL)
Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Role` | body | `Role::Create` | ✓ | Objeto de tipo role |

### Respuestas

- **201** — 
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `PATCH /roles/{identifier}`

**Actualiza un cargo**

Actualiza un cargo existente en el sistema. Los parámetros son:
- identifier: Identificador del cargo existente. Puede ser tanto el ID numérico como el código del Cargo (Role)
- name: Nuevo nombre del cargo (OPCIONAL)
- description: Nueva descripción del cargo (OPCIONAL)
- requirements: Nuevos requisitos del cargo (OPCIONAL)
- active: Estado del cargo (OPCIONAL)
- area_ids: IDs de las nuevas áreas del cargo. (OPCIONAL)
- custom_attributes: Atributos personalizados del cargo (OPCIONAL)
- role_family_id: Id de la familia de cargo (OPCIONAL)

Los valores ingresados sobrescribirán los datos del cargo que se está editando

En caso de que area_ids no contenga las actuales, estás se eliminarán, quedando sólo con las ingresadas

No se puede eliminar la asociación de un área con un cargo que posea trabajos activos

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `identifier` | path | string | ✓ | - identifier: Identificador del cargo existente. Puede ser tanto el ID numérico como el código del Cargo (Role) |
| `Role` | body | `Role::Update` | ✓ | Objeto de tipo role |

### Respuestas

- **201** — 
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /roles/{id}`

**Obtener un cargo en específico por ID**

Retorna la información específica del cargo asociado al ID proporcionado

Descripción de atributos:
- `id`: [string] Id del Cargo.
- `code`: [string] Codigo.
- `name`: [string] Nombre.
- `description`: [string] Descripción.
- `requirements`: [string] Requisitos.
- `role_family`: [object] Familia de cargo.
- `area_ids`: [array] Área al que pertenece el cargo.
- `custom_attributes`: [object] Atributos personalizados del cargo.
Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del cargo |

### Respuestas

- **200** — Como respuesta recibirás un Cargo
- **404** — Cargo no encontrado

---
