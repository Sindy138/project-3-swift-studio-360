import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../config/api'
import styles from './Services.module.css'

const CATEGORY_COLORS = {
  SEO: '#3b82f6',
  Contenidos: '#4ECDC4',
  Fotografía: '#f59e0b',
  Automatización: '#a78bfa',
}

const CATEGORIES = ['Todos', 'SEO', 'Contenidos', 'Fotografía', 'Automatización']

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  useEffect(() => {
    apiFetch('/api/services')
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    activeCategory === 'Todos'
      ? services
      : services.filter((s) => s.category === activeCategory)

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Cargando servicios...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.error}>Error al cargar los servicios: {error}</div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Catálogo completo</p>
          <h1 className={styles.title}>Nuestros servicios</h1>
          <p className={styles.subtitle}>
            Elige el servicio que necesitas y cuéntanos tu proyecto. Nos ponemos en marcha en 24&nbsp;h.
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de servicios */}
        {filtered.length === 0 ? (
          <p className={styles.empty}>No hay servicios en esta categoría.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((service) => (
              <div key={service.id} className={styles.card}>
                <div
                  className={styles.categoryBar}
                  style={{ backgroundColor: CATEGORY_COLORS[service.category] || '#94a3b8' }}
                />
                <div className={styles.cardBody}>
                  <span
                    className={styles.badge}
                    style={{ color: CATEGORY_COLORS[service.category] || '#64748b' }}
                  >
                    {service.category}
                  </span>
                  <h2 className={styles.serviceName}>{service.name}</h2>
                  <p className={styles.serviceDesc}>{service.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>
                      {service.price.toLocaleString('es-ES')} €
                    </span>
                    <Link to={`/checkout/${service.id}`} className={styles.ctaBtn}>
                      Contratar →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Services
