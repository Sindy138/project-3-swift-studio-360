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

#### Fase 4

## Contexto

La migración se ejecutó correctamente. Este documento explica cómo funciona cada endpoint, cómo se configuran los roles y la secuencia de pruebas recomendada con Postman.

---

## Cómo funcionan los roles

### Dos roles posibles

| Rol     | Qué puede hacer                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `USER`  | Registrarse, hacer login, crear pedidos, ver sus propios pedidos y entregables, ver/editar su propio perfil                          |
| `ADMIN` | Todo lo anterior + gestionar servicios, ver todos los pedidos, cambiar estado de pedidos, añadir entregables, ver todos los usuarios |

### Cómo se asigna el rol

- Al registrarse, **todos los usuarios son `USER` por defecto**.
- Para crear un ADMIN hay que cambiar el rol **manualmente en la base de datos**:
  ```sql
  UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@ejemplo.com';
  ```
  O con Prisma Studio: `npx prisma studio` → tabla User → editar el campo `role`.

### Cómo funciona la autenticación en las rutas

- Tras hacer login/register recibes un **JWT token**.
- Ese token hay que mandarlo en **todas las rutas protegidas** dentro de la cabecera HTTP:
  ```
  Authorization: Bearer eyJhbGci...
  ```
- El middleware `authenticate` verifica el token y pone `req.user` con `{ id, email, role }`.
- El middleware `isAdmin` comprueba que `req.user.role === 'ADMIN'`, si no devuelve `403 Forbidden`.

---

## Secuencia de prueba recomendada

### Paso 1 — Registrar un usuario

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "usuario@test.com",
  "password": "password123"
}
```

Respuesta `201`: `{ user: {...}, token: "eyJhbGci..." }`
→ **Guarda el token**, lo necesitas en todos los pasos siguientes.

### Paso 2 — Login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "usuario@test.com",
  "password": "password123"
}
```

Respuesta `200`: igual que register, devuelve un token nuevo.

---

## Servicios — /api/services

### GET /api/services — público, sin token

```
GET http://localhost:3000/api/services
```

Respuesta `200`: array con los 8 servicios del seed (todos tienen `isActive: true`).

### GET /api/services/:id — público

```
GET http://localhost:3000/api/services/<id-del-servicio>
```

Coge cualquier `id` del listado anterior.

### POST /api/services — solo ADMIN

```
POST http://localhost:3000/api/services
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "name": "Servicio de prueba",
  "description": "Descripción del servicio",
  "price": 150,
  "category": "SEO",
  "formConfig": { "fields": [] }
}
```

Sin token → `401`. Con token de USER → `403`. Con token de ADMIN → `201`.

### PUT /api/services/:id — solo ADMIN

```
PUT http://localhost:3000/api/services/<id>
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "price": 200
}
```

Solo manda los campos que quieras cambiar (actualización parcial).

### DELETE /api/services/:id — solo ADMIN (soft delete)

```
DELETE http://localhost:3000/api/services/<id>
Authorization: Bearer <token-admin>
```

No borra el registro. Pone `isActive: false`. El servicio deja de aparecer en el GET público.
Respuesta `204` (sin body).

---

## Pedidos — /api/orders

### POST /api/orders — usuario autenticado

```
POST http://localhost:3000/api/orders
Authorization: Bearer <token-usuario>
Content-Type: application/json

{
  "serviceId": "<id-de-un-servicio-activo>",
  "configData": {
    "websiteUrl": "https://miweb.com",
    "mainGoal": "Aumentar tráfico orgánico"
  }
}
```

- El `total` se calcula automáticamente con el `price` del servicio.
- Si intentas crear un segundo pedido del mismo servicio en estado `PENDING` o `PROGRESS` → `409 Conflict`.

### GET /api/orders — autenticado

```
GET http://localhost:3000/api/orders
Authorization: Bearer <token>
```

- Con token de `USER`: devuelve solo los pedidos de ese usuario.
- Con token de `ADMIN`: devuelve todos los pedidos de todos los usuarios.

### GET /api/orders/:id — autenticado

```
GET http://localhost:3000/api/orders/<id-pedido>
Authorization: Bearer <token>
```

- Si eres el propietario del pedido → `200` con los datos + entregables incluidos.
- Si intentas ver el pedido de otro usuario siendo USER → `403 Forbidden`.
- ADMIN puede ver cualquier pedido.

### PUT /api/orders/:id/status — solo ADMIN

```
PUT http://localhost:3000/api/orders/<id-pedido>/status
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "status": "PROGRESS"
}
```

