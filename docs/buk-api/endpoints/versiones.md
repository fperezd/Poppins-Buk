# Versiones

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `GET /versions`

**Mostrar versiones**

Recibimos la información relacionada a las versiones

* Permitir ver información sensible en: 'Sí'.
Para acceder a historiales extensos (mayores a un año), se requiere solicitar a través de la plataforma. Esto permite procesar la información y luego disponibilizarla mediante la API.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `event` | query | integer |  | Evento que da origen a la versión |
| `item_type` | query | integer |  | Clase del objeto afectado que da origen a la versión |
| `page_size` | query | integer |  | Tamaño página |
| `page` | query | integer |  | Número de página |

### Respuestas

- **200** — Como respuesta recibimos la información correspondiente a todas los versiones → `version`

---
