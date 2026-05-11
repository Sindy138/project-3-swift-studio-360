# Project 3 Brief | Aplicación Full-Stack con React y Node.js

## Descripción general

El proyecto midterm es la culminación del bootcamp hasta este momento. Deberás construir una aplicación web completa conectando el frontend React (semanas 1-5) con el backend Node.js/Express/PostgreSQL (semanas 6-7).

La aplicación debe ser funcional, desplegada, y defendible: en la presentación del proyecto explicarás tus decisiones técnicas y harás una demo en vivo.

---

## Requisitos técnicos obligatorios

### Backend (Node.js + Express + PostgreSQL)
- API REST con al menos 4 recursos principales
- Autenticación JWT (registro, login, rutas protegidas)
- Roles de usuario (al menos usuario normal y admin)
- Base de datos PostgreSQL con al menos 4 tablas relacionadas
- Prisma ORM para el acceso a datos
- Validaciones en todos los endpoints que reciben datos
- Manejo de errores centralizado con códigos HTTP apropiados
- Variables de entorno para configuración sensible
- BONUS: Al menos 1 integración externa (n8n, webhook, email, etc.)

### BONUS: Frontend (React)
- React 18+ con Vite
- React Router v6 con al menos 4 rutas
- Conexión a tu API con fetch o axios
- Context API para estado global (usuario autenticado, como mínimo)
- Formularios controlados con validación en el cliente
- Manejo de estados: loading, error, datos vacíos
- Diseño responsive (mobile y desktop)
- CSS Modules para los estilos

### Testing
- Al menos 8 tests (unitarios y/o de integración)
- Los tests pasan todos (npm test)

### Despliegue
- Backend desplegado (Railway, Render, o similar)
- BONUS Frontend desplegado (Netlify, Vercel, o similar)
- Base de datos en la nube (Railway PostgreSQL, Supabase, etc.)
- Las dos aplicaciones se comunican en producción

---

## Arquitectura recomendada

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                  │
│                                                     │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │  Auth   │  │  Pages   │  │    Context API  │   │
│  │ Context │  │ + Router │  │  (usuario, etc) │   │
│  └────┬────┘  └────┬─────┘  └────────┬────────┘   │
│       └────────────┼─────────────────┘             │
│                    │ fetch/axios                    │
└────────────────────┼────────────────────────────────┘
                     │ HTTPS (JWT en header)
                     │
┌────────────────────┼────────────────────────────────┐
│              BACKEND (Node.js + Express)            │
│                    │                                │
│  ┌─────────────────▼─────────────────────────────┐ │
│  │                 Routes                        │ │
│  └─────────────────┬─────────────────────────────┘ │
│  ┌─────────────────▼─────────────────────────────┐ │
│  │   Middleware: Auth, Validation, Error Handler  │ │
│  └─────────────────┬─────────────────────────────┘ │
│  ┌─────────────────▼─────────────────────────────┐ │
│  │              Controllers                      │ │
│  └─────────────────┬─────────────────────────────┘ │
│  ┌─────────────────▼─────────────────────────────┐ │
│  │           Prisma Client (ORM)                 │ │
│  └─────────────────┬─────────────────────────────┘ │
└────────────────────┼────────────────────────────────┘
                     │ SQL
                     │
┌────────────────────┼────────────────────────────────┐
│              PostgreSQL Database                    │
│                                                     │
│   usuarios │ recursos │ relaciones │ ...            │
└─────────────────────────────────────────────────────┘
```

---

## Estructura de repositorios

Puedes estructurarlo como monorepo (recomendado) o repositorios separados:

### Monorepo
```
mi-proyecto-midterm/
├── frontend/              # React app (Vite)
│   ├── src/
│   ├── package.json
│   └── .env
├── backend/               # Express API
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

---

## Comunicación Frontend ↔ Backend

### Configuración de la URL de la API en React

```js
// frontend/src/config/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default API_URL
```

```env
# frontend/.env
VITE_API_URL=http://localhost:3000

# frontend/.env.production
VITE_API_URL=https://mi-api.railway.app
```

### Hook personalizado para autenticación

```jsx
// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Recuperar token al recargar la página
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')

    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setCargando(false)
  }, [])

  const login = (datosUsuario, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))
    setUsuario(datosUsuario)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

```js
// frontend/src/hooks/useApi.js
import { useState } from 'react'
import API_URL from '../config/api'

