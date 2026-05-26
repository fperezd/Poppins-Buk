# Integraciones de Seleccion y Empleo - BUK

> Articulos sobre integraciones para procesos de seleccion, publicacion de ofertas laborales y evaluaciones de candidatos.

---

## Integracion con LinkedIn
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403721109659

La integracion con LinkedIn permite compartir una oferta laboral en el muro personal del publicador o enviar como mensaje privado a otro usuario de la plataforma. La descripcion de la oferta se publica con un enlace a la URL publica para que el postulante aplique directamente a Buk.

### Activacion
No requiere el ingreso de credenciales. Para activar en Buk:
1. Ingresar al modulo de Seleccion
2. Ir a la seccion de "Configuraciones" > pestana "Seleccion"
3. Activar el switch correspondiente y dar clic en "Guardar"
4. Aparecera dentro del Marketplace en la seccion de integraciones contratadas

### Como realizar una publicacion?
1. Busca tu proceso de seleccion y en los tres puntos del costado derecho haz clic en "Publicar en LinkedIn"
2. Si no estas logueado en LinkedIn, se te solicitara Iniciar Sesion
3. Se abrira una nueva ventana con la vista previa de la publicacion
4. Selecciona si deseas compartir en el muro o enviar como mensaje privado
5. Al presionar Publicar, te notificaran que la publicacion fue exitosa

### Experiencia del Postulante
El postulante sera enviado a la URL Publica de la publicacion y podra continuar con su proceso de postulacion estandar desde Buk.

### Identificacion del origen
Si un postulante aplica desde esta URL, se puede detectar a LinkedIn como fuente de origen, lo que se refleja en el panel de estadisticas del proceso.

---

## Integracion con Laborum
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36645527676699

Publicar procesos de seleccion de BUK en el portal de empleos de Laborum. Obtener postulantes y CVs automaticamente.

### Requisitos
- Contar con un plan de Laborum que incluya integracion mediante API y avisos
- Las credenciales y Api Key son proporcionadas por Laborum
- Usuario con Permisos de Modificacion en Seleccion para publicar

### Configuracion de la Integracion
1. Activar en Seleccion > Configuraciones > pestana "integraciones" > switch Laborum > Guardar
2. Ir a Marketplace > Integraciones > pestana "Contratadas" > clic en Configurar Laborum
3. Seleccionar empresa(s), ingresar la Api Key de Laborum, marcar checkbox "Activo" y Guardar

### Otras Configuraciones
**Configuracion de la Empresa:** Configurar nombre de fantasia en Seleccion >> Administracion > seccion "Configuracion de empresas".

**Configuracion del proceso:** Completar campos en Seleccion >> Procesos al crear, copiar o editar un proceso.

### Publicar en Laborum
Con la integracion activada, se habilita la accion "Publicar en Laborum" en cada proceso de seleccion activo de la empresa integrada.

Al seleccionar publicar, completar los campos requeridos:
- Area (obligatorio)
- Cargo (obligatorio)
- Tipo de Trabajo (obligatorio)
- Region/Ubicacion (obligatorio)
- Descripcion + Requerimientos (obligatorio)
- Industria (obligatorio)
- Pais: Chile (automatico)

**Nota:** El nombre del proceso en Laborum sera el nombre de fantasia estipulado y el cargo de la vacante buscada.

### Obtencion de Postulantes
Los postulantes de Laborum se obtienen automaticamente al postular a traves de Laborum y apareceran en la columna "Postulantes" del proceso correspondiente.

**Campos del postulante recibidos:**
| Campo | Obligatorio |
|---|---|
| Nombre | Si |
| Primer Apellido | Si |
| Mail | Si |
| Telefono | No |
| RUT | Si |
| CV | Si (proximamente) |

---

## Integracion con BNE
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36642262196507

Con la integracion entre Buk y BNE podras publicar tus ofertas laborales de manera sencilla y gratuita en el portal de empleos nacionales.

### Configuracion
1. Activar en Seleccion > Configuraciones > pestana "integraciones" > switch BNE > Guardar
2. Ir a Marketplace > Integraciones > pestana "Contratadas" > clic en Configurar BNE
3. Seleccionar empresa(s), marcar checkbox "Activo" y Guardar

### Como publicar en BNE?
1. Con la integracion activada, se habilita la accion "Publicar en BNE" en cada proceso de seleccion activo
2. Al seleccionar "Publicar en BNE", completar los campos requeridos:
   - Cargo
   - Anos de experiencia requeridos
   - Sueldo minimo
   - Tipo de contrato
3. Cada postulante que aplique sera enviado al proceso de seleccion correspondiente en Buk

---

## Integracion con EB Metrics
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403460603803

EB Metrics ofrece pruebas psicometricas para evaluar aspectos fundamentales del perfil de un postulante: habilidades cognitivas, rasgos de personalidad, capacidad de resolucion de problemas.

