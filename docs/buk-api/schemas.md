# Schemas (Definitions)

Total definiciones: 217

Schemas referenciados directamente desde endpoints:

## `Absences::Absence::Request`

_(schema `Absences::Absence::Request` sin propiedades documentadas)_


## `Absences::Licence::Request`

_(schema `Absences::Licence::Request` sin propiedades documentadas)_


## `Absences::Permission::Request`

_(schema `Absences::Permission::Request` sin propiedades documentadas)_


## `ApplicantInput`

_(schema `ApplicantInput` sin propiedades documentadas)_


## `ApplicationInput`

_(schema `ApplicationInput` sin propiedades documentadas)_


## `Area::Create`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `parent_id` | integer |  |  |
| `location_id` | integer |  |  |
| `name` | string |  |  |
| `accounting_prefix` | string |  |  |
| `city` | string |  |  |
| `address` | string |  |  |
| `cost_center_id` | string |  |  |
| `role_ids` | array |  |  |
| `custom_attrs` | object |  |  |


## `Area::Update`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  |  |
| `accounting_prefix` | string |  |  |
| `city` | string |  |  |
| `address` | string |  |  |
| `cost_center_id` | string |  |  |
| `location_id` | integer |  |  |
| `active` | boolean |  |  |
| `role_ids` | array |  |  |
| `custom_attrs` | object |  |  |


## `Assign::Create`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_id` | integer |  |  |
| `item_id` | integer |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `description` | string |  |  |
| `amount` | integer |  |  |
| `advance_payment_day` | integer |  |  |
| `overwrite_existing_assign` | boolean |  |  |
| `cost_center` | string |  |  |


## `Attendances::NonWorkedHours::Index`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `pagination` | `Pagination` |  |  |
| `data` | `Attendances::NonWorkedHours::Response[]` |  |  |


## `Attendances::NonWorkedHours::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `day` | integer | ✓ |  |
| `month` | integer | ✓ |  |
| `year` | integer | ✓ |  |
| `hours` | number (float) | ✓ |  |
| `employee_id` | integer | ✓ |  |
| `type_id` | integer | ✓ |  |


## `Attendances::NonWorkedHours::TypeModel::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string | ✓ |  |
| `paid_leave` | boolean | ✓ |  |


## `Attendances::Overtime::Index`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `pagination` | `Pagination` |  |  |
| `data` | `Attendances::Overtime::Response[]` |  |  |


## `Attendances::Overtime::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `day` | integer | ✓ |  |
| `month` | integer | ✓ |  |
| `year` | integer | ✓ |  |
| `hours` | number (float) | ✓ |  |
| `employee_id` | integer | ✓ |  |
| `type_id` | integer | ✓ |  |
| `centro_costo` | string |  |  |


## `CentroCostoDefinition`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string |  |  |
| `previred_code` | string |  |  |
| `custom_attributes` | object |  |  |


## `Credit`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `employee_id` | integer |  |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `amount` | number (float) |  |  |
| `term` | integer |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `initial_payment_date` | string (date) |  |  |
| `paid_amount` | number (float) |  |  |
| `remaining_balance` | number (float) |  |  |
| `current_fee` | integer |  |  |
| `status` | string |  |  |
| `type` | string |  |  |
| `currency` | string |  |  |
| `uf_day` | string |  |  |


## `Employee::Response::Minimal`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `period_type` | string |  | Frecuencia de pago: monthly, semi_monthly o weekly. |


## `EmployeeFileDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `employee_folder_id` | integer |  |  |
| `document_template_id` | integer |  |  |
| `original_filename` | string |  |  |
| `is_visible` | boolean |  |  |
| `settings` | object |  |  |
| `signatures` | `DocumentSignature[]` |  |  |
| `reviewer_id` | integer |  |  |


## `EmployeeFileListDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `file_id` | integer |  |  |
| `filename` | string |  |  |
| `path` | string |  |  |
| `created_at` | string |  |  |


## `EmployeeInputCloneCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `payment_method` | enum: Cheque, Servipag, Vale Vista, No Generar Pago, Transferencia Bancaria |  | Forma Pago |
| `payment_period` | enum: semanal, mensual, quincenal, diario, por_hora |  | Periodo de Pago (ej: `mensual`) |
| `bank` | enum: BBVA, BCI, BICE, Banco de Chile, Consorcio, COOPEUCH, Corpbanca, Banco Estado |  | Banco. Obligatorio si payment_method es "Transferencia Bancaria" |
| `account_type` | enum: Corriente, Vista, Ahorro |  | Tipo Cuenta. Obligatorio si payment_method es "Transferencia Bancaria" |
| `account_number` | string |  | N° Cuenta. Obligatorio si payment_method es "Transferencia Bancaria" |
| `code_sheet` | string |  | Código Ficha |
| `start_date` | string (date) |  | Ingreso Compañía |
| `private_role` | boolean |  |  |
| `custom_attributes` | object |  |  |
| `period_type` | string |  | Frecuencia de pago: monthly, semi_monthly o weekly. |


## `EmployeeResponseCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `period_type` | string |  |  |
| `person_id` | integer (int64) |  |  |
| `id` | integer (int64) |  |  |
| `picture_url` | string |  |  |
| `first_name` | string |  |  |
| `surname` | string |  |  |
| `second_surname` | string |  |  |
| `full_name` | string |  |  |
| `rut` | string |  |  |
| `nationality` | string |  |  |
| `country_code` | string |  |  |
| `civil_status` | string |  |  |
| `email` | string |  |  |
| `personal_email` | string |  |  |
| `address` | string |  |  |
| `street` | string |  |  |
| `street_number` | string |  |  |
| `office_number` | string |  |  |
| `city` | string |  |  |
| `district` | string |  |  |
| `location_id` | integer (int64) |  |  |
| `region` | string |  |  |
| `office_phone` | string |  |  |
| `phone` | string |  |  |
| `gender` | string |  |  |
| `birthday` | string |  |  |
| `university` | string |  |  |
| `degree` | string |  |  |
| `active_since` | string |  |  |
| `status` | string |  |  |
| `private_role` | boolean |  |  |
| `code_sheet` | string |  |  |
| `health_company` | string |  |  |
| `pension_regime` | string |  |  |
| `pension_fund` | string |  |  |
| `retired` | boolean |  |  |
| `retirement_regime` | string |  |  |
| `afc` | string |  |  |
| `active_until` |  (date) |  |  |
| `created_at` |  (date) |  |  |
| `termination_reason` | string |  |  |
| `custom_attributes` | object |  |  |
| `current_job` | `JobResponseCountry` |  |  |
| `bank` | string |  |  |
| `payment_currency` | enum: CLP |  |  |
| `payment_method` | string |  |  |
| `payment_period` | string |  |  |
| `advance_payment` | string |  |  |
| `account_type` | string |  |  |
| `account_number` | string |  |  |
| `progressive_vacations_start` | string (date) |  |  |
| `family_responsabilities` | `EmployeeFamilyResponsability` |  |  |


## `EmployeeResponsePatch`

_(schema `EmployeeResponsePatch` sin propiedades documentadas)_


## `EmployeeSubstitutionDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `active` | boolean |  |  |
| `employee_id` | integer |  |  |
| `substitute_id` | integer |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `reason` | string |  | Causal |


## `EmployeeSubstitutionInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `active` | boolean |  |  |
| `employee_id` | integer |  |  |
| `substitute_id` | integer |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `reason` | string |  | Causal |


## `FiniquitoInputCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `template_documento_id` | number |  |  |
| `documento_visible` | boolean |  |  |
| `descuentos` | `AsignacionFiniquito[]` |  |  |
| `haberes` | `AsignacionFiniquito[]` |  |  |


