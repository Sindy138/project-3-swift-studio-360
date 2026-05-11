# Mid-Project - Toma de Requisitos

## Requisitos obligatorios

- **Express.js** como framework HTTP
- **PostgreSQL** como base de datos
- **API REST funcional** - mínimo CRUD completo sobre el recurso principal de tu opción
- **Postman** - colección exportada con todos los endpoints documentados y probados
- **Pirsma** - ORM
- **JWT + bcryptjs** - Autenticación y hashing de contraseñas 
- **Vitest + Supertest** - Tests de integración sobre los endpoints 

El resto es opcional.

---

## Opcionales (Por si quieres investigar cosas)

| Herramienta | Para qué sirve |
|---|---|
| Zod | Validación de datos de entrada |
| Morgan | Logger de peticiones HTTP en consola |
| Helmet | Cabeceras de seguridad HTTP automáticas |
| cors | Control de orígenes permitidos (CORS) |
| express-rate-limit | Limitar peticiones por IP para evitar abuso |
| multer | Subida de archivos en formularios multipart |
| nodemailer | Envío de correos desde el backend |
| socket.io | Comunicación en tiempo real (WebSockets) |
| Redis | Caché de consultas o almacén de sesiones |
| Swagger / OpenAPI | Documentación interactiva de la API |
| Docker | Contenerizar la app y la base de datos |

Todo lo que uses, documéntalo y aprovecha para sacar pecho de ello en la presentación :) 

---

## Lógica de negocio

- Modelar las **entidades principales** y sus relaciones en la base de datos
- Implementar las **reglas de negocio clave** de tu opción
  - Ejemplo Events: un usuario no puede registrarse dos veces al mismo evento
  - Ejemplo Marketplace: un producto no puede tener stock negativo
- Calidad sobre cantidad - un CRUD limpio y bien estructurado vale más que diez features a medias

---

## Nomenclatura propuesta (no obligatoria)

### Archivos

```
{recurso}.controller.js   → lógica de cada endpoint
{recurso}.routes.js       → definición de rutas con Express Router
{recurso}.schema.js       → validaciones de entrada
```

### Endpoints

```
GET    /api/{recursos}            → listar
GET    /api/{recursos}/:id        → detalle
POST   /api/{recursos}            → crear
PUT    /api/{recursos}/:id        → actualizar
DELETE /api/{recursos}/:id        → eliminar
POST   /api/{recursos}/:id/:accion → acciones específicas (ej: /register, /publish)
```

---

## Jerarquía del proyecto - dos propuestas

### Propuesta A - Por capas (MVC)

Más habitual en proyectos pequeños y medianos. Fácil de navegar cuando hay pocos recursos.

```
backend/
├── controllers/          ← un archivo por recurso
├── routes/               ← un archivo por recurso
├── middleware/           ← auth.js, validate.js, errorHandler.js
├── schemas/              ← validaciones Zod
├── lib/                  ← prisma.js u otros clientes
├── prisma/               ← schema.prisma, migrations/, seed.js
├── app.js
└── server.js
```

### Propuesta B - Por dominio (Feature-based)

Escala mejor. Cada feature es un módulo autocontenido.

```
backend/
├── features/
│   ├── users/
│   │   ├── users.controller.js
│   │   ├── users.routes.js
│   │   └── users.schema.js
│   └── events/           ← o marketplace/, posts/, products/...
│       ├── events.controller.js
│       ├── events.routes.js
│       └── events.schema.js
├── middleware/
├── lib/
├── prisma/
├── app.js
└── server.js
```

Ambas son válidas y profesionales. Elige la que más ilusión te haga :) 
---

## Entrega

- Repositorio **GitHub** público con:
  - `README.md` - instrucciones de instalación, variables de entorno necesarias, cómo arrancar el proyecto
  - `.env.example` - todas las variables sin valores reales
  - Colección de Postman exportada (`.json`) en la raíz o en una carpeta `/postman`
- El proyecto debe arrancar con `npm install` + configurar `.env` + `npm run dev`
