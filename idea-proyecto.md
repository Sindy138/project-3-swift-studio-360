IDEA - AGENCIA DE MARKETING DIGITAL SWIFT STUDIO 360
La aplicacion web Swift Studio 360º es una ecommerce de servicios de mk digital. Cuenta con login para usuarios, dashboard de cliente, compra de servicios, check out y pagina de gracias (bonus automatizacion de correo al mail).

A continuación se describen los servicios, flujo de usuario

1. El Catálogo de Servicios (Suficientes para la DB)
   Para que no parezca un proyecto vacío, estos son los servicios que cargaremos en la tabla Services:
   Vertical SEO:
   Auditoría Técnica Express: Pago único, entrega en 48h.
   Suscripción SEO Mensual: Recurrente, incluye 4 artículos y optimización on-page.
   Vertical Contenidos/Social:
   Pack 12 Reels/TikToks: Incluye guionización y edición.
   Gestión de LinkedIn Authority: Para perfiles directivos.
   Vertical Fotografía (Tu especialidad):
   Sesión de Producto E-commerce: Pack de 20 fotos retocadas.
   Retrato Corporativo "Lifestyle": Para equipos de trabajo.
   Vertical Automatización (The Engine):
   Integración CRM + Email Marketing: Conexión vía n8n.
   Automatización de Facturación: Conexión Stripe con software contable.

2. Flujo de Usuario (Pasos del Frontend)
   Este flujo define qué endpoints vas a necesitar en el backend:
   Exploración: El usuario ve el grid de servicios (GET /services).
   Configuración: Al elegir uno, rellena el formulario dinámico. Estos datos se guardarán como un JSON en la tabla de pedidos.
   Auth/Login: Si no está logueado, el sistema le obliga a registrarse (POST /auth/register) o entrar (POST /auth/login) para asociar el pedido a su userId.
   Checkout: Se envía el pedido (POST /orders). El backend crea la orden y, bonus, dispara el webhook hacia n8n.
   Confirmación: El usuario aterriza en una página de "Éxito" y es redirigido a su Dashboard.

3. El Dashboard de Cliente (Vistas y Componentes)
   Esto es lo que debe "pintar" tu React consumiendo la API:
   Resumen de Actividad: Un contador de "Servicios Activos" y "Entregas Pendientes".
   Lista de Proyectos (Cards):
   Título del Servicio.
   Estado (Badge): "Pendiente", "En producción", "Revisión cliente", "Completado".
   Fecha de contratación.
   Detalle del Proyecto (Modal o Página):
   Timeline: Un histórico de lo que ha pasado (Pedido recibido -> Asignado -> En proceso).
   Sección de Entregables: Una lista de enlaces (URL de Google Drive, Dropbox, Notion) que el Admin habrá subido desde su panel.