## `JobInputCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `company_id` | integer | ✓ |  |
| `start_date` | string (date) | ✓ | Fecha Inicio |
| `type_of_contract` | enum: Renovación Automática, Plazo fijo, Obra, Indefinido, Aprendizaje, A honorarios | ✓ | Tipo Contrato |
| `end_of_contract` | string (date) |  | Término Contrato. Solo si type_of_contract es "Plazo fijo" o "Renovación Automática |
| `end_of_contract_2` | string (date) |  | Término Contrato 2 |
| `periodicity` | enum: mensual, diaria, hora |  | Periodicidad Jornada. Solo si type_of_contract es "Plazo fijo" o "Renovación Automática |
| `regular_hours` | number (float) |  | Horario Semanal. Solo si type_of_contract es "Plazo fijo" o "Renovación Automática (ej: `45`) |
| `days` | enum: l, m, w, j, v, s, d |  | Dias de la Jornada Laboral (ej: `['l', 'm', 'w', 'j', 'v']`) |
| `type_of_working_day` | enum: ordinaria_art_22, parcial_art_40_bis, exenta_art_22, otros, parcial_sector_publico, ordinaria_sector_publico, otros_sector_publico |  | Tipo Jornada |
| `other_type_of_working_day` | enum: extraordinaria_art_30, especial_art_38_inc_5, especial_art_23, especial_art_106, especial_art_152_ter_d, especial_art_152_ter_f, especial_art_25, especial_art_25_bis |  | Otros Tipos Jornada. Solo si type_of_working_day es "otros" |
| `location_id` | integer (float) |  | Comuna |
| `area_id` | integer (float) | ✓ | Área |
| `role_id` | integer (float) | ✓ | Cargo |
| `leader_id` | integer (float) | ✓ | Supervisor |
| `wage` | number (float) | ✓ | Sueldo Base |
| `currency` | enum: peso, uf, utm | ✓ | Moneda |
| `without_wage` | boolean |  | Tiene Liquidación |
| `contract_subscription_date` | string (date) |  | Fecha de Suscripción de Contrato (firma de contrato) |
| `reward` | boolean |  | Recibe Gratificaciones |
| `reward_concept` | enum: articulo_47, articulo_50, sin_obligacion, superior_minimo, no_pactado |  | Gratificación Pactada |
| `reward_payment_period` | enum: gratificacion_mensual, gratificacion_bimestral, gratificacion_trimestral, gratificacion_cuatrimestral, gratificacion_semestral, gratificacion_anual |  | Periodo de Pago de la Gratificación |
| `reward_description` | string |  | Descripción de la Gratificación |
| `contractual_stipulation_attributes` | object |  |  |
| `contractual_detail_attributes` | object |  |  |
| `grado_sector_publico_chile` | enum: grado_a, grado_b, grado_c, grado_1a, grado_1b, grado_1c, grado_1, grado_2 |  | Grado |
| `estamento_sector_publico_chile` | enum: auxiliar, administrativo, tecnico, profesional, directivo_no_profesional, directivo_profesional, jefe_superior, autoridad_de_gobierno |  | Estamento |
| `custom_attributes` | object |  |  |


## `JobInputCountryPost`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `company_id` | integer | ✓ |  |
| `start_date` | string (date) | ✓ | Fecha Inicio |
| `type_of_contract` | enum: Renovación Automática, Plazo fijo, Obra, Indefinido, Aprendizaje, A honorarios | ✓ | Tipo Contrato |
| `end_of_contract` | string (date) |  | Término Contrato. Solo si type_of_contract es "Plazo fijo" o "Renovación Automática |
| `end_of_contract_2` | string (date) |  | Término Contrato 2 |
| `periodicity` | enum: mensual, diaria, hora |  | Periodicidad Jornada. Solo si type_of_contract es "Plazo fijo" o "Renovación Automática |
| `regular_hours` | number (float) |  | Horario Semanal. Solo si type_of_contract es "Plazo fijo" o "Renovación Automática (ej: `45`) |
| `days` | enum: l, m, w, j, v, s, d |  | Dias de la Jornada Laboral (ej: `['l', 'm', 'w', 'j', 'v']`) |
| `type_of_working_day` | enum: ordinaria_art_22, parcial_art_40_bis, exenta_art_22, otros, parcial_sector_publico, ordinaria_sector_publico, otros_sector_publico |  | Tipo Jornada |
| `other_type_of_working_day` | enum: extraordinaria_art_30, especial_art_38_inc_5, especial_art_23, especial_art_106, especial_art_152_ter_d, especial_art_152_ter_f, especial_art_25, especial_art_25_bis |  | Otros Tipos Jornada. Solo si type_of_working_day es "otros" |
| `location_id` | integer (float) |  | Comuna |
| `area_id` | integer (float) | ✓ | Área |
| `role_id` | integer (float) | ✓ | Cargo |
| `leader_id` | integer (float) | ✓ | Supervisor |
| `wage` | number (float) | ✓ | Sueldo Base |
| `currency` | enum: peso, uf, utm | ✓ | Moneda |
| `without_wage` | boolean |  | Tiene Liquidación |
| `contract_subscription_date` | string (date) |  | Fecha de Suscripción de Contrato (firma de contrato) |
| `reward` | boolean |  | Recibe Gratificaciones |
| `reward_concept` | enum: articulo_47, articulo_50, sin_obligacion, superior_minimo, no_pactado |  | Gratificación Pactada |
| `reward_payment_period` | enum: gratificacion_mensual, gratificacion_bimestral, gratificacion_trimestral, gratificacion_cuatrimestral, gratificacion_semestral, gratificacion_anual |  | Periodo de Pago de la Gratificación |
| `reward_description` | string |  | Descripción de la Gratificación |
| `contractual_stipulation_attributes` | object |  |  |
| `contractual_detail_attributes` | object |  |  |
| `cost_centers_attributes` | array |  |  |
| `cost_center` | string |  | Centro de Costo |
| `grado_sector_publico_chile` | enum: grado_a, grado_b, grado_c, grado_1a, grado_1b, grado_1c, grado_1, grado_2 |  | Grado |
| `estamento_sector_publico_chile` | enum: auxiliar, administrativo, tecnico, profesional, directivo_no_profesional, directivo_profesional, jefe_superior, autoridad_de_gobierno |  | Estamento |
| `custom_attributes` | object |  |  |


## `JobTerminateInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `end_date` | string (date) | ✓ | Fecha de término del trabajo en YYYY-MM-DD. |
| `termination_reason` | enum: mutuo_acuerdo, renuncia, muerte, vencimiento_plazo, fin_servicio, caso_fortuito, falta_probidad, acoso_sexual | ✓ | Causal de finiquito (ver opciones). |
| `comment` | string |  |  |
| `employee_final_state` | string |  |  |
| `notice_date` | string (date) |  | - notice_date: Fecha de aviso de término de trabajo en YYYY-MM-DD, en caso de no agregar este campo se considerará el end_date. (OPCIONAL) |
| `termination_fundaments` | string |  | - termination_fundaments: Fundamentos del término solicitado por la DT para las razones de término Art 160 y Art 161, debe explicar los motivos en los que se fundamenta el término de contrato. Si no cuentan con la solución Registros DT no es obligatorio. |


## `KPIDatum`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `kpi_id` | integer | ✓ |  |
| `empresa_id` | integer |  |  |
| `area_id` | integer |  |  |
| `employee_id` | integer |  |  |
| `value` | number | ✓ |  |
| `period_type` | string |  | Frecuencia de pago: monthly, semi_monthly o weekly. Requerido para KPIs de tipo Área o Empresa (Solo se puede usar frecuencias de pago que se tengan habilitadas en el tenant) |
| `date` | string (date) |  | Fecha del período para el dato KPI, debe ser un período abierto |


## `LicenceType::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string |  |  |
| `name` | string |  |  |
| `kind` | string |  |  |
| `description` | string |  |  |
| `type` | string |  |  |
| `with_pay` | boolean |  |  |
| `time_measure` | enum: per_day, per_hour, both |  |  |
| `requestable` | boolean |  |  |


## `Location`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `depth` | integer |  |  |
| `parent` | `Location` |  |  |


## `Location::Minimal`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `depth` | integer |  |  |
| `ancestry` | string |  |  |
| `full_name` | string |  |  |


## `PermissionRole`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `permissions` | object |  |  |


## `PlanInputCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `pension_scheme` | enum: afp, no_cotiza, ips | ✓ | Cotización |
| `fund_quote` | enum: capital, cuprum, habitat, modelo, planvital, provida, servicios_de_seguro_social_regimen_1, empart_regimen_1 |  | Solo si pension_scheme es "afp" o "ips" |
| `health_company` | enum: fonasa, banmedica, colmena, consalud, cruz_blanca, nueva_masvida, vida_tres, banco_estado | ✓ | Salud |
| `health_company_plan` | number (float) |  | Valor UF. Solo si health_company es una "Isapre" |
| `health_company_plan_currency` | number (float) |  | Valor Pesos. Solo si health_company es una "Isapre" |
| `health_company_plan_percentage` | number (float) |  | Valor Porcentaje. Solo si health_company es una "Isapre" |
| `afc` | enum: normal, reducido, no_cotiza | ✓ | Seguro Cesantía |
| `afp_collector` | enum: recauda_capital, recauda_cuprum, recauda_habitat, recauda_modelo, recauda_planvital, recauda_provida, recauda_uno |  | AFP recaudadora. Solo si pension_scheme es "ips" y cotiza AFC |
| `disability` | boolean |  | Posee Discapacidad |
| `disability_start_date` | string (date) |  | Fecha de notificación de discapacidad |
| `invalidity` | enum: no, invalidez_parcial, invalidez_total |  | Posee pensión por invalidez |
| `invalidity_start_date` | string (date) |  | Fecha de notificación de invalidez |
| `youth_employment_subsidy` | boolean |  | Subsidio a la cotización de trabajadores jóvenes |
| `retired` | boolean |  | Jubilación |
| `retirement_regime` | number (integer) |  | Régimen jubilación |
| `fun` | number (integer) |  | FUN |
| `ips_rate` | number (decimal) |  | Tasa reducida IPS |
| `foreign_technician` | boolean |  | Trabajador técnico extranjero |
| `quote_increase_one_percent` | boolean |  | Aumentar la cotización 1% |


