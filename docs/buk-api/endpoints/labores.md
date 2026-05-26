# Labores

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /piecework/tasks`

**Listar labores**

'Retornar labores desde la fecha de creación dada'

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `created_at` | query | string (date) |  | (OPCIONAL) Fecha en que fue creada la labor en YYYY-MM-DD. |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100]  |

---

## `POST /piecework/tasks`

**Crear labores**

Crea un nuevo labor en el sistema. Los parámetros son:

  - description : Descripción del labor.
  - code : Código del labor.
  - seventh_workday : Afecto a semana corrida.
  - custom_attrs : Atributos personalizados para labores.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Labor` | body |  | ✓ | Objeto de tipo labor |

---
