# Productos

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /piecework/products`

**Listar Productos**

'Retornar Productos'

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100]  |

---

## `POST /piecework/products`

**Crear Productos**

Crea un nuevo Producto en el sistema. Los parámetros son:

  - name : Nombre del Producto.
  - code : Código del Producto.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de tratos en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Producto` | body |  | ✓ | Objeto de tipo Producto |

---
