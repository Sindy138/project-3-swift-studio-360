# Swift Studio 360 — Guía Técnica de la API REST

## Índice

1. [Información General](#1-información-general)
2. [Autenticación](#2-autenticación)
3. [Modelos de Datos](#3-modelos-de-datos)
4. [Códigos de Estado HTTP](#4-códigos-de-estado-http)
5. [Errores y Formato de Respuesta](#5-errores-y-formato-de-respuesta)
6. [Endpoints — Auth](#6-endpoints--auth)
7. [Endpoints — Users](#7-endpoints--users)
8. [Endpoints — Services](#8-endpoints--services)
9. [Endpoints — Orders](#9-endpoints--orders)
10. [Endpoints — Deliverables](#10-endpoints--deliverables)
11. [Reglas de Negocio](#11-reglas-de-negocio)
12. [Rate Limiting](#12-rate-limiting)
13. [Referencia rápida de endpoints](#13-referencia-rápida-de-endpoints)

---

## 1. Información General

| Campo | Valor |
|-------|-------|
| **Base URL** | `http://localhost:3000/api` |
| **Protocolo** | HTTP/HTTPS |
| **Formato** | JSON (`Content-Type: application/json`) |
| **Autenticación** | JWT Bearer Token |
| **Versión** | 1.0.0 |

Todos los cuerpos de petición y respuesta son JSON. Las respuestas de error siguen siempre el mismo formato `{ "error": "mensaje" }`.

---

## 2. Autenticación

La API usa **JSON Web Tokens (JWT)**. El token se obtiene en `/api/auth/login` o `/api/auth/register` y debe incluirse en cada petición protegida.

### Cómo incluir el token

```http
Authorization: Bearer <token>
```

### Propiedades del token

| Campo | Valor |
|-------|-------|
| Algoritmo | HS256 |
| Expiración | 7 días |
| Payload | `{ id, email, role }` |

### Roles disponibles

| Rol | Descripción |
|-----|-------------|
| `USER` | Usuario estándar. Solo accede a sus propios recursos. |
| `ADMIN` | Acceso total. Puede gestionar usuarios, servicios y órdenes de cualquier usuario. |

### Errores de autenticación

| Código | Error | Causa |
|--------|-------|-------|
| 401 | `No token provided` | Header `Authorization` ausente o no empieza por `Bearer ` |
| 401 | `Invalid or expired token` | Token malformado, firmado con otra clave o caducado |
| 403 | `Forbidden: admin access required` | Ruta exclusiva para ADMIN usada con token de USER |
| 403 | `Forbidden` | Recurso pertenece a otro usuario |

---

## 3. Modelos de Datos

### User

```json
{
  "id": "cuid",
  "email": "string (único)",
  "role": "USER | ADMIN",
  "createdAt": "ISO 8601",
  "profile": "Profile | null"
}
```

> El campo `password` nunca se devuelve en ninguna respuesta.

### Profile

```json
{
  "id": "cuid",
  "fullName": "string | null",
  "phone": "string | null",
  "companyName": "string | null",
  "userId": "cuid"
}
```

### Service

```json
{
  "id": "cuid",
  "name": "string",
  "description": "string",
  "price": "number (float, positivo)",
  "category": "string",
  "formConfig": "object (JSON libre)",
  "isActive": "boolean",
  "createdAt": "ISO 8601"
}
```

> `isActive: false` equivale a servicio eliminado. No se expone en los endpoints públicos.

### Order

```json
{
  "id": "cuid",
  "status": "PENDING | PROGRESS | DONE",
  "configData": "object (JSON libre)",
  "total": "number (float)",
  "userId": "cuid",
  "serviceId": "cuid",
  "createdAt": "ISO 8601"
}
```

### Deliverable

```json
{
  "id": "cuid",
  "label": "string",
  "url": "string (URL válida)",
  "orderId": "cuid",
  "createdAt": "ISO 8601"
}
```

---

## 4. Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| `200 OK` | Éxito con cuerpo | GET, PUT exitosos |
| `201 Created` | Recurso creado | POST exitoso |
| `204 No Content` | Éxito sin cuerpo | DELETE exitoso |
| `400 Bad Request` | Error de validación | Body no cumple el schema Zod |
| `401 Unauthorized` | Sin autenticación | Token ausente o inválido |
| `403 Forbidden` | Sin autorización | Rol insuficiente o recurso ajeno |
| `404 Not Found` | Recurso inexistente | ID no existe o servicio inactivo |
| `409 Conflict` | Conflicto de estado | Email duplicado, orden duplicada, usuario con órdenes |
| `429 Too Many Requests` | Rate limit | Demasiados intentos de login |
| `500 Internal Server Error` | Error del servidor | Error no controlado |

---

## 5. Errores y Formato de Respuesta

### Error estándar (400, 401, 403, 404, 409)

```json
{
  "error": "Mensaje descriptivo del error"
}
```

### Error de validación (400)

```json
{
  "errors": [
    {
      "path": ["email"],
      "message": "A valid email is required"
    },
    {
      "path": ["password"],
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Rate limit (429)

```json
{
  "error": "Too many login attempts, please try again in 15 minutes"
}
```

---

## 6. Endpoints — Auth

### POST /api/auth/register

Registra un nuevo usuario con rol `USER` por defecto. Devuelve el usuario creado y un token JWT válido.

**Auth requerida:** No

**Body:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123"
}
```

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `email` | string | Sí | Formato email válido |
| `password` | string | Sí | Mínimo 8 caracteres |

**Respuesta 201:**

```json
{
  "user": {
    "id": "cmp6vxpcf0000rstjeudrx4t5",
    "email": "usuario@ejemplo.com",
    "role": "USER",
    "createdAt": "2026-05-15T12:20:06.159Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | Errores de validación Zod |
| 409 | `Email already in use` |

---

### POST /api/auth/login

Autentica un usuario existente. Devuelve los datos del usuario (sin password) y un token JWT.

**Auth requerida:** No  
**Rate limit:** 10 peticiones cada 15 minutos por IP

**Body:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123"
}
```

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| `email` | string | Sí |
| `password` | string | Sí |

**Respuesta 200:**

```json
{
  "user": {
    "id": "cmp6vxpcf0000rstjeudrx4t5",
    "email": "usuario@ejemplo.com",
    "role": "USER",
    "createdAt": "2026-05-15T12:20:06.159Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | Errores de validación |
| 401 | `Invalid credentials` |
| 429 | `Too many login attempts, please try again in 15 minutes` |

---

## 7. Endpoints — Users

### GET /api/users

Devuelve la lista completa de usuarios con sus perfiles. Ordenados por fecha de creación descendente.

**Auth requerida:** Sí — solo `ADMIN`

**Respuesta 200:**

```json
[
  {
    "id": "cmp6vxpcf0000rstjeudrx4t5",
    "email": "usuario@ejemplo.com",
    "role": "USER",
    "createdAt": "2026-05-15T12:20:06.159Z",
    "profile": {
      "id": "cmp7abc123",
      "fullName": "Ana García",
      "phone": "600123456",
      "companyName": "Mi Empresa SL",
      "userId": "cmp6vxpcf0000rstjeudrx4t5"
    }
  }
]
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 401 | `No token provided` |
| 403 | `Forbidden: admin access required` |

---

### GET /api/users/:id

Devuelve los datos de un usuario específico con su perfil.

**Auth requerida:** Sí — `ADMIN` o el propio usuario

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID del usuario |

**Respuesta 200:**

```json
{
  "id": "cmp6vxpcf0000rstjeudrx4t5",
  "email": "usuario@ejemplo.com",
  "role": "USER",
  "createdAt": "2026-05-15T12:20:06.159Z",
  "profile": null
}
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 401 | `No token provided` |
| 403 | `Forbidden` (usuario intentando ver otro usuario) |
| 404 | `User not found` |

---

### PUT /api/users/:id

Actualiza datos del usuario y/o su perfil. El perfil se crea automáticamente si no existe (upsert). Solo `ADMIN` puede modificar el campo `role`.

**Auth requerida:** Sí — `ADMIN` o el propio usuario

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID del usuario |

**Body (todos los campos opcionales):**

```json
{
  "email": "nuevo@email.com",
  "role": "ADMIN",
  "fullName": "Nombre Completo",
  "phone": "600000000",
  "companyName": "Empresa SL"
}
```

| Campo | Tipo | Solo ADMIN | Validación |
|-------|------|------------|------------|
| `email` | string | No | Formato email válido |
| `role` | string | **Sí** | `USER` o `ADMIN` |
| `fullName` | string | No | — |
| `phone` | string | No | — |
| `companyName` | string | No | — |

**Respuesta 200:** Objeto usuario completo con profile actualizado.

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | Errores de validación |
| 401 | `No token provided` |
| 403 | `Forbidden` o `You cannot change your own role` |
| 404 | `User not found` |

---

### DELETE /api/users/:id

Elimina permanentemente un usuario y su perfil asociado (cascade). No se puede eliminar un usuario que tenga órdenes registradas.

**Auth requerida:** Sí — solo `ADMIN`

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID del usuario a eliminar |

**Respuesta 204:** Sin body.

**Errores:**

| Código | Mensaje |
|--------|---------|
| 401 | `No token provided` |
| 403 | `Forbidden: admin access required` |
| 403 | `You cannot delete your own account` |
| 404 | `User not found` |
| 409 | `Cannot delete user with existing orders` |

> **Nota:** Si el usuario tiene órdenes, primero deben ser gestionadas (cambiar estado a `DONE`) antes de poder eliminarlo, o bien gestionar la eliminación desde base de datos directamente.

---

## 8. Endpoints — Services

### GET /api/services

Devuelve todos los servicios activos. No requiere autenticación.

**Auth requerida:** No

**Respuesta 200:**

```json
[
  {
    "id": "cmq1abc000",
    "name": "Logo Design",
    "description": "Diseño de logotipo profesional",
    "price": 299.99,
    "category": "Branding",
    "formConfig": { "style": ["minimalista", "moderno"] },
    "isActive": true,
    "createdAt": "2026-05-01T10:00:00.000Z"
  }
]
```

---

### GET /api/services/:id

Devuelve un servicio activo por su ID.

**Auth requerida:** No

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID del servicio |

**Respuesta 200:** Objeto servicio.

**Errores:**

| Código | Mensaje |
|--------|---------|
| 404 | `Service not found` (inexistente o `isActive: false`) |

---

### POST /api/services

Crea un nuevo servicio.

**Auth requerida:** Sí — solo `ADMIN`

**Body:**

```json
{
  "name": "Logo Design",
  "description": "Diseño de logotipo profesional",
  "price": 299.99,
  "category": "Branding",
  "formConfig": { "style": ["minimalista", "moderno"], "colores": 3 }
}
```

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `name` | string | Sí | No vacío |
| `description` | string | Sí | No vacío |
| `price` | number | Sí | Número positivo |
| `category` | string | Sí | No vacío |
| `formConfig` | object | No | JSON libre (default `{}`) |

**Respuesta 201:** Objeto servicio creado con `isActive: true`.

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | Errores de validación |
| 401 | `No token provided` |
| 403 | `Forbidden: admin access required` |

---

### PUT /api/services/:id

Actualiza un servicio existente y activo. Todos los campos son opcionales.

**Auth requerida:** Sí — solo `ADMIN`

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID del servicio |

**Body (parcial):**

```json
{
  "price": 349.99,
  "description": "Nueva descripción"
}
```

**Respuesta 200:** Objeto servicio actualizado.

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | Errores de validación |
| 401 | `No token provided` |
| 403 | `Forbidden: admin access required` |
| 404 | `Service not found` |

---

### DELETE /api/services/:id

Desactiva un servicio (soft delete: pone `isActive: false`). El registro se conserva en base de datos para mantener la integridad referencial con las órdenes existentes.

**Auth requerida:** Sí — solo `ADMIN`

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID del servicio |

**Respuesta 204:** Sin body.

**Errores:**

| Código | Mensaje |
|--------|---------|
| 401 | `No token provided` |
| 403 | `Forbidden: admin access required` |
| 404 | `Service not found` (inexistente o ya inactivo) |

---

## 9. Endpoints — Orders

### POST /api/orders

Crea una nueva orden para el usuario autenticado. El `total` se calcula automáticamente a partir del precio del servicio en el momento de la creación.

**Auth requerida:** Sí — `USER` o `ADMIN`

**Body:**

```json
{
  "serviceId": "cmq1abc000",
  "configData": {
    "brief": "Quiero algo minimalista",
    "colores": ["azul", "blanco"],
    "referencia": "https://ejemplo.com/logo"
  }
}
```

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `serviceId` | string | Sí | ID de servicio activo |
| `configData` | object | No | JSON libre (default `{}`) |

**Respuesta 201:**

```json
{
  "id": "cmr2def111",
  "status": "PENDING",
  "configData": { "brief": "Quiero algo minimalista" },
  "total": 299.99,
  "userId": "cmp6vxpcf0000rstjeudrx4t5",
  "serviceId": "cmq1abc000",
  "createdAt": "2026-05-16T09:00:00.000Z",
  "service": {
    "name": "Logo Design",
    "category": "Branding",
    "price": 299.99
  }
}
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | Errores de validación |
| 401 | `No token provided` |
| 404 | `Service not found` |
| 409 | `You already have an active order for this service` |

> **Regla de negocio:** Un usuario no puede tener dos órdenes activas (`PENDING` o `PROGRESS`) para el mismo servicio simultáneamente.

---

### GET /api/orders

Devuelve las órdenes del sistema. El comportamiento varía según el rol:

- **USER:** Solo devuelve sus propias órdenes.
- **ADMIN:** Devuelve todas las órdenes de todos los usuarios.

**Auth requerida:** Sí

**Respuesta 200:**

```json
[
  {
    "id": "cmr2def111",
    "status": "PENDING",
    "configData": {},
    "total": 299.99,
    "userId": "cmp6vxpcf0000rstjeudrx4t5",
    "serviceId": "cmq1abc000",
    "createdAt": "2026-05-16T09:00:00.000Z",
    "service": {
      "name": "Logo Design",
      "category": "Branding"
    }
  }
]
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 401 | `No token provided` |

---

### GET /api/orders/:id

Devuelve el detalle completo de una orden, incluyendo sus entregables.

**Auth requerida:** Sí — `ADMIN` o el dueño de la orden

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID de la orden |

**Respuesta 200:**

```json
{
  "id": "cmr2def111",
  "status": "PROGRESS",
  "configData": { "brief": "Quiero algo minimalista" },
  "total": 299.99,
  "userId": "cmp6vxpcf0000rstjeudrx4t5",
  "serviceId": "cmq1abc000",
  "createdAt": "2026-05-16T09:00:00.000Z",
  "service": {
    "name": "Logo Design",
    "category": "Branding",
    "price": 299.99
  },
  "deliverables": [
    {
      "id": "cms3ghi222",
      "label": "Logo versión final",
      "url": "https://drive.google.com/file/logo-final.pdf",
      "orderId": "cmr2def111",
      "createdAt": "2026-05-17T10:00:00.000Z"
    }
  ]
}
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 401 | `No token provided` |
| 403 | `Forbidden` |
| 404 | `Order not found` |

---

### PUT /api/orders/:id/status

Actualiza el estado de una orden. Exclusivo para ADMIN.

**Auth requerida:** Sí — solo `ADMIN`

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID de la orden |

**Body:**

```json
{
  "status": "PROGRESS"
}
```

| Valor | Descripción |
|-------|-------------|
| `PENDING` | Orden recibida, pendiente de inicio |
| `PROGRESS` | En proceso de producción |
| `DONE` | Entregada y finalizada |

**Respuesta 200:** Objeto orden actualizado.

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | `Status must be PENDING, PROGRESS or DONE` |
| 401 | `No token provided` |
| 403 | `Forbidden: admin access required` |
| 404 | `Order not found` |

---

## 10. Endpoints — Deliverables

### POST /api/orders/:id/deliverables

Añade un entregable a una orden. Se pueden añadir múltiples entregables a la misma orden.

**Auth requerida:** Sí — solo `ADMIN`

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID de la orden |

**Body:**

```json
{
  "label": "Logo versión final",
  "url": "https://drive.google.com/file/logo-final.pdf"
}
```

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `label` | string | Sí | No vacío |
| `url` | string | Sí | URL válida (http/https) |

**Respuesta 201:**

```json
{
  "id": "cms3ghi222",
  "label": "Logo versión final",
  "url": "https://drive.google.com/file/logo-final.pdf",
  "orderId": "cmr2def111",
  "createdAt": "2026-05-17T10:00:00.000Z"
}
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 400 | `Label is required` / `A valid URL is required` |
| 401 | `No token provided` |
| 403 | `Forbidden: admin access required` |
| 404 | `Order not found` |

---

### GET /api/orders/:id/deliverables

Lista todos los entregables de una orden, ordenados cronológicamente.

**Auth requerida:** Sí — `ADMIN` o el dueño de la orden

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (cuid) | ID de la orden |

**Respuesta 200:**

```json
[
  {
    "id": "cms3ghi222",
    "label": "Logo versión final",
    "url": "https://drive.google.com/file/logo-final.pdf",
    "orderId": "cmr2def111",
    "createdAt": "2026-05-17T10:00:00.000Z"
  }
]
```

**Errores:**

| Código | Mensaje |
|--------|---------|
| 401 | `No token provided` |
| 403 | `Forbidden` |
| 404 | `Order not found` |

---

## 11. Reglas de Negocio

### Gestión de usuarios

- Un usuario no puede cambiar su propio `role`. Solo ADMIN puede promover o degradar roles.
- Un ADMIN no puede eliminarse a sí mismo.
- No se puede eliminar un usuario que tenga órdenes asociadas (la integridad referencial lo impide). El perfil (`Profile`) se elimina en cascada al borrar el usuario.

### Gestión de servicios

- El DELETE de un servicio es un **soft delete**: el registro permanece en base de datos con `isActive: false` para preservar el histórico de órdenes.
- Los endpoints públicos (`GET /services`, `GET /services/:id`) solo exponen servicios con `isActive: true`.

### Gestión de órdenes

- El `total` de una orden se fija en el precio del servicio en el momento de crearla. Si el precio del servicio cambia después, las órdenes existentes no se ven afectadas.
- Un usuario no puede tener dos órdenes con estado `PENDING` o `PROGRESS` para el mismo servicio al mismo tiempo.
- Solo ADMIN puede cambiar el estado de las órdenes.
- Solo ADMIN puede añadir entregables a las órdenes.

### Visibilidad de datos

| Recurso | USER ve | ADMIN ve |
|---------|---------|----------|
| Lista de usuarios | Solo el suyo | Todos |
| Detalle de usuario | Solo el suyo | Cualquiera |
| Lista de órdenes | Solo las suyas | Todas |
| Detalle de orden | Solo las suyas | Cualquiera |
| Entregables | Solo de sus órdenes | Cualquiera |

---

## 12. Rate Limiting

Solo el endpoint de login tiene limitación de tasa activa.

| Endpoint | Límite | Ventana | Acción al superar |
|----------|--------|---------|-------------------|
| `POST /api/auth/login` | 10 peticiones | 15 minutos | 429 con mensaje de error |

---

## 13. Referencia rápida de endpoints

| Método | Ruta | Auth | Rol mínimo | Descripción |
|--------|------|------|------------|-------------|
| `POST` | `/api/auth/register` | No | — | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | No | — | Iniciar sesión |
| `GET` | `/api/users` | Sí | ADMIN | Listar todos los usuarios |
| `GET` | `/api/users/:id` | Sí | USER (propio) | Ver usuario por ID |
| `PUT` | `/api/users/:id` | Sí | USER (propio) | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Sí | ADMIN | Eliminar usuario |
| `GET` | `/api/services` | No | — | Listar servicios activos |
| `GET` | `/api/services/:id` | No | — | Ver servicio por ID |
| `POST` | `/api/services` | Sí | ADMIN | Crear servicio |
| `PUT` | `/api/services/:id` | Sí | ADMIN | Actualizar servicio |
| `DELETE` | `/api/services/:id` | Sí | ADMIN | Desactivar servicio |
| `POST` | `/api/orders` | Sí | USER | Crear orden |
| `GET` | `/api/orders` | Sí | USER | Listar órdenes |
| `GET` | `/api/orders/:id` | Sí | USER (propia) | Ver orden por ID |
| `PUT` | `/api/orders/:id/status` | Sí | ADMIN | Cambiar estado de orden |
| `POST` | `/api/orders/:id/deliverables` | Sí | ADMIN | Añadir entregable |
| `GET` | `/api/orders/:id/deliverables` | Sí | USER (propia) | Listar entregables |
