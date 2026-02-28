# 🔌 BUK API — Guía de integración Poppins

## Base URL
```
https://app.buk.cl/api/v1/
```

## Autenticación
```http
Authorization: Bearer {BUK_API_TOKEN}
Content-Type: application/json
```

---

## Endpoints relevantes para Poppins

### Empleados
```http
GET /api/v1/employees
GET /api/v1/employees/{id}
POST /api/v1/employees
PUT /api/v1/employees/{id}
```

**Campos clave del response:**
```json
{
  "id": 1,
  "first_name": "María",
  "last_name": "González",
  "identification_number": "12345678-9",
  "position": { "name": "Nana" },
  "start_date": "2023-03-01",
  "employment_status": "active",
  "base_salary": 450000
}
```

### Liquidaciones (Payroll)
```http
GET /api/v1/payroll_processes
GET /api/v1/payroll_processes/{id}/payroll_items
```

### Vacaciones y Ausencias
```http
GET /api/v1/absence_requests
POST /api/v1/absence_requests
PUT /api/v1/absence_requests/{id}
```

### Beneficios
```http
GET /api/v1/benefits
GET /api/v1/employee_benefits
```

---

## Notas de mapping Poppins ↔ BUK

| Campo Poppins | Campo BUK API |
|--------------|---------------|
| `nombre` | `first_name` |
| `apellido` | `last_name` |
| `rut` | `identification_number` |
| `cargo` | `position.name` |
| `fecha_ingreso` | `start_date` |
| `estado` | `employment_status` |
| `sueldo_base` | `base_salary` |
