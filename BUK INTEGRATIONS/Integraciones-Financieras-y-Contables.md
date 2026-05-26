# Integraciones Financieras y Contables - BUK

> Articulos sobre integraciones de Buk con sistemas financieros, contables y de gestion.

---

## Integracion Buk NetSuite
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36657752743195

Integracion entre Buk y NetSuite (ERP de gestion empresarial). Envia lineas de liquidacion para centralizacion contable como journal entries.

### Descripcion General
- Protocolo: OAuth 1.0 con TBA (Token Based Authentication)
- Tipo: Unidireccional (desde Buk a NetSuite)
- Alcance: Solo journal entries (NO incluye sincronizacion de nomina)
- Disponible para: Chile, Mexico, Colombia y Peru

El cliente puede solicitar la integracion directamente a Buk sin costo adicional (integracion estandar).

### Opciones de Integracion

#### 1. Integracion Estandar (Gratuita)
Incluye el envio de lineas contables desde Buk hacia NetSuite para centralizacion contable.
**NO** contempla sincronizacion de nomina.

**Requisitos del Cliente:**
- API de NetSuite habilitada
- Version Standard o Premium de NetSuite (NO la version Starter)
- Obtener Access Token de NetSuite:
  - Consumer Key/Client ID
  - Consumer Secret/Client Secret
  - Token ID
  - Token Secret
- Proporcionar REALM (URL de acceso a NetSuite):
  - Produccion: https://1234567.suitetalk.api.netsuite.com/ -> REALM: 1234567
  - Sandbox: https://1234567-sb1.suitetalk.api.netsuite.com/ -> REALM: 1234567-sb1
- Informacion de estructura contable:
  - ID Interno (Empleado)
  - ID vendors (Empleado)
  - Tercero NetSuite (Nombre Empleado o Nombre Entidad)
  - ID Cuentas Contables
  - ID Centro Costos
  - ID Externo (Nombre documento contable)
  - ID Proveedor (Entidades)

**Proceso de Implementacion:**
- Mes 1: JP de Buk recopila informacion del cliente y carga CSV para validar integracion
- Mes 2: JP genera ticket al equipo de integraciones de Buk (hasta 1 mes)

#### 2. Integracion a la Medida (Con costo)
Para integraciones avanzadas (sincronizacion de nomina, datos adicionales). Gestionada por partners certificados.

**Partners certificados:**
- Hood River Consulting (HRC)
- Agilesoft
- Onitec
- K2
- TCIT

**Contacto por pais:**
- Chile: Partnerschile@buk.cl
- Colombia: Partners@buk.co
- Mexico: partners@buk.mx
- Peru: partners@buk.pe

### Como Solicitar
- Cliente nuevo de Buk en implementacion: Solicitar a su Jefe de Proyectos
- Cliente ya implementado: Solicitar a SAC levantando una solicitud

### Modulos Requeridos
- Base: Gestion de personas esencial
- Modulos: Remuneraciones
- Otros: API de NetSuite

---

## Como integrar Chipax con Buk
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36645310809499

Chipax ayuda a las Pymes a gestionar sus finanzas. Con la integracion, Chipax descarga todos los conceptos contables (haberes y descuentos) de las liquidaciones desde Buk.

### Beneficios
- Sincronizacion automatica de informacion de remuneraciones
- Informacion completa del "costo empresa" completo para el Resultado Operacional
- Clasificacion de costo de empleado en multiples categorias (Lineas de Negocio/Cuentas)

### Como conectar Buk en Chipax
1. En Buk: ir a Configuracion > Accesos API > Crear Nueva API Key
2. Guardar y hacer clic en el icono del ojo para obtener el Token
3. En Chipax: ir al modulo de Integraciones
4. Hacer clic en "Conectar" la aplicacion Buk
5. Ingresar la URL de tu cuenta Buk y el token de acceso generado
6. Hacer clic en "Guardar"

### Actualizacion de Datos
Una vez conectado Buk a Chipax, hacer clic en "Actualizar" en el modulo Remuneraciones para sincronizar los datos.

### Funcionalidades en Chipax
- **Ver Libro de Remuneraciones:** Gestion Contable > Remuneraciones > filtrar por mes
- **Propuesta de F29:** toma el impuesto de segunda categoria y el libro de remuneraciones para calcular en un solo lugar

---

## Como integrar Clay con Buk
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36632973170971

Clay es una plataforma online que entrega servicio de gestion contable, consolidando informacion bancaria y de facturacion.

### Requisitos Previos
- URL de la empresa en Buk
- Token de acceso (API Key de Buk)

### Como conectar Buk en Clay
1. En Buk: Configuracion > Accesos API > obtener URL y Token
2. En Clay: ir a Ajustes > Conexion Buk
3. Ingresar URL y Token
4. Configurar los permisos de la API

### Funcionalidades con la Integracion
- **Ver Libro de Remuneraciones en Clay:** Gestion Contable > Remuneraciones > filtrar por mes y elegir libro
- **Propuesta de F29:** Clay toma el impuesto de segunda categoria y el libro de remuneraciones para el calculo