## `Process`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer | ✓ | Identificador |
| `name` | string | ✓ | Nombre |
| `process_type` | enum: salary_payment, item_payment, snapshot_salary_payment, ptu, aguinaldo, finiquito, reproceso, travel_expenses | ✓ | Tipo |
| `payment_date` | string (date) |  | Fecha de pago |
| `status` | enum: abierto, revision, cerrado | ✓ | Estado |
| `start_date` | string (date) |  | Fecha inicio período |
| `end_date` | string (date) |  | Fecha fin período |
| `created_at` | string (date) |  | Fecha de creación |
| `updated_at` | string (date) |  | Última fecha que se modifico |


## `Recinto::Create`

_(schema `Recinto::Create` sin propiedades documentadas)_


## `Recinto::Update`

_(schema `Recinto::Update` sin propiedades documentadas)_


## `Role::Create`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  |  |
| `code` | string |  |  |
| `description` | string |  |  |
| `requirements` | string |  |  |
| `role_family_id` | integer |  |  |
| `area_ids` | array |  |  |
| `custom_attributes` | object |  |  |


## `Role::Update`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  |  |
| `description` | string |  |  |
| `requirements` | string |  |  |
| `active` | boolean |  |  |
| `role_family_id` | integer |  |  |
| `area_ids` | array |  |  |
| `custom_attributes` | object |  |  |


## `SencePercent`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `sence_percent` | string |  | Porcentaje de tramo sence del empleado |


## `Signature`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `signatures` | array |  |  |
| `reviewer_id` | integer |  |  |


## `User`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `email` | string |  |  |
| `name` | string |  |  |
| `person_id` | integer |  |  |
| `activated` | boolean |  |  |
| `permission_role_id` | integer |  |  |
| `limit_areas` | boolean |  |  |
| `area_ids` | array |  |  |
| `limit_realms` | boolean |  |  |
| `realm_ids` | array |  |  |
| `rol_visible` | string |  |  |


## `VacationDefinitionInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string |  |  |


## `VacationDefinitionOutput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `vacation_definitions` | `VacationDefinition[]` |  |  |


## `VacationsAvailable`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_id` | integer |  |  |
| `full_name` | string |  |  |
| `nationality` | string |  |  |
| `civil_status` | string |  |  |
| `private_role` | boolean |  |  |
| `code_sheet` | string |  |  |
| `pension_regime` | string |  |  |
| `pension_fund` | string |  |  |
| `current_job` | `CurrentJobDetails` |  |  |
| `vacations` | `Vacations[]` |  |  |


## `WorkingDay::Minimal`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_id` | integer |  |  |
| `month` | integer |  |  |
| `working_days` | string |  |  |


## `approved_union`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer | ✓ |  |
| `name` | string | ✓ |  |
| `rut` | string | ✓ |  |


## `approved_vacation`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_id` | integer | ✓ |  |
| `type` | enum: legales, progresivas, dias_administrativos | ✓ |  |
| `start_date` | string (date) | ✓ |  |
| `end_date` | string (date) | ✓ |  |
| `percent_day` | integer | ✓ |  |
| `workday_stage` | string |  |  |


## `bad_request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `errors` | array |  |  |


## `centro_costo_definition_detail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string | ✓ |  |
| `previred_code` | string |  |  |
| `custom_attributes` | object |  |  |


## `centro_costo_definition_response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer | ✓ |  |
| `code` | string | ✓ |  |
| `previred_code` | string | ✓ |  |
| `custom_attributes` | object | ✓ |  |


## `centro_costo_request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `centro_costo_definition_id` | integer |  |  |
| `job_id` | integer |  |  |
| `weight` | integer |  |  |


## `processInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `process` | object | ✓ |  |
| `owner_email` | string | ✓ |  |
| `employees` | array | ✓ |  |


## `union`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `rut` | string |  |  |


## `union_request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer | ✓ |  |
| `name` | string | ✓ |  |
| `rut` | string | ✓ |  |


## `version`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `event` | string |  |  |
| `item_type` | string |  |  |
| `employee_id` | integer |  |  |
| `object_changes` | object |  |  |


---

## Schemas restantes

### `Absence::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `start_date` | string (date) | ✓ |  |
| `days_count` | integer | ✓ |  |
| `day_percent` | string |  |  |
| `workday_stage` | string |  |  |
| `application_date` | string (date) |  |  |
| `justification` | string |  |  |
| `employee_id` | integer |  |  |
| `medic_rut` | string |  |  |
| `licence_number` | string |  |  |
| `medic_name` | string |  |  |


### `Absence::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `start_date` | string (date) | ✓ |  |
| `end_date` | string (date) |  |  |
| `days_count` | integer | ✓ |  |
| `day_percent` | number (float) |  |  |
| `contribution_days` | number (float) |  |  |
| `workday_stage` | string |  |  |
| `application_date` | string (date) |  |  |
| `application_end_date` | string (date) |  |  |
| `justification` | string |  |  |
| `employee_id` | integer |  |  |
| `status` | string |  |  |
| `created_at` | string (date) |  |  |
| `updated_at` | string (date) |  |  |


### `Absences::Absence::Response`

_(schema `Absences::Absence::Response` sin propiedades documentadas)_


### `Absences::Licence::Response`

_(schema `Absences::Licence::Response` sin propiedades documentadas)_


### `Absences::Permission::Response`

_(schema `Absences::Permission::Response` sin propiedades documentadas)_


### `Accounting`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `rut_health_company` | string |  |  |
| `rut_afp` | string |  |  |
| `items` | `AccountingItem[]` |  |  |


### `AccountingItem`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `description` | string |  |  |
| `amount` | integer |  |  |
| `entry_type` | enum: debit, credit |  |  |
| `account` | string |  |  |
| `account_doc_type` | string |  |  |
| `account_group_code` | string |  |  |
| `cost_center` | string |  |  |
| `comment` | string |  |  |
| `employee_rut` | string |  |  |


### `Applicant`

_(schema `Applicant` sin propiedades documentadas)_


### `ApplicantBase`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `first_name` | string |  | Nombre |
| `surname` | string |  | Apellido |
| `second_surname` | string |  | Segundo apellido |
| `birthday` | string (date) |  | Fecha de nacimiento (ej: `YYYY-MM-DD`) |
| `email` | string |  | Correo electrónico |
| `phone` | string |  | Teléfono |
| `address` | string |  | Dirección |
| `gender` | enum: M, F |  | Género |
| `university` | string |  | Universidad |
| `academic_degree` | string |  | Título profesional |
| `experience_years` | integer |  | Años de experiencia |
| `cv_url` | `ApplicantCv` |  |  |
| `seleccion_processes` | `ApplicantSelectionProcess` |  |  |
| `custom_attributes` | object |  | Atributos personalizados de postulantes. (Consultar con administrador cuales son los atributos personalizados disponibles) |


### `ApplicantCv`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `cv_url` | file |  | CV del postulante |


### `ApplicantIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `rut` | string |  | RUT |


### `ApplicantLocation`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID de la Comuna |
| `name` | string |  | Nombre de la Comuna |


### `ApplicantLocationInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `location_id` | string |  | ID o nombre de la Comuna |


### `ApplicantSelectionProcess`

_(schema `ApplicantSelectionProcess` sin propiedades documentadas)_


### `Application`

_(schema `Application` sin propiedades documentadas)_


### `ApplicationApplicant`

_(schema `ApplicationApplicant` sin propiedades documentadas)_


### `ApplicationApplicantIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `rut` | string |  | RUT del postulante |


### `ApplicationApplicantIdentifierInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `applicant_id` | string |  | ID o RUT del postulante |


### `ApplicationBase`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `selection_process_id` | integer |  | ID del proceso de selección |
| `referrer` | enum: internal, external, genoma, trabajando, aira, portal, talent |  | Origen de la postulación |
| `integration_url` | string |  | URL asociada al origen de la postulación |
| `salary_expectation` | integer |  | Expectativa salarial específica para la postulación |
| `custom_attributes` | object |  | Atributos personalizados de la postulación. (Consultar con administrador cuales son los atributos personalizados disponibles) |
| `application_date` | string (date) |  | Fecha de postulación (ej: `2024-01-01`) |


### `ApplicationForApplicant`

