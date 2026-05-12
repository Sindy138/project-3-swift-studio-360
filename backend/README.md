# Swift Studio 360 — Backend API

API REST para **Swift Studio 360**, agencia de marketing digital que ofrece servicios de SEO, contenidos, fotografía y automatización. Los clientes pueden explorar el catálogo, configurar y contratar servicios, y hacer seguimiento de sus pedidos desde un dashboard personal.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework HTTP | Express.js v5 |
| Base de datos | PostgreSQL |
| ORM | Prisma v7 |
| Autenticación | JWT + bcryptjs |
| Driver DB | @prisma/adapter-pg |
| Validación | Zod |
| Seguridad HTTP | Helmet |
| CORS | cors |
| Rate limiting | express-rate-limit |
| Logger HTTP | Morgan |
| Testing | Vitest + Supertest |
| Variables de entorno | dotenv |

---

## Requisitos previos

- [Node.js](https://nodejs.org) v18 o superior
- [PostgreSQL](https://www.postgresql.org) instalado y en ejecución

---

## Instalación y puesta en marcha

```bash
# 1. Clona el repositorio
git clone <url-del-repo>
cd project-3-swift-studio-360/backend

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# 4. Genera el cliente de Prisma
npx prisma generate

# 5. Crea la base de datos y aplica el schema
npx prisma migrate dev --name init

# 6. Carga los datos iniciales (8 servicios del catálogo)
npx prisma db seed

# 7. Arranca el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del backend basándote en `.env.example`:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgresql://postgres:pass@localhost:5432/swift_studio_360` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT (mín. 32 caracteres) | `una_clave_muy_larga_y_segura_aqui` |
| `PORT` | Puerto en el que escucha el servidor | `3000` |
| `CORS_ORIGIN` | Origen permitido para CORS (URL del frontend) | `http://localhost:5173` |

---

## Jerarquía del proyecto

Arquitectura **feature-based** (por dominio): cada recurso es un módulo autocontenido con su controller, routes y schema de validación.

```
backend/
├── prisma/
│   ├── schema.prisma         # Modelos y relaciones de la base de datos
│   ├── seed.js               # Carga inicial de los 8 servicios del catálogo
│   └── migrations/           # Historial de migraciones (generado por Prisma)
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.controller.js   # Lógica de registro y login
│   │   │   ├── auth.routes.js       # POST /api/auth/register · POST /api/auth/login
│   │   │   └── auth.schema.js       # Validación de email y contraseña
│   │   ├── users/
│   │   │   ├── users.controller.js
│   │   │   ├── users.routes.js
│   │   │   └── users.schema.js
│   │   ├── services/
│   │   │   ├── services.controller.js
│   │   │   ├── services.routes.js
│   │   │   └── services.schema.js
│   │   └── orders/
│   │       ├── orders.controller.js
│   │       ├── orders.routes.js
│   │       └── orders.schema.js
│   ├── middlewares/
│   │   ├── auth.middleware.js        # authenticate (JWT) · isAdmin (rol ADMIN)
│   │   └── error.middleware.js       # Manejador centralizado de errores
│   ├── lib/
│   │   └── prisma.js                 # Instancia única del PrismaClient
│   ├── app.js                        # Configuración de Express (middlewares + rutas)
│   └── server.js                     # Arranque del servidor
├── .env                              # Variables de entorno (no subir a git)
├── .env.example                      # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── prisma.config.ts                  # Configuración de Prisma v7 (URL, migraciones, seed)
```

---

## Modelo de datos

La base de datos tiene **5 tablas** con las siguientes relaciones:

```
User ──────────── Profile        (1:1 — cascade delete)
User ──────────── Order[]        (1:N — restrict delete)
Service ────────── Order[]       (1:N — restrict delete)
Order ──────────── Deliverable[] (1:N — cascade delete)
```

### User
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (cuid) | Identificador único |
| email | String (unique) | Email de acceso |
| password | String | Contraseña hasheada con bcrypt |
| role | Enum (USER/ADMIN) | Rol del usuario |
| createdAt | DateTime | Fecha de registro |

### Profile
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (cuid) | Identificador único |
| fullName | String? | Nombre completo |
| phone | String? | Teléfono de contacto |
| companyName | String? | Empresa |
| userId | String (unique) | FK → User |

### Service
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (cuid) | Identificador único |
| name | String | Nombre del servicio |
| description | String | Descripción |
| price | Float | Precio en euros |
| category | String | SEO / Contenidos / Fotografía / Automatización |
| formConfig | Json | Configuración del formulario dinámico de contratación |
| createdAt | DateTime | Fecha de creación |

### Order
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (cuid) | Identificador único |
| status | Enum (PENDING/PROGRESS/DONE) | Estado del pedido |
| configData | Json | Respuestas del formulario de configuración |
| total | Float | Precio total |
| userId | String | FK → User |
| serviceId | String | FK → Service |
| createdAt | DateTime | Fecha del pedido |

### Deliverable
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (cuid) | Identificador único |
| label | String | Nombre del entregable |
| url | String | Enlace (Google Drive, Dropbox, Notion…) |
| orderId | String | FK → Order |
| createdAt | DateTime | Fecha de entrega |

---

## Endpoints disponibles

### Autenticación — `/api/auth`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un nuevo usuario, devuelve JWT | No |
| POST | `/api/auth/login` | Valida credenciales, devuelve JWT | No |

**Body register / login:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "minimo8caracteres"
}
```

**Respuesta exitosa:**
```json
{
  "user": { "id": "...", "email": "...", "role": "USER", "createdAt": "..." },
  "token": "eyJhbGci..."
}
```

**Reglas de negocio:**
- Email debe ser único en el sistema → `409 Conflict`
- Contraseña mínimo 8 caracteres → `400 Bad Request`
- Credenciales incorrectas en login → `401 Unauthorized`

### Rutas protegidas

Las rutas que requieren autenticación esperan el token en la cabecera:
```
Authorization: Bearer <token>
```

Las rutas de administrador además verifican `role === 'ADMIN'` → `403 Forbidden` si no cumple.

---

## Datos de seed

El catálogo inicial incluye **8 servicios** distribuidos en 4 verticales:

| Vertical | Servicio | Precio |
|---|---|---|
| SEO | Auditoría Técnica Express | 299 € |
| SEO | Suscripción SEO Mensual | 599 € |
| Contenidos | Pack 12 Reels/TikToks | 799 € |
| Contenidos | Gestión de LinkedIn Authority | 450 € |
| Fotografía | Sesión de Producto E-commerce | 349 € |
| Fotografía | Retrato Corporativo "Lifestyle" | 599 € |
| Automatización | Integración CRM + Email Marketing | 899 € |
| Automatización | Automatización de Facturación | 1.200 € |

Cada servicio incluye un `formConfig` con los campos del formulario dinámico que el cliente rellena al contratar.

---

## Seguridad y calidad

### Zod — Validación de datos de entrada

Todos los endpoints que reciben datos en el body usan schemas Zod declarados en `*.schema.js`. La validación ocurre **antes** de ejecutar el controlador gracias al middleware `validate`:

```js
// src/middlewares/validate.middleware.js
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message)
      return res.status(400).json({ error: errors[0], details: errors })
    }
    req.body = result.data  // datos ya parseados y saneados
    next()
  }
}
```

Los schemas de autenticación como ejemplo:

```js
// src/features/auth/auth.schema.js
const RegisterSchema = z.object({
  email: z.string().email({ message: 'A valid email is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})
```

Si la validación falla, la respuesta incluye el primer error como `error` y el listado completo en `details`:

```json
{
  "error": "A valid email is required",
  "details": ["A valid email is required"]
}
```

---

### Helmet — Cabeceras de seguridad HTTP

[Helmet](https://helmetjs.github.io/) configura automáticamente **14 cabeceras HTTP de seguridad**, entre ellas:

| Cabecera | Qué hace |
|---|---|
| `X-Content-Type-Options: nosniff` | Evita MIME-type sniffing |
| `X-Frame-Options: SAMEORIGIN` | Protege contra clickjacking |
| `Strict-Transport-Security` | Fuerza HTTPS en producción |
| `Content-Security-Policy` | Restringe orígenes de recursos |
| ~~`X-Powered-By: Express`~~ | Eliminada para no revelar el stack |

Se aplica globalmente como el primer middleware en `app.js`:

```js
app.use(helmet())
```

---

### CORS — Control de orígenes

La configuración restringe qué frontend puede consumir la API. En producción se debe definir `CORS_ORIGIN` con la URL exacta del frontend:

```js
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',   // '*' solo en desarrollo local
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
```

> En desarrollo sin `.env`, `CORS_ORIGIN` no está definida y se permite cualquier origen (`*`). En producción **siempre** hay que definir `CORS_ORIGIN`.

---

### express-rate-limit — Protección contra fuerza bruta

El endpoint `POST /api/auth/login` tiene un límite de **10 peticiones por IP cada 15 minutos**. Si se supera, devuelve `429 Too Many Requests`:

```json
{ "error": "Too many login attempts, please try again in 15 minutes" }
```

Configuración aplicada en `auth.routes.js`:

```js
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // ventana de 15 minutos
  max: 10,                    // máximo 10 intentos por IP
  standardHeaders: true,      // cabecera RateLimit-* estándar (RFC 6585)
  legacyHeaders: false,       // desactiva X-RateLimit-* antiguas
})
```

---

### Morgan — Logger de peticiones HTTP

Morgan registra cada petición en consola en formato `dev`:

```
POST /api/auth/login 200 45ms
POST /api/auth/login 401 12ms
POST /api/auth/register 409 23ms
```

Activado globalmente en `app.js`:

```js
app.use(morgan('dev'))
```

---

## Scripts disponibles

```bash
npm run dev          # Arranca el servidor con node
npm test             # Ejecuta los tests con Vitest
npx prisma generate  # Regenera el cliente de Prisma
npx prisma migrate dev --name <nombre>  # Nueva migración
npx prisma db seed   # Recarga el catálogo de servicios
npx prisma studio    # Interfaz visual de la base de datos
```
