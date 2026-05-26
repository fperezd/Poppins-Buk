# Procesos

**Base path:** `/api/v1/chile`

4 endpoint(s).

## `GET /process`

**Listar procesos**

Retorna todos los procesos correspondientes a un periodo.

Este endpoint no requiere permisos especiales.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `date` | query | string (date) | ✓ | Indica la fecha de inicio del proceso a consultar (Formato YYYY-MM-DD) |
| `page_size` | query | integer |  | Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100] |
| `page` | query | integer |  | Numero de página |
| `name` | query | string |  | Nombre del proceso para filtrar los resultados |

### Respuestas

- **200** — Proceso encontrado exitosamente

---

## `POST /process`

**Crear un nuevo proceso de nómina**

Retorna todos los procesos correspondientes a un periodo.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de procesos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Process` | body | `processInput` | ✓ | Retorna todos los procesos correspondientes a un periodo. |

### Respuestas

- **201** — Proceso creado exitosamente → `Process`

---

## `DELETE /process/{id}`

**Eliminar proceso**

Elimina un proceso de tipo liquidación utilizando su identificador. Solo se pueden eliminar procesos de este tipo.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de procesos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | Identificador del proceso a eliminar |

### Respuestas

- **200** — Proceso eliminado exitosamente
- **409** — No se puede eliminar el proceso. Solo se permiten eliminar procesos de tipo Liquidación

---

## `GET /process/{id}`

**Obtener detalles de un proceso**

Retorna la información detallada de un proceso específico por su ÍD

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de procesos en: 'Lectura'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ÍD del proceso a consultar |

### Respuestas

- **200** — Proceso encontrado exitosamente → `Process`

---
