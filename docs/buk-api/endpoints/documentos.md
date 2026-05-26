# Documentos

**Base path:** `/api/v1/chile`

6 endpoint(s).

## `GET /docs/{id}`

**Obtener especificaciones de un documento**

Recibe un id de un documento, y entrega las especificaciones asociadas a dicho documento.
**Permisos requeridos para utilizar este endpoint:** 
* Permisos para ver y descargar documentos de empleados en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del documento |

### Respuestas

- **200** — Como respuesta recibimos un documento de empleado

---

## `PUT /docs/{id}/signatures`

**Asignar firmantes a un documento**

Recibimos las firmas o revisor a asignar. Solo se realizarán cambios sobre los parámetros que sean enviados.
- En el caso de las firmas:

  Recibimos el tipo de firma a asignar, este puede ser un string de la siguiente lista:
  - employee_signature
  - legal_agent_signature
  - second_legal_agent_signature
  - supervisor_signature
  - other_signature
  - second_other_signature    

  Junto con un id de persona válido con usuario. En caso de elegir tipo de firma legal_agent_signature
  o second_legal_agent_signature el id de la persona debe ser un representante legal configurado. En caso de elegir tipo de firma employee_signature o supervisor_signature, no es necesario agregar el id de la persona.

  Si se quiere agregar un orden a las firmas se debe agregar dentro de cada firma el atributo "position". Donde se debe indicar el orden de las firmas a asignar con valores numéricos desde el 1 hasta el número de firmas, estos valores no se pueden repetir. En caso de no querer un orden para las firmas no se debe enviar el atributo "position".
  
  Para eliminar las firmas de un documento se debe enviar una lista vacía.

- En el caso del revisor:

  Recibimos el id del person del revisor, este para ser válido debe contar con un usuario activo y al menos un trabajo activo. Para eliminar a un revisor debes enviar null en el campo.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos para ver y descargar documentos de empleados en: 'Sí'.

Si estás reasignando un firmante a un documento generado desde una plantilla, esta no será modificada. La reasignación aplicará solo para el documento seleccionado y este se cargará nuevamente con el contenido actual de la plantilla.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del documento |
| `Especificaciones de firma` | body | `Signature` | ✓ | Objeto de especificaciones de firma |

### Respuestas

- **201** — Como respuesta recibimos la información de las firmas y el revisor del documento.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `POST /docs/{id}/signatures/process`

**Iniciar flujo de firma de un documento**

Recibimos un id de documento, y se inicia el flujo de firma. Si el documento ya había comenzado el flujo de firma, se retorna un error con estado 409.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos para subir documentos en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del documento |

---

## `GET /employees/{id}/docs`

**Obtener documentos de empleado**

Se obtiene información de los documentos del empleado según los filtros de fecha ingresados

**Permisos requeridos para utilizar este endpoint:** 
* Permisos para ver y descargar documentos de empleados en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del empleado a consultar. |
| `from` | query | string (date) |  | Desde - Rango de fechas de la creación del documento. Ejemplo: 2020/12/10 |
| `to` | query | string (date) |  | Hasta - Rango de fechas de la creación del documento. Ejemplo 2020/12/11 |

### Respuestas

- **200** — Como respuesta recibimos un arreglo con los documentos del empleado → `EmployeeFileListDetail[]`

---

## `POST /employees/{id}/docs`

**Añadir un documento a empleado**

Recibimos un documento, el cual estará relacionado al empleado.

**Permisos requeridos para utilizar este endpoint:** 
* Permisos para subir documentos en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del empleado a consultar. |
| `file` | formData | file |  | Documento a cargar. |
| `file_base64` | formData |  |  | Documento (codificado en base64) a cargar.  Se debe enviar como JSON un objeto compuesto por los siguientes atributos: - content: Contenido codificado en base64. - filename: Nombre que tendrá el documento cargado junto con la extensión (ejm: filename.pdf).  |
| `visible` | query | boolean |  | Visible por el empleado. Por defecto: false |
| `signable_by_employee` | query | boolean |  | Requiere la firma del empleado. Por defecto: false |
| `signable_by_legal_agent` | query | boolean |  | Requiere la firma del representante legal. Por defecto: false |
| `signable_by_second_legal_agent` | query | boolean |  | Requiere la firma de un segundo representante legal. Por defecto: false |
| `overwrite` | query | boolean |  | Sobreescribir archivo. Aplica solo para documentos que no tengan todas las firmas requeridas. Por defecto: false |
| `start_signature_workflow` | query | boolean |  | Iniciar flujo de firma automático. El documento debe estar visible y debe tener requisitos de firmas o revisión para seleccionar esta opción. Por defecto: false |
| `path` | query | string |  | Ruta donde se guardará el archivo. Si se deja en blanco se creará en la carpeta raíz del empleado. Ejemplo: personales/seguridad |
| `signatures` | query |  |  | Arreglo de objetos de tipo firma. Es un parámetro opcional, si se utiliza este no se tomarán en cuenta los otros parámetros relacionados con la firma. |
| `reviewer_id` | query | integer |  | Id del person del revisor. Es un parámetro opcional, si no quieres asignar revisor deja este campo vacío |

### Respuestas

- **201** — Respuesta de la api ante la creación de documentos.
- **400** — Existe un error con los datos enviados → `bad_request`

---

## `GET /employees/{id}/docs/{file_id}`

**Obtiene un documento de empleado**

Los file ids posibles están en el endpoint GET `/employees/{id}/docs`.

Se devuelve la redirección del documento de file_id ingresado, por lo que hay que seguirla.

* Para seguir la redirección se añade la opción `-L`
* Para guardar la respuesta en un archivo se debe agregar la opción `-o` y pasarle el nombre del archivo

**Example**
```curl -L -X GET --header 'Accept: */*' --header 'auth_token: [AUTH TOKEN]' 'http://www.[COMPANY SUBDOMAIN].buk.cl/api/v1/employees/1/docs/1156' -o [NOMBRE ARCHIVO]```

Prueba con `curl`, el botón Pruébalo no funciona para documentos.


**Permisos requeridos para utilizar este endpoint:** 
* Permisos para ver y descargar documentos de empleados en: 'Sí'.

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | string | ✓ | ID del empleado |
| `file_id` | path | string | ✓ | ID del documento |

### Respuestas

- **200** — Como respuesta recibimos un documento de empleado → `EmployeeFileDetail`

---