Valores válidos: `PENDING`, `PROGRESS`, `DONE`.

---

## Entregables — /api/orders/:id/deliverables

### POST — solo ADMIN

```
POST http://localhost:3000/api/orders/<id-pedido>/deliverables
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "label": "Informe SEO final",
  "url": "https://drive.google.com/file/d/abc123"
}
```

La `url` debe ser una URL válida, si no → `400 Bad Request`.

### GET — ADMIN o propietario del pedido

```
GET http://localhost:3000/api/orders/<id-pedido>/deliverables
Authorization: Bearer <token>
```

---

## Usuarios — /api/users

### GET /api/users — solo ADMIN

```
GET http://localhost:3000/api/users
Authorization: Bearer <token-admin>
```

### GET /api/users/:id — ADMIN o el propio usuario

```
GET http://localhost:3000/api/users/<id-usuario>
Authorization: Bearer <token>
```

- Un USER solo puede ver su propio perfil. Ver otro → `403`.

### PUT /api/users/:id — ADMIN o el propio usuario

```
PUT http://localhost:3000/api/users/<id-usuario>
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Ada Lovelace",
  "phone": "+34 600 000 000",
  "companyName": "Mi Empresa SL"
}
```

- Un USER no puede cambiar su propio `role` → `403`.
- Los campos `fullName`, `phone`, `companyName` se guardan en la tabla `Profile` (se crea automáticamente si no existe).
- Puedes mandar solo los campos que quieras actualizar.

---

## Errores comunes y qué significan

| Código | Cuándo ocurre                                                                                        |
| ------ | ---------------------------------------------------------------------------------------------------- |
| `400`  | Body inválido (falta un campo requerido, URL mal formada, password < 8 chars)                        |
| `401`  | No se mandó token o el token expiró/es inválido                                                      |
| `403`  | Token válido pero sin permisos (USER intentando ruta de ADMIN, o accediendo a datos de otro usuario) |
| `404`  | El recurso con ese ID no existe o está inactivo                                                      |
| `409`  | Conflicto — email ya registrado, o pedido duplicado activo para el mismo servicio                    |
| `429`  | Demasiados intentos de login (rate limit: 10 por 15 minutos)                                         |

No hay código que implementar — el plan es puramente documentación. Aquí tienes el resumen clave:

---

## Orden para probar en Postman

**1. Crear un usuario** → `POST /api/auth/register` → copia el token de la respuesta

**2. Crear un ADMIN** → registra otro usuario y luego en tu terminal:

```bash
npx prisma studio
```

Abre la tabla `User`, encuentra ese usuario y cambia `role` a `ADMIN`. Luego haz login con él para obtener un token de admin.

**3. Prueba la secuencia:**

- `GET /api/services` — sin token, deberías ver los 8 servicios del seed
- `POST /api/orders` — con token de usuario, usa un `serviceId` del listado anterior
- `GET /api/orders` — con token de usuario ve solo los suyos; con token admin ve todos
- `PUT /api/orders/:id/status` — solo con token admin, body `{ "status": "PROGRESS" }`
- `POST /api/orders/:id/deliverables` — solo admin, body `{ "label": "...", "url": "https://..." }`

## Mapa de permisos rápido

| Ruta                          | Sin token | USER          | ADMIN    |
| ----------------------------- | --------- | ------------- | -------- |
| GET /api/services             | ✅        | ✅            | ✅       |
| POST/PUT/DELETE /api/services | ❌ 401    | ❌ 403        | ✅       |
| POST /api/orders              | ❌ 401    | ✅            | ✅       |
| GET /api/orders               | ❌ 401    | ✅ solo suyos | ✅ todos |
| PUT /api/orders/:id/status    | ❌ 401    | ❌ 403        | ✅       |
| POST deliverables             | ❌ 401    | ❌ 403        | ✅       |
| GET /api/users                | ❌ 401    | ❌ 403        | ✅       |

User: haz la # Guía de endpoints y roles — Swift Studio 360, explica bien para que se cogen los tokens y donde se añaden, bien detallado

Claude: Voy a leer primero el NOTAS.md para ver qué hay y dónde tiene más sentido escribir la guía.

