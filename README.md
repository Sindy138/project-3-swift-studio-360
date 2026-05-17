# Swift Studio 360

Plataforma web completa para una agencia de marketing digital. Los clientes exploran el catálogo de servicios, contratan a través de un formulario dinámico y hacen seguimiento de sus pedidos desde un dashboard personal. El equipo administra servicios, pedidos, estados y entregables desde el backend.

---

## Stack

| | Frontend | Backend |
|---|---|---|
| Lenguaje | JavaScript (ESM) | JavaScript (CommonJS) |
| Framework | React 19 + Vite 8 | Express.js 5 |
| Routing | React Router DOM 7 | Express Router |
| Base de datos | — | PostgreSQL + Prisma 7 |
| Auth | Context API + JWT en localStorage | JWT + bcryptjs |
| Estilos | CSS Modules + CSS puro | — |
| Tests | — | Vitest + Supertest |

---

## Estructura del repositorio

```
project-3-swift-studio-360/
├── frontend/    # SPA React — catálogo, checkout, dashboard, perfil
└── backend/     # API REST — auth, servicios, pedidos, usuarios
```

---

## Puesta en marcha

Arranca el backend primero; el frontend lo necesita para funcionar.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # Configura DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGIN
npx prisma migrate dev --name init
npx prisma db seed
npm run dev            # http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
# Opcional: crea .env con VITE_API_URL si el backend no corre en localhost:3000
npm run dev            # http://localhost:5173
```

---

## Variables de entorno esenciales

**Backend** (`.env`):

| Variable | Ejemplo |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:pass@localhost:5432/swift_studio_360` |
| `JWT_SECRET` | cadena aleatoria ≥ 32 caracteres |
| `PORT` | `3000` |
| `CORS_ORIGIN` | `http://localhost:5173` |

**Frontend** (`.env`, opcional):

| Variable | Valor por defecto |
|---|---|
| `VITE_API_URL` | `http://localhost:3000` |

---

## Documentación detallada

- [backend/README.md](backend/README.md) — modelo de datos, todos los endpoints, seguridad, tests
- [frontend/README.md](frontend/README.md) — rutas, autenticación, páginas, arquitectura de la Home
