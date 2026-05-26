# API Documentacion Tecnica - BUK

> Articulos tecnicos sobre la API REST de Buk para integraciones.

---

## Como funciona nuestra API?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46268700701723

Una API REST permite a diferentes sistemas comunicarse usando solicitudes GET, POST, PUT, DELETE para interactuar con recursos del servidor en formato JSON.

### API BUK
La API Rest de Buk permite exportar, inyectar, actualizar y buscar informacion desde Buk hacia las API configuradas, facilitando el traspaso de informacion.

### Acceso a la API
Luego de confirmar la integracion con los sistemas, generar un token en la plataforma del cliente en BUK: Configuracion > Accesos API.

### Checklist de Conexion
1. Obtener API Key (auth_token): Desde la plataforma BUK (Configuracion > Accesos API)
2. Identificar la URL del Tenant: https://{NombreTenant}.buk.cl
3. Definir el Pais: /api/v1/chile | /api/v1/mexico | /api/v1/colombia | /api/v1/peru
4. Configurar Permisos del token (modulos a consultar)
5. Whitelist de IP (Opcional)

### Estructura de la Peticion
- Header Key: auth_token
- Header Value: Su API Key
- Content-Type: application/json

### Ejemplo Ejecutable (curl)
```bash
curl -X GET \
  "https://{{TENANT}}.buk.cl/api/v1/chile/employees?page_size=25&page=1" \
  -H "auth_token: {{AUTH_TOKEN}}" \
  -H "Accept: application/json"
```

### Reglas de Negocio y Seguridad
- Multi-idioma: Documentacion disponible en ingles, espanol y portugues
- Flujo de datos: La API permite recibir y entregar datos, pero no push nativo (usar Webhooks)
- Tokens Modulares: Es recomendable generar tokens con alcance limitado a ciertas entidades
- No existe un limite definido en la cantidad de tokens que puede crear el administrador

---

## Manual de Usuario: Autenticacion con Bearer Token en Webhooks
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46478840249115

Esta funcionalidad permite robustecer la seguridad de integraciones. Los webhooks de Buk envian un token de autenticacion directamente en el header de las peticiones HTTP. Ideal para conectar con sistemas externos como SAP, Power BI o IzyTime.

### Que es el Bearer Token?
Metodo de seguridad estandar donde Buk envia una "llave" (token) en cada notificacion. El servidor puede verificar que la informacion proviene de Buk y no de un tercero no autorizado.

### Configuracion del Webhook
1. Acceso al Formulario: Ingresar a Webhooks > Crear Webhook o editar uno existente
2. Direccion URL: Ingresar el endpoint del sistema destino
3. Bearer Token (Opcional): Pegar el token estatico proporcionado por el sistema externo (se almacena encriptado)
4. Seleccion de Entidades: Elegir los eventos que gatillaran la notificacion
5. Guardar: Cada peticion incluira automaticamente el header Authorization: Bearer {tu_token}

### Consideraciones Importantes
- Token Estatico: Buk no lo regenerara automaticamente. Si el token expira o cambia, actualizar manualmente
- Seguridad en Interfaz: Una vez guardado, el token no se mostrara completo en la interfaz de usuario
- Compatibilidad: Si no configuras token, el webhook sigue funcionando sin headers de autenticacion

### Resumen de Funcionamiento
| Caracteristica | Con Bearer Token | Sin Bearer Token |
|---|---|---|
| Seguridad | Alta (Header de Autorizacion) | Estandar |
| Header HTTP | Incluye Authorization: Bearer ... | No incluye headers de auth |
| Uso Recomendado | Integraciones Enterprise (SAP, IzyTime) | Pruebas simples o sistemas internos |
| Almacenamiento | Encriptado en Base de Datos | N/A |

### Eventos Disponibles
- Empleados: Creacion, actualizacion y cambios de planes o responsabilidades
- Trabajo: Contrataciones, terminos de contrato y movimientos
- Organizacion: Creacion y actualizacion de areas
- Ausencias: Creacion, edicion o eliminacion de vacaciones y licencias

---

## Como integrarse a Buk a traves de una API
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403643846043

