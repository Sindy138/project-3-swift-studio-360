# Swift Studio 360 — Frontend

SPA (Single Page Application) de **Swift Studio 360**, agencia de marketing digital. Permite a los clientes explorar el catálogo de servicios, contratar a través de un formulario dinámico, hacer seguimiento de sus pedidos y gestionar su perfil desde un dashboard personal.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 19 |
| Routing | React Router DOM 7 |
| Build tool / Dev server | Vite 8 |
| Estilos | CSS Modules + CSS puro (sin librerías UI externas) |
| Estado de autenticación | React Context API |
| HTTP | Fetch nativo (`apiFetch` helper) |
| Linting | ESLint 10 |

---

## Requisitos previos

- [Node.js](https://nodejs.org) v18 o superior
- El backend corriendo en `http://localhost:3000` (o configurar `VITE_API_URL`)

---

## Instalación y puesta en marcha

```bash
# 1. Clona el repositorio
git clone <url-del-repo>
cd project-3-swift-studio-360/frontend

# 2. Instala dependencias
npm install

# 3. (Opcional) Configura la URL del backend
# Crea un archivo .env con VITE_API_URL si el backend no corre en localhost:3000

# 4. Arranca el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del frontend:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |

> En producción, el frontend se sirve desde el mismo dominio que el backend (deploy full-stack en Render), por lo que `VITE_API_URL` debe apuntar a esa misma URL pública. El archivo `.env` ya incluye la URL de producción configurada.

---

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo en http://localhost:5173
npm run build     # Compila para producción (salida en dist/)
npm run preview   # Preview de la build de producción
npm run lint      # Valida el código con ESLint
```

---

## Build y deploy en producción

El frontend no se despliega por separado. Se compila y el resultado se incluye en el backend para un **deploy full-stack en Render**.

### Proceso

```bash
# 1. Asegúrate de que .env tiene VITE_API_URL apuntando a la URL de Render
# 2. Compila
npm run build

# 3. Copia el contenido de dist/ a backend/public/
# 4. Haz commit de backend/public/ y push
```

Render detecta el push y redespliega el backend, que servirá el nuevo frontend automáticamente desde `backend/public/`.

---

## Estructura del proyecto

```
frontend/
├── index.html                        # Entry point HTML
├── vite.config.js                    # Configuración de Vite
├── eslint.config.js                  # Configuración de ESLint
├── package.json
└── src/
    ├── main.jsx                      # Punto de entrada — monta React en #root
    ├── App.jsx                       # Router, ProtectedRoute y layout (NavBar + Footer)
    ├── App.css                       # Estilos globales de la app
    ├── index.css                     # Reset y variables CSS base
    ├── config/
    │   ├── api.js                    # Helper apiFetch + constante API_URL
    │   ├── content.js                # SECTOR_CONFIG — contenido de la Home
    │   └── TEMPLATE.js              # Plantilla para transponer a otro sector
    ├── context/
    │   └── AuthContext.jsx           # Proveedor de auth: user, login(), logout(), loading
    ├── components/
    │   ├── layout/
    │   │   ├── NavBar.jsx            # Barra de navegación (adapta menú según auth)
    │   │   ├── NavBar.module.css
    │   │   ├── Footer.jsx            # Pie de página con enlaces y RRSS
    │   │   └── Footer.module.css
    │   └── home/
    │       ├── Home.jsx              # Ensambla las 5 secciones de la landing
    │       ├── HeroSection.jsx       # Propuesta de valor + CTA principal
    │       ├── SocialProof.jsx       # Logos de clientes + carrusel de testimonios
    │       ├── ServiceGrid.jsx       # Grid de los 5 pilares de servicios
    │       ├── EngineSection.jsx     # Diferenciadores vs agencia tradicional
    │       ├── SEOAuthority.jsx      # KPIs + texto SEO + Structured Data JSON-LD
    │       ├── ARCHITECTURE.md       # Guía de arquitectura modular de la Home
    │       └── styles/               # CSS Modules por componente
    └── pages/
        ├── Login.jsx                 # Formulario de inicio de sesión
        ├── Register.jsx              # Registro con confirmación de contraseña
        ├── Auth.module.css           # Estilos compartidos de Login y Register
        ├── Services.jsx              # Catálogo con filtros por categoría
        ├── Services.module.css
        ├── Checkout.jsx              # Formulario dinámico de contratación
        ├── Checkout.module.css
        ├── OrderSuccess.jsx          # Página de confirmación tras contratar
        ├── OrderSuccess.module.css
        ├── Dashboard.jsx             # Panel del cliente: pedidos y estadísticas
        ├── Dashboard.module.css
        ├── OrderDetail.jsx           # Detalle de pedido: timeline + entregables
        ├── OrderDetail.module.css
        ├── Profile.jsx               # Edición de datos de perfil
        └── Profile.module.css
```

---

## Rutas de la aplicación

| Ruta | Página | Protegida | Descripción |
|---|---|---|---|
| `/` | `Home` | No | Landing page con secciones de marketing |
| `/login` | `Login` | No | Formulario de acceso |
| `/register` | `Register` | No | Formulario de registro |
| `/servicios` | `Services` | No | Catálogo de servicios con filtros |
| `/checkout/:serviceId` | `Checkout` | Sí | Formulario dinámico de contratación |
| `/gracias` | `OrderSuccess` | Sí | Confirmación de pedido enviado |
| `/dashboard` | `Dashboard` | Sí | Panel con pedidos del usuario |
| `/dashboard/pedido/:id` | `OrderDetail` | Sí | Detalle de un pedido específico |
| `/perfil` | `Profile` | Sí | Edición de datos de perfil |
| `*` | — | — | Redirección a `/` |

Las rutas protegidas usan `ProtectedRoute` (en `App.jsx`): si el usuario no está autenticado, redirige a `/login`.

---

## Autenticación

El estado de auth se gestiona con React Context (`src/context/AuthContext.jsx`).

**Flujo:**
- Al hacer login o register, el token JWT y los datos del usuario se guardan en `localStorage`.
- Al cargar la app, `AuthContext` lee el `localStorage` y restaura la sesión automáticamente.
- Al hacer logout, se limpian `token` y `user` del `localStorage` y se redirige a `/`.

**API expuesta por `useAuth()`:**

| Propiedad | Tipo | Descripción |
|---|---|---|
| `user` | `Object \| null` | Datos del usuario autenticado (`id`, `email`, `role`) |
| `loading` | `boolean` | `true` mientras se inicializa la sesión al cargar |
| `login(userData, token)` | `Function` | Guarda la sesión y actualiza el estado |
| `logout()` | `Function` | Limpia la sesión del estado y del localStorage |

---

## Comunicación con el backend

Todas las llamadas HTTP pasan por el helper `apiFetch` (`src/config/api.js`):

```js
// Añade automáticamente:
// - Content-Type: application/json
// - Authorization: Bearer <token>  (si hay token en localStorage)
const data = await apiFetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({ serviceId, configData }),
})
```

Si la respuesta no es `ok`, lanza un `Error` con el mensaje del campo `error` de la respuesta JSON del backend.

---

## Páginas en detalle

### Home — `/`

Landing page data-driven: todo el contenido viene de `src/config/content.js` (`SECTOR_CONFIG`). Los componentes son agnósticos de datos y reciben su configuración por props.

**Secciones en orden:**

| # | Componente | Contenido |
|---|---|---|
| 1 | `HeroSection` | Headline, subheadline, CTA principal y secundario, fondo de video |
| 2 | `SocialProof` | Logos de clientes, carrusel de testimonios con navegación manual |
| 3 | `ServiceGrid` | Grid responsivo de 5 pilares de servicios con color accent por categoría |
| 4 | `EngineSection` | 3 ventajas (Equipo especializado, Integraciones n8n, Optimización continua) |
| 5 | `SEOAuthority` | 4 KPIs estadísticos, texto de autoridad de marca, JSON-LD `LocalBusiness` |

---

### Servicios — `/servicios`

Consume `GET /api/services` al montar. Renderiza tarjetas con filtros por categoría:

**Categorías disponibles:**

| Categoría | Color de acento |
|---|---|
| SEO | Azul `#3b82f6` |
| Contenidos | Verde azulado `#4ECDC4` |
| Fotografía | Ámbar `#f59e0b` |
| Automatización | Violeta `#a78bfa` |

Cada tarjeta muestra nombre, descripción, precio y un botón "Contratar →" que navega a `/checkout/:serviceId`.

---

### Checkout — `/checkout/:serviceId`

1. Carga el servicio con `GET /api/services/:id`.
2. Renderiza dinámicamente los campos definidos en `service.formConfig.fields`. Soporta tipos: `text`, `number`, `textarea`, `select`.
3. Valida que los campos `required` estén rellenos antes de enviar.
4. Envía `POST /api/orders` con `{ serviceId, configData }`.
5. En caso de éxito, navega a `/gracias`.

**Panel lateral:** Muestra nombre, categoría, descripción y precio del servicio junto a las garantías (sin permanencia, contacto en 24 h, pago tras confirmación).

---

### Dashboard — `/dashboard`

Lista todos los pedidos del usuario autenticado (`GET /api/orders`). Muestra tres contadores: servicios activos (PENDING + PROGRESS), completados (DONE) y total de pedidos.

**Estados de pedido:**

| Estado API | Etiqueta visible |
|---|---|
| `PENDING` | Pendiente |
| `PROGRESS` | En producción |
| `DONE` | Completado |

Cada pedido es un enlace a `/dashboard/pedido/:id`. Incluye un acceso directo a `/servicios` para contratar nuevos servicios.

---

### Detalle de pedido — `/dashboard/pedido/:id`

Carga `GET /api/orders/:id` (incluye datos del servicio y entregables). Muestra:

- **Timeline de 4 pasos**: Pedido recibido → Asignado al equipo → En producción → Entregado. Los pasos completados se marcan con ✓ según el estado del pedido.
- **Entregables**: Lista de archivos/enlaces adjuntos por el equipo. Si no hay aún, muestra mensaje de espera.
- **Datos aportados**: Las respuestas del formulario de contratación (`configData`), mostradas como lista de clave/valor.

---

### Perfil — `/perfil`

Carga `GET /api/users/:id` para obtener los datos del perfil. Permite editar `fullName`, `phone` y `companyName` mediante `PUT /api/users/:id`.

El email y el rol se muestran en un panel lateral como información de solo lectura (no son editables desde esta pantalla).

---

## Arquitectura modular de la Home

La Home está diseñada como **plantilla agnóstica de sector**. Para adaptar el sitio a otro sector (ej. inmobiliaria) basta con:

1. Crear `src/config/realestate.js` siguiendo la estructura de `TEMPLATE.js`.
2. Actualizar el import en `Home.jsx`.

Los componentes nunca tienen contenido hardcodeado — todo llega por props desde el archivo de configuración.

Consulta `src/components/home/ARCHITECTURE.md` para la guía completa con ejemplos de transposición a otros sectores.

---

## Sistema de estilos

- **CSS Modules** (`*.module.css`) para páginas y componentes de layout — scoping automático de clases, sin colisiones.
- **CSS puro** para los componentes de la Home (`*.css`) — permite compartir variables CSS globales definidas en `Home.css`.
- **Sin librerías UI externas** — todo el diseño es CSS propio.

**Variables CSS globales** (`src/components/home/styles/Home.css`):

```css
:root {
  --color-primary:   #ff6b6b;
  --color-secondary: #4ecdc4;
  --color-accent:    #ffe66d;
}
```

**Breakpoints responsive:**

| Nombre | Ancho máximo |
|---|---|
| Tablet | 768px |
| Mobile | 480px |

---

## Flujo de usuario completo

```
/ (Home)
  └─ /servicios                → Explorar catálogo
       └─ /checkout/:id        → Contratar (requiere login)
            └─ /gracias        → Pedido confirmado
                 └─ /dashboard → Mis proyectos
                      ├─ /dashboard/pedido/:id → Detalle + entregables
                      └─ /perfil              → Editar datos de contacto

/login    ← Redirige aquí si se accede a ruta protegida sin sesión
/register ← Registro de nueva cuenta → redirige a /dashboard
```
