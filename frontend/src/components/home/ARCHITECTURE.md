# 📋 Swift Studio - Arquitectura Modular Escalable

## 🎯 Visión General

Esta es una **Plantilla Maestra Escalable** diseñada para la web de captación de Swift Studio. La arquitectura permite transposición a otros sectores (Inmobiliaria, Fintech, etc.) **sin tocar componentes React**.

---

## 📦 Dependencias Requeridas

### Instalación

```bash
# Instalar todas las dependencias
npm install
```

### Stack Técnico

| Dependencia      | Versión | Propósito               |
| ---------------- | ------- | ----------------------- |
| **React**        | ^19.2.5 | Framework UI            |
| **React DOM**    | ^19.2.5 | Renderizado DOM         |
| **React Router** | ^7.15.0 | Routing (subpáginas)    |
| **Vite**         | ^8.0.10 | Build tool y dev server |

### Comandos Principales

```bash
# Desarrollo local
npm run dev              # Inicia en http://localhost:5173

# Producción
npm run build            # Compila para producción
npm run preview          # Preview de la build
npm run lint             # Valida código con ESLint
```

**✅ No hay dependencias externas adicionales** - Todos los componentes usan CSS puro y React vanilla.

---

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── content.js                 # CORAZÓN: Datos centralizados (agnóstico de sector)
├── components/
│   └── home/
│       ├── Home.jsx               # Componente principal que ensambla todo
│       ├── HeroSection.jsx         # 1. Propuesta de valor + CTA
│       ├── SocialProof.jsx         # 2. Logos + Testimonios
│       ├── ServiceGrid.jsx         # 3. The Core (5 Pilares de servicios)
│       ├── EngineSection.jsx       # 4. The Engine (Diferenciación tecnológica)
│       ├── SEOAuthority.jsx        # 5. Autoridad + SEO Local
│       └── styles/
│           ├── Home.css            # Variables CSS globales + responsive
│           ├── HeroSection.css
│           ├── SocialProof.css
│           ├── ServiceGrid.css
│           ├── EngineSection.css
│           └── SEOAuthority.css
```

---

## 🔑 Principios Clave

### 1. **Data-Driven Architecture**

Todo el contenido viene de `src/config/content.js`. Los componentes son agnósticos de datos.

```javascript
// Para cambiar sector: solo edita content.js
export const SECTOR_CONFIG = {
  sector: "Marketing Digital",
  companyName: "Swift Studio",
  hero: { ... },
  services: { ... },
  // etc
}
```

### 2. **Componentes Reutilizables**

Cada componente acepta su configuración como prop:

```jsx
<HeroSection config={SECTOR_CONFIG.hero} />
<ServiceGrid config={SECTOR_CONFIG.services} />
<EngineSection config={SECTOR_CONFIG.engine} />
```

### 3. **Escalabilidad a Otros Sectores**

Para crear la web de una **Inmobiliaria**, solo necesitas:

```javascript
// 1. Crear src/config/realestate.js
export const REAL_ESTATE_CONFIG = {
  sector: "Inmobiliaria Digital",
  companyName: "Mi Inmobiliaria",
  hero: {
    valueProp: {
      headline: "Transforma tu Inmobiliaria en una Empresa Digital",
      // ... otros datos específicos
    },
  },
  services: {
    serviceCards: [
      { id: "property-photo", name: "Fotografía de Propiedades" },
      { id: "virtual-tour", name: "Tours Virtuales 3D" },
      { id: "seo-local", name: "Posicionamiento Local" },
      // etc
    ],
  },
  // ...
};

// 2. En Home.jsx:
import REAL_ESTATE_CONFIG from "../../config/realestate";

