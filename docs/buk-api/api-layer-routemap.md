# Poppins API Layer — Route Map

**Versión:** v1 · **Base path:** `/api/buk/v1`

Total endpoints: **48** distribuidos en **14 dominios**.

Leyenda: 🟢 Fase B (prioritario) · 🟡 Fase C · ⚪ Fase D+ · ⚠️ requiere lógica compuesta

---

## 1. `colaboradoras` 🟢

Empleados Buk cuyo cargo NO es "Jefe de Área". Filtro automático en cada handler.

| Método | Path | Buk endpoint | Notas |
|---|---|---|---|
| GET | `/colaboradoras` | `GET /employees` | filtra por cargo, soporta `?hogar_id=` (= area_id) |
| POST | `/colaboradoras` | `POST /employees` | requiere `area_id` (hogar) y `role_id` ≠ "Jefe de Área" |
| GET | `/colaboradoras/{id}` | `GET /employees/{id}` | |
| PUT | `/colaboradoras/{id}` | `PUT /employees/{id}` | |
| POST | `/colaboradoras/{id}/clone` | `POST /employees/{id}/clone` | duplicar registro |
| POST | `/colaboradoras/{id}/baja` ⚠️ | `POST /jobs/{job_id}/termination` | requiere causal, fecha, lookup de current_job |

---

## 2. `empleadores` 🟢

Empleados Buk con cargo "Jefe de Área", sueldo $1. Modelan el "empleador funcional" del hogar.

| Método | Path | Buk endpoint | Notas |
|---|---|---|---|
| GET | `/empleadores` | `GET /employees` | filtra por cargo = "Jefe de Área" |
| POST | `/empleadores` ⚠️ | compuesto | crea Area (POST /organization/areas/) + Empleado-jefe (POST /employees) en una sola transacción lógica |
| GET | `/empleadores/{id}` | `GET /employees/{id}` | |
| PUT | `/empleadores/{id}` | `PUT /employees/{id}` | |

---

## 3. `hogares` 🟢

Areas de Buk. Una Area = una casa = un cliente. Cada hogar tiene 1 empleador (jefe de área) + N colaboradoras.

| Método | Path | Buk endpoint | Notas |
|---|---|---|---|
| GET | `/hogares` | `GET /areas` | |
| GET | `/hogares/{id}` | `GET /areas/{id}` | retorna también empleados del area |
| POST | `/hogares` | `POST /organization/areas/` | |
| PATCH | `/hogares/{id}` | `PATCH /organization/areas/{id}` | |
| GET | `/hogares/{id}/empleados` ⚠️ | `GET /employees?area_id=` | colaboradoras + empleador |

---

## 4. `asignaciones` 🟢

Histórico de qué colaboradora trabaja en qué hogar. **Persistencia en Supabase** (Buk no tiene histórico de cambios de área).

| Método | Path | Datasource | Notas |
|---|---|---|---|
| GET | `/asignaciones` | Supabase `asignaciones` | filtros: `colaboradora_id`, `hogar_id`, `activas=true` |
| POST | `/asignaciones` ⚠️ | Supabase + Buk | inserta en Supabase + actualiza `area_id` del empleado en Buk |
| PATCH | `/asignaciones/{id}` | Supabase | termina asignación (set `fecha_fin`) |

---

## 5. `vacaciones` 🟡

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/vacaciones?colaboradora_id=` | `GET /vacations` |
| POST | `/vacaciones` | `POST /vacations` |
| DELETE | `/vacaciones` | `DELETE /vacations` |
| GET | `/vacaciones/{id}` | `GET /vacations/{id}` |
| GET | `/vacaciones/dias-habiles?desde=&hasta=` | `GET /vacations/business_days` |
| GET | `/colaboradoras/{id}/vacaciones/saldo` | `GET /employees/{id}/vacations_available` |
| GET | `/colaboradoras/{id}/vacaciones/devengadas` | `GET /employees/{id}/earned_vacations` |
| GET | `/politicas-vacaciones` | `GET /vacation_definitions` |

---

## 6. `ausencias` 🟡

Tres sub-recursos: licencias, permisos, inasistencias. Cada uno tiene su catálogo de tipos.

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/ausencias` | `GET /absences` (vista unificada) |
| GET | `/ausencias/licencias` | `GET /absences/licence` |
| POST | `/ausencias/licencias` | `POST /absences/licence` |
| GET | `/ausencias/licencias/tipos` | `GET /absences/licence/types` |
| GET | `/ausencias/permisos` | `GET /absences/permission` |
| POST | `/ausencias/permisos` | `POST /absences/permission` |
| GET | `/ausencias/permisos/tipos` | `GET /absences/permission/types` |
| GET | `/ausencias/inasistencias` | `GET /absences/absence` |
| POST | `/ausencias/inasistencias` | `POST /absences/absence` |
| GET | `/ausencias/inasistencias/tipos` | `GET /absences/absence/types` |