Guia para integrar distintos sistemas automaticamente a Buk.

### Que es una API?
Una API (Application Programming Interface) es un conjunto de metodos o procedimientos que ofrece un software para que pueda ser utilizado por otro software. Permite que sistemas interactuen entre si directamente y de manera sencilla.

### Acceso a la API
1. Configuracion >> Accesos API >> Crear nueva API Key
2. Seleccionar si quieres que el sistema externo pueda leer datos sensibles del empleado (como sueldo)
3. Se recomienda crear un token por cada sistema que quieras conectar a Buk
4. Clic en los cuadros si deseas limitar acceso por empresas
5. Accesos: Lectura (solo ver empleados) / Lectura y modificacion (ver y modificar informacion)
6. Clic en "Actualizar API Key" y luego "Guardar"
7. Clic en el icono "Ojo" para obtener el codigo (Token)

### Documentacion de la API
Acceder a la documentacion publica en: https://{empresa}.buk.{pais}/apidocs

Ejemplo: https://proyectoperu.buk.pe/apidocs

En la documentacion puedes:
- Autenticarte via boton "Authorize"
- Ver todos los Endpoints disponibles haciendo clic en "Mostrar/Ocultar" > "Listar"
- Probar en vivo con "Pruebalo!"

---

## API - Entidad Cargos (Roles)
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46223615472667

Un cargo en Buk es la definicion estandar y reutilizable de un rol laboral dentro de la organizacion.

### Definicion Funcional
- Estandariza el "que" del trabajo: nombre del rol y su alcance
- Define el perfil esperado: competencias, conocimientos, experiencia y formacion requeridas
- Habilita gestion y control: permite asociar dotacion, bandas salariales, activos y datos relevantes del rol
- Soporta operacion de RRHH: referencia para seleccion, onboarding, evaluacion de desempeno y desarrollo

### Consideraciones Tecnicas
- Cargo != Area/Subarea: El area define el "donde", no el "que"
- Puesto de trabajo = Cargo + Area/Subarea (si esta disponible en la configuracion)
- Los cargos NO TIENEN relacion jerarquica entre ellos
- La jerarquia organizacional se define en colaboradores mediante asignacion de jefe directo

### Endpoints

#### GET /roles
Retorna todos los cargos registrados en el sistema.
**Permisos:** auth_token sin permisos especiales

```bash
curl -X GET --header 'Accept: application/json' --header 'auth_token: {TOKEN}' 'https://{TENANT}.buk.cl/api/v1/chile/roles'
```

**Parametros opcionales:**
| Campo | Tipo | Descripcion |
|---|---|---|
| search | string | Filtrar roles por nombre |
| page_size | int | Numero de respuestas por pagina [25-100] |

**Respuesta:**
```json
{
  "pagination": { "next": "string", "previous": "string", "count": 0, "total_pages": 0 },
  "data": [{
    "id": 0,
    "code": "string",
    "name": "string",
    "description": "string",
    "requirements": "string",
    "role_family": { "id": 0, "name": "string", "quantity_of_roles": 0 },
    "area_ids": [0],
    "custom_attributes": {}
  }]
}
```

#### GET /roles/{id}
Retorna informacion especifica del cargo asociado al ID.

```bash
curl -X GET --header 'Accept: application/json' --header 'auth_token: {TOKEN}' 'https://{TENANT}.buk.cl/api/v1/chile/roles/{ID_ROLE}'
```

#### POST /roles
Crea un nuevo cargo en el sistema.

```bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'auth_token: {TOKEN}' \
  -d '{"name": "string", "code": "string", "description": "string", "requirements": "string", "role_family_id": 0, "area_ids": [0], "custom_attributes": {}}' \
  'https://{TENANT}.buk.cl/api/v1/chile/roles'
```

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| name | string | SI | Nombre del cargo |
| code | string | SI | Codigo unico (alfanumerico con guiones bajos) |
| description | string | NO | Descripcion del cargo |
| requirements | string | NO | Requerimientos del cargo |
| role_family_id | int | NO | Id de la familia de cargos |
| area_ids | array | NO | Ids de las areas relacionadas |
| custom_attrs | object | NO | Atributos personalizados |

