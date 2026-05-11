require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const services = [
  {
    name: 'Auditoría Técnica Express',
    description: 'Análisis completo del estado SEO de tu web. Entrega de informe detallado en 48h con errores críticos, oportunidades y hoja de ruta priorizada.',
    price: 299,
    category: 'SEO',
    formConfig: {
      fields: [
        { name: 'websiteUrl', label: 'URL de tu sitio web', type: 'text', required: true },
        { name: 'competitors', label: 'Principales competidores (máx. 3)', type: 'textarea', required: false },
        {
          name: 'mainGoal', label: 'Objetivo principal', type: 'select', required: true,
          options: ['Aumentar tráfico orgánico', 'Mejorar posicionamiento', 'Recuperarme de penalización', 'Otro']
        }
      ]
    }
  },
  {
    name: 'Suscripción SEO Mensual',
    description: 'Plan recurrente de posicionamiento orgánico. Incluye 4 artículos optimizados al mes, optimización on-page continua e informe mensual de resultados.',
    price: 599,
    category: 'SEO',
    formConfig: {
      fields: [
        { name: 'websiteUrl', label: 'URL de tu sitio web', type: 'text', required: true },
        { name: 'targetKeywords', label: 'Palabras clave que te interesan', type: 'textarea', required: true },
        { name: 'niche', label: 'Sector o nicho de mercado', type: 'text', required: true },
        {
          name: 'contentTone', label: 'Tono del contenido', type: 'select', required: true,
          options: ['Profesional', 'Cercano', 'Técnico', 'Divulgativo']
        }
      ]
    }
  },
  {
    name: 'Pack 12 Reels/TikToks',
    description: 'Producción completa de 12 vídeos cortos para Instagram Reels y TikTok. Incluye guionización, edición y subtítulos. Entrega en 15 días.',
    price: 799,
    category: 'Contenidos',
    formConfig: {
      fields: [
        { name: 'sector', label: 'Sector o nicho de tu marca', type: 'text', required: true },
        {
          name: 'brandTone', label: 'Tono de marca', type: 'select', required: true,
          options: ['Divertido', 'Profesional', 'Inspiracional', 'Educativo']
        },
        {
          name: 'platforms', label: 'Plataformas objetivo', type: 'select', required: true,
          options: ['Solo Instagram', 'Solo TikTok', 'Ambas']
        },
        {
          name: 'hasOwnFootage', label: '¿Tienes material propio (fotos/vídeos)?', type: 'select', required: true,
          options: ['Sí, lo aportaré', 'No, necesito que lo produzcáis']
        }
      ]
    }
  },
  {
    name: 'Gestión de LinkedIn Authority',
    description: 'Construimos tu marca personal en LinkedIn para perfiles directivos. Publicación diaria, gestión de comentarios e informe mensual de alcance.',
    price: 450,
    category: 'Contenidos',
    formConfig: {
      fields: [
        { name: 'linkedinUrl', label: 'URL de tu perfil de LinkedIn', type: 'text', required: true },
        { name: 'jobTitle', label: 'Cargo e industria', type: 'text', required: true },
        {
          name: 'mainGoal', label: 'Objetivo principal', type: 'select', required: true,
          options: ['Networking', 'Generación de leads', 'Marca personal', 'Búsqueda de empleo']
        },
        { name: 'topics', label: 'Temas sobre los que te gustaría hablar', type: 'textarea', required: false }
      ]
    }
  },
  {
    name: 'Sesión de Producto E-commerce',
    description: 'Pack de 20 fotos de producto retocadas profesionalmente, listas para tu tienda online. Fondo blanco o lifestyle según necesidad.',
    price: 349,
    category: 'Fotografía',
    formConfig: {
      fields: [
        { name: 'productType', label: 'Tipo de producto', type: 'text', required: true },
        { name: 'productCount', label: 'Número de referencias distintas', type: 'number', required: true },
        {
          name: 'background', label: 'Tipo de fondo', type: 'select', required: true,
          options: ['Fondo blanco', 'Fondo lifestyle', 'Ambos']
        },
        { name: 'shippingAddress', label: 'Dirección de envío del producto', type: 'textarea', required: true }
      ]
    }
  },
  {
    name: 'Retrato Corporativo "Lifestyle"',
    description: 'Sesión fotográfica de equipo en entorno natural o de oficina. Ideal para webs, LinkedIn y comunicación interna. Incluye selección y retoque de fotos.',
    price: 599,
    category: 'Fotografía',
    formConfig: {
      fields: [
        { name: 'peopleCount', label: 'Número de personas a fotografiar', type: 'number', required: true },
        {
          name: 'location', label: 'Localización preferida', type: 'select', required: true,
          options: ['Vuestras oficinas', 'Exterior/ciudad', 'Estudio fotográfico', 'Me ayudáis a elegir']
        },
        {
          name: 'usage', label: 'Uso principal de las fotos', type: 'select', required: true,
          options: ['Web corporativa', 'LinkedIn', 'Comunicación interna', 'Varios']
        },
        { name: 'preferredDate', label: 'Fecha preferida', type: 'text', required: false }
      ]
    }
  },
  {
    name: 'Integración CRM + Email Marketing',
    description: 'Conexión automatizada entre tu CRM y herramienta de email marketing mediante n8n. Sincronización de contactos, segmentación y flujos automáticos.',
    price: 899,
    category: 'Automatización',
    formConfig: {
      fields: [
        {
          name: 'currentCrm', label: 'CRM actual', type: 'select', required: true,
          options: ['HubSpot', 'Salesforce', 'Pipedrive', 'Notion', 'Ninguno', 'Otro']
        },
        {
          name: 'emailTool', label: 'Herramienta de email marketing', type: 'select', required: true,
          options: ['Mailchimp', 'ActiveCampaign', 'Brevo', 'Klaviyo', 'Otro']
        },
        { name: 'contactVolume', label: 'Volumen aproximado de contactos', type: 'number', required: true },
        { name: 'automationGoal', label: 'Objetivo principal de la automatización', type: 'textarea', required: true }
      ]
    }
  },
  {
    name: 'Automatización de Facturación',
    description: 'Conectamos Stripe con tu software contable para generar y enviar facturas automáticamente. Sin trabajo manual, sin errores.',
    price: 1200,
    category: 'Automatización',
    formConfig: {
      fields: [
        {
          name: 'accountingSoftware', label: 'Software contable actual', type: 'select', required: true,
          options: ['Holded', 'Factusol', 'Sage', 'QuickBooks', 'Otro']
        },
        { name: 'monthlyInvoices', label: 'Volumen mensual de facturas aproximado', type: 'number', required: true },
        {
          name: 'hasStripe', label: '¿Tienes cuenta Stripe activa?', type: 'select', required: true,
          options: ['Sí', 'No, necesito crearla', 'Uso otra pasarela de pago']
        },
        { name: 'notes', label: 'Notas adicionales', type: 'textarea', required: false }
      ]
    }
  }
]

async function main() {
  console.log('Seeding services...')

  await prisma.service.deleteMany()

  const result = await prisma.service.createMany({ data: services })

  console.log(`Created ${result.count} services.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