_(schema `ApplicationForApplicant` sin propiedades documentadas)_


### `ApplicationProcessStage`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID de la etapa del proceso de selección |
| `name` | string |  | Nombre de la etapa del proceso de selección |


### `ApplicationSelectionProcess`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID del proceso de selección |
| `name` | string |  | Título del proceso de selección |


### `Area`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `address` | string |  |  |
| `children_area` | `parent_child_area` |  |  |
| `parent_area` | `parent_child_area` |  |  |
| `cost_center` | string |  |  |
| `department` | `AreaSecondLevel` |  |  |
| `status` | string |  |  |
| `custom_attributes` | object |  |  |
| `city` | string |  |  |


### `AreaFirstLevel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |


### `AreaSecondLevel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `division` | `AreaFirstLevel` |  |  |


### `Area_new`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `address` | string |  |  |
| `children_area` | `parent_child_area[]` |  |  |
| `parent_area` | `parent_child_area` |  |  |
| `first_level_id` | integer |  |  |
| `first_level_name` | string |  |  |
| `second_level_id` | integer |  |  |
| `second_level_name` | string |  |  |
| `depth` | integer |  |  |
| `cost_center` | string |  |  |
| `status` | string |  |  |
| `custom_attributes` | object |  |  |
| `city` | string |  |  |


### `Article22`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `article_22` | boolean |  | Aplica o no artículo 22 del código de trabajo (false por defecto) |


### `AsignacionFiniquito`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `codigo` | string |  |  |
| `monto` | number |  |  |


### `Assign`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `item_id` | integer |  |  |
| `employee_id` | integer |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `amount` | integer |  |  |
| `advance_payment_day` | integer |  |  |
| `description` | string |  |  |
| `cost_center` | string |  |  |


### `Assign::PaymentDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `employee_id` | integer |  |  |
| `item_id` | integer |  |  |
| `end_date` | string (date) |  |  |
| `description` | string |  |  |
| `amount` | integer |  |  |
| `cost_center` | string |  |  |
| `_destroy` | boolean |  |  |
| `custom_attrs` | object |  |  |


### `Attendances::NonWorkedHours::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `day` | integer |  |  |
| `month` | integer |  |  |
| `year` | integer |  |  |
| `hours` | number (float) |  |  |
| `id` | integer |  |  |
| `employee_id` | integer |  |  |
| `type_id` | integer |  |  |


### `Attendances::NonWorkedHours::Type`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `paid_leave` | boolean |  |  |


### `Attendances::NonWorkedHours::TypeModel::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `paid_leave` | boolean |  |  |


### `Attendances::Overtime::PaymentDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `day` | integer |  |  |
| `hours` | number (float) | ✓ |  |
| `employee_id` | integer | ✓ |  |
| `type_id` | integer | ✓ |  |
| `centro_costo` | string |  |  |


### `Attendances::Overtime::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `day` | integer |  |  |
| `month` | integer |  |  |
| `year` | integer |  |  |
| `hours` | number (float) |  |  |
| `id` | integer |  |  |
| `employee_id` | integer |  |  |
| `type_id` | integer |  |  |
| `centro_costo` | string |  |  |
| `centro_costo_code` | string |  |  |


### `Attendances::Overtime::Type`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `factor` | number (float) |  |  |
| `category` | enum: 0, 1 |  | 0 = hora_extra, 1 = recargo |


### `BasePersonIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `document_number` | string |  | Número de Documento del Colaborador. |
| `document_type` | string |  | Tipo de Documento del Colaborador. Los Tipos de Documento válidos en el formato {código: traducción} son: {"rut":"RUT","otro":"Otro"} |


### `BenefitRequestResponse`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID de la solicitud de beneficio |
| `person_id` | integer |  | ID de la persona que solicitó el beneficio |
| `approver_id` | integer |  | ID de la persona que aprobó la solicitud |
| `available_version_id` | integer |  | ID de la versión del beneficio |
| `status` | string |  | Estado actual de la solicitud |
| `requested_at` | string (date-time) |  | Fecha y hora en que se realizó la solicitud |
| `status_date` | string (date-time) |  | Fecha y hora del último cambio de estado |
| `points_cost` | integer |  | Costo en puntos del beneficio solicitado |
| `comments` | string |  | Comentarios generales de la solicitud |
| `cancel_comments` | string |  | Comentarios de cancelación de la solicitud |
| `created_at` | string (date-time) |  | Fecha y hora de creación de la solicitud |
| `updated_at` | string (date-time) |  | Fecha y hora de la última actualización de la solicitud |
| `benefit_request_field_values` | object |  | Valores de los campos personalizados definidos para la solicitud de beneficio |


### `BenefitVersionResponse`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID de la versión de beneficio |
| `name` | string |  | Nombre de la versión de beneficio |
| `global` | boolean |  | Indica si la versión del beneficio está disponible para todos |
| `points` | integer |  | Costo de puntos asociados |
| `enrollment_type` | integer |  | Tipo de suscripción |
| `integration` | integer |  | Tipo de integración con otros módulos (ej: Vacaciones, Permisos, etc.) |
| `created_at` | string (date-time) |  | Fecha de creación |
| `updated_at` | string (date-time) |  | Fecha de última actualización |


### `Bono`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `start_date` | string |  |  |
| `end_date` | string |  |  |
| `type` | string |  |  |
| `remuneration_type` | string |  |  |
| `amount` | string |  |  |
| `income_tax` | boolean |  |  |
| `created_at` | string |  |  |
| `updated_at` | string |  |  |
| `calculation_method` | string |  |  |
| `base_extra_hours` | boolean |  |  |
| `currency` | string |  |  |
| `gratification` | boolean |  |  |
| `base_seventh_work_day` | boolean |  |  |
| `advance_payment_day` | boolean |  |  |
| `uf_day` | string |  |  |
| `taxable` | boolean |  |  |
| `base_contribution_license` | boolean |  |  |
| `amount_type` | string |  |  |
| `formula` | string |  |  |
| `calculation_description` | string |  |  |
| `blocked` | boolean |  |  |
| `group_ine` | string |  |  |
| `affects_overdraft` | boolean |  |  |
| `previous_bono_id` | string |  |  |
| `editable` | string |  |  |
| `limit_areas` | boolean |  |  |
| `order_section` | string |  |  |
| `order_number` | string |  |  |
| `requestable` | boolean |  |  |
| `assignable` | string |  |  |
| `after_section` | boolean |  |  |
| `code` | string |  |  |
| `agrupacion_lre` | string |  |  |
| `version_number` | integer |  |  |


### `Bono::Minimal`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string |  |  |


### `BossModel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `rut` | string |  |  |


### `CamposBrasil`

_(schema `CamposBrasil` sin propiedades documentadas)_


### `Capacities`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `evaluation_id` | integer |  |  |
| `evaluation_status` | string |  |  |
| `evaluated_name` | string |  |  |
| `evaluated_rut` | string |  |  |
| `role` | string |  |  |
| `role_family` | string |  |  |
| `division` | string |  |  |
| `area` | string |  |  |
| `sub_area` | string |  |  |
| `evaluation_type` | string |  |  |
| `evaluator_name` | string |  |  |
| `evaluator_rut` | string |  |  |
| `score_by_capacity` | `ScoreByCapacity[]` |  |  |
| `capacities_score` | number |  |  |
| `score` | number |  |  |


### `Company`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `address` | string |  |  |
| `commune` | string |  |  |
| `city` | string |  |  |
| `rut` | string |  |  |
| `company_email` | string |  |  |
| `company_business` | string |  |  |
| `legal_agents` | `LegalAgent[]` |  |  |
| `custom_attributes` | object |  |  |
| `company_banks` | `CompanyBank[]` |  |  |


### `CompanyBank`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `empresa_id` | integer |  |  |
| `name` | string |  |  |
| `account_number` | integer |  |  |
| `clabe_mexico` | integer |  |  |


### `CompanyVariable`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |


### `CompanyVariableRegistry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |


### `ContractualDetailModel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `internal_rules_shift` | boolean |  |  |
| `workday_distribution` | string |  |  |
| `service_type` | string |  |  |
| `rut_empresa_principal` | string |  |  |
| `rut_empresa_usuaria` | string |  |  |


### `ContractualStipulationModel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `options` | array |  |  |
| `affected_to` | string |  |  |
| `instrument_start_date` | string (date) |  |  |
| `instrument_end_date` | string (date) |  |  |
| `other_details` | string |  |  |


### `CostCenterModel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | string |  |  |
| `job_id` | string |  |  |
| `weight` | integer |  |  |
| `cost_center` | string |  |  |


### `CurrentJobDetails`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `periodicity` | string |  |  |
| `zone_assignment` | string |  |  |


