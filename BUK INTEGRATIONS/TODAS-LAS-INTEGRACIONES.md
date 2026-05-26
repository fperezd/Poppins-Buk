# BUK INTEGRATIONS - Documentacion Completa
**Fuente:** https://supportcenter.buk.cl/hc/es-419/sections/36257702625563-Integraciones
**Chile - Recursos adicionales > Integraciones**
Total articulos: 26

---

## 01. Integracion con LinkedIn
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403721109659

La integracion con LinkedIn permite compartir una oferta laboral en el muro personal del publicador o enviar como mensaje privado.

**Activacion:** Modulo Seleccion > Configuraciones > Seleccion > activar switch > Guardar. No requiere credenciales.

**Publicacion:** Proceso de seleccion > tres puntos > Publicar en LinkedIn > Vista previa (muro o mensaje privado) > Publicar.

**Postulante:** Va a URL Publica de la publicacion. LinkedIn queda como fuente de origen en estadisticas del proceso.

---

## 02. Manual Bearer Token en Webhooks
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46478840249115

Los webhooks de Buk envian un token de autenticacion en el header HTTP. Ideal para SAP, Power BI o IzyTime.

**Configuracion:** Webhooks > Crear Webhook > URL del endpoint > Bearer Token (Opcional, se almacena encriptado) > seleccionar entidades > Guardar.

Cada peticion incluira: Authorization: Bearer {tu_token}

**Consideraciones:**
- Token Estatico: actualizar manualmente si expira
- Una vez guardado no se muestra completo en interfaz
- Sin token el webhook funciona sin headers de autenticacion

**Eventos disponibles:** Empleados (creacion, actualizacion, cambios de planes), Trabajo (contrataciones, terminos, movimientos), Organizacion (areas), Ausencias (vacaciones y licencias)

---

## 03. Como funciona nuestra API?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46268700701723

API REST de Buk permite exportar, inyectar, actualizar y buscar informacion. Formato JSON.

**Checklist de Conexion:**
1. Obtener API Key: Configuracion > Accesos API
2. URL del Tenant: https://{NombreTenant}.buk.cl
3. Definir Pais: /api/v1/chile, /api/v1/mexico, /api/v1/colombia, /api/v1/peru
4. Configurar Permisos del token
5. Whitelist de IP (Opcional)

**Estructura:** Header auth_token = {API Key}, Content-Type: application/json

**Ejemplo CURL:**
curl -X GET "https://TENANT.buk.cl/api/v1/chile/employees?page_size=25&page=1" -H "auth_token: TOKEN" -H "Accept: application/json"

**Documentacion publica:** https://{empresa}.buk.{pais}/apidocs

---

## 04. API - Entidad Cargos
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46223615472667

Un cargo es la definicion estandar de un rol laboral. Estandariza el que del trabajo, define el perfil esperado.

**Endpoints:**
- GET /roles - Retorna todos los cargos (paginado)
- GET /roles/{id} - Cargo especifico
- POST /roles - Crea cargo (name y code obligatorios, code debe ser alfanumerico con guiones bajos)
- PATCH /roles/{identifier} - Edita cargo
- GET /role_families - Familias de cargos

**Respuesta GET /roles:** pagination{next, previous, count, total_pages} + data[]{id, code, name, description, requirements, role_family, area_ids, custom_attributes}

**Reglas:** Cargos NO tienen jerarquia entre ellos. La jerarquia se define en colaboradores con jefe directo.

---

## 05. API - Entidad Areas
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46222808586523

Estructura jerarquica arbol. Depth 0: Division, Depth 1: Area, Depth 2+: Subarea.
Solo desde Depth 2 se asignan cargos y colaboradores.

**Endpoints:**
- GET /organization/areas/{id} - Area por ID
- GET /organization/areas/ - Maestro (filtros: status active/inactive/both, page_size, page)
- POST /organization/areas/ - Crea area (parent_id CONDICIONAL, location_id SI, name SI, role_ids SI)
- PATCH /organization/areas/{ID} - Edita area (parent_id NO modificable)
- DELETE /organization/areas - Elimina area (id SI)

**Respuesta:** {id, name, address, children_area, parent_area, first_level_id, first_level_name, second_level_id, second_level_name, depth, cost_center, status, custom_attributes, city}

---

## 06. API - Entidad Colaboradores
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/46220993138459

Entidad maestra con identificacion, datos personales, contacto y domicilio del colaborador.