export const useApi = () => {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const peticion = async (endpoint, opciones = {}) => {
    setCargando(true)
    setError(null)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        ...opciones
      })

      const datos = await res.json()

      if (!res.ok) {
        throw new Error(datos.error || 'Error en la petición')
      }

      return datos
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setCargando(false)
    }
  }

  return { peticion, cargando, error }
}
```

---

## Criterios de evaluación

### Funcionalidad (35%)
- La aplicación funciona end-to-end (frontend conectado con backend real)
- La autenticación funciona (registro, login, sesión persistente)
- El CRUD principal está completo
- La autorización funciona (no puedes borrar recursos ajenos)
- Está desplegada y accesible en URLs públicas

### Calidad técnica del backend (25%)
- Separación de responsabilidades (routes/controllers/services)
- Prisma usado correctamente (relaciones, filtros, paginación)
- Validaciones robustas en todos los endpoints
- Manejo de errores con códigos HTTP apropiados
- Tests que pasan

### Calidad técnica del frontend (20%)
- Componentes bien organizados
- Estado gestionado con Context
- Estados de loading/error implementados
- Diseño responsive
- Formularios con validación

### Presentación (20%)
- Demo en vivo sin errores graves
- Explica la arquitectura de tu proyecto
- Defiende tus decisiones técnicas
- Menciona qué mejorarías con más tiempo
- README claro con instrucciones de instalación

---

## Plan de trabajo sugerido (5 días)

### Día 1: Planificación y setup
- Elegir opción de proyecto y definir alcance
- Diseñar el modelo de datos (tablas y relaciones)
- Crear repositorio/s y configurar entorno
- Crear schema de Prisma y ejecutar primera migración
- Implementar autenticación (registro + login)
- Crear la estructura básica del frontend con React Router

### Día 2: Backend - Core features
- Implementar los endpoints principales del CRUD
- Middleware de autenticación y roles
- Validaciones y manejo de errores
- Datos de seed para desarrollo
- Tests para los endpoints principales

### Día 3: Frontend - UI y conexión con API
- Páginas principales: Home, Login, Registro
- Página de lista y detalle del recurso principal
- Formularios de creación/edición
- Integración con la API (fetch con token)
- Context para el usuario autenticado

### Día 4: Integración y pulido
- Integración externa (n8n webhook, email, etc.)
- Mejorar el diseño responsive
- Rutas protegidas en el frontend
- Manejo de errores en el frontend (loading, empty states)
- Tests adicionales

### Día 5: Despliegue y presentación
- Desplegar el backend (Railway/Render)
- Configurar la base de datos en la nube
- Desplegar el frontend (Netlify/Vercel)
- Configurar variables de entorno en producción
- Verificar que todo funciona en producción
- Preparar la presentación (5-7 minutos)

---

## Estructura de la presentación (7 minutos)

1. **Introducción (1 min):** ¿Qué es tu aplicación? ¿A qué problema responde?
2. **Demo en vivo (3 min):** flujo completo de usuario (registro → login → usar la app)
3. **Arquitectura técnica (2 min):** muestra el schema de Prisma, una ruta del backend, un componente del frontend
4. **Reflexión (1 min):** mayor reto encontrado + qué mejorarías con más tiempo

---

## Recursos útiles

- [Railway](https://railway.app) — Despliegue de Node.js + PostgreSQL gratis
- [Render](https://render.com) — Alternativa a Railway
- [Netlify](https://netlify.com) — Despliegue de React
- [Vercel](https://vercel.com) — Alternativa a Netlify
- [Supabase](https://supabase.com) — PostgreSQL en la nube con interfaz visual
- [Prisma Docs](https://www.prisma.io/docs) — Documentación oficial de Prisma
- [JWT.io](https://jwt.io) — Decodificador de JWT para debug

---

## Checklist final antes de la presentación

### Backend
- [ ] `npm run dev` funciona sin errores
- [ ] Todas las rutas responden correctamente en Postman/Thunder Client
- [ ] `npm test` → todos los tests pasan
- [ ] `.env` con todas las variables necesarias
- [ ] API desplegada y accesible

### Frontend
- [ ] `npm run dev` funciona sin errores en consola
- [ ] Login y registro funcionan contra la API desplegada
- [ ] El CRUD principal funciona de extremo a extremo
- [ ] El diseño es responsive (prueba en móvil)
- [ ] Frontend desplegado y accesible

### General
- [ ] README con: descripción, instrucciones de instalación, lista de endpoints
- [ ] `.gitignore` incluye `node_modules` y `.env`
- [ ] Las contraseñas NO están en el código fuente
- [ ] Demo preparada y probada el día antes