### `DocumentSignature`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `signature_type` | string |  |  |
| `person_id` | number |  |  |
| `position` | number |  |  |
| `status` | string |  |  |
| `signed_at` | string |  |  |
| `confirmation_code_channel` | string |  |  |
| `created_at` | string |  |  |


### `EarnedVacations`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `vacation_definition_id` | integer |  |  |
| `vacation_type_id` | integer |  |  |
| `earned_days` | number |  |  |
| `period_start_date` | string (date) |  |  |
| `earned_at` | string (date) |  |  |
| `proportional` | boolean |  |  |
| `compensated` | boolean |  |  |
| `expiration_date` | date |  |  |


### `Employee::Assign`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `item` | `Bono::Minimal` |  |  |
| `amount` | number |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `description` | string |  |  |
| `custom_attrs` | object |  |  |


### `Employee::Clone`

_(schema `Employee::Clone` sin propiedades documentadas)_


### `Employee::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `person_id` | integer (int64) |  |  |
| `id` | integer (int64) |  |  |
| `picture_url` | string |  |  |
| `first_name` | string |  |  |
| `surname` | string |  |  |
| `second_surname` | string |  |  |
| `full_name` | string |  |  |
| `rut` | string |  |  |
| `code_sheet` | string |  |  |
| `nationality` | string |  |  |
| `country_code` | string |  |  |
| `civil_status` | string |  |  |
| `email` | string |  |  |
| `personal_email` | string |  |  |
| `address` | string |  |  |
| `city` | string |  |  |
| `district` | string |  |  |
| `location_id` | integer (int64) |  |  |
| `region` | string |  |  |
| `office_phone` | string |  |  |
| `phone` | string |  |  |
| `gender` | string |  |  |
| `birthday` | string |  |  |
| `university` | string |  |  |
| `degree` | string |  |  |
| `active_since` | string |  |  |
| `status` | string |  |  |
| `private_role` | boolean |  |  |
| `health_company` | string |  |  |
| `retired` | boolean |  |  |
| `retirement_regime` | string |  |  |
| `pension_regime` | string |  |  |
| `pension_fund` | string |  |  |
| `afc` | string |  |  |
| `active_until` |  (date) |  |  |
| `termination_reason` | string |  |  |
| `custom_attributes` | object |  |  |
| `current_job` | `EmployeeCurrentJob` |  |  |
| `bank` | string |  |  |
| `payment_method` | string |  |  |
| `account_type` | string |  |  |
| `account_number` | string |  |  |
| `progressive_vacations_start` | string (date) |  |  |
| `fecha_reconocimiento_antiguedad` | string (date) |  | Fecha de reconocimiento de antigüedad del empleado. |
| `family_responsabilities` | `EmployeeFamilyResponsability` |  |  |


### `Employee::Response::Simple`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID del empleado |
| `rut` | string |  |  |


### `EmployeeCurrentJob`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `periodicity` | string |  |  |
| `frequency` | string |  |  |
| `working_schedule_type` | string |  |  |
| `zone_assignment` | boolean |  |  |
| `previous_job_id` | integer |  |  |
| `company_id` | integer |  |  |
| `area_id` | integer |  |  |
| `contract_term` | string (date) |  |  |
| `contract_type` | string |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `active_until` | string (date) |  |  |
| `contract_finishing_date_1` | string (date) |  |  |
| `contract_finishing_date_2` | string (date) |  |  |
| `weekly_hours` | integer |  |  |
| `base_wage` | integer |  |  |
| `cost_center` | string |  |  |
| `role` | `Role` |  |  |
| `custom_attributes` | object |  |  |
| `union` | citext |  |  |
| `project` | string |  |  |
| `days` | array |  | ej: `['l', 'm', 'w', 'j', 'v']` |
| `boss` | `BossModel` |  |  |
| `recinto_primario` | `RecintoModel` |  |  |
| `recinto_secundario` | `RecintoModel[]` |  |  |


### `EmployeeFamilyResponsability`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `family_allowance_section` | string |  |  |
| `maternity_family_responsability` | string |  |  |
| `invalid_family_responsability` | string |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `responsability_details` | `ResponsabilityDetail` |  |  |


### `EmployeeFamilyResponsibility`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `family_allowance_section` | string |  |  |
| `maternity_family_responsibility` | string |  |  |
| `invalid_family_responsibility` | string |  |  |
| `simple_family_responsibility` | string |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `responsibility_details` | `ResponsibilityDetail[]` |  |  |


### `EmployeeFileBase64`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `content` | string |  |  |
| `filename` | string |  |  |


### `EmployeeInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `period_type` | string |  | Frecuencia de pago: monthly, semi_monthly o weekly. |


### `EmployeeInputBase`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `picture_url` | string |  |  |


### `EmployeeInputCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `first_name` | string | ✓ | Nombre |
| `surname` | string | ✓ | Apellido |
| `second_surname` | string |  | Segundo Apellido |
| `code_sheet` | string |  | Código |
| `nationality` | enum: AD, AE, AF, AG, AI, AL, AM, AO | ✓ | Código Nacionalidad |
| `gender` | enum: M, F | ✓ | Género |
| `civil_status` | enum: Casado, Divorciado, Soltero, Viudo, Acuerdo de Unión Civil | ✓ | Estado Civil |
| `birthday` | string (date) | ✓ | Fecha Nacimiento |
| `email` | string (email) | ✓ | Email Corporativo |
| `personal_email` | string (email) |  | Email Personal |
| `location_id` | integer | ✓ | Comuna |
| `address` | string | ✓ | Dirección |
| `street` | string |  | Calle |
| `street_number` | string |  | Número de Calle |
| `office_number` | string |  | Depto / Oficina |
| `city` | string |  | Ciudad |
| `payment_currency` | enum: CLP |  |  |
| `payment_method` | enum: Cheque, Servipag, Vale Vista, No Generar Pago, Transferencia Bancaria | ✓ | Forma Pago |
| `payment_period` | enum: semanal, mensual, quincenal, diario, por_hora |  | Periodo de Pago (ej: `mensual`) |
| `advance_payment` | enum: sin_anticipo, anticipo_por_hora, anticipo_diario, anticipo_semanal, anticipo_quincenal |  | Anticipo de Remuneración (ej: `sin_anticipo`) |
| `bank` | enum: BBVA, BCI, BICE, Banco de Chile, Consorcio, COOPEUCH, Corpbanca, Banco Estado |  | Banco. Obligatorio si payment_method es "Transferencia Bancaria" |
| `account_type` | enum: Corriente, Vista, Ahorro |  | Tipo Cuenta. Obligatorio si payment_method es "Transferencia Bancaria" |
| `account_number` | string |  | N° Cuenta. Obligatorio si payment_method es "Transferencia Bancaria" |
| `start_date` | string (date) | ✓ | Ingreso Compañía |
| `private_role` | boolean |  | Rol Privado |
| `active` | enum: active, inactive, pending |  | Activo. Deprecamos el uso de ~~true y false~~ |


### `EmployeePersonIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_document_number` | string |  | Número de Documento del Colaborador. |
| `employee_document_type` | string |  | Tipo de Documento del Colaborador. Los Tipos de Documento válidos en el formato {código: traducción} son: {"rut":"RUT","otro":"Otro"} |


### `EvaluatedPersonIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `evaluated_document_number` | string |  | Número de Documento del Evaluado. |
| `evaluated_document_type` | string |  | Tipo de Documento del Evaluado. Los Tipos de Documento válidos en el formato {código: traducción} son: {"rut":"RUT","otro":"Otro"} |


### `EvaluationProcess`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `participants` | integer |  |  |
| `status` | string |  |  |
| `start_date` | string |  |  |
| `end_date` | string |  |  |
| `global_progress` | string |  |  |
| `stages` | array |  |  |


### `EvaluatorPersonIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `evaluator_document_number` | string |  | Número de Documento del Evaluador. |
| `evaluator_document_type` | string |  | Tipo de Documento del Evaluador. Los Tipos de Documento válidos en el formato {código: traducción} son: {"rut":"RUT","otro":"Otro"} |


### `FilterQueryModel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID del grupo |
| `group_name` | string |  | Nombre del grupo |
| `updated_at` | string (date-time) |  | Última actualización |


### `FilterQueryParticipant`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID del participante |
| `full_name` | string |  | Nombre completo del participante |
| `document_number` | string |  | Número de documento del participante |


### `Finiquito`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `fecha_inicio` | string (date) |  |  |
| `monto` | number |  |  |
| `monto_sin_liquidacion` | number |  |  |
| `razon_print` | string |  |  |
| `dias_indemnizacion_por_obra` | number |  |  |
| `dias_feriados_corridos` | number |  |  |
| `descuentos` | `FiniquitoDescuentos[]` |  |  |
| `haberes` | `FiniquitoHaberes[]` |  |  |
| `indemnizacion_tributable` | number |  |  |
| `impuesto_indemnizacion` | number |  |  |
| `remuneraciones_pendientes` | number |  |  |
| `asignaciones_no_imponibles_pendientes` | number |  |  |


