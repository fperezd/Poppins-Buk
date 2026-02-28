# 🌂 Poppins ERP — RRHH para el Hogar

> **"Magia en tu casa"** — Plataforma de gestión de empleadas domésticas con integración BUK API

![Poppins ERP](https://img.shields.io/badge/Poppins-ERP%20Dom%C3%A9stico-F0197A?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIzIDEyYTExLjA1IDExLjA1IDAgMCAwLTIyIDB6bS01IDdhMyAzIDAgMCAxLTYgMHYtNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Tailwind-1B1564?style=for-the-badge)
![BUK](https://img.shields.io/badge/API-BUK%20Integración-059669?style=for-the-badge)

---

## ✨ ¿Qué es Poppins?

Poppins es un **ERP de RRHH especializado en personal doméstico**. Permite a empleadores gestionar nanas, cocineras, cuidadoras y asesoras del hogar con la misma potencia que las grandes empresas, consumiendo la **API de BUK** como backend.

---

## 🗂 Módulos

| Módulo | Descripción |
|--------|-------------|
| 📊 **Dashboard** | KPIs en tiempo real, estado del personal, solicitudes pendientes |
| 👩‍💼 **Empleados** | Lista completa con búsqueda, filtros y navegación al perfil |
| 🪪 **Perfil del empleado** | Datos personales, contrato, liquidaciones, vacaciones |
| 💳 **Liquidaciones** | Sueldos mensuales, haberes, descuentos AFP/Salud, exportación PDF |
| 📅 **Asistencia & Vacaciones** | Control de ausencias, licencias y permisos con aprobación |
| 🎁 **Beneficios** | Gestión de extras: movilización, colación, seguro, etc. |

---

## 🏗 Estructura del proyecto

```
Poppins-Buk/
│
├── poppins-erp.html          # App principal (React + Tailwind, standalone)
│
├── src/
│   ├── components/           # Componentes React (próxima iteración)
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EmployeeList.jsx
│   │   ├── EmployeeProfile.jsx
│   │   ├── Payroll.jsx
│   │   ├── Attendance.jsx
│   │   └── Benefits.jsx
│   │
│   ├── data/
│   │   └── mockData.js       # Mock data con estructura BUK API
│   │
│   └── styles/
│       └── theme.js          # Tokens de marca Poppins
│
├── docs/
│   ├── BUK-API.md            # Endpoints BUK a reemplazar
│   └── ROADMAP.md            # Plan de desarrollo
│
└── public/
    └── (assets futuros)
```

---

## 🎨 Identidad visual

| Token | Valor |
|-------|-------|
| Color primario | `#F0197A` (Pink Poppins) |
| Color secundario | `#1B1564` (Navy Poppins) |
| Tipografía | `Poppins` (Google Fonts) |
| Logo | Paraguas ☂️ (Mary Poppins) |

---

## 🔌 Integración BUK API

El front está diseñado para consumir la API de BUK. Los datos mock al inicio del archivo `poppins-erp.html` deben ser reemplazados por llamadas reales:

```javascript
// ANTES (mock data)
const EMPLOYEES = [ { id:1, nombre:'María', ... } ];

// DESPUÉS (BUK API)
const EMPLOYEES = await fetch('https://app.buk.cl/api/v1/employees', {
  headers: { 'Authorization': `Bearer ${BUK_TOKEN}` }
}).then(r => r.json());
```

### Endpoints BUK usados

| Recurso | Endpoint BUK |
|---------|-------------|
| Empleados | `GET /api/v1/employees` |
| Liquidaciones | `GET /api/v1/payroll_processes` |
| Vacaciones | `GET /api/v1/absence_requests` |
| Beneficios | `GET /api/v1/benefits` |

---

## 🚀 Cómo usar

### Opción 1 — Abrir directamente en browser
```bash
# Simplemente abre el archivo en tu browser:
open poppins-erp.html
```

### Opción 2 — Servidor local
```bash
python3 -m http.server 3000
# → http://localhost:3000/poppins-erp.html
```

---

## 🗺 Roadmap

- [x] MVP front standalone (React + Tailwind)
- [x] Mock data con estructura BUK API
- [ ] Conexión real con BUK API
- [ ] Autenticación empleador
- [ ] Módulo de contratos (generación PDF)
- [ ] Notificaciones por WhatsApp/Email
- [ ] App móvil (React Native)
- [ ] Panel empleada (acceso individual)

---

## 🛠 Tech Stack

- **Frontend**: React 18 (CDN), Tailwind CSS, Poppins (Google Fonts)
- **Backend/API**: BUK API REST
- **Hosting**: Por definir (Vercel / Netlify)

---

## 👤 Autor

**René Aravena** — [@manoletear](https://github.com/manoletear)

---

*Poppins — Magia en tu casa ✨*