Read [](file:///c%3A/Users/sindy/desktop/ironhack-class/project-3-swift-studio-360/backend/NOTAS.md)

Voy a crear una guía detallada en un archivo dedicado dentro del backend.Guía creada en [GUIA_API.md](backend/GUIA_API.md). Lo más importante resumido aquí:

---

**¿Por qué se coge el token?**
Cualquier ruta protegida necesita que "demuestres" quién eres. El token contiene tu `id`, `email` y `role` encriptados. Sin él → `401`. Con él pero sin permisos → `403`.

**¿Dónde se coge el token?**
Siempre viene en la respuesta del `register` o del `login`, dentro del campo `"token"`.

**¿Dónde se añade el token en Postman?**
En cada petición protegida → pestaña **Authorization** → tipo **Bearer Token** → pega el token.

O mejor: usa la pestaña **Tests** en el login con este script para guardarlo automáticamente:

```javascript
pm.environment.set("token", pm.response.json().token);
```

Y en las peticiones protegidas pones `{{token}}` en el campo Bearer Token.

**Flujo mínimo para probar todo:**

1. `POST /api/auth/register` → copia el token
2. `GET /api/services` → sin token, ves los 8 servicios del seed, copia un `id`
3. Cambia tu rol a ADMIN en Prisma Studio → vuelve a hacer login → copia nuevo token
4. `POST /api/orders` con token de usuario normal y el `serviceId` del paso 2
5. `PUT /api/orders/:id/status` con token admin y `{ "status": "PROGRESS" }`

User: <ide_opened_file>The user opened the file c:\Users\sindy\desktop\ironhack-class\project-3-swift-studio-360\backend\GUIA_API.md in the IDE. This may or may not be related to the current task.</ide_opened_file>añade en readme lo añadido del crud que haz hecho, de manera tecnica, no como guia, siguiendo la bases del readme creado

Claude: Voy a releer el README actual para seguir exactamente su estilo.

Read [](file:///c%3A/Users/sindy/desktop/ironhack-class/project-3-swift-studio-360/backend/README.md)

Veo lo que falta. Los endpoints del CRUD ya están en el README (los añadí en la fase 4), pero hay tres huecos técnicos: el campo `isActive` no aparece en el modelo `Service`, `validate.middleware.js` no está en la jerarquía, y la sección de Zod solo muestra auth. Voy a completar esas tres partes.Ahora amplío la sección de Zod para mostrar los schemas de todos los recursos, no solo auth:Ahora añado una sección técnica sobre el soft delete y el patrón de ownership en la sección de endpoints, justo después de "Rutas protegidas":Tres cambios concretos siguiendo el estilo técnico del README existente:

1. **Modelo `Service`** — añadido `isActive Boolean` a la tabla de campos con su descripción.

2. **Jerarquía del proyecto** — añadido `validate.middleware.js` en la sección de middlewares con su descripción.

3. **Sección Zod** — ampliada con:
   - La cadena de middlewares que muestra dónde se inyecta `validate()`
   - Todos los schemas Zod de los 4 recursos (auth, services, orders, users) en un único bloque de código con su archivo fuente

4. **Sección "Rutas protegidas"** — añadidos tres bloques técnicos:
   - Matriz de autorización completa (quién puede qué)
   - Explicación del patrón soft delete con el código de Prisma real
   - Explicación del patrón de ownership con el código del controlador

#### FASE 5

Todo implementado. Esto es lo que hace cada pieza:

Archivo nuevo — asyncHandler.js

Una línea que envuelve cualquier función async y, si lanza una excepción, la pasa a next(err) en lugar de dejar caer el servidor:

const asyncHandler = (fn) => (req, res, next) =>
Promise.resolve(fn(req, res, next)).catch(next)
Sin esto, un await prisma.something() que falla lanzaba un UnhandledPromiseRejection y Express no llegaba al errorHandler.

Actualizado — error.middleware.js

Ahora distingue tres errores específicos de Prisma antes de llegar al 500 genérico:

Código Prisma Situación HTTP devuelto
P2002 Violación de unique constraint (email duplicado) 409 con el campo afectado
P2025 update/delete sobre un ID que no existe 404
P2003 FK constraint — relación referenciada no existe 409
SyntaxError + body JSON malformado en el body 400
Cualquier otro Error inesperado 500 + console.error
Actualizados — los 4 controladores

Cada función ahora está envuelta con asyncHandler(async (req, res) => { ... }). El código interno no cambia — solo desaparece la necesidad de try/catch manual porque el wrapper lo hace por todos.

Limpiado — validate.middleware.js

Eliminado el const { ZodError } = require('zod') que estaba declarado pero nunca usado (usamos safeParse, no lanzamos excepciones Zod).

#### auditoría segun briefing

Validar datos de entrada en todos los endpoints POST/PUT:

Campos requeridos presentes → Zod en todos los schemas ✅
Tipos de dato correctos → Zod (.string(), .number(), .url(), .enum()) ✅
Email con formato válido → z.string().email() en auth y users ✅
Precio no negativo en Services → z.number().positive() ✅
middleware/errorHandler.js que captura todos los errores:

400 datos inválidos → validate.middleware.js (Zod) + SyntaxError de JSON malformado ✅
401 no autenticado → authenticate en auth.middleware.js ✅
403 no autorizado → isAdmin + checks de ownership en controladores ✅
404 recurso no encontrado → controladores + Prisma P2025 en errorHandler ✅
409 conflicto → controladores + Prisma P2002/P2003 en errorHandler ✅
500 error interno → fallback del errorHandler ✅
Lo que se añadió en esta sesión para cerrar los huecos:

asyncHandler — sin esto los errores de Prisma no llegaban al errorHandler y el servidor podía crashear en silencio
Prisma error codes (P2002, P2025, P2003) en el errorHandler
Captura de JSON malformado

#### Fase 6 completa.

Esto es lo que se creó y por qué cada decisión:

vitest.config.mjs — .mjs fuerza ESM sin importar el "type": "commonjs" del proyecto. Cuatro ajustes clave:

globals: true — describe, it, expect, beforeAll, afterAll disponibles sin imports en los tests
environment: 'node' — no DOM, entorno puro de Node
testTimeout: 15000 — las operaciones de BD pueden tardar, el default de 5s es insuficiente
pool: 'forks' — cada archivo de tests corre en su propio proceso, evita colisiones de estado
tests/api.test.js — los 10 tests exactos del brief, escritos con require (CJS, igual que el resto del proyecto):

beforeAll crea dos usuarios (uno normal, uno al que se le sube el rol a ADMIN directamente en BD con prisma) y un servicio auxiliar para los tests de pedidos
Los tests del 8 al 10 comparten orderId — el test 8 lo crea vía API y los tests 9 y 10 lo consumen
afterAll limpia todo lo generado: pedidos, servicios (soft-delete), perfiles y usuarios
Para ejecutarlo, con la base de datos activa:

npm test
Si ves 429 en los tests de login, el rate limiter se ha activado (máximo 10 intentos por IP cada 15 minutos). Espera un momento y vuelve a ejecutar.

#### AUDITORIA

Auditoría — Swift Studio 360 Backend
Requisitos obligatorios — toma_de_requisitos.md
Requisito Estado Detalle
Express.js framework HTTP ✅ Express 5.2.1 en app.js
PostgreSQL base de datos ✅ Configurado en prisma.config.ts vía DATABASE_URL
API REST funcional — CRUD completo ✅ 4 recursos: auth, services, orders (+deliverables), users
Postman — colección exportada y documentada ❌ No existe ningún archivo .json de Postman en el repo
Prisma ORM ✅ Prisma 7.8, schema con 5 modelos, migraciones y seed
JWT + bcryptjs ✅ Tokens 7d firmados con JWT_SECRET, hash con 10 rondas
Vitest + Supertest — tests de integración ✅ 10 tests en tests/api.test.js
Requisitos de entrega — toma_de_requisitos.md
Requisito Estado Detalle
README.md con instrucciones de instalación ✅ Instalación, variables, scripts, jerarquía, endpoints, modelo de datos
.env.example con todas las variables ✅ DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGIN
Colección Postman .json en raíz o /postman ❌ No existe
Proyecto arranca con npm install + .env + npm run dev ✅ Script dev funcional
Requisitos del BRIEF
Requisito Estado Detalle
≥ 4 recursos en la API ✅ Users, Services, Orders, Deliverables
Autenticación JWT ✅ Register + Login + middleware authenticate
Roles de usuario ✅ USER / ADMIN con middleware isAdmin
Validaciones de entrada ✅ Zod en todos los POST/PUT
Manejo de errores centralizado ✅ errorHandler con Prisma codes, SyntaxError, 400–500
≥ 8 tests de integración ✅ 10 tests cubriendo auth, services, orders
Lógica de negocio implementada ✅ Pedido duplicado → 409, soft delete en services
Resultado
El único requisito obligatorio pendiente es la colección de Postman. Todo lo demás está implementado y cumple los requisitos.

La colección de Postman debe cubrir todos los endpoints documentados en el README y exportarse como .json en una carpeta /postman o en la raíz del proyecto. Eso no se puede generar desde código — tienes que hacerlo tú desde Postman con las peticiones que ya has probado.
