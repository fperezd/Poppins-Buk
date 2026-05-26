# Lugares de Trabajo

**Base path:** `/api/v1/chile`

2 endpoint(s).

## `GET /piecework/places`

**Listar Lugares de Trabajo**

#<Proc:0x00007fd64b00e118 /usr/src/app/packs/nomina/chile/piecework/app/controllers/api/v1/piecework/places_controller.rb:10 (lambda)>

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `empresa_id` | query | integer |  |  |
| `page_size` | query | integer |  | (OPCIONAL) Numero de respuestas por página. Por defecto tiene un valor de 25 y debe estar entre un rango de [25 - 100]  |

---

## `POST /piecework/places`

**Crear Lugares de Trabajo**

#<Proc:0x00007fd64b00d178 /usr/src/app/packs/nomina/chile/piecework/app/controllers/api/v1/piecework/places_controller.rb:30 (lambda)>

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `Lugar de Trabajo` | body |  | ✓ | Objeto de tipo Lugar de Trabajo |

---
