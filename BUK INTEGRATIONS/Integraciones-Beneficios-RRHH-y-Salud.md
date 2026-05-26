# Integraciones de Beneficios, RRHH y Salud - BUK

> Articulos sobre integraciones de Buk con sistemas de beneficios, recursos humanos y licencias medicas.

---

## Integracion BUK - Betterfly
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36645597577883

Betterfly mejora el bienestar de los colaboradores. La integracion permite administrar desde Buk cuales colaboradores tienen acceso a la plataforma de Betterfly.

### Paso 1: Crear Atributo Personalizado "Betterfly"
Crear un atributo personalizado en Buk para identificar que colaboradores deben tener acceso a Betterfly.

Parametros:
- Tipo de Valor: Texto
- Entidad: Empleado
- Por cada colaborador, completar con el valor "SI" si debe tener acceso a Betterfly

Para la creacion del Atributo Personalizado consultar: Crear atributos personalizados.

### Paso 2: Obtener API Key
Desde la pantalla principal > boton "engranaje" (barra superior) > Accesos API > "Crear Nueva API Key"

Permisos:
- Descripcion: Betterfly
- NO marcar "Permitir ver Informacion Sensible"
- NO marcar "Limitar acceso por empresas"
- Subir documentos: No
- Ver y descargar documentos: No
- Permisos empleados: LECTURA
- Todos los demas: Ninguno
- Clic en "Crear API Key"

### Paso 3: Compartir Token con Betterfly
Hacer clic en el icono del "ojo" a la derecha de la columna Token para ver el Token. Copiarlo y enviarlo al agente de Betterfly para que finalice la integracion.

---

## Como integrar Buk con Brolly?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/37147913867547

Brolly mejora la salud financiera del equipo a costo $0, a traves de educacion y asesoria financiera y acceso a mejores productos de ahorro, inversion y financiamiento.

### Descripcion
Brolly obtiene de Buk informacion de nombre, RUT, celular, mail, sueldo bruto, tiempo de trabajo en la empresa, porcentaje de descuentos e informacion de cuenta bancaria de los colaboradores que quieran sumarse al beneficio y hayan aceptado los terminos y condiciones.

### Requisitos Modulares
- Base: Gestion de personas
- Modulos: Remuneraciones
- Addons: API

### Paso 1: Crear API Key en Buk
Administracion > Accesos API > Crear Nueva API Key

Permisos:
- Descripcion: Brolly
- Permitir ver informacion sensible: Si
- Limitar acceso por empresa: No
- Permiso para subir documentos: No
- Permisos empleados: Lectura
- Permisos items: Lectura
- Todos los demas: Ninguno
- Guardar > Clic en icono "ojo" para obtener el API Key o Token

