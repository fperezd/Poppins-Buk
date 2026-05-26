# Usuarios y perfiles

**Base path:** `/api/v1/chile`

5 endpoint(s).

## `GET /permission_roles`

**Mostrar Perfiles**

Entrega la información de todos los perfiles disponibles.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de usuarios y perfiles en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | query | integer |  | ID del perfil |
| `name` | query | string |  | Nombre |

### Respuestas

- **200** — Una lista de perfiles que cumplan con el criterio de búsqueda. → `PermissionRole`

---

## `GET /users`

**Mostrar usuarios**

Entrega la información de todos los usuarios.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de usuarios y perfiles en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `name` | query | string |  | Nombre |
| `email` | query | string |  | Email |
| `person_id` | query | integer |  | ID de la Persona (Se encuentra en el endpoint de empleados) |
| `permission_role_id` | query | integer |  | ID del perfil |
| `limit_areas` | query | boolean |  | ¿Limitado por áreas? |
| `limit_realms` | query | boolean |  | ¿Limitado por Juego de datos? |
| `realm_name` | query | boolean |  | Nombre del juego de datos |
| `limited_by_area_id` | query | integer |  | ID del Área por el cual esta limitados los usuarios |
| `activated` | query | boolean |  | ¿Usuario activo? |
| `rol_visible` | query | string |  | Límites de Rol |

### Respuestas

- **200** — Una lista de usuarios que cumplan con el criterio de búsqueda. → `User`

---

## `POST /users`

**Crear usuario**

Crea un usuario y envia la invitación al mismo #magic___^_^___line Cada registro se compone de: - person_id: Id de la persona a relacionar con el usuario (Si este parámetro es enviado, se usa nombre y el email corporativo de la persona)
  Se puede encontrar en la api de Colaboradores.

- name: Nombre del usuario - email: Email del usuario (Si person_id es enviado usa el email de la persona si esta tiene) - activated: Determina si el usuario puede loguearse en la aplicación - area_ids: Lista de ids de areas a limitar el usuario - limit_areas: Si el usuario va a estar limitado o no por áreas - permission_role_id: Id del perfil a asignar al usuario.
  (Si se deja este campo vacío el usuario tendrá Perfil Normal)

(Solo disponible si general 'Habilitar juegos de datos' está activa) - realm_ids: Lista de ids de Juegos de datos a limitar - limit_realms: Si el usuario esta limitado por juego de datos
(Solo disponible si la general 'Habilitar Rol Privado' está activa) - rol_visible: Permite limitar si el usuario puede ver perfiles privado, públicos o ambos (ve_publico, ve_privado, ve_ambos)


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de usuarios y perfiles en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `User` | body | `User` | ✓ | Objeto de tipo user |

### Respuestas

- **201** — Usuario creado.

---

## `GET /users/{id}`

**Mostrar usuario**

Entrega la información de un usuario.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos de usuarios y perfiles en: 'Lectura' o 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID de usuario |

### Respuestas

- **200** — Un usuario con el ID correspondiente → `User`

---

## `PUT /users/{id}`

**Editar un usuario**

Edita un usuario
Las campos que podemos editar son los siguientes (No hace falta enviar los campos que no va a ser modificados): - person_id: Id de la persona a relacionar con el usuario (Si este parámetro es enviado, se usa nombre y el email corporativo de la persona)
  Se puede encontrar en la api de Colaboradores.

- name: Nombre del usuario - email: Email del usuario (Si person_id es enviado usa el email de la persona si esta tiene) - area_ids: Lista de ids de areas a limitar el usuario - activated: Determina si el usuario puede loguearse en la aplicación - limit_areas: Si el usuario va a estar limitado o no por áreas - permission_role_id: Id del perfil a asignar al usuario.
  (Si se deja este campo vacío el usuario tendrá Perfil Normal)

(Solo disponible si general 'Habilitar juegos de datos' está activa) - realm_ids: Lista de ids de Juegos de datos a limitar - limit_realms: Si el usuario esta limitado por juego de datos
(Solo disponible si la general 'Habilitar Rol Privado' está activa) - rol_visible: Permite limitar si el usuario puede ver perfiles privado, públicos o ambos (ve_publico, ve_privado, ve_ambos)


**Permisos requeridos para utilizar este endpoint:** 
* Permisos de usuarios y perfiles en: 'Lectura y Modificación'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del usuario a editar |
| `User` | body | `User` | ✓ |  |

### Respuestas

- **200** — Usuario editado.

---