**Reglas POST:**
- El codigo del cargo debe ser unico y contener solo valores alfanumericos y guiones bajos (sin espacios ni caracteres especiales)
- Los cargos no se ordenan jerarquicamente entre si

#### PATCH /roles/{identifier}
Permite editar un cargo en el sistema.

```bash
curl -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'auth_token: {TOKEN}' \
  -d '{"name": "string", "description": "string", "requirements": "string", "active": true, "role_family_id": 0, "area_ids": [0], "custom_attributes": {}}' \
  'https://{TENANT}.buk.cl/api/v1/chile/roles/{ID_ROLE}'
```

#### GET /role_families
Retorna todas las familias de cargos registradas en el sistema.

```bash
curl -X GET --header 'Accept: application/json' --header 'auth_token: {TOKEN}' 'https://{TENANT}.buk.cl/api/v1/chile/role_families'
```

---

## API - Entidad Areas
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46222808586523

Gestion de areas basada en estructura jerarquica arbol. El concepto de depth (profundidad) determina el nivel en la jerarquia.

### Jerarquia de Niveles (Depth)
- Depth 0: Division (nivel mas alto, no depende de otra area, parent_area: null)
- Depth 1: Area (ejemplo: "Gerencia")
- Depth 2 en adelante: Subarea (donde se asignan cargos y trabajadores)

Division (depth 0) > Area (depth 1) > Subarea (depth 2) > Cargos, Trabajadores

### Consideraciones Especiales
- No puede existir un area (depth>0) que no dependa de una Division
- Solo desde depth 2 pueden tener un trabajo asociado
- depth:0 siempre corresponde a division y depth:1 siempre corresponde a gerencia
- El area_id en /employees siempre corresponde al area del frontend (nodo donde esta el trabajo)

### Endpoints

#### GET /organization/areas/{id}
Retorna el area por ID, incluyendo depth 0 y 1.

```bash
curl -X GET --header 'Accept: application/json' --header 'auth_token: {{AUTH_TOKEN}}' 'https://{{TENANT}}.buk.cl/api/v1/chile/organization/areas/{ID_AREA}'
```

**Respuesta:**
```json
{
  "data": {
    "id": 0, "name": "string", "address": "string",
    "children_area": [{"id": 0, "name": "string", "commune": "string", "city": "string", "address": "string"}],
    "parent_area": {"id": 0, "name": "string"},
    "first_level_id": 0, "first_level_name": "string",
    "second_level_id": 0, "second_level_name": "string",
    "depth": 0, "cost_center": "string", "status": "string",
    "custom_attributes": {}, "city": "string"
  }
}
```

#### GET /organization/areas/
Maestro de areas.

```bash
curl -X GET "https://{{TENANT}}.buk.cl/api/v1/chile/organization/areas?status=both&page_size=25&page=1" \
  -H "auth_token: {{AUTH_TOKEN}}" -H "Accept: application/json"
```

**Filtros:** status (active/inactive/both), page_size (25-100), page

#### POST /organization/areas/
Crea un area en el sistema.

```bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'auth_token: {{AUTH_TOKEN}}' \
  -d '{"parent_id": 0, "location_id": 0, "name": "string", "accounting_prefix": "string", "city": "string", "address": "string", "cost_center_id": "string", "role_ids": [0], "custom_attrs": {}}' \
  'https://{{TENANT}}.buk.cl/api/v1/chile/organization/areas'
```

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| parent_id | integer | CONDICIONAL | ID del Area padre |
| location_id | integer | SI | ID de la ubicacion (obtener de GET /locations) |
| name | string | SI | Nombre del Area |
| role_ids | array | SI | Ids de los roles del Area |
| custom_attrs | object | SI | Atributos personalizados |

**Nota:** La vinculacion de trabajos esta restringida al ultimo nivel (Subarea, depth: 2).

#### PATCH /organization/areas/{ID}
Edita un area. El campo parent_id NO es modificable.

#### DELETE /organization/areas
Elimina un area. Requiere: id (SI)

