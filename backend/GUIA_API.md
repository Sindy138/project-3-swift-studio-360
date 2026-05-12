# Guía de endpoints y roles — Swift Studio 360

---

## Índice
1. [Cómo funcionan los tokens JWT](#1-cómo-funcionan-los-tokens-jwt)
2. [Cómo configurar el token en Postman](#2-cómo-configurar-el-token-en-postman)
3. [Roles: USER y ADMIN](#3-roles-user-y-admin)
4. [Autenticación — `/api/auth`](#4-autenticación--apiauth)
5. [Servicios — `/api/services`](#5-servicios--apiservices)
6. [Pedidos — `/api/orders`](#6-pedidos--apiorders)
7. [Entregables — `/api/orders/:id/deliverables`](#7-entregables--apiordersiddeliverables)
8. [Usuarios — `/api/users`](#8-usuarios--apiusers)
9. [Tabla de códigos de error](#9-tabla-de-códigos-de-error)

---

## 1. Cómo funcionan los tokens JWT

### Qué es un token

Cuando te registras o haces login, el servidor te devuelve un **token JWT** (JSON Web Token). Es una cadena larga que empieza por `eyJ...` y que identifica quién eres y qué rol tienes.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseTEiLCJlbWFpbCI6...
```

Dentro del token el servidor guarda tu `id`, `email` y `role`. El token **tiene una duración de 7 días**, después caduca y tienes que volver a hacer login.

### Por qué se necesita

La API tiene rutas públicas (sin protección) y rutas protegidas. Para entrar a una ruta protegida tienes que "demostrar" quién eres enviando el token en cada petición.

```
Sin token  → 401 Unauthorized
Token caducado o inválido → 401 Unauthorized
Token válido pero sin permisos de admin → 403 Forbidden
Token válido y con permisos → ✅ respuesta correcta
```

### Ciclo de vida del token

```
1. POST /api/auth/register  ──→  Servidor crea usuario + devuelve TOKEN
         ó
   POST /api/auth/login     ──→  Servidor verifica contraseña + devuelve TOKEN

2. Guardas ese token en Postman (o en el frontend en localStorage)

3. Cada petición a ruta protegida:
   Request ──→ cabecera "Authorization: Bearer TOKEN" ──→ Servidor verifica TOKEN ──→ respuesta
```

---

## 2. Cómo configurar el token en Postman

### Opción A — Pegarlo manualmente en cada petición (simple)

1. Haz el register o login
2. Copia el valor del campo `token` de la respuesta
3. En la petición que quieras hacer, ve a la pestaña **Authorization**
4. En el desplegable selecciona **Bearer Token**
5. Pega el token en el campo de texto

```
Authorization → Bearer Token → [pega aquí el token]
```

Esto añade automáticamente la cabecera:
```
Authorization: Bearer eyJhbGci...
```

### Opción B — Variable de entorno (recomendada para no repetirlo)

1. En Postman, crea un **Environment** (icono de ojo arriba a la derecha → "Add")
2. Añade una variable llamada `token` (sin valor por ahora)
3. En la petición de login/register, ve a la pestaña **Tests** y añade este script:
   ```javascript
   const res = pm.response.json();
   pm.environment.set("token", res.token);
   ```
4. Ahora cada vez que hagas login, el token se guarda automáticamente en la variable
5. En cualquier petición protegida, ve a **Authorization → Bearer Token** y pon: `{{token}}`

---

## 3. Roles: USER y ADMIN

### Diferencia de permisos

| Qué puede hacer | USER | ADMIN |
|---|---|---|
| Registrarse / hacer login | ✅ | ✅ |
| Ver servicios activos | ✅ | ✅ |
| Crear un pedido | ✅ | ✅ |
| Ver sus propios pedidos | ✅ | ✅ |
| Ver todos los pedidos de todos | ❌ | ✅ |
| Crear / editar / eliminar servicios | ❌ | ✅ |
| Cambiar el estado de un pedido | ❌ | ✅ |
| Añadir entregables a un pedido | ❌ | ✅ |
| Ver la lista de todos los usuarios | ❌ | ✅ |
| Cambiar el rol de otro usuario | ❌ | ✅ |

### Cómo se asigna el rol

Al registrarte siempre eres `USER`. No hay endpoint público para convertirte en ADMIN (por seguridad).

**Para crear un ADMIN**, dos opciones:

**Opción A — Prisma Studio (visual)**
```bash
npx prisma studio
```
Se abre en `http://localhost:5555`. Ve a la tabla `User`, busca el usuario y cambia el campo `role` de `USER` a `ADMIN`. Guarda.

**Opción B — SQL directo**
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'tu@email.com';
```

Después del cambio tienes que **volver a hacer login** para obtener un nuevo token que ya incluya `role: "ADMIN"`.

---

## 4. Autenticación — `/api/auth`

### POST /api/auth/register — Registrar usuario nuevo

**Sin token** — esta ruta es pública.

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json
```

Body:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "minimo8caracteres"
}
```

**Respuesta exitosa `201`:**
```json
{
  "user": {
    "id": "clxyz123",
    "email": "usuario@ejemplo.com",
    "role": "USER",
    "createdAt": "2026-05-12T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

→ Guarda el `token` para usarlo en las siguientes peticiones.

**Errores posibles:**
- `400` — email inválido o password menor de 8 caracteres
- `409` — ese email ya está registrado

---

### POST /api/auth/login — Iniciar sesión

**Sin token** — esta ruta es pública. Máximo 10 intentos por IP cada 15 minutos.

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json
```

Body:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "minimo8caracteres"
}
```

**Respuesta exitosa `200`:**
```json
{
  "user": {
    "id": "clxyz123",
    "email": "usuario@ejemplo.com",
    "role": "USER",
    "createdAt": "2026-05-12T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles:**
- `400` — falta email o password en el body
- `401` — credenciales incorrectas (mismo mensaje para email y password, para no dar pistas)
- `429` — demasiados intentos, espera 15 minutos

---

## 5. Servicios — `/api/services`

### GET /api/services — Listar servicios activos

**Sin token** — ruta pública.

```
GET http://localhost:3000/api/services
```

No necesita body. Devuelve un array con los servicios que tienen `isActive: true`.

**Respuesta `200`:**
```json
[
  {
    "id": "clxyz1",
    "name": "Auditoría Técnica Express",
    "description": "Análisis completo del estado SEO...",
    "price": 299,
    "category": "SEO",
    "formConfig": { "fields": [...] },
    "isActive": true,
    "createdAt": "2026-05-12T10:00:00.000Z"
  },
  ...
]
```

---

### GET /api/services/:id — Detalle de un servicio

**Sin token** — ruta pública.

```
GET http://localhost:3000/api/services/clxyz1
```

Sustituye `clxyz1` por el `id` real de un servicio (obtenido del listado anterior).

**Errores posibles:**
- `404` — no existe un servicio activo con ese ID

---

### POST /api/services — Crear servicio

**Requiere token de ADMIN.**

```
POST http://localhost:3000/api/services
Authorization: Bearer <token-admin>
Content-Type: application/json
```

Body:
```json
{
  "name": "Nuevo Servicio SEO",
  "description": "Descripción detallada del servicio",
  "price": 500,
  "category": "SEO",
  "formConfig": {
    "fields": [
      { "name": "websiteUrl", "label": "URL de tu web", "type": "text", "required": true }
    ]
  }
}
```

**Respuesta exitosa `201`:** el objeto del servicio creado.

**Errores posibles:**
- `400` — falta algún campo requerido o precio no es un número positivo
- `401` — no se mandó token
- `403` — token de usuario normal (solo admin puede crear)

---

### PUT /api/services/:id — Editar servicio

**Requiere token de ADMIN.**

```
PUT http://localhost:3000/api/services/clxyz1
Authorization: Bearer <token-admin>
Content-Type: application/json
```

Body (solo los campos que quieras cambiar, todos son opcionales):
```json
{
  "price": 350,
  "description": "Nueva descripción actualizada"
}
```

**Respuesta `200`:** el objeto del servicio actualizado.

---

### DELETE /api/services/:id — Desactivar servicio (soft delete)

**Requiere token de ADMIN.**

```
DELETE http://localhost:3000/api/services/clxyz1
Authorization: Bearer <token-admin>
```

No necesita body. **No borra el registro** de la base de datos — pone `isActive: false`.
A partir de ese momento el servicio no aparece en el GET público ni se puede contratar.

**Respuesta `204`:** sin body (operación exitosa sin contenido que devolver).

---

## 6. Pedidos — `/api/orders`

### POST /api/orders — Crear pedido

**Requiere token de USER o ADMIN.**

```
POST http://localhost:3000/api/orders
Authorization: Bearer <token-usuario>
Content-Type: application/json
```

Body:
```json
{
  "serviceId": "clxyz1",
  "configData": {
    "websiteUrl": "https://miweb.com",
    "mainGoal": "Aumentar tráfico orgánico"
  }
}
```

- `serviceId` → el `id` del servicio que quieres contratar (del GET /api/services)
- `configData` → las respuestas del formulario del servicio (los campos del `formConfig`)
- El `total` se calcula automáticamente con el `price` del servicio — no hace falta mandarlo

**Respuesta exitosa `201`:**
```json
{
  "id": "clorder1",
  "status": "PENDING",
  "configData": { "websiteUrl": "https://miweb.com", "mainGoal": "Aumentar tráfico orgánico" },
  "total": 299,
  "userId": "clxyz123",
  "serviceId": "clxyz1",
  "service": { "name": "Auditoría Técnica Express", "category": "SEO", "price": 299 },
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

**Errores posibles:**
- `400` — falta `serviceId` en el body
- `401` — no se mandó token
- `404` — el servicio no existe o está desactivado
- `409` — ya tienes un pedido `PENDING` o `PROGRESS` para ese mismo servicio

---

### GET /api/orders — Listar pedidos

**Requiere token.**

```
GET http://localhost:3000/api/orders
Authorization: Bearer <token>
```

- Con **token de USER**: devuelve solo los pedidos de ese usuario
- Con **token de ADMIN**: devuelve todos los pedidos de todos los usuarios

---

### GET /api/orders/:id — Detalle de un pedido

**Requiere token. Solo el propietario o un ADMIN.**

```
GET http://localhost:3000/api/orders/clorder1
Authorization: Bearer <token>
```

Incluye los entregables del pedido en la respuesta.

**Errores posibles:**
- `403` — intentas ver el pedido de otro usuario siendo USER
- `404` — pedido no encontrado

---

### PUT /api/orders/:id/status — Cambiar estado

**Requiere token de ADMIN.**

```
PUT http://localhost:3000/api/orders/clorder1/status
Authorization: Bearer <token-admin>
Content-Type: application/json
```

Body:
```json
{
  "status": "PROGRESS"
}
```

Los tres estados posibles y su significado:

| Estado | Significado |
|---|---|
| `PENDING` | Pedido recibido, pendiente de empezar |
| `PROGRESS` | En producción, el equipo está trabajando en él |
| `DONE` | Completado, los entregables están disponibles |

**Respuesta `200`:** el pedido con el estado actualizado.

---

## 7. Entregables — `/api/orders/:id/deliverables`

Los entregables son links (Google Drive, Notion, Dropbox…) que el equipo sube cuando termina un pedido.

### POST /api/orders/:id/deliverables — Añadir entregable

**Requiere token de ADMIN.**

```
POST http://localhost:3000/api/orders/clorder1/deliverables
Authorization: Bearer <token-admin>
Content-Type: application/json
```

Body:
```json
{
  "label": "Informe SEO final",
  "url": "https://drive.google.com/file/d/abc123/view"
}
```

- `label` → nombre descriptivo del entregable
- `url` → debe ser una URL válida (con `https://`), si no → `400`

**Respuesta `201`:** el objeto del entregable creado.

---

### GET /api/orders/:id/deliverables — Listar entregables

**Requiere token. Solo el propietario del pedido o un ADMIN.**

```
GET http://localhost:3000/api/orders/clorder1/deliverables
Authorization: Bearer <token>
```

**Respuesta `200`:** array de entregables ordenados por fecha de creación.

**Errores posibles:**
- `403` — intentas ver los entregables del pedido de otro usuario siendo USER
- `404` — el pedido no existe

---

## 8. Usuarios — `/api/users`

### GET /api/users — Listar todos los usuarios

**Requiere token de ADMIN.**

```
GET http://localhost:3000/api/users
Authorization: Bearer <token-admin>
```

Devuelve todos los usuarios con su perfil incluido. Las contraseñas nunca se devuelven.

---

### GET /api/users/:id — Detalle de un usuario

**Requiere token. Solo el propio usuario o un ADMIN.**

```
GET http://localhost:3000/api/users/clxyz123
Authorization: Bearer <token>
```

- Un USER solo puede ver su propio perfil (si pone el ID de otro usuario → `403`)
- Un ADMIN puede ver cualquier usuario

**Respuesta `200`:**
```json
{
  "id": "clxyz123",
  "email": "usuario@ejemplo.com",
  "role": "USER",
  "createdAt": "2026-05-12T10:00:00.000Z",
  "profile": {
    "id": "clprofile1",
    "fullName": "Ada Lovelace",
    "phone": "+34 600 000 000",
    "companyName": "Mi Empresa SL",
    "userId": "clxyz123"
  }
}
```

Si el usuario no ha rellenado su perfil todavía, `profile` será `null`.

---

### PUT /api/users/:id — Actualizar usuario

**Requiere token. Solo el propio usuario o un ADMIN.**

```
PUT http://localhost:3000/api/users/clxyz123
Authorization: Bearer <token>
Content-Type: application/json
```

Body (todos los campos son opcionales, manda solo los que quieras cambiar):
```json
{
  "email": "nuevo@email.com",
  "fullName": "Ada Lovelace",
  "phone": "+34 600 000 000",
  "companyName": "Mi Empresa SL"
}
```

**Campos disponibles:**

| Campo | Dónde se guarda | Quién puede cambiarlo |
|---|---|---|
| `email` | Tabla `User` | USER (el suyo) / ADMIN (cualquiera) |
| `role` | Tabla `User` | Solo ADMIN |
| `fullName` | Tabla `Profile` | USER (el suyo) / ADMIN (cualquiera) |
| `phone` | Tabla `Profile` | USER (el suyo) / ADMIN (cualquiera) |
| `companyName` | Tabla `Profile` | USER (el suyo) / ADMIN (cualquiera) |

- Si mandas `role` siendo USER → `403 Forbidden`
- Los campos de `Profile` se crean automáticamente si no existen (upsert)

**Respuesta `200`:** el usuario actualizado con el perfil incluido.

---

## 9. Tabla de códigos de error

| Código | Nombre | Cuándo ocurre |
|---|---|---|
| `400` | Bad Request | Body inválido: falta campo requerido, URL mal formada, password < 8 chars, precio negativo... |
| `401` | Unauthorized | No se mandó token, el token expiró o está mal formado |
| `403` | Forbidden | Token válido pero sin permisos: USER en ruta de ADMIN, o accediendo a datos de otro usuario |
| `404` | Not Found | El recurso con ese ID no existe o está inactivo (`isActive: false`) |
| `409` | Conflict | Email ya registrado, o pedido duplicado activo para el mismo servicio |
| `429` | Too Many Requests | Rate limit superado en el login: espera 15 minutos |
| `500` | Internal Server Error | Error inesperado del servidor (ver logs de Morgan en la consola) |