const Home = () => {
  return (
    <>
      <HeroSection config={REAL_ESTATE_CONFIG.hero} />
      <ServiceGrid config={REAL_ESTATE_CONFIG.services} />
      {/* ... */}
    </>
  );
};
```

---

## 📱 Componentes Implementados

### 1. **HeroSection** - Propuesta de Valor

- ✅ Background dinámico (video, imagen, gradiente)
- ✅ Headline + subheadline + descripción
- ✅ CTA primaria y secundaria
- ✅ Scroll indicator animado
- ✅ Animaciones fade-in en cascade

**Config:**

```javascript
hero: {
  valueProp: { headline, subheadline, description },
  cta: { primary: { text, link }, secondary: {...} },
  backgroundType: "video|image|gradient",
  backgroundUrl: "..."
}
```

---

### 2. **SocialProof** - Logos + Testimonios

- ✅ Grid de logos con hover effects
- ✅ Carrusel de testimonios con navegación
- ✅ Rating stars
- ✅ Control manual + automático (dots)

**Config:**

```javascript
socialProof: {
  title: "...",
  subtitle: "...",
  logos: [ { id, name, image, alt } ],
  testimonials: [ { id, quote, author, role, rating } ]
}
```

---

### 3. **ServiceGrid** - The Core (5 Pilares)

- ✅ Grid responsivo (3 columnas en desktop, 1 en mobile)
- ✅ Cards con color accent bar personalizado
- ✅ Icono + nombre + descripción corta/larga
- ✅ Lista de features expandible
- ✅ CTA link a subpágina de captación
- ✅ Hover effects elegantes

**Config:**

```javascript
services: {
  title: "The Core",
  subtitle: "...",
  serviceCards: [
    {
      id: "seo",
      name: "SEO & Posicionamiento",
      icon: "📊",
      shortDescription: "...",
      longDescription: "...",
      features: ["...", "..."],
      ctaText: "Conocer SEO",
      link: "/servicios/seo",
      color: "#FF6B6B"
    }
    // ... 4 servicios más
  ]
}
```

---

### 4. **EngineSection** - Diferenciación Tecnológica

- ✅ Background oscuro con patrón sutil
- ✅ Grid de 4 ventajas (Dashboard, Integraciones, IA, Equipo)
- ✅ Tabla comparativa (Agencia Tradicional vs Swift Studio)
- ✅ CTA principal hacia dashboard/ecommerce

**Config:**

```javascript
engine: {
  title: "The Engine",
  subtitle: "¿Qué nos diferencia?",
  description: "...",
  advantages: [ { id, title, description, icon } ],
  cta: { text, link }
}
```

---

### 5. **SEOAuthority** - Autoridad + Structured Data

- ✅ Grid de KPIs (150+ proyectos, 95% satisfacción, etc.)
- ✅ Párrafo optimizado para SEO Local
- ✅ Structured Data JSON-LD (LocalBusiness schema)
- ✅ CTA hacia consulta gratuita

**Config:**

```javascript
seoAuthority: {
  title: "Autoridad Digital para tu Negocio",
  subtitle: "...",
  keyStats: [ { metric, label } ],
  authorityContent: {
    mainText: "...",
    schemaType: "LocalBusiness"
  }
}
```

---

## 🎨 Sistema de Diseño (CSS)

### Variables Globales Centralizadas (Home.css)

```css
:root {
  /* Colors */
  --color-primary: #ff6b6b;
  --color-secondary: #4ecdc4;
  --color-accent: #ffe66d;

  /* Typography */
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-4xl: 64px;

  /* Spacing */
  --spacing-sm: 1rem;
  --spacing-lg: 2rem;
  --spacing-3xl: 6rem;

  /* Transitions */
  --transition-normal: 0.3s ease;
}
```

**Para cambiar tema a nivel global**, solo modifica `Home.css`.

### Responsive Design

Todos los componentes tienen breakpoints:

- **Desktop**: 1200px
- **Tablet**: 768px
- **Mobile**: 480px

---

## 🚀 Cómo Usar (Guía Rápida)

### 1. **Cambiar Contenido (Para Swift Studio)**

Edita `src/config/content.js`:

```javascript
export const SECTOR_CONFIG = {
  // Actualiza headline, descripción, servicios, etc.
  hero: {
    valueProp: {
      headline: "Tu nuevo headline aquí",
    },
  },
};
```

### 2. **Cambiar Colores**

En `src/components/home/styles/Home.css`:

```css
:root {
  --color-primary: #tu-color;
  --color-secondary: #otro-color;
}
```

### 3. **Agregar un Nuevo Servicio (The Core)**

En `src/config/content.js` → `services.serviceCards`:

```javascript
{
  id: "nuevo-servicio",
  name: "Mi Nuevo Servicio",
  icon: "🎯",
  shortDescription: "Descripción corta",
  features: ["Feature 1", "Feature 2"],
  link: "/servicios/nuevo-servicio",
  color: "#CUSTOM-COLOR"
}
```

### 4. **Para Otro Sector (Ej. Inmobiliaria)**

Crea `src/config/realestate.js` y reemplaza en Home.jsx.

---

## ✅ Características Implementadas

| Feature          | HeroSection | SocialProof | ServiceGrid | EngineSection | SEOAuthority |
| ---------------- | :---------: | :---------: | :---------: | :-----------: | :----------: |
| Responsive       |     ✅      |     ✅      |     ✅      |      ✅       |      ✅      |
| Animaciones      |     ✅      |     ✅      |     ✅      |      ✅       |      ❌      |
| SEO Optimizado   |     ✅      |     ❌      |     ✅      |      ❌       |      ✅      |
| Estructured Data |     ❌      |     ❌      |     ❌      |      ❌       |      ✅      |
| Data-Driven      |     ✅      |     ✅      |     ✅      |      ✅       |      ✅      |
| Accesibilidad    |     ✅      |     ✅      |     ✅      |      ✅       |      ✅      |

---

## 🔧 Próximos Pasos Recomendados

1. **Crear subpáginas de cada servicio**
   - `/servicios/seo` - Análisis profundo
   - `/servicios/social-media` - Casos de estudio
   - etc.

2. **Implementar formulario de contacto**
   - CTA "Solicitar Consulta Gratuita" → Modal/Página

3. **Integración con ecommerce**
   - Botones → https://ecommerce.swiftstudio.com

4. **Blog dinámico**
   - Artículos SEO desde CMS
   - Link en navbar

5. **Analytics & Tracking**
   - Google Analytics
   - Conversion tracking (Servicios, Dashboard)

---

## 📚 Estructura de Datos (content.js)

Formato escalable agnóstico de sector:

```javascript
SECTOR_CONFIG = {
  // Global
  sector: "string",
  companyName: "string",
  ecommerceUrl: "string",

  // Sections (7)
  hero: { valueProp, cta, backgroundType },
  socialProof: { title, logos, testimonials },
  services: { title, serviceCards[] },
  engine: { title, advantages[], cta },
  seoAuthority: { title, keyStats[], authorityContent },

  // Support
  navigation: { internal, external }
}
```

---

## 💡 Ventajas de Esta Arquitectura

✅ **Modular**: Cada sección es independiente  
✅ **Escalable**: Agregar servicios/testimonios sin tocar código  
✅ **Reutilizable**: Transposición a otros sectores en minutos  
✅ **Mantenible**: Cambios centralizados en content.js  
✅ **SEO-First**: Optimizado para posicionamiento  
✅ **Responsive**: Mobile-first design  
✅ **Performante**: CSS/JS optimizado sin dependencias pesadas

---

## 🎭 Ejemplo: Transposición a Inmobiliaria

```javascript
// config/realestate.js
export const REAL_ESTATE_CONFIG = {
  sector: "Inmobiliaria Digital",
  hero: {
    valueProp: {
      headline: "Vende más propiedades con Marketing Digital",
      subheadline: "Fotografía profesional + Tours 3D + Posicionamiento SEO"
    }
  },
  services: {
    serviceCards: [
      { id: "foto", name: "Fotografía de Propiedades", icon: "📸" },
      { id: "tour3d", name: "Tours Virtuales 3D", icon: "🎬" },
      { id: "seo", name: "Posicionamiento Local", icon: "📍" },
      { id: "publicidad", name: "Publicidad Digital", icon: "📱" },
      { id: "crm", name: "CRM + Automatización", icon: "⚙️" }
    ]
  }
}

// Home.jsx
<Home config={REAL_ESTATE_CONFIG} />
```

---

## 📞 Soporte

Para cambios específicos del cliente o nuevos sectores, edita `src/config/content.js` y verifica:

- [ ] Valores reemplazados correctamente
- [ ] Enlaces internos apuntan a rutas reales
- [ ] Imágenes existen en `/public`
- [ ] Responsive OK en móvil

---

**Creado para Swift Studio - Agencia 360º**  
_Plantilla escalable para dominar cualquier sector digital._