### `FiniquitoBase`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `fecha` | string (date) |  |  |
| `fecha_aviso` | string (date) |  |  |
| `fecha_pago` | string (date) |  |  |
| `razon` | string |  |  |
| `anos_de_servicio` | number |  |  |
| `indemnizacion_legal_por_anos_servicios` | number |  |  |
| `indemnizacion_legal_por_meses_obra` | number |  |  |
| `indemnizacion_sustitutiva_previo_aviso` | number |  |  |
| `indemnizacion_pactada_contractualmente` | number |  |  |
| `indemnizacion_voluntaria` | number |  |  |
| `indemnizacion_vacaciones` | number |  |  |
| `descuento_seguro_cesantia` | number |  |  |
| `otros_descuentos` | number |  |  |
| `monto_indemnizacion_no_renta` | number |  |  |
| `reajuste_indemnizacion` | number |  |  |
| `interes_indemnizacion` | number |  |  |
| `en_liquidacion` | boolean |  |  |
| `custom_attributes` | object |  |  |
| `payment_detail` | `PaymentDetail` |  |  |
| `termination_fundaments` | string |  | termination_fundaments: Fundamentos del término solicitado por la DT para las razones de término Art 160 y Art 161, debe explicar los motivos en los que se fundamenta el término de contrato. Si no cuentan con la solución Registros DT no es obligatorio. |


### `FiniquitoDescuentos`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `nombre` | number |  |  |
| `monto` | number |  |  |


### `FiniquitoHaberes`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `nombre` | number |  |  |
| `monto` | number |  |  |


### `Goals`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `evaluation_id` | integer |  |  |
| `evaluation_status` | string |  |  |
| `evaluated_name` | string |  |  |
| `evaluated_rut` | string |  |  |
| `role` | string |  |  |
| `role_family` | string |  |  |
| `division` | string |  |  |
| `area` | string |  |  |
| `sub_area` | string |  |  |
| `evaluation_type` | string |  |  |
| `evaluator_name` | string |  |  |
| `evaluator_rut` | string |  |  |
| `score_by_goal` | `ScoreByGoal[]` |  |  |
| `goals_score` | number |  |  |
| `score` | number |  |  |


### `Holiday`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `day` | string (date) |  |  |


### `Job`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `company_id` | integer |  |  |
| `area_id` | integer |  |  |
| `contract_term` |  (date) |  |  |
| `contract_type` | string |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `weekly_hours` | integer |  |  |
| `base_wage` | integer |  |  |
| `cost_center` | string |  |  |
| `role` | `Role` |  |  |
| `custom_attributes` | object |  |  |
| `boss` | `BossModel` |  |  |


### `JobInput`

_(schema `JobInput` sin propiedades documentadas)_


### `JobInputBase`

_(schema `JobInputBase` sin propiedades documentadas)_


### `JobInputCountryPatch`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `company_id` | integer |  |  |
| `type_of_contract` | enum: Renovación Automática, Plazo fijo, Obra, Indefinido, Aprendizaje, A honorarios |  | Tipo de Contrato |
| `end_of_contract` | string (date) |  |  |
| `periodicity` | enum: mensual, diaria, hora |  |  |
| `regular_hours` | number (float) |  |  |
| `days` | enum: l, m, w, j, v, s, d |  | Dias de Jornada Laboral (ej: `['l', 'm', 'w', 'j', 'v']`) |
| `type_of_working_day` | enum: ordinaria_art_22, parcial_art_40_bis, exenta_art_22, parcial_sector_publico, ordinaria_sector_publico, otros_sector_publico |  |  |
| `other_type_of_working_day` | enum: extraordinaria_art_30, especial_art_38_inc_5, especial_art_23, especial_art_106, especial_art_152_ter_d, especial_art_152_ter_f, especial_art_25, especial_art_25_bis |  |  |
| `leader_id` | integer (float) |  | Supervisor |
| `wage` | number (float) |  | Sueldo Base |
| `currency` | enum: peso, uf, utm |  | Moneda |


### `JobInputPatch`

_(schema `JobInputPatch` sin propiedades documentadas)_


### `JobResponseCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `company_id` | integer |  |  |
| `area_id` | integer |  |  |
| `contract_type` | string |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `notice_date` | string (date) |  |  |
| `contract_finishing_date_1` | string (date) |  |  |
| `contract_finishing_date_2` | string (date) |  |  |
| `weekly_hours` | integer |  |  |
| `cost_center` | string |  |  |
| `periodicity` | string |  |  |
| `frequency` | string |  |  |
| `role` | string |  |  |
| `working_schedule_type` | string |  |  |
| `other_type_of_working_day` | string |  |  |
| `cost_centers` | `CostCenterModel` |  |  |
| `location_id` | string |  |  |
| `without_wage` | string |  |  |
| `zone_assignment` | string |  |  |
| `currency_code` | string |  |  |
| `base_wage` | integer |  |  |
| `custom_attributes` | object |  |  |
| `boss` | `BossModel` |  |  |
| `contract_subscription_date` | string (date) |  |  |
| `reward` | boolean |  |  |
| `reward_concept` | string |  |  |
| `reward_payment_period` | string |  |  |
| `reward_description` | string |  |  |
| `contractual_stipulation` | `ContractualStipulationModel` |  |  |
| `contractual_detail` | `ContractualDetailModel` |  |  |
| `grado_sector_publico_chile` | string |  |  |
| `estamento_sector_publico_chile` | string |  |  |
| `termination_fundaments` | string |  | - termination_fundaments: Fundamentos del término solicitado por la DT para las razones de término Art 160 y Art 161, debe explicar los motivos en los que se fundamenta el término de contrato. Si no cuentan con la solución Registros DT no es obligatorio. |


### `KPI`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `code` | string |  |  |
| `related_to` | string |  |  |
| `units` | string |  |  |


### `LegalAgent`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `person_id` | integer |  |  |
| `id` | integer |  |  |
| `rut` | string |  |  |


### `LicenceBase`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `licence_type_id` | integer |  |  |
| `contribution_days` | integer |  |  |
| `format` | enum: electronica, fisica | ✓ |  |


### `LicenceType`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | enum: accidente_comun, prorroga, pre_natal, post_natal, parental, niño_menor, accidente_trabajo, accidente_trayecto |  |  |


### `LicenceType::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string |  |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `kind` | enum: licencia, ausencia, permiso |  |  |
| `with_pay` | boolean |  |  |
| `time_measure` | enum: per_day, per_hour, both |  |  |
| `requestable` | boolean |  |  |
| `editable` | boolean |  |  |
| `created_at` | string (date) |  |  |
| `updated_at` | string (date) |  |  |


### `MedicIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `medic_rut` | string |  |  |


### `MinimalEmployee`

_(schema `MinimalEmployee` sin propiedades documentadas)_


### `MinimalEmployeeCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `rut` | string |  |  |


### `NoteCreated`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | Id del comentario |
| `message` | string |  | Mensaje del comentario |
| `postulante_id` | integer |  | Id del postulante |
| `created_at` | string (date-time) |  | Fecha de creación del comentario |


### `NoteInput`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `message` | string | ✓ | Mensaje del comentario |
| `email` | string (email) | ✓ | E-mail del postulante |
| `process_stage_name` | string |  | Nombre de la etapa del proceso |
| `process_stage_id` | integer |  | Id de la etapa del proceso |
| `score` | integer |  | Puntaje dado al postulante |
| `referrer` | string | ✓ | Origen del comentario, Tipos soportados (internal, external, diio) |
| `selection_process_id` | integer |  | Id del proceso de selección |


### `Pagination`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `next` | string |  |  |
| `previous` | string |  |  |
| `count` | integer |  |  |
| `total_pages` | integer |  |  |


### `PaymentDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `payment_method` | enum: Cheque, Servipag, Vale Vista, Transferencia Bancaria |  |  |
| `bank` | enum: BBVA, BCI, BICE, Banco de Chile, Consorcio, COOPEUCH, Corpbanca, Banco Estado |  |  |
| `account_type` | enum: Corriente, Vista, Ahorro, Chequera Electrónica |  |  |
| `account_number` | string |  |  |
| `codigo_sucursal_retiro` | string |  |  |
| `tipo_vale_vista` | enum: vale_vista_direccionado_entrega_al_beneficiario, vale_vista_custodia_electronica, vale_vista_direccionado_entrega_al_tomador, vale_vista_entrega_meson, vale_vista_entrega_empresa, vale_vista_impresion_centralizada, vale_vista_pago_cash, vale_vista_santander |  |  |


