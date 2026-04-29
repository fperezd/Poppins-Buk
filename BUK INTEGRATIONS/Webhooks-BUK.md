# Webhooks BUK

## Configuración

En BUK: **Configuración → Acceso API → URLs Webhooks**
URL: `https://{tu-dominio}/api/webhooks/buk` (HTTPS requerido)

## Eventos disponibles

### Empleados
`employee_create`, `employee_update`, `employee_plan_update`, `employee_responsibility_update`, `job_hire`, `job_termination`, `job_movement`

### Vacaciones
`vacation_create`, `vacation_update`, `vacation_destroy`

### Licencias/Ausencias/Permisos
`{licence|absence|permission}_create`, `_update`, `_destroy`

### Documentos
`document_create`

## PDF de Liquidación

```
GET /employees/{id}/statements/{year}-{MM}.pdf
```

**IMPORTANTE**: El mes debe ir con cero delante — formato `MM` no `M`.
- Correcto: `/employees/35/statements/2026-03.pdf`
- Incorrecto: `/employees/35/statements/2026-3.pdf`