**Endpoints:**
- GET /employees - Todos los empleados (filtros: status, document_number, code_sheet, company_id, page_size, page, sort)
- GET /employees/active - Empleados vigentes (filtros: rut, code_sheet, date YYYY-MM-DD, exclude_pending, page_size)
- GET /employees/{id} - Empleado especifico
- GET /employees/{id}/subordinates - Subordinados
- GET /employees/{id}/vacations_available - Dias disponibles vacaciones (filtros: discount bool, date DD-MM-YYYY)
- GET /employees/{id}/earned_vacations - Vacaciones percibidas y proporcionales
- GET /employees/{employee_id}/family_responsibilities/{id} - Grupo familiar
- GET /employees/{id}/pension_savings - Ahorros previsionales APVI
- GET /employees/{id}/plans - Planes previsionales
- POST /employees - Crea empleado (obligatorios: first_name, surname, code_sheet, nationality, gender, birthday, location_id, address, payment_period, start_date, document_number)
- POST /employees/{id}/clone - Clona ficha
- PATCH /employees/{id} - Actualiza empleado

**Valores validos - gender:** M, F
**civil_status:** Casado, Divorciado, Soltero, Viudo, Acuerdo de Union Civil
**payment_method:** Transferencia Bancaria, No Generar Pago, Vale Vista, Servipag, Cheque
**payment_period:** semanal, mensual, quincenal, diario, por_hora
**active:** active, inactive, pending
**account_type:** Corriente, Vista, Ahorro

---

## 07. Como integrar Buk con Brolly?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/37147913867547

Brolly mejora la salud financiera con educacion y acceso a productos de ahorro, inversion y financiamiento.

**Proceso:**
1. Crear API Key: Descripcion Brolly, Informacion sensible Si, Permisos empleados Lectura, Permisos items Lectura
2. Enviar API Key a solicitudes@brolly.cl con asunto "[EMPRESA] - BUK API KEY" + URL portal Buk
3. Mensualmente Brolly envia Excel; cargar via Importadores > Descuentos de Caja o Creditos

**Modulos:** Base Gestion de personas, Remuneraciones, Addons API

---

## 08. Como integrar Buk con Flexpay?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/37147697382043

Flexpay automatiza calculo de remuneracion variable. Inserta items variables con PDF en carpetas de colaboradores.

**Proceso:**
1. Crear API Key: Descripcion Flexpay, Informacion sensible Si, Permisos empleados Lectura y Modificacion, Permisos items Lectura y modificacion, Subir documentos Si
2. Enviar API Key a glarrain@flexpay.cl y cvial@flexpay.cl + URL portal Buk

**Modulos:** Base Gestion de personas, Remuneraciones, Addons API

---

## 09. Integracion Buk NetSuite
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36657752743195

Integracion con NetSuite ERP. Envia lineas de liquidacion para centralizacion contable como journal entries. Protocolo OAuth 1.0 con TBA. Disponible Chile, Mexico, Colombia, Peru.

**Opciones:**
1. Gratuita (Estandar): Envio de lineas contables, sin sincronizacion de nomina
2. A medida (con costo): Partners certificados: Hood River Consulting, Agilesoft, Onitec, K2, TCIT

**Requisitos:** API de NetSuite habilitada, Version Standard o Premium, Access Token (Consumer Key/Secret, Token ID/Secret), REALM URL de NetSuite.

**Proceso:** Mes 1 JP recopila info y valida con CSV. Mes 2 JP genera ticket al equipo integraciones (hasta 1 mes).

**Partners por pais:** Chile: Partnerschile@buk.cl | Colombia: Partners@buk.co | Mexico: partners@buk.mx | Peru: partners@buk.pe

---

## 10. Integracion Buk con Agri
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36657819347995

Software de gestion agricola. Faenas registradas en Agri quedan reflejadas en haberes y asistencia de Buk.

**Proceso:**
1. Crear API Key: Descripcion Agri, Informacion sensible Si, Permisos empleados Lectura, Permisos asistencia Lectura y modificacion, Permisos items Lectura y modificacion, Subir documentos Si
2. Enviar API Key a joseignacio@tcit.cl (Agri)

**Modulos:** Base Gestion de personas, Remuneraciones, Addons API

---

## 11. Integracion Licencias Medicas Electronicas
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/37366418763931

Tramitar, recibir y hacer seguimiento de LME de Imed y Medipass desde Buk.

**Configuracion:**
1. Crear empresa en www.lmempleador.cl
2. Marketplace > Soluciones Buk > Disponibles > LME > Cotizar
3. Activo: Asistencia > Licencias Medicas Electronicas
4. Marketplace > Soluciones Buk > Contratadas > Configurar LME > seleccionar empresa, completar campos, Guardar

**Modulos:** Base Plataforma esencial, Addons Integracion LME, Config: activar Integrar Licencias Medicas Electronicas

---

## 12. Como integrar buk con Movired
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36657634710555