### `PensionSaving`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | string |  |  |
| `institution` | string |  |  |
| `amount` | number |  |  |
| `currency` | string |  |  |
| `deposit_type` | string |  |  |
| `document` | string |  |  |
| `reduction` | boolean |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |


### `PersonResponse`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | Identificador único de la persona |
| `first_name` | string |  | Nombre de la persona |
| `last_name` | string |  | Apellido de la persona |
| `dni` | string |  | Número de identificación (RUT, DNI, CORP, etc.) |


### `Piecework::Execution::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `piecework_place_id` | integer |  |  |
| `piecework_task_id` | integer |  |  |
| `piecework_unit_id` | integer |  |  |
| `piecework_product_id` | integer |  |  |
| `formula` | number (float) |  |  |
| `start_date` | string (date) |  |  |
| `type_rate` | integer |  |  |
| `monetary_floor` | integer |  |  |


### `Piecework::Execution::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `piecework_place_id` | integer |  |  |
| `piecework_task_id` | integer |  |  |
| `piecework_unit_id` | integer |  |  |
| `piecework_product_id` | integer |  |  |
| `formula` | number (float) |  |  |
| `created_at` | string (date) |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `type_rate` | integer |  |  |
| `monetary_floor` | integer |  |  |


### `Piecework::Place::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string | ✓ |  |
| `name` | string | ✓ |  |
| `empresa_id` | integer | ✓ |  |
| `centro_costo_definition_id` | integer | ✓ |  |


### `Piecework::Place::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string |  |  |
| `id` | integer |  |  |
| `name` | string |  |  |
| `empresa_id` | integer |  |  |
| `centro_costo_definition_id` | integer |  |  |
| `created_at` | date |  |  |


### `Piecework::Product::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string | ✓ |  |
| `name` | string | ✓ |  |


### `Piecework::Product::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string |  |  |
| `id` | integer |  |  |
| `name` | string |  |  |
| `created_at` | date |  |  |


### `Piecework::Task::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | integer | ✓ |  |
| `description` | string | ✓ |  |
| `seventh_workday` | boolean |  |  |
| `custom_attrs` | object |  |  |


### `Piecework::Task::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | integer |  |  |
| `id` | integer |  |  |
| `description` | string |  |  |
| `seventh_workday` | boolean |  |  |
| `custom_attrs` | object |  |  |


### `Piecework::Unit::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string | ✓ |  |
| `name` | string | ✓ |  |


### `Piecework::Unit::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `code` | string |  |  |
| `id` | integer |  |  |
| `name` | string |  |  |
| `created_at` | date |  |  |


### `Piecework::Worklog::Request`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `piecework_execution_id` | integer | ✓ |  |
| `production` | integer |  |  |
| `rate_value` | decimal |  |  |
| `saved_in` | string | ✓ |  |
| `total_pay` | decimal |  |  |
| `work_type` | string | ✓ |  |
| `worked_units` | decimal | ✓ |  |


### `Piecework::Worklog::RequestPatch`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `day` | string |  |  |
| `work_type` | string |  |  |
| `worked_units` | decimal |  |  |
| `production` | integer |  |  |
| `total_pay` | decimal |  |  |
| `rate_value` | decimal |  |  |


### `Piecework::Worklog::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `day` | date |  |  |
| `employee_id` | integer |  |  |
| `variable_id` | integer |  |  |
| `piecework_execution_id` | integer |  |  |
| `production` | integer |  |  |
| `calculation_floor_method` | string |  |  |
| `monetary_floor` | decimal |  |  |
| `rate_value` | decimal |  |  |
| `saved_in` | string |  |  |
| `total_pay` | decimal |  |  |
| `work_type` | string |  |  |
| `worked_units` | decimal |  |  |
| `created_at` | date |  |  |
| `status` | string |  |  |


### `PlanResponseCountry`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `start_date` | string (date) |  |  |
| `pension_scheme` | string |  |  |
| `fund_quote` | string |  |  |
| `health_company` | string |  |  |
| `health_company_plan` | number (float) |  |  |
| `health_company_plan_currency` | number (float) |  |  |
| `health_company_plan_percentage` | number (float) |  |  |
| `disability` | boolean |  |  |
| `disability_start_date` | string (date) |  |  |
| `invalidity` | string |  |  |
| `invalidity_start_date` | string (date) |  |  |
| `afc` | string |  |  |
| `afp_collector` | string |  |  |
| `start_date_quotation_afc` | string (date) |  |  |
| `youth_employment_subsidy` | boolean |  |  |
| `retired` | boolean |  |  |
| `retirement_regime` | number (integer) |  |  |
| `fun` | number (integer) |  |  |
| `ips_rate` | number (decimal) |  |  |
| `foreign_technician` | boolean |  |  |
| `quote_increase_one_percent` | boolean |  |  |


### `Recinto`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  | Nombre |
| `code` | string |  | Código |
| `location_id` | integer |  | Localidad |
| `address_name` | string |  | Calle |
| `address_number` | string |  | Número |
| `address_optional` | string |  | Descripción |
| `latitude` | number |  | Latitud |
| `longitude` | number |  | Longitud |
| `postcode` | string |  | Código Postal |
| `codigo_establecimiento` | string |  | Código Establecimiento |


### `Recinto::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | Identificador interno |


### `RecintoIndex`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  | Nombre |
| `code` | string |  | Código |
| `location_id` | integer |  | Localidad |
| `city` | string |  | Ciudad |
| `address_name` | string |  | Calle |
| `address_number` | string |  | Número |
| `address_optional` | string |  | Descripción |
| `latitude` | float |  | Latitud |
| `longitude` | float |  | Longitud |
| `postcode` | string |  | Código Postal |
| `integrated_with_ctrl` | boolean |  | Integrado con CTRL |
| `codigo_establecimiento` | string |  | Código Establecimiento |


### `RecintoModel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string |  |  |


### `ResponsabilityDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `gender` | string |  |  |
| `first_name` | string |  |  |
| `first_surname` | string |  |  |
| `second_surname` | string |  |  |
| `birthday` | string (date) |  |  |
| `legal_responsability` | string |  |  |
| `health_plan` | string |  |  |
| `relation` | string |  |  |
| `expiration_date` |  (date) |  |  |
| `retirement_fund` | string |  |  |
| `voluntary_enrollment` | string |  |  |
| `voluntary_retirement_percentage` | string |  |  |
| `voluntary_account_2` | string |  |  |
| `custom_attributes` | object |  |  |
| `rut` | string |  |  |


### `ResponsibilityDetail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `rut` | string |  |  |
| `gender` | string |  |  |
| `first_name` | string |  |  |
| `first_surname` | string |  |  |
| `second_surname` | string |  |  |
| `birthday` | string (date) |  |  |
| `legal_responsibility` | boolean |  |  |
| `health_plan` | boolean |  |  |
| `relation` | string |  |  |
| `expiration_date` | string (date) |  |  |
| `retirement_fund` | string |  |  |
| `voluntary_enrollment` | boolean |  |  |
| `voluntary_retirement_percentage` | number |  |  |
| `voluntary_account_2` | integer |  |  |
| `custom_attributes` | object |  |  |


### `Role`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string |  |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `requirements` | string |  |  |
| `role_family` | `RoleFamily` |  |  |
| `area_ids` | array |  |  |
| `custom_attributes` | object |  |  |


### `Role::Response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `description` | string |  |  |
| `code` | string |  |  |
| `requirements` | string |  |  |
| `active` | boolean |  |  |
| `area_ids` | array |  |  |
| `role_family_id` | integer |  |  |
| `custom_attributes` | object |  |  |


### `RoleFamily`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `quantity_of_roles` | integer |  |  |


### `ScoreByCapacity`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  |  |
| `score` | number |  |  |


### `ScoreByGoal`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  |  |
| `score` | number |  |  |


### `SearchApplicantByEmail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `email` | string |  | Email |


### `SelectionProcess`

_(schema `SelectionProcess` sin propiedades documentadas)_


### `SelectionProcessArea`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID del área |
| `name` | string |  | Nombre del área |


### `SelectionProcessBase`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  | Nombre del proceso de selección |
| `workday` | enum: full-time, part-time |  | Tipo de jornada (full-time por defecto) |
| `hours_by_week` | integer |  | Horas semanales a trabajar (45 por defecto) |
| `available_positions` | integer |  | Número de vacantes disponibles (1 por defecto) |
| `minimum_salary` | integer |  | Monto mínimo de salario |
| `maximum_salary` | integer |  | Monto máximo de salario |
| `published_in_applications_portal` | boolean |  | Indica si el proceso está publicado en el portal de postulación (true por defecto) |
| `search_scope` | enum: external, internal |  | Tipo de búsqueda, interna (dentro de la compañía) o externa. Ambas por defecto. |
| `description` | string |  | Descripción del proceso de selección |
| `status` | enum: pendiente, iniciado, cerrado, cancelado |  | Estado del proceso de selección (pendiente por defecto) |
| `requirements` | string |  | Requisitos del proceso de selección |
| `template_id` | integer |  | ID de la plantilla del proceso (Consultar con administrador cuales son las plantillas disponibles) |
| `custom_attributes` | object |  | Atributos personalizados del proceso. (Consultar con administrador cuales son los atributos personalizados disponibles) |
| `reason` | enum: replacement, new_vacancy, internship, temporary_replacement, other |  | Motivo del proceso de selección |