**Nota:** La informacion proviene directamente de Buk y no se puede modificar en Clay (si en Buk).

---

## Como integrar Buk con Rindegastos
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36632750294683

Rindegastos digitaliza el proceso de rendiciones de gastos. La integracion permite la creacion y desactivacion automatica de usuarios Rindegastos desde Buk.

### Paso 1: Crear Atributo Personalizado "Rindegastos"
Desde Configuracion > Atributos Personalizados > Nuevo Atributo.

Parametros:
- Entidad: Empleado
- Atributo: Rindegastos
- Tipo de Valor: Lista
- Opciones (una por linea): si / no
- Valor por Defecto: no
- Guardar

### Paso 2: Carga Masiva de Datos
Importadores > Importadores > Administrativo > Empleados > Datos Personales > seleccionar "Rindegastos" > descargar template, completar y subir.

### Paso 3: Obtener API Key
Configuracion > Accesos API > Crear Nueva API Key

Permisos recomendados:
- Descripcion: Rindegastos
- NO marcar "Permitir ver Informacion Sensible"
- NO marcar "Limitar acceso por empresas"
- Permisos empleados: LECTURA
- Todos los demas: Ninguno
- Clic en "Crear API Key"

Hacer clic en el icono del ojo para obtener el Token.

### Paso 4: Activar en Rindegastos
El administrador debe informar a Rindegastos (raquel@rindegastos.com) con:
- Su propio correo (para notificaciones de altas, bajas o modificaciones)
- La API Key generada

Para mas info: Manual de Activacion Buk en Rindegastos.
Landing de integracion: https://info.buk.cl/buk-junto-a-rindegastos

### Preguntas Frecuentes
- **Costo:** Esta integracion no tiene costo, solo se requieren ambas plataformas contratadas
- **Tiempo de implementacion:** Es plug & play, puede estar operativa en minutos

---

## Integracion Buk con Sistegra
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36632289318171

Sistegra gestiona Seguridad y Salud en el Trabajo (SST). La integracion extrae informacion de Buk y crea automaticamente empresas y usuarios en Sistegra.

### Paso 1: Crear Atributos Personalizados

**Para Usuarios (Entidad Empleado - Tipo Lista):**

Atributo 1 - Estrato:
- Opciones: 1, 2, 3, 4, 5, 6

Atributo 2 - Nivel de estudio:
- Opciones: 1. Basico, 2. Bachiller, 3. Tecnico, 4. Tecnologo, 5. Universitario, 6. Especialista, 7. Magister, 8. Doctorado, 9. Pos doctorado

Atributo 3 - Area de Trabajo:
- Opciones: Administracion y contabilidad, Almacen, Comercial, Compras, Direccion general, Finanzas y control de gestion, I+D, Logistica y operaciones, Marketing, Produccion, Recursos humanos RRHH

**Para Empresa (Entidad Empresa - Tipo Texto):**

Atributo 4 - Correo Representante Legal
Atributo 5 - Celular Representante Legal

### Paso 2: Obtener API Key
Configuracion > Accesos API > Crear Nueva API Key

Permisos:
- Descripcion: Sistegra
- NO marcar "Permitir ver Informacion Sensible"
- NO marcar "Limitar acceso por empresas"
- Permisos empleados: LECTURA
- Todos los demas: Ninguno
- Clic en "Crear API Key" > hacer clic en el ojo para obtener el Token

### Paso 3: Enviar Token a Sistegra
Enviar el Token al equipo de Sistegra para que finalicen la integracion.

### Uso en Sistegra
**Menu lateral > Administrador Buk usuarios:**

- **Nuevos Empleados:** Muestra empleados no registrados previamente en Sistegra
- **Ver empleados:** Lista todos los empleados registrados en Buk con opciones para:
  - Editar usuarios en Sistegra
  - Registrar empleados en Sistegra (si ya existe, mostrara error)

---

## Como enviar archivos via SFTP?
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36633098980635

Funcionalidad de Buk para enviar archivos de pago de Sueldos a un servidor FTP/SFTP, automatizando los procesos de pago o implementando un sistema mas seguro.

### Activacion
1. Confirmar con el equipo de SAC que la plataforma esta configurada para permitir el envio de archivos. Si no, solicitar activacion.
2. Ir al menu lateral > Marketplace > Integraciones > Contratadas
3. Hacer clic en "Configurar" en el cuadro correspondiente a la integracion de envio SFTP

### Configuracion
Por cada empresa creada en Buk se mostrara un formulario separado para establecer diferentes URL de envio.

Campos:
- **Backup URL** (obligatorio): URL del servidor SFTP
- **Backup Password** (obligatorio): Contrasena del servidor SFTP
- **Encriptacion Activa** (opcional): Marcar el checkbox para encriptar el archivo
- Hacer clic en "Guardar"

### Envio del Archivo
1. Ir a Remuneraciones > Procesos
2. Ingresar a cualquiera de los procesos o subprocesos
3. Hacer clic en "Sueldos" > seleccionar la opcion "Enviar banco"

---

*Fuente: https://supportcenter.buk.cl/hc/es-419/sections/36257702625563-Integraciones*