```bash
curl -X DELETE --header 'Accept: application/json' --header 'auth_token: TOKEN' 'https://{tenant}.buk.cl/api/v1/chile/organization/areas?id={idArea}'
```

---

## API - Entidad Colaboradores (Employees)
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46220993138459

Un empleado en Buk es la entidad maestra de persona que representa a un colaborador dentro de la empresa. Concentra identificacion, datos personales (nombres, RUT/documento, nacionalidad, fecha de nacimiento, genero), contacto y domicilio.

### Endpoints de Consulta

#### GET /employees
Entrega la informacion de todos los Empleados.
**Permisos:** Lectura o Lectura y Modificacion de empleados.

```bash
curl -X GET --header 'Accept: application/json' --header 'auth_token: {TOKEN}' 'https://{TENANT}.buk.cl/api/v1/chile/employees'
```

**Parametros opcionales:**
| Campo | Tipo | Descripcion |
|---|---|---|
| status | string | activo / inactivo / pendiente |
| document_number | string | Sin puntos ni guion |
| code_sheet | string | Codigo de ficha |
| company_id | string | Id de empresa (GET /companies) |
| update_start_date | date | Fecha de actualizacion |
| page_size | integer | [25-100] |
| page | integer | Numero de pagina |
| sort | string | Solo "id" (por defecto ordena por nombre) |

#### GET /employees/active
Retorna todos los Empleados vigentes (con plan y trabajo activos).
**Filtros:** rut, code_sheet, date (YYYY-MM-DD), exclude_pending, page_size

#### GET /employees/{id}
Informacion especifica del Empleado por ID.

#### GET /employees/{id}/subordinates
Lista de Empleados subordinados.
**Filtros:** date (fecha de vigencia), page_size

#### GET /employees/{id}/vacations_available
Cantidad de dias disponibles para vacaciones.
**Filtros:** discount (bool - descuenta vacaciones futuras), date (DD-MM-YYYY)

#### GET /employees/{id}/earned_vacations
Detalle de vacaciones percibidas y proporcionales hasta cierta fecha.

#### GET /employees/{employee_id}/family_responsibilities/{id}
Informacion de Grupo Familiar. Requiere configuracion: Habilitar grupo familiar.

#### GET /employees/{id}/pension_savings
Obtener ahorros previsionales (APVI) del empleado.

#### GET /employees/{id}/plans
Retorna la informacion de los planes previsionales del empleado.

### Endpoints de Creacion y Modificacion

#### POST /employees
Permite almacenar la informacion de un nuevo Empleado.
**Permisos:** Lectura y Modificacion de empleados.

Campos Obligatorios:
| Campo | Tipo | Descripcion |
|---|---|---|
| first_name | string | Nombre |
| surname | string | Apellido |
| code_sheet | string | Codigo de Ficha |
| nationality | string | Codigo ISO alfa-2 (ej: CL) |
| gender | string | M o F |
| birthday | string | Fecha de nacimiento |
| location_id | integer | Id Localidad (GET /locations) |
| address | string | Direccion |
| payment_period | string | semanal/mensual/quincenal/diario/por_hora |
| start_date | string | Fecha de Ingreso |
| document_number | string | Numero de documento |

**Valores validos - payment_method:** Transferencia Bancaria, No Generar Pago, Vale Vista, Servipag, Cheque
**active:** active, inactive, pending
**account_type:** Corriente, Vista, Ahorro

#### POST /employees/{id}/clone
Crea una nueva ficha tomando como referencia una existente (para colaboradores con multiples fichas).

#### PATCH /employees/{id}
Actualiza la informacion del Empleado.

### Reglas de Negocio
- Un colaborador puede existir sin plan previsional o trabajo (existira como inactivo)
- Para campos personalizados respetar nombre y obligatoriedad configurada en interfaz
- Los atributos personalizados se gestionan en Administracion > Atributos Personalizados
- Posible identificar atributos sensibles (requieren permiso de lectura sensible en el token)

---

*Fuente: https://supportcenter.buk.cl/hc/es-419/sections/36257702625563-Integraciones*
