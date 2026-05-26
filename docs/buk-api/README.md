# Buk API — Documentación local

Documentación extraída desde el Swagger 2.0 oficial de Buk.
Fuente: <https://demo.buk.cl/apidocs> → spec en `/api/chile/es/api_docs`.

## Datos generales

- **Host (demo)**: `demo.buk.cl`
- **Host (producción Poppins)**: `renearavena.buk.cl`
- **Base path**: `/api/v1/chile`
- **Auth**: header `auth_token: <API_KEY>`
- **API Key**: gestionar en *Configuración → Accesos API* dentro de la plataforma.
- **Variables disponibles**: Chile, Colombia, Perú, México, Brasil — idiomas ES/EN/PT.

## Cómo construir una request

```http
GET https://renearavena.buk.cl/api/v1/chile/employees
auth_token: <API_KEY>
Accept: application/json
```

## Índice por recurso

- [Períodos](endpoints/periodos.md) — 1 endpoint(s)
- [Procesos](endpoints/procesos.md) — 4 endpoint(s)
- [Trabajos](endpoints/trabajos.md) — 6 endpoint(s)
- [Liquidaciones](endpoints/liquidaciones.md) — 5 endpoint(s)
- [Vacaciones](endpoints/vacaciones.md) — 6 endpoint(s)
- [Feriados](endpoints/feriados.md) — 1 endpoint(s)
- [Beneficios](endpoints/beneficios.md) — 3 endpoint(s)
- [Personas](endpoints/personas.md) — 1 endpoint(s)
- [Ausencias](endpoints/ausencias.md) — 1 endpoint(s)
- [Inasistencias](endpoints/inasistencias.md) — 9 endpoint(s)
- [Licencias](endpoints/licencias.md) — 7 endpoint(s)
- [Permisos](endpoints/permisos.md) — 9 endpoint(s)
- [Horas no trabajadas](endpoints/horas-no-trabajadas.md) — 7 endpoint(s)
- [Horas Extras](endpoints/horas-extras.md) — 5 endpoint(s)
- [Cargos](endpoints/cargos.md) — 5 endpoint(s)
- [Áreas](endpoints/areas.md) — 7 endpoint(s)
- [Empresas](endpoints/empresas.md) — 1 endpoint(s)
- [Centralización contable](endpoints/centralizacion-contable.md) — 7 endpoint(s)
- [Ítems](endpoints/items.md) — 1 endpoint(s)
- [KPIs](endpoints/kpis.md) — 4 endpoint(s)
- [Centro de costo](endpoints/centro-de-costo.md) — 6 endpoint(s)
- [Localidades](endpoints/localidades.md) — 2 endpoint(s)
- [Sindicatos](endpoints/sindicatos.md) — 4 endpoint(s)
- [Labores](endpoints/labores.md) — 2 endpoint(s)
- [Tarifas](endpoints/tarifas.md) — 2 endpoint(s)
- [Productos](endpoints/productos.md) — 2 endpoint(s)
- [Unidades](endpoints/unidades.md) — 2 endpoint(s)
- [Lugares de Trabajo](endpoints/lugares-de-trabajo.md) — 2 endpoint(s)
- [Registros de Trabajo](endpoints/registros-de-trabajo.md) — 3 endpoint(s)
- [Créditos](endpoints/creditos.md) — 7 endpoint(s)
- [Días trabajados](endpoints/dias-trabajados.md) — 3 endpoint(s)
- [Recintos](endpoints/recintos.md) — 3 endpoint(s)
- [Evaluaciones](endpoints/evaluaciones.md) — 3 endpoint(s)
- [Suplencias](endpoints/suplencias.md) — 4 endpoint(s)
- [Sincronización datos de pago](endpoints/sincronizacion-datos-de-pago.md) — 1 endpoint(s)
- [Versiones](endpoints/versiones.md) — 1 endpoint(s)
- [Postulante](endpoints/postulante.md) — 6 endpoint(s)
- [Postulación](endpoints/postulacion.md) — 3 endpoint(s)
- [Proceso de selección](endpoints/proceso-de-seleccion.md) — 2 endpoint(s)
- [Capacitaciones](endpoints/capacitaciones.md) — 2 endpoint(s)
- [Flujos de Trabajo](endpoints/flujos-de-trabajo.md) — 1 endpoint(s)
- [Grupos](endpoints/grupos.md) — 2 endpoint(s)
- [Colaboradores](endpoints/colaboradores.md) — 30 endpoint(s)
- [Grupo Familiar](endpoints/grupo-familiar.md) — 1 endpoint(s)
- [Finiquitos](endpoints/finiquitos.md) — 2 endpoint(s)
- [Usuarios y perfiles](endpoints/usuarios-y-perfiles.md) — 5 endpoint(s)
- [Documentos](endpoints/documentos.md) — 6 endpoint(s)
- [Políticas de vacaciones](endpoints/politicas-de-vacaciones.md) — 1 endpoint(s)
- [Estructuras Contables](endpoints/estructuras-contables.md) — 4 endpoint(s)
- [Items](endpoints/items.md) — 5 endpoint(s)
- [Variables de Empresas](endpoints/variables-de-empresas.md) — 1 endpoint(s)
- [Variables de Registros Empresas](endpoints/variables-de-registros-empresas.md) — 1 endpoint(s)
- [Notas](endpoints/notas.md) — 1 endpoint(s)

## Otros archivos

- [`schemas.md`](schemas.md) — definiciones de objetos (input/output)
- [`spec/buk-chile-es.json`](spec/buk-chile-es.json) — Swagger 2.0 ES (raw)
- [`spec/buk-chile-en.json`](spec/buk-chile-en.json) — Swagger 2.0 EN (raw)
