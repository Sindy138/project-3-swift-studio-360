/**
 * PLANTILLA MAESTRA ESCALABLE - Swift Studio
 * Este archivo es el "corazón" modular del contenido.
 * Estructura agnóstica de sector para permitir transposición a Inmobiliaria, Fintech, etc.
 *
 * Uso: Reemplaza valores de {sector} y servicios sin tocar componentes
 */

export const SECTOR_CONFIG = {
  // =========================================
  // 1. CONFIGURACIÓN GLOBAL DEL SECTOR
  // =========================================
  sector: "Marketing Digital & Agencia 360º",
  companyName: "Swift Studio",
  industry: "Agencia Digital",
  ecommerceUrl: "https://ecommerce.swiftstudio.com", // Será variable

  // =========================================
  // 2. HERO SECTION
  // =========================================

  hero: {
    valueProp: {
      headline:
        "Servicios de Marketing y Contenido potenciados por Automatización Avanzada",
      subheadline:
        "Transformamos tu Marketing en un Sistema Automatizado y Medible",
      /*description:
        "Somos la agencia que combina creatividad humana con poder de automatización. 5 servicios integrados. 1 sistema. Infinitas posibilidades.",
      */
    },
    cta: {
      primary: {
        text: "Explorar Servicios",
        link: "/servicios", // Link interno
      },
      secondary: {
        text: "Ver Demo",
        link: "/demo",
      },
    },
    backgroundType: "video", // 'video', 'image', 'gradient'
    backgroundUrl: "/assets/hero-bg.mp4",
  },

  // =========================================
  // 3. SOCIAL PROOF (Logos + Testimonios)
  // =========================================
  socialProof: {
    title: "Más de 150 proyectos completados y clientes satisfechos",
    subtitle: "Confían en nosotros:",

    logos: [
      {
        id: "client-1",
        name: "Cliente 1",
        image: "/logos/airbnb-logo.svg",
        alt: "Logo cliente 1",
      },
      {
        id: "client-2",
        name: "Cliente 2",
        image: "/logos/amazon-logo.svg",
        alt: "Logo cliente 2",
      },
      {
        id: "client-3",
        name: "Cliente 3",
        image: "/logos/google-logo.svg",
        alt: "Logo cliente 3",
      },
      {
        id: "client-4",
        name: "Cliente 4",
        image: "/logos/fedex-logo.svg",
        alt: "Logo cliente 4",
      },
    ],

    testimonials: [
      {
        id: "testimonial-1",
        quote:
          "Swift Studio transformó nuestro flujo de marketing. Resultado: 3x más leads en 6 meses.",
        author: "Juan Pérez",
        role: "CEO, TechCorp",
        rating: 5,
      },
      {
        id: "testimonial-2",
        quote:
          "La automatización que implementaron nos ahorraba 40 horas mensuales. Impresionante ROI.",
        author: "María García",
        role: "Marketing Manager, RetailPro",
        rating: 5,
      },
      {
        id: "testimonial-3",
        quote: "El mejor equipo en creatividad + datos que hemos contratado.",
        author: "Carlos López",
        role: "Founder, StartupX",
        rating: 5,
      },
      {
        id: "testimonial-4",
        quote:
          "Nuestra campaña superó todas las expectativas gracias a Swift Studio. Profesionalidad y resultados reales.",
        author: "Ana Martínez",
        role: "Directora de Marketing, EduTech Solutions",
        rating: 5,
      },
    ],
  },

  // =========================================
  // 4. GRID DE SERVICIOS (The Core - 5 Pilares)
  // =========================================
  services: {
    title: "Los 5 Pilares que Transforman tu Negocio",
    subtitle:
      "Cada servicio está optimizado para trabajar en sinergia. Tu visión es nuestro poder de ejecución.",
    // description:"Cada servicio está optimizado para trabajar en sinergia. Tu visión. Nuestro poder de ejecución.",

    serviceCards: [
      {
        id: "seo",
        name: "SEO & Posicionamiento",
        image: "/services/seo-score.svg",
        shortDescription: "Domina la primera página de Google",
        longDescription:
          "Estrategia integral SEO técnico, contenido y link building para autoridad digital.",
        features: [
          "Auditoría técnica completa",
          "Estrategia de palabras clave",
          "Contenido optimizado",
          "Link building ético",
        ],
        ctaText: "Conocer SEO",
        link: "/servicios/seo",
        color: "#FF6B6B", // Color para diferenciación visual
        learningPath: "/learn/seo", // Subpágina de captación
      },
      {
        id: "social",
        name: "Social Media",
        image: "/services/social-media.svg",
        shortDescription: "Community. Engagement. Sales.",
        longDescription:
          "Estrategia de redes sociales integrada con automatización y análisis de datos.",
        features: [
          "Calendario de contenidos",
          "Gestión de comunidad",
          "Automatización de posts",
          "Análisis y reportes",
        ],
        ctaText: "Explorar Social",
        link: "/servicios/social-media",
        color: "#4ECDC4",
        learningPath: "/learn/social-media",
      },
      {
        id: "fotografia",
        name: "Fotografía Profesional",
        image: "/services/photo-session.svg",
        shortDescription: "Storytelling. Historias visuales que venden",
        longDescription:
          "Sesiones fotográficas profesionales para productos, eventos y corporate.",
        features: [
          "Sesiones en estudio",
          "Fotografía de productos",
          "Cobertura de eventos",
          "Retoque profesional",
        ],
        ctaText: "Ver Portafolio",
        link: "/servicios/fotografia",
        color: "#FFE66D",
        learningPath: "/learn/fotografia",
      },
      {
        id: "blogs",
        name: "Content & Blogs",
        image: "/services/content-seo.svg",
        shortDescription: "Contenido que atrae y convierte",
        longDescription:
          "Estrategia de contenido integrada: blogs, whitepapers, casos de estudio.",
        features: [
          "Investigación y estrategia",
          "Redacción SEO",
          "Edición y diseño",
          "Distribución multicanal",
        ],
        ctaText: "Leer Blog",
        link: "/servicios/content",
        color: "#95E1D3",
        learningPath: "/learn/content",
      },
      {
        id: "automatizacion",
        name: "Automation n8n",
        image: "/services/automation.svg",
        shortDescription: "Tu agencia funcionando en 24/7",
        longDescription:
          "Flujos de trabajo automatizados que integran todos tus sistemas y herramientas.",
        features: [
          "Integración de CRM",
          "Automatización de leads",
          "Sincronización de datos",
          "Workflows personalizados",
        ],
        ctaText: "Ver Automatizaciones",
        link: "/servicios/automatizacion",
        color: "#A8E6CF",
        learningPath: "/learn/automatizacion",
      },
    ],
  },

  // =========================================
  // 5. THE ENGINE SECTION
  // =========================================
  engine: {
    title: "¿Qué nos diferencia de una agencia tradicional?",
    /*subtitle: "¿Qué nos diferencia de una agencia tradicional?",*/
    description:
      "Agencias 360º + Automatización Avanzada = Resultados Exponenciales",

    advantages: [
      {
        id: "advantage-4",
        title: "Equipo Especializado",
        description:
          "SEO Experts, Fotógrafos, Content Writers y Automation Engineers. Todo integrado.",
        visual: "/engine/engine.gif",
      },
      /*
      {
        id: "advantage-1",
        title: "Dashboard Propio",
        description:
          "Panel centralizado para monitorear todos tus servicios en tiempo real. ROI visible.",
        icon: "📈",
      },
      */
      {
        id: "advantage-2",
        title: "Integraciones n8n",
        description:
          "Conecta todos tus sistemas. CRM, Email, Analytics, Social. Sin duplicar trabajo.",
        visual: "/engine/engine.gif",
      },
      {
        id: "advantage-3",
        title: "Optimización Continua",
        description:
          "Machine learning y análisis de datos para mejora permanente. No solo ejecución.",
        visual: "/engine/engine.gif",
      },
    ],

    cta: {
      text: "Acceder al Dashboard",
      link: "/dashboard", // Será el ecommerce
    },
  },

  // =========================================
  // 6. SEO LOCAL & AUTORIDAD
  // =========================================
  seoAuthority: {
    title: "Autoridad Digital para tu Negocio",
    subtitle: "Posicionamiento Orgánico + Brand Trust",

    keyStats: [
      {
        metric: "150+",
        label: "Proyectos Completados",
      },
      {
        metric: "99%",
        label: "Satisfacción de Clientes",
      },
      {
        metric: "6",
        label: "Meses, resultados",
      },
      {
        metric: "300%",
        label: "ROI promedio",
      },
    ],

    authorityContent: {
      mainText: `Swift Studio es una agencia digital especializada en Marketing 360º y Automatización. 
      Nuestro enfoque integrado combina fotografía profesional, estrategia SEO, content marketing, 
      gestión de redes sociales y automatización avanzada con n8n.
      
      Trabajamos con empresas que buscan no solo creatividad, sino resultados medibles y sostenibles.`,

      schemaType: "LocalBusiness", // Para structured data
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
        href: "https://ecommerce.swiftstudio.com",
        external: true,
      },
    ],
  },
};

export default SECTOR_CONFIG;