### Paso 2: Enviar API Key a Brolly
Copiar la API Key y enviarla a solicitudes@brolly.cl con asunto: "[NOMBRE DE EMPRESA] - BUK API KEY"
Tambien indicar la URL del portal de empresa Buk (ejemplo: https://nombredeempresa.buk.cl)

### Paso 3: Cargar Creditos Brolly
Mensualmente, Brolly enviara un Excel con la informacion de todos los creditos nuevos. Cargarlo mediante:
1. Ingresar a Buk > Importadores
2. Buscar "Importadores Masivos" > casilla "Descuentos de Caja o Creditos"
3. Marcar "Permitir cargar descuentos de caja o creditos en el futuro"
4. En "Origen": seleccionar "Otros Creditos"
5. Seleccionar el archivo Excel de Brolly
6. Esperar a que se importe masivamente

### Contacto Brolly
- Email: contacto@brolly.cl
- Telefono: +56 9 64618534

---

## Como integrar Buk con Flexpay?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/37147697382043

Flexpay es un SaaS que automatiza el calculo de la remuneracion variable, entregando resultados de forma simple y clara para colaboradores y la compania.

### Descripcion
Flexpay obtiene informacion de empleados vigentes de Buk y luego inserta en Buk un item variable calculado y un desglose en PDF alojado en las carpetas de cada colaborador.

### Requisitos Modulares
- Base: Gestion de personas esencial
- Modulos: Remuneraciones
- Addons: API

### Crear API Key en Buk
Administracion > Accesos API > Crear Nueva API Key

Permisos:
- Descripcion: Flexpay
- Permitir ver informacion sensible: Si
- Limitar acceso por empresa: No
- Permisos para subir documentos: Si
- Permisos empleados: Lectura y Modificacion
- Permisos asistencia: Ninguno
- Permisos items: Lectura y modificacion
- Permisos vacaciones: Ninguno
- Ver y descargar documentos: Si
- Todos los demas: Ninguno
- Guardar > Clic en icono "ojo" para obtener el Token

### Enviar API Key a Flexpay
Enviar la API Key a:
- German Larrain: glarrain@flexpay.cl
- Carlos Vial: cvial@flexpay.cl
Con asunto: "[NOMBRE DE EMPRESA] - BUK API KEY"
Incluir la URL del portal Buk.

### Contacto Flexpay
- contacto@flexpay.cl
- Telefono: +56 9 64618534

---

## Integracion Buk con Agri
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36657819347995

Agri es un software de gestion que lleva tecnologia hacia el sector agricola. Las faenas registradas en Agri con sus centros de costos, bonos y colaboradores quedan reflejados en los haberes y asistencia de Buk.

### Beneficios de la Integracion
- Simplicidad: Desaparece el doble trabajo de copiar informacion entre plataformas
- Seguridad: Conexion segura bajo estandares mundiales de seguridad
- Integridad: Los datos de faenas y tratos en Agri se traspasan automaticamente a Buk
- Mejora continua: Comprometidos a explorar mejoras entre ambas plataformas

### Requisitos Modulares
- Base: Gestion de personas
- Modulos: Remuneraciones
- Addons: API

### Crear API Key en Buk
Administracion > Accesos API > Crear Nueva API Key

Permisos:
- Descripcion: Agri
- Permitir ver informacion sensible: Si
- Limitar acceso por empresa: No
- Permiso para subir documentos: Si
- Ver y descargar documentos: Si
- Permisos empleados: Lectura
- Permisos contabilidad: Ninguno
- Permisos asistencia: Lectura y modificacion
- Permisos items: Lectura y modificacion
- Todos los demas: Ninguno
- Guardar > Clic en icono "ojo" para obtener el Token

### Enviar API Key a Agri
Remitir la API Key a Jose Ignacio Monasterio (joseignacio@tcit.cl), Jefe Comercial de Agri. Esto habilitara la integracion y Buk aparecera en el menu "Integraciones Disponibles" de Agri.

---

## Como integrar buk con Movired
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36657634710555

La integracion permite indicar en Buk a que colaboradores realizar la carga masiva de sus tarjetas bip!, bip!QR, TNE (Tarjeta Nacional Estudiantil) o TAM (Tarjeta Adulto Mayor).

### Beneficios
- Disminucion en tiempo de trayecto casa-trabajo
- Seguridad al Empleador del uso correcto del beneficio de movilizacion
- Automatizacion del proceso de carga sin necesidad de operador manual
- Desarrollo del personal a traves del beneficio de transporte

### Paso 1: Crear API Key
Configuracion > Accesos API > Crear Nueva API Key

Permisos:
- Descripcion: INTEGRACION_BIP
- Permitir ver informacion sensible: No
- Limitar acceso por empresa: No
- Permisos empleados: Lectura
- Todos los demas: Ninguno
- Guardar > Clic en icono "ojo" para obtener el Token

### Paso 2: Crear Atributos Personalizados
Crear los atributos en Configuracion > Atributos Personalizados > Nuevo Atributo:

1. **activar_bip** - Tipo Lista (Si/No): Define si el colaborador tiene el beneficio
2. **tipo_bip** - Tipo Lista (bip!, bip!QR, TNE, TAM): Tipo de tarjeta
3. **numero_bip** - Tipo Texto: Numero de tarjeta (en bip!QR es el RUT)
4. **frecuencia_carga_bip** - Tipo Lista (1, 7, 30, 60): Frecuencia de carga en dias
5. **monto_carga_bip** - Tipo Lista ($1.000, $2.000, $3.000, $5.000, $10.000, $15.000, $20.000): Monto a cargar

### Paso 3: Carga Masiva de Datos
Desde el menu lateral: Informacion > Importadores > Importadores > Administrativo > Empleados > Datos Personales

Seleccionar los atributos: activar_bip, numero_bip, frecuencia_carga_bip, monto_carga_bip, tipo_bip

Descargar template > completar el archivo Empleados.xls > subir en la plataforma.

### Paso 4: Gestionar Integracion con Movired
Ingresar al sitio movired.cl/buk > ingresar el Token y datos solicitados. Movired contactara y terminara de habilitar la integracion.

### Preguntas Frecuentes
- Requiere Addon de API en Buk y servicio de Movired
- La habilitacion no tiene costo alguno
- Montos disponibles: desde $1.000 hasta $20.000
- Tarjetas disponibles: bip!, bip!QR, TNE, TAM
- Frecuencia: entre 1 y 60 dias
- Se puede elegir a que colaboradores otorgar el beneficio
- No se requiere activacion en totems (Movired se encarga)

---

## Integracion Buk AppWorki
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36642221017499

AppWorki es la primera aplicacion movil chilena que digitaliza y certifica ante la Direccion del Trabajo (DT) los procesos criticos de prevencion de riesgos para fortalecer la cultura de cero accidentes laborales.

### Beneficios
Administrar desde Buk la nomina de colaboradores en las dos plataformas. Olvida de manejar el alta y baja de usuarios en dos plataformas.

### Crear API Key en Buk
Configuracion > Accesos API > Crear Nueva API Key

Permisos:
- Descripcion: AppWorki
- Permitir ver informacion sensible: Si
- Limitar acceso por empresa: Si (elegir las empresas a habilitar para la integracion)
- Permisos empleados: Lectura
- Permisos asistencia: Lectura
- Permisos usuarios y perfiles: Lectura
- Todos los demas: Ninguno
- Guardar > Clic en icono del "ojo" para obtener el Token

### Activar Integracion
Enviar el Token a contacto@appworki.cl para que finalicen la integracion entre las dos plataformas.

Para soporte: sac@buk.cl
Para dudas sobre la alianza: partners@buk.cl

---

## Activacion X-Data: Automatizacion de cambios en planes Isapre
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36633302534555

X-Data es una empresa de tecnologia encomendada por las Isapres para manejar el proceso de notificacion de FUN de manera digital y eficiente.

### Descripcion
La automatizacion cumple con las regulaciones de la Superintendencia de Salud. Permite que las cotizaciones de Isapre se actualicen automaticamente, minimizando errores humanos. Sin costo para el empleador (los costos son asumidos por la Isapre).

### Proceso de Activacion
1. Llenar un formulario en www.x-data.cl o solicitar por email a contacto@x-data.cl
2. X-Data proporcionara un codigo unico de convenio para cada Razon Social
3. En Buk: Administracion (engranaje) > Empresas
4. Localizar la casilla "Codigo Convenio X-Data / Portal Isapres" y registrar el codigo
5. Guardar - aparecera la nueva opcion "Notificaciones FUN" en la barra superior
6. Al hacer clic en "Notificaciones FUN" se pueden revisar todas las actualizaciones y cambios

**Nota:** Una vez activado el convenio, no es necesario hacer mas ajustes en la ficha. Las cotizaciones de planes se actualizan automaticamente.

### Codigos de Error
Si recibes mensajes de error, aqui la descripcion:

| Codigo | Descripcion |
|---|---|
| 01 | Finiquito (Fecha): FUN rechazado porque ya existe un finiquito registrado en esa fecha |
| 02 | Fallecido (Fecha): FUN rechazado porque el empleado esta registrado como fallecido |
| 03 | Nunca ha trabajado en la empresa: FUN rechazado porque no hay relacion laboral previa |
| 10 | Otro motivo: FUN rechazado por motivo especifico (el detalle esta en el mensaje) |
| Codigo invalido | Si el empleado no existe en el sistema |
| Codigo invalido | Para un empleado activo que se intenta registrar como finiquitado |

### Modulos Requeridos
Base: Gestion de personas esencial

---

## Integracion Licencias Medicas Electronicas (Configuracion)
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/37366418763931

Permite tramitar, recibir y realizar un seguimiento del estado de las Licencias Medicas Electronicas de Imed y Medipass desde Buk. Incluye revision en linea del pronunciamiento y liquidacion de la licencia dada por la COMPIN o Isapre.

### Proceso de Activacion
1. Crear empresa en el portal www.lmempleador.cl (ver Manual de Inscripcion de empresa)
2. En Buk: ir al menu lateral Marketplace > Soluciones Buk > pestana Disponibles
3. Buscar "Licencias Medicas Electronicas" > clic en Cotizar para agendar reunion comercial
4. Una vez activo: modulo LME disponible en menu lateral > Asistencia > Licencias Medicas Electronicas

### Configuracion de Imed
1. Ir a Marketplace > Soluciones Buk > Contratadas > Configurar en Licencias Medicas Electronicas
2. Seleccionar la empresa que quieres editar
3. Completar todos los campos:
   - **Comuna:** Correspondiente a las operaciones de la empresa
   - **Tipo de Licencia por Defecto:** tipo de licencia creado en el sistema (por defecto: "Licencia")
4. Clic en "Guardar"

### Requisitos
- **Modulos:** Base (Plataforma esencial) + Addon Integracion Licencias Medicas Electronicas
- **Configuracion General:** Activar "Integrar Licencias Medicas Electronicas"

---

## Sincronizacion Licencias Medicas Electronicas
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36633195398299

Proceso para obtener, sincronizar y tramitar licencias desde Imed o Medipass con la ficha del trabajador.

### Consideraciones Importantes
- Esta integracion NO actualiza el estado de las licencias medicas en el portal LM Empleador
- Para verificar el estado de la licencia, se debe abrir el archivo PDF (ahi esta el estado actualizado)
- Las licencias pasan al estado "Tramitada" solo cuando cuentan con pronunciamiento y son liquidadas por la entidad pagadora

### Proceso de Sincronizacion
1. Ir a Asistencia > Licencias Medicas Electronicas
2. Hacer clic en el boton "Consultar Licencias"
3. Seleccionar el rango de fechas para consultar (MAXIMO 10 DIAS CORRIDOS)
4. Clic en "Consultar" para obtener las licencias creadas y actualizadas en el periodo

### Opciones para Seleccionar Licencias
- **Crear licencias en Buk (sincronizar con Buk):** Para sincronizar masivamente
- **Rechazar multiple:** Para rechazar multiples licencias

**Nota:** Las licencias de pre y post natal NO permiten ser creadas de forma masiva. Deben hacerse individualmente desde el icono del lapiz, indicando la fecha de aplicacion (cuando se descontaran los dias en la liquidacion).

### Tramitar Licencias
Desde el icono de documento de cada licencia:
1. Seleccionar los documentos que se adjuntaran (ademas de las 3 ultimas liquidaciones que se adjuntan automaticamente)
2. Indicar la entidad pagadora
3. Indicar las fechas respectivas
4. Los documentos deben estar previamente cargados en la pestana "Documentos" de la ficha del colaborador

**Para licencias de pre y post natal:** Se adjuntan automaticamente las 6 licencias requeridas para su tramitacion.

### Requisitos
- **Modulos:** Base (Gestion de personas esencial) + Addon Integracion Licencias Medicas Electronicas
- **Configuracion:** "Integrar Licencias Medicas Electronicas" activada
- **Perfil de usuario:** Debe permitir modificar informacion de asistencia de la ficha

---

*Fuente: https://supportcenter.buk.cl/hc/es-419/sections/36257702625563-Integraciones*