Cargas masivas automatizadas a tarjetas bip!, bip!QR, TNE (Tarjeta Nacional Estudiantil) o TAM (Tarjeta Adulto Mayor).

**Paso 1:** Crear API Key (Descripcion INTEGRACION_BIP, Permisos empleados Lectura, Sin informacion sensible)

**Paso 2:** Crear Atributos Personalizados: Tipo de bip!, Numero de bip!, Frecuencia de carga (1/7/30/60 dias), Monto ($1.000 a $20.000)

**Paso 3:** Carga masiva: Importadores > Administrativo > Empleados > Datos Personales > seleccionar atributos bip

**Paso 4:** Ingresar a movired.cl/buk con Token y datos solicitados

---

## 13. Integracion BUK - Betterfly
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36645597577883

Betterfly mejora el bienestar de colaboradores. Gestion de acceso desde Buk.

**Proceso:**
1. Crear Atributo Personalizado "Betterfly" (Tipo Texto, Entidad Empleado, valor "SI" para quienes deben tener acceso)
2. Crear API Key: Descripcion Betterfly, Sin informacion sensible, Permisos empleados Lectura
3. Enviar Token al agente de Betterfly

---

## 14. Integracion con Laborum
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36645527676699

Publicar procesos de seleccion en portal de empleos Laborum. Obtener postulantes y CVs automaticamente.

**Configuracion:**
1. Contratar plan Laborum con integracion API
2. Seleccion > Configuraciones > Integraciones > activar Laborum
3. Marketplace > Integraciones > Contratadas > Configurar Laborum > ingresar Api Key, activar

**Campos enviados a Laborum:** Area, Cargo, Tipo Trabajo, Region, Frecuencia pago, Descripcion, Nombre fantasia, Industria, Sueldo, Pais

**Campos recibidos de postulantes:** Nombre, Apellido, Mail, Telefono, RUT, CV

---

## 15. Como integrar Chipax con Buk
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36645310809499

Chipax gestiona finanzas de Pymes. Sincronizacion automatica de liquidaciones con costo empresa completo.

**Proceso:**
1. En Buk: Configuracion > Accesos API > Crear Nueva API Key
2. En Chipax: Modulo Integraciones > Conectar Buk > ingresar URL y token > Guardar
3. Actualizar en modulo Remuneraciones

---

## 16. Integracion con BNE
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36642262196507

Publicar ofertas laborales gratuitas en Bolsa Nacional de Empleo.

**Configuracion:**
1. Seleccion > Configuraciones > Integraciones > switch BNE > Guardar
2. Marketplace > Integraciones > Contratadas > Configurar BNE > seleccionar empresa(s) > activar > Guardar
3. Publicar desde tres puntos de cada proceso de seleccion

---

## 17. Integracion Buk AppWorki
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36642221017499

AppWorki digitaliza procesos de prevencion de riesgos ante la Direccion del Trabajo.

**Proceso:**
1. Crear API Key: Descripcion AppWorki, Informacion sensible Si, Limitar por empresa Si, Permisos empleados Lectura, Permisos asistencia Lectura, Permisos usuarios y perfiles Lectura
2. Enviar Token a contacto@appworki.cl

---

## 18. Activacion X-Data: Automatizacion cambios planes Isapre
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36633302534555

X-Data conecta sistemas de remuneraciones con Isapres para notificacion digital de FUN. Sin costo para empleador.

**Proceso:**
1. Formulario en www.x-data.cl o contactar contacto@x-data.cl
2. X-Data provee codigo unico de convenio por Razon Social
3. Administracion > Empresas > Codigo Convenio X-Data > registrar codigo
4. Aparece opcion "Notificaciones FUN" en barra superior con todas las actualizaciones

**Codigos de Error:** 01 Finiquito | 02 Fallecido | 03 Nunca trabajo en la empresa | 10 Otro motivo

---

## 19. Integracion con EB Metrics
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403460603803

EB Metrics ofrece pruebas psicometricas: capacidad cognitiva, personalidad, habilidades comerciales y tecnicas. Credenciales en https://www.ebmetrics.cl

**Funcionalidades:** Enviar pruebas, obtener PDF resultados, automatizar envio, filtrar por puntaje

**Configuracion:**
1. Seleccion > Configuraciones > Integraciones > activar EB Metrics
2. Marketplace > Integraciones > Contratadas > Configurar EB Metrics > ingresar Usuario, Contrasena, Tenant

**Envio Automatico:** Proceso > Automatizacion > etapa > Nueva regla > Enviar prueba psicometrica EB Metrics

**Envio Manual:** Seleccionar postulantes > Acciones > Enviar formulario > Fuente EB Metrics

---

## 20. Integracion TestGorilla
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403378513563