### `SelectionProcessCompany`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `rut` | string |  |  |


### `SelectionProcessInput`

_(schema `SelectionProcessInput` sin propiedades documentadas)_


### `SelectionProcessLocation`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID de la ubicación de la oferta de trabajo |
| `name` | string |  | Nombre de la ubicación de la oferta de trabajo |


### `SelectionProcessRole`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID del cargo |
| `name` | string |  | Nombre del cargo |


### `SelectionProcessStage`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | ID de la etapa del proceso de selección |
| `name` | string |  | Nombre de la etapa del proceso de selección |


### `SencePercentIndex`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee` | `Employee::Response::Simple` |  |  |
| `sence_percent` | string |  | Porcentaje de tramo sence del empleado |


### `Settlement`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `liquidacion_id` | integer (int64) |  |  |
| `person_id` | integer (int64) |  |  |
| `employee_id` | integer (int64) |  |  |
| `month` | string |  |  |
| `year` | string |  |  |
| `worked_days` | number (float) |  |  |
| `noworked_days` | number (float) |  |  |
| `income_gross` | number (float) |  |  |
| `income_net` | number (float) |  |  |
| `income_afp` | number (float) |  |  |
| `income_ips` | number (float) |  |  |
| `total_income_taxable` | number (float) |  |  |
| `total_income_notaxable` | number (float) |  |  |
| `total_legal_discounts` | number (float) |  |  |
| `total_other_discounts` | number (float) |  |  |
| `closed` | boolean |  |  |
| `liquid_reach` | number (integer) |  |  |
| `taxable_base` | number (integer) |  |  |
| `rut` | string |  |  |
| `lines_settlement` | `SettlementLine[]` |  |  |


### `SettlementLine`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | string |  |  |
| `subtype` | string |  |  |
| `income_type` | string |  |  |
| `name` | string |  |  |
| `amount` | number (float) |  |  |
| `resettlement` | boolean |  |  |
| `taxable` | boolean |  |  |
| `imponible` | boolean |  |  |
| `anticipo` | boolean |  |  |
| `credit_type` | string |  |  |
| `institution` | string |  |  |
| `description` | string |  |  |
| `code` | string |  |  |
| `item_code` | string |  |  |


### `StudiesLevel`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `studies_level` | enum: Básica, Media, Técnico medio / Colegio técnico, Técnico profesional superior, Universitaria, Postgrado, Magíster, Doctorado |  | Nivel de estudios |


### `TerminatedJob`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string |  |  |
| `role_id` | integer |  |  |
| `company_id` | integer |  |  |
| `employee_id` | integer |  |  |
| `area_id` | integer |  |  |
| `weekly_hours` | integer |  |  |
| `weekly_days` | array |  |  |
| `currency` | string |  |  |
| `base_wage` | integer |  |  |
| `supervisor_id` | integer |  |  |
| `contract_term` |  (date) |  |  |
| `start_date` |  (date) |  |  |
| `end_date` |  (date) |  |  |
| `termination_reason` | string |  |  |
| `custom_attributes` | object |  |  |


### `Vacation`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `employee_id` | integer |  |  |
| `approved_by_id` | integer |  |  |
| `working_days` | number |  |  |
| `calendar_days` | integer |  |  |
| `workday_stage` | string |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `requested_at` | string (date) |  |  |
| `approved_at` | string (date) |  |  |
| `type` | string |  |  |
| `status` | string |  |  |
| `vacation_type_id` | integer |  |  |


### `VacationBalance`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_id` | integer |  |  |
| `initial_vacation_balance` | number |  |  |
| `final_vacation_balance` | number |  |  |
| `difference` | number |  |  |


### `VacationDefinition`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `code` | string |  |  |
| `name` | string |  |  |
| `vacation_type` | `VacationType` |  |  |


### `VacationType`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  |  |
| `code` | string |  |  |


### `Vacations`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | string |  |  |
| `stock` | number |  |  |


### `Variable`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `month` | string |  |  |
| `end_date` | string |  |  |
| `status` | string |  |  |


### `WorkflowCompanyIdentifier`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `rut` | string |  |  |


### `WorkflowProcessAlta`

_(schema `WorkflowProcessAlta` sin propiedades documentadas)_


### `WorkflowProcessAltaEmployee`

_(schema `WorkflowProcessAltaEmployee` sin propiedades documentadas)_


### `WorkflowProcessAltaJob`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `company` | `WorkflowProcessAltaJobCompany` |  |  |
| `area` | `WorkflowProcessAltaJobArea` |  |  |
| `role` | `WorkflowProcessAltaJobRole` |  |  |
| `supervisor` | `WorkflowProcessAltaJobSupervisor` |  |  |


### `WorkflowProcessAltaJobArea`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | Id del área |
| `nombre` | string |  | Nombre del área |


### `WorkflowProcessAltaJobCompany`

_(schema `WorkflowProcessAltaJobCompany` sin propiedades documentadas)_


### `WorkflowProcessAltaJobRole`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | Id del cargo |
| `nombre` | string |  | Nombre del cargo |


### `WorkflowProcessAltaJobSupervisor`

_(schema `WorkflowProcessAltaJobSupervisor` sin propiedades documentadas)_


### `WorkflowProcessAltaOperation`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `title` | string |  | Título de la operación |
| `completed_at` | string (date) |  | Fecha en que se completó de la operación |
| `completed_by` | `WorkflowProcessAltaUser` |  | Usuario que completó la operación |


### `WorkflowProcessAltaUser`

_(schema `WorkflowProcessAltaUser` sin propiedades documentadas)_


### `WorkflowProcessBase`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  | Id de la solicitud |
| `title` | string |  | Título de la solicitud |
| `kind` | enum: Alta |  | Tipo de Flujo |
| `status` | enum: Finalizado, En Progreso, Cancelado, Error |  | Estado de la solicitud |
| `created_at` | string (date) |  | Fecha de creación de la solicitud (ej: `YYYY-MM-DD`) |
| `created_by` | `WorkflowProcessBaseEmployee` |  | Usuario creador de la solicitud |


### `WorkflowProcessBaseEmployee`

_(schema `WorkflowProcessBaseEmployee` sin propiedades documentadas)_


### `WorkingDay`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_id` | integer |  |  |
| `rut` | string |  |  |
| `code` | string |  |  |
| `working_days` | integer |  |  |
| `working_days_dates` | array |  |  |


### `centro_costo_response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `centro_costo_definition_id` | integer |  |  |
| `job_id` | integer |  |  |
| `weight` | integer |  |  |


### `hire`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `role_id` | integer |  |  |
| `company_id` | integer |  |  |
| `employee_id` | integer |  |  |
| `area_id` | integer |  |  |
| `weekly_hours` | integer |  |  |
| `weekly_days` | array |  |  |
| `currency` | string |  |  |
| `base_wage` | integer |  |  |
| `supervisor_id` | integer |  |  |
| `contract_term` | string (date) |  |  |
| `start_date` | string (date) |  |  |
| `custom_attributes` | object |  |  |


### `job_movement`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `role_id` | integer |  |  |
| `company_id` | integer |  |  |
| `employee_id` | integer |  |  |
| `area_id` | integer |  |  |
| `weekly_hours` | integer |  |  |
| `weekly_days` | array |  |  |
| `currency` | string |  |  |
| `base_wage` | integer |  |  |
| `supervisor_id` | integer |  |  |
| `contract_term` | string (date) |  |  |
| `start_date` | string (date) |  |  |
| `custom_attributes` | object |  |  |


### `parent_child_area`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `commune` | string |  |  |
| `city` | string |  |  |
| `address` | string |  |  |


### `union_detail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `rut` | string |  |  |


### `union_response`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `id` | integer |  |  |
| `name` | string |  |  |
| `rut` | string |  |  |


### `vacation_detail`

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `employee_id` | integer |  |  |
| `type` | enum: legales, progresivas, dias_administrativos |  |  |
| `start_date` | string (date) |  |  |
| `end_date` | string (date) |  |  |
| `working_days` | integer |  |  |
| `calendar_days` | integer |  |  |
| `workday_stage` | string |  |  |

