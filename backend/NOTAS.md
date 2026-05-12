### Validaciones

- `auth.schema.js` — Valida email (regex) y password (mín. 8 chars). Devuelve `null` si OK o el mensaje de error.

- `auth.controller.js` — Dos funciones:
  - `register`: valida → comprueba email único (409) → hashea con bcrypt → crea user → devuelve token.

  - `login`: valida → busca user → compara password (siempre mismo mensaje de error para no dar pistas) → devuelve token sin password en el payload.

- `auth.routes.js` — `POST /register` y `POST /login`

- `auth.middleware.js` — Dos middlewares exportados:
  - `authenticate`: extrae Bearer token, verifica con JWT_SECRET, inyecta `req.user`.

  - `isAdmin`: verifica `req.user.role === 'ADMIN'`, rechaza con 403

- `error.middleware.js` — Manejador centralizado, recoge cualquier error no tratado

`app.js` — App Express con cors, json, rutas montadas en `/api/auth` y error handler al final

- `server.js` — Carga dotenv y arranca el servidor

## Estados de proyecto

### Día 2 - am

#### Estado actual del proyecto

Tienes montado:

- Express + Prisma + JWT/bcrypt (auth completa)
- Estructura feature-based (users, services, orders, auth)
- Middleware de auth y roles (authenticate + isAdmin)
- Validación manual con regex en auth.schema.js
- cors ya instalado y en uso en app.js

- Implementación de herramientas
  Herramientas que encajan AHORA mismo
  Alta prioridad — encajan con lo que ya tienes

1. Zod — tu validación actual en auth.schema.js es manual con regex. Zod reemplaza eso con schemas reutilizables y mensajes de error automáticos. Ya tienes archivos .schema.js en cada feature, así que la integración es directa.

// En vez de esto:
if (!data.email || !EMAIL_REGEX.test(data.email)) return 'A valid email is required'

// Con Zod:
const RegisterSchema = z.object({
email: z.string().email(),
password: z.string().min(8)
})

2. Morgan — tienes errorHandler pero no ves qué peticiones llegan. Morgan añade una línea al app.js y ya puedes ver POST /api/auth/login 200 12ms en consola. Cero configuración.

3. Helmet — tienes JWT y rutas protegidas, pero Express por defecto expone cabeceras que revelan información del servidor (X-Powered-By: Express). Helmet las elimina con una línea. Siempre es una buena práctica mencionar en presentación.

Media prioridad — útil cuando avances 4. cors — ya lo tienes instalado pero con cors() sin configuración (acepta cualquier origen). Cuando conectes el frontend, deberías restringirlo a tu dominio.

5. express-rate-limit — tienes /api/auth/login que es vulnerable a fuerza bruta. Rate limiting en ese endpoint específico es una mejora de seguridad sencilla y muy visible en presentación.

##### Archivos modificados:

- Archivo Qué cambió
- app.js Añadidos helmet(), morgan('dev') y cors con origen configurable
- auth.routes.js loginLimiter (10 req/15min) + middleware validate en ambas rutas
- auth.schema.js Reescrito con Zod — RegisterSchema y LoginSchema
- auth.controller.js Eliminadas las llamadas a validateRegister/validateLogin (ahora lo hace el middleware)
- .env.example Nueva variable CORS_ORIGIN
- README.md Sección "Seguridad y calidad" con detalle de cada herramienta

Archivos nuevos:
Archivo Qué hace

- validate.middleware.js Middleware reutilizable: recibe un schema Zod, valida req.body, devuelve 400 con mensaje si falla