TestGorilla evalua habilidades: programacion, liderazgo, pensamiento critico. Requiere planes Scale o Business.

**Configuracion:**
1. Seleccion > Configuraciones > Integraciones > activar TestGorilla
2. Marketplace > Integraciones > Contratadas > Configurar TestGorilla > ingresar API Key de TestGorilla
3. Obtener API Key: TestGorilla > Integrations > logo Buk > Enable > tuerca

**Envio Automatico:** Proceso > Automatizacion > Nueva regla > Enviar prueba TestGorilla

**Envio Manual:** Seleccionar postulantes > Acciones > Enviar formulario > Fuente TestGorilla

---

## 21. Sincronizacion Licencias Medicas Electronicas
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36633195398299

Obtener, sincronizar y tramitar licencias desde Imed o Medipass con la ficha del trabajador.

**Proceso:**
1. Asistencia > Licencias Medicas Electronicas
2. Consultar Licencias: seleccionar rango de fechas (max 10 dias corridos)
3. Seleccionar licencias: Crear licencias en Buk o Rechazar multiple
4. Licencias pre y post natal: hacer individualmente indicando fecha de aplicacion
5. Tramitar licencia: adjuntar documentos, indicar entidad pagadora, fechas

**Notas:** No actualiza estado en portal LM Empleador. Abrir PDF para ver estado actual.

---

## 22. Como enviar archivos via SFTP?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36633098980635

Envio de archivos de pago de Sueldos via SFTP para automatizar procesos.

**Configuracion:**
1. Confirmar con SAC que la plataforma este configurada
2. Marketplace > Integraciones > Contratadas > Configurar SFTP
3. Completar formulario por empresa: Backup URL y Backup Password (minimo)
4. Opcion encriptacion activa (checkbox) > Guardar

**Envio:** Remuneraciones > Procesos > Sueldos > Enviar banco

---

## 23. Como integrar Clay con Buk
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36632973170971

Clay es plataforma de gestion contable online que consolida informacion bancaria y de facturacion.

**Proceso:**
1. Obtener URL de empresa y Token de Buk (Configuracion > Accesos API)
2. En Clay: Ajustes > Conexion Buk > Ingresar URL y Token
3. Ver Libro de Remuneraciones en Clay (Gestion Contable > Remuneraciones)
4. Propuesta de F29 con impuesto de segunda categoria

---

## 24. Como integrar Buk con Rindegastos
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36632750294683

Rindegastos digitaliza rendiciones de gastos. Creacion y desactivacion automatica de usuarios desde Buk.

**Paso 1:** Crear Atributo Personalizado "Rindegastos" (Entidad Empleado, Tipo Lista, Opciones si/no, Default no)

**Paso 2:** Carga Masiva: Importadores > Administrativo > Empleados > Datos Personales > Rindegastos

**Paso 3:** Obtener API Key (Sin informacion sensible, Permisos empleados Lectura)

**Paso 4:** Informar a Rindegastos raquel@rindegastos.com el correo del administrador y la API Key

---

## 25. Integracion Buk con Sistegra
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36632289318171

Sistegra gestiona Seguridad y Salud en el Trabajo (SST). Crea automaticamente empresas y usuarios en Sistegra.

**Atributos para usuarios (Entidad Empleado):**
- Estrato: Lista (1, 2, 3, 4, 5, 6)
- Nivel de estudio: Lista (Basico, Bachiller, Tecnico, Tecnologo, Universitario, Especialista, Magister, Doctorado)
- Area de Trabajo: Lista (Administracion, Almacen, Comercial, Compras, Direccion, Finanzas, Logistica, Marketing, Produccion, RRHH)

**Atributos para empresa (Tipo Texto):**
- Correo Representante Legal
- Celular Representante Legal

**Obtener API Key:** Sin informacion sensible, Permisos empleados Lectura. Enviar Token al equipo de Sistegra.

---

## 26. Como integrarse a Buk a traves de una API
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403643846043

Guia general para integrar distintos sistemas con Buk automaticamente.

**Pasos:**
1. Configuracion > Accesos API > Crear nueva API Key
2. Seleccionar permisos de datos sensibles y empresas
3. Permisos: Lectura o Lectura y modificacion
4. Guardar y hacer clic en icono "Ojo" para obtener el Token

**Documentacion:** https://{empresa}.buk.{pais}/apidocs (ejemplo: https://proyectoperu.buk.pe/apidocs)

Autenticarse via boton "Authorize". Ver Endpoints disponibles. Probar en vivo con "Pruebalo!".

---

*Documentacion generada desde: https://supportcenter.buk.cl/hc/es-419/sections/36257702625563-Integraciones*
*Fecha: 19/03/2026*
