/**
 * SECTOR CONFIG TEMPLATE
 * ========================
 * Copia este archivo para crear configuración de un NUEVO SECTOR
 *
 * Instrucciones:
 * 1. Duplica este archivo: src/config/nombre-sector.js
 * 2. Reemplaza valores en TODAS LAS SECCIONES
 * 3. Reemplaza en Home.jsx: import SECTOR_CONFIG from "../../config/nombre-sector"
 * 4. ¡Listo! Home funciona para el nuevo sector
 *
 * Variables a Personalizar (Global):
 * - sector: Tu nicho de negocio
 * - companyName: Nombre de la agencia/empresa
 * - industry: Industria
 * - ecommerceUrl: URL del dashboard/ecommerce
 */

export const NEW_SECTOR_CONFIG = {
  // =========================================
  // 1. CONFIGURACIÓN GLOBAL DEL SECTOR
  // =========================================
  sector: "Tu Sector Aquí",
  companyName: "Nombre de tu Empresa",
  industry: "Categoría Industrial",
  ecommerceUrl: "https://tu-ecommerce.com",

  // =========================================
  // 2. HERO SECTION
  // =========================================
  hero: {
    valueProp: {
      headline: "Tu propuesta de valor principal (máx 10 palabras)",
      subheadline: "Subtítulo que expande la propuesta (máx 15 palabras)",
      description:
        "Párrafo adicional con contexto. Explica beneficios principales de trabajar contigo.",
    },
    cta: {
      primary: {
        text: "Texto del botón principal",
        link: "/ruta-interna", // Internal link
      },
      secondary: {
        text: "Texto del botón secundario",
        link: "/ruta-secundaria",
      },
    },
    backgroundType: "video", // 'video', 'image', 'gradient'
    backgroundUrl: "/assets/tu-background.mp4", // URL de fondo
  },

  // =========================================
  // 3. SOCIAL PROOF
  // =========================================
  socialProof: {
    title: "Confían en Nosotros",
    subtitle: "Métrica de confianza (ej: 150+ clientes, 5 años)",

    logos: [
      {
        id: "client-1",
        name: "Nombre Cliente 1",
        image: "/assets/clients/logo-1.png",
        alt: "Logo Cliente 1",
      },
      {
        id: "client-2",
        name: "Nombre Cliente 2",
        image: "/assets/clients/logo-2.png",
        alt: "Logo Cliente 2",
      },
      // Agrega más logos (mínimo 4, máximo 6)
    ],

    testimonials: [
      {
        id: "test-1",
        quote:
          "Resultado medible y cuantificable que obtuvieron al trabajar contigo.",
        author: "Nombre de Persona Real",
        role: "Cargo/Empresa",
        rating: 5,
      },
      {
        id: "test-2",
        quote: "Otro testimonio con resultado específico.",
        author: "Otro Cliente",
        role: "Su Rol",
        rating: 5,
      },
      // Mínimo 3 testimonios, máximo 6
    ],
  },

  // =========================================
  // 4. GRID DE SERVICIOS (The Core - 5 Pilares)
  // =========================================
  services: {
    title: "The Core", // O personaliza: "Nuestros Servicios"
    subtitle: "Los pilares de tu transformación digital",
    description:
      "Cada servicio está diseñado para trabajar en sinergia y multiplicar resultados.",

    serviceCards: [
      {
        id: "servicio-1",
        name: "Nombre del Servicio 1",
        icon: "📊", // Emoji o SVG
        shortDescription: "Descripción corta del beneficio (máx 10 palabras)",
        longDescription:
          "Explicación más detallada de qué incluye este servicio y cómo funciona.",
        features: [
          "Feature 1 - Deliverable específico",
          "Feature 2 - Beneficio medible",
          "Feature 3 - Diferenciador clave",
          "Feature 4 - Otro valor agregado",
        ],
        ctaText: "Explorar Servicio",
        link: "/servicios/servicio-1",
        color: "#FF6B6B", // Color único para esta card
        learningPath: "/learn/servicio-1",
      },
      {
        id: "servicio-2",
        name: "Nombre del Servicio 2",
        icon: "🎯",
        shortDescription: "Descripción corta",
        longDescription:
          "Descripción larga detallada del servicio y cómo afecta al negocio.",
        features: [
          "Feature específico 1",
          "Feature específico 2",
          "Feature específico 3",
          "Feature específico 4",
        ],
        ctaText: "Conocer Más",
        link: "/servicios/servicio-2",
        color: "#4ECDC4",
        learningPath: "/learn/servicio-2",
      },
      {
        id: "servicio-3",
        name: "Nombre del Servicio 3",
        icon: "💡",
        shortDescription: "Descripción corta",
        longDescription: "Descripción larga.",
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
        ctaText: "Descubrir",
        link: "/servicios/servicio-3",
        color: "#FFE66D",
        learningPath: "/learn/servicio-3",
      },
      {
        id: "servicio-4",
        name: "Nombre del Servicio 4",
        icon: "🚀",
        shortDescription: "Descripción corta",
        longDescription: "Descripción larga.",
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
        ctaText: "Ver Detalles",
        link: "/servicios/servicio-4",
        color: "#95E1D3",
        learningPath: "/learn/servicio-4",
      },
      {
        id: "servicio-5",
        name: "Nombre del Servicio 5",
        icon: "⚙️",
        shortDescription: "Descripción corta",
        longDescription: "Descripción larga.",
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
        ctaText: "Explorar",
        link: "/servicios/servicio-5",
        color: "#A8E6CF",
        learningPath: "/learn/servicio-5",
      },
    ],
  },

  // =========================================
  // 5. THE ENGINE SECTION
  // =========================================
  engine: {
    title: "The Engine", // O: "La Diferencia"
    subtitle: "¿Qué nos diferencia de competidores tradicionales?",
    description: "Tu ventaja competitiva integrada con tecnología avanzada.",

    advantages: [
      {
        id: "adv-1",
        title: "Ventaja Tecnológica 1",
        description:
          "Explicación de cómo esta tecnología/proceso te ayuda a ganar.",
        icon: "🔧",
      },
      {
        id: "adv-2",
        title: "Ventaja Tecnológica 2",
        description: "Cómo integras sistemas existentes del cliente.",
        icon: "🔗",
      },
      {
        id: "adv-3",
        title: "Ventaja Tecnológica 3",
        description: "Optimización continua basada en datos/IA.",
        icon: "📈",
      },
      {
        id: "adv-4",
        title: "Ventaja Tecnológica 4",
        description: "Equipo especializado o metodología única.",
        icon: "👥",
      },
    ],

    cta: {
      text: "Acceder al Dashboard",
      link: "/dashboard", // Link al ecommerce
    },
  },

  // =========================================
  // 6. SEO LOCAL & AUTORIDAD
  // =========================================
  seoAuthority: {
    title: "Autoridad Digital en tu Sector",
    subtitle: "Posicionamiento + Trust + Conversión",

    keyStats: [
      {
        metric: "150+",
        label: "Proyectos Completados",
      },
      {
        metric: "95%",
        label: "Tasa de Satisfacción",
      },
      {
        metric: "6 Meses",
        label: "Tiempo a Resultados",
      },
      {
        metric: "300%",
        label: "ROI Promedio",
      },
    ],

    authorityContent: {
      mainText: `Tu empresa es especialista en [sector]. Somos el equipo que 
      combina [servicio1], [servicio2], [servicio3] y [servicio4]. 
      Trabajamos con empresas que buscan no solo creatividad, 
      sino resultados medibles y sostenibles en [métrica importante].`,

      schemaType: "LocalBusiness", // O "Organization", "ProfessionalService"
    },
  },

  // =========================================
  // 7. CONFIGURACIÓN FOOTER & NAVEGACIÓN
  // =========================================
  navigation: {
    internal: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/servicios" },
      { label: "Portafolio", href: "/portafolio" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
    ],
    external: [
      {
        label: "Dashboard",
        href: "https://tu-ecommerce.com",
        external: true,
      },
    ],
  },
};

