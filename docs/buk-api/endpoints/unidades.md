# Unidades

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /piecework/units`

**Listar Unidades**

'Retornar Unidades'

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100]  |

---

## `POST /piecework/units`

**Crear Unidades**

Crea una nueva Unidad en el sistema. Los parámetros son:

  - name : Nombre de la Unidad.
  - code : Código de la Unidad.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Unidad` | body |  | ✓ | Objeto de tipo Unidad |

---