---

## 7. `horas-extras` 🟡

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/horas-extras` | `GET /attendances/overtime` |
| POST | `/horas-extras` | `POST /attendances/overtime` |
| PUT | `/horas-extras` | `PUT /attendances/overtime` |
| GET | `/horas-extras/{id}` | `GET /attendances/overtime/{id}` |
| GET | `/horas-extras/tipos` | `GET /attendances/overtime/types` |

---

## 8. `liquidaciones` 🟡

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/liquidaciones?periodicidad=month` | `GET /payroll_detail/month` |
| GET | `/liquidaciones?periodicidad=semi_month` | `GET /payroll_detail/semi_month` |
| GET | `/liquidaciones?periodicidad=week` | `GET /payroll_detail/week` |
| GET | `/colaboradoras/{id}/liquidaciones` | `GET /employees/{id}/payroll_detail` |
| GET | `/colaboradoras/{id}/liquidaciones/{year}-{month}.pdf` ⚠️ | `GET /employees/{id}/statements/{y-m}.pdf` (binario) |

---

## 9. `documentos` 🟡

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/colaboradoras/{id}/documentos` | `GET /employees/{id}/docs` |
| POST | `/colaboradoras/{id}/documentos` | `POST /employees/{id}/docs` |
| GET | `/colaboradoras/{id}/documentos/{file_id}` | `GET /employees/{id}/docs/{file_id}` |
| GET | `/documentos/{id}` | `GET /docs/{id}` |
| POST | `/documentos/{id}/firmas` | `POST /docs/{id}/signatures/process` |

---

## 10. `cargas-familiares` 🟡

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/colaboradoras/{id}/cargas` | derivado de `GET /people/{person_id}` |
| PATCH | `/cargas/{id}` | `PATCH /cargas/{id}` |

---

## 11. `bonos-items` 🟡

Asignaciones de bonos/items a un empleado (`/assigns` en Buk).

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/colaboradoras/{id}/bonos` | `GET /employees/{id}/assigns` |
| POST | `/bonos` | `POST /assigns` |
| PATCH | `/bonos/{id}` | `PATCH /assigns/{id}` |
| DELETE | `/bonos/{id}` | `DELETE /assigns/{id}` |
| POST | `/bonos/{id}/terminar` | `POST /assigns/{id}/terminate` |

---

## 12. `catalogos` 🟢

Reads frecuentes que cambian poco. Cacheables.

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/catalogos/cargos` | `GET /roles` |
| GET | `/catalogos/cargos/{id}` | `GET /roles/{id}` |
| GET | `/catalogos/familias-cargos` | `GET /role_families` |
| GET | `/catalogos/areas` | `GET /areas` (alias de `/hogares`) |
| GET | `/catalogos/centros-costo` | `GET /centro_costo_definitions` |
| GET | `/catalogos/locaciones` | `GET /locations` |
| GET | `/catalogos/empresa` | `GET /companies` (typicamente 1 sola) |

---

## 13. `health` 🟢

| Método | Path | Buk endpoint |
|---|---|---|
| GET | `/health` | hace 1 hit a `/employees?page_size=1` y reporta latencia |

---

## 14. `webhooks` ⚪

Buk envía eventos a un endpoint configurado en su plataforma. Este recurso lo expone.

| Método | Path | Notas |
|---|---|---|
| POST | `/webhooks/buk` | recibe eventos: `employee.created`, `employee.updated`, `vacation.approved`, etc. |

---

## Resumen por fase

- **🟢 Fase B (prioritarios, ~17 endpoints):** colaboradoras, empleadores, hogares, asignaciones, catalogos, health
- **🟡 Fase C (HR completos, ~25 endpoints):** vacaciones, ausencias, horas-extras, liquidaciones, documentos, cargas-familiares, bonos-items
- **⚪ Fase D+ (~6 endpoints):** webhooks, idempotency, observabilidad avanzada