export default NEW_SECTOR_CONFIG;

/**
 * CHECKLIST DE IMPLEMENTACIÓN
 * ============================
 *
 * ✅ Valores Globales:
 * [ ] sector
 * [ ] companyName
 * [ ] industry
 * [ ] ecommerceUrl
 *
 * ✅ Hero Section:
 * [ ] headline impactante
 * [ ] subheadline diferenciador
 * [ ] description con beneficios
 * [ ] CTA primary y secondary con links reales
 * [ ] background URL (video/imagen)
 *
 * ✅ Social Proof:
 * [ ] 4-6 logos de clientes reales
 * [ ] 3-6 testimonios con resultados cuantificables
 * [ ] Ratings de 4-5 estrellas
 *
 * ✅ Services (5 Pilares):
 * [ ] Nombres descriptivos de servicios
 * [ ] Iconos reconocibles (emoji o SVG)
 * [ ] Features con beneficios específicos
 * [ ] Links a subpáginas (/servicios/nombre)
 * [ ] Colores únicos para cada card
 *
 * ✅ Engine (Diferenciación):
 * [ ] 4 ventajas tecnológicas únicas
 * [ ] Comparación clara vs competencia
 * [ ] CTA hacia dashboard/ecommerce
 *
 * ✅ SEO Authority:
 * [ ] 4 KPIs realistas y verificables
 * [ ] Copy optimizado para SEO local
 * [ ] Schema.org type correcto
 *
 * ✅ Navigation:
 * [ ] Enlaces internos reales
 * [ ] Links a ecommerce actualizados
 *
 * NOTAS:
 * - Todos los links deben ser rutas reales
 * - Las imágenes deben estar en /public/assets/
 * - Mantén consistencia en tono y valores
 * - Verifica en mobile (768px y 480px)
 */
