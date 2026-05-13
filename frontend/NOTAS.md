## AUDITORÍA FRONTED

### Lo que ya esta hecho

Backend completo: 4 recursos (auth, users, services, orders), JWT, roles USER/ADMIN, deliverables, ordenado por capas feature-based. Muy sólido.

Frontend: Solo la Home con 5 secciones visuales (HeroSection, ServiceGrid, EngineSection, SocialProof, SEOAuthority). Todo con datos estáticos del SECTOR_CONFIG. Sin React Router, sin AuthContext, sin conexión a la API.

Lo que necesita el frontend — en orden de implementación

#### Bloque 1 — Infraestructura (sin esto nada funciona)

Archivo Qué hace
npm install react-router-dom Routing
src/config/api.js URL base de la API (VITE_API_URL)
src/context/AuthContext.jsx Estado global: user, token, login(), logout()
App.jsx (refactor) Envuelve todo en <BrowserRouter> + <AuthProvider> + define <Routes>

#### Bloque 2 — Autenticación (2 páginas sencillas)

/login → src/pages/Login.jsx

Formulario controlado: email + password
POST /api/auth/login → guarda token en localStorage via AuthContext
Redirige a /dashboard si ok, muestra error si falla
Link a /register
/register → src/pages/Register.jsx

Formulario: email + password (+ confirmPassword en cliente)
POST /api/auth/register
Redirige a /dashboard tras registro
Link a /login

Bloque 3 — Catálogo de servicios (flujo ecommerce principal)
/servicios → src/pages/Services.jsx

GET /api/services (público, no necesita auth)
Muestra cards con nombre, categoría, precio, descripción
Filtro por categoría (SEO, Contenidos, Fotografía, Automatización) — simple, con botones
Cada card con botón "Contratar" → /checkout/:serviceId
Estados: loading spinner, error, lista vacía
/checkout/:serviceId → src/pages/Checkout.jsx

Si no hay usuario → redirige a /login
GET /api/services/:id para cargar el servicio
Muestra nombre, precio, descripción del servicio
Formulario dinámico simple (nota: formConfig del servicio es JSON, úsalo para campos básicos o simplifica con un textarea "Cuéntanos tu proyecto")
POST /api/orders con { serviceId, configData }
Éxito → redirige a /gracias
/gracias → src/pages/OrderSuccess.jsx

Página simple de confirmación (checkmark, mensaje, botón a /dashboard)
Bloque 4 — Área de cliente
/dashboard → src/pages/Dashboard.jsx

Ruta protegida (si no hay token → redirect a /login)
GET /api/orders → lista las órdenes del usuario
Contadores: "Servicios Activos" (PENDING/PROGRESS) y "Completados" (DONE)
Cards de cada pedido: nombre del servicio, badge de estado (PENDING/PROGRESS/DONE), fecha
Click en card → /dashboard/pedido/:id
/dashboard/pedido/:id → src/pages/OrderDetail.jsx

GET /api/orders/:id + GET /api/orders/:id/deliverables
Timeline simple: creado → en proceso → completado (basado en el status)
Lista de entregables con links (URLs que el admin habrá subido)
/perfil → src/pages/Profile.jsx

GET /api/users/:id (el ID viene del contexto de auth)
PUT /api/users/:id para guardar fullName, phone, companyName
Formulario controlado con validación
Bloque 5 — Ajustes en componentes existentes
Componente Cambio necesario
NavBar.jsx Usar <Link> de react-router. Si hay usuario: mostrar "Dashboard" + "Salir"; si no: "Entrar". Usar useAuth()
HeroSection.jsx Cambiar <a> por <Link> para CTAs internos
ServiceGrid.jsx Opcional: mantener estático en Home (más simple) o añadir useEffect para fetch real
App.jsx Reescribir con Router + rutas + AuthProvider
Estructura de rutas resultante

/ → Home (ya existe)
/servicios → Services (nuevo)
/checkout/:id → Checkout (nuevo, protegida)
/gracias → OrderSuccess (nuevo)
/login → Login (nuevo)
/register → Register (nuevo)
/dashboard → Dashboard (nuevo, protegida)
/dashboard/pedido/:id → OrderDetail (nuevo, protegida)
/perfil → Profile (nuevo, protegida)
9 rutas → cumple el requisito de 4+ rutas con creces.

Orden de implementación sugerido (del más al menos crítico)
Infraestructura (api.js + AuthContext + App con Router) — sin esto nada conecta
Login + Register — necesarios para todo lo demás
Services — página de catálogo, usa la API real, impresiona en la demo
Checkout + OrderSuccess — el flujo de compra completo
Dashboard + OrderDetail — el área de cliente
Profile — lo más prescindible si el tiempo aprieta
Ajustes de NavBar — pequeño pero da coherencia visual
Lo que NO haría (para no perder tiempo)
Panel de admin — no hay rutas de admin en el front, no lo necesitas para la demo
Blog / Portafolio / Contacto — no tienen backend, son decorativos
Carrusel en Home — lo que tienes (ServiceGrid estático) ya funciona bien visualmente; mejor invertir el tiempo en las rutas de la API
Pago real — no hay Stripe en el backend
¿Quieres que empiece a implementar el Bloque 1 (infraestructura) para dejarlo todo cableado?

## FASE 1

Esto es lo que se ha creado:

Archivo Estado
frontend/src/config/api.js Nuevo — URL base + apiFetch con token automático
frontend/src/context/AuthContext.jsx Nuevo — user, login(), logout(), loading
frontend/src/App.jsx Reescrito — BrowserRouter + AuthProvider + Routes + ProtectedRoute
frontend/.env Nuevo — VITE_API_URL=http://localhost:3000
frontend/src/components/home/styles/Home.css Nuevo — faltaba, lo requería Home.jsx
Todas las rutas futuras están ya comentadas en App.jsx — solo hay que descomentar a medida que creamos cada página. ¿Seguimos con el Bloque 2 (Login + Register)?
