import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import Home from './components/home/Home'
import './App.css'

// Páginas (se irán creando)
import Services from './pages/Services'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

const AppRoutes = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Catálogo */}
        <Route path="/servicios" element={<Services />} />

        {/* Checkout (protegido) */}
        <Route path="/checkout/:serviceId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/gracias" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

        {/* Área de cliente (protegida) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/pedido/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