Tipos de pruebas disponibles: capacidad cognitiva, personalidad, habilidades comerciales, habilidades tecnicas (Excel), entre otras.

Para integrar, contactar directamente a EB Metrics: https://www.ebmetrics.cl

### Funcionalidades Principales
1. Enviar pruebas psicometricas a los postulantes dentro de un proceso de seleccion
2. Obtener un archivo PDF con los resultados de las pruebas
3. Automatizar el envio de pruebas segun etapas del proceso
4. Filtrar postulantes segun si respondieron la prueba o por puntaje obtenido

### Configuracion de la Integracion en Buk
1. Seleccion > Configuraciones > pestana "integraciones" > activar switch EB Metrics > Guardar
2. Marketplace > Integraciones > pestana "Contratadas" > Configurar EB Metrics
3. Ingresar credenciales de EB Metrics:
   - Nombre de usuario: correo electronico o alias de EB Metrics
   - Contrasena: clave secreta de EB Metrics
   - Tenant: nombre de la empresa (subdominio de la URL de acceso)

### Envio de Pruebas - Automatico
1. Entrar al proceso de seleccion > pestana "Automatizacion"
2. Seleccionar etapa > clic en "+ Nueva regla"
3. Seleccionar "Enviar prueba psicometrica de EB Metrics"
4. Definir el momento de envio (cuando el postulante sea movido a la etapa o cuando responda un formulario)
5. Elegir la prueba especifica del catalogo
6. Configurar condiciones adicionales > Guardar

### Envio de Pruebas - Manual
1. Ingresar al proceso de seleccion
2. Seleccionar los postulantes deseados
3. Clic en Acciones > Enviar formulario
4. Seleccionar fuente "EB Metrics" y la prueba a aplicar
5. Clic en "Aceptar" - se enviara automaticamente un correo con la prueba

### Resultados de Pruebas
Los resultados se pueden revisar descargando el archivo PDF desde la pestana "Formularios" del proceso:
- Seleccionar formulario de origen EB Metrics
- Seleccionar candidato(s) > Acciones > Descargar
- O desde la ficha del postulante > pestana Proceso > lista de formularios enviados > icono de flecha

---

## Integracion TestGorilla
**URL:** https://supportcenter.buk.cl/hc/es-419/articles/36403378513563

TestGorilla es una plataforma de evaluacion de habilidades que utiliza pruebas psicometricas y tecnicas para medir habilidades en diferentes areas: programacion, liderazgo, pensamiento critico y mas.

Catalogo de pruebas: https://www.testgorilla.com/es/catalogo-de-pruebas/

### Requisitos
- Modulo de Seleccion de Buk
- Plan Scale o Business de TestGorilla (https://www.testgorilla.com/es/precio/)
- Credencial de integracion de TestGorilla

### Funcionalidades
1. Enviar pruebas psicometricas a los postulantes
2. Obtener enlace a los resultados de las pruebas
3. Automatizar el envio de pruebas psicometricas
4. Filtrar postulantes por respuesta o puntaje

### Configuracion de la Integracion en Buk
1. Seleccion > Configuraciones > pestana "integraciones" > activar switch TestGorilla > Guardar
2. Marketplace > Integraciones > pestana "Contratadas" > Configurar TestGorilla
3. Ingresar la API Key proporcionada por TestGorilla

### Como obtener la API Key de TestGorilla?
1. Ingresar a la pagina de TestGorilla > seccion "Integrations"
2. Ubicar el logo de Buk > presionar boton "Enable"
3. Hacer clic en la tuerca para acceder a la API Key generada automaticamente

### Envio de Pruebas - Automatico
1. Proceso de seleccion > pestana "Automatizacion"
2. Seleccionar etapa > clic en "+ Nueva regla"
3. Seleccionar "Enviar prueba psicometrica del TestGorilla"
4. Definir el momento de envio (movido a etapa o cuando responda un formulario)
5. Elegir la prueba especifica del catalogo
6. Configurar condiciones adicionales > Guardar

### Envio de Pruebas - Manual
1. Ingresar al proceso de seleccion
2. Seleccionar postulantes deseados
3. Clic en Acciones > Enviar formulario
4. Seleccionar fuente "TestGorilla" y la prueba a aplicar
5. Clic en "Aceptar"

### Recepcion de Resultados
En el tab "Formularios" del proceso se muestran las pruebas psicometricas disponibles:
- Postulantes: numero de postulantes que recibieron la prueba
- Avance Global: porcentaje de postulantes que contestaron
- Al clic en el nombre de la bateria, ver detalles de cada postulante: RUT, Etapa, Estado, Puntaje, Aprobado
- Accion "Obtener enlace" abre los resultados del postulante en nueva ventana

---

*Fuente: https://supportcenter.buk.cl/hc/es-419/sections/36257702625563-Integraciones*
