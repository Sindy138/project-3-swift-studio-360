import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from '../config/api'
import styles from './OrderDetail.module.css'

const STATUS_LABEL = { PENDING: 'Pendiente', PROGRESS: 'En producción', DONE: 'Completado' }
const STATUS_CLASS = { PENDING: styles.badgePending, PROGRESS: styles.badgeProgress, DONE: styles.badgeDone }

const TIMELINE = [
  { key: 'received',    label: 'Pedido recibido',     active: () => true },
  { key: 'assigned',   label: 'Asignado al equipo',   active: (s) => s === 'PROGRESS' || s === 'DONE' },
  { key: 'production', label: 'En producción',         active: (s) => s === 'PROGRESS' || s === 'DONE' },
  { key: 'done',       label: 'Entregado',             active: (s) => s === 'DONE' },
]

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(`/api/orders/${id}`)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <main className={styles.page}><div className={styles.loading}>Cargando pedido...</div></main>
  }

  if (error) {
    return <main className={styles.page}><div className={styles.error}>{error}</div></main>
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Back */}
        <Link to="/dashboard" className={styles.back}>← Volver al dashboard</Link>

        {/* Header del pedido */}
        <div className={styles.header}>
          <div>
            <p className={styles.category}>{order.service?.category}</p>
            <h1 className={styles.title}>{order.service?.name}</h1>
          </div>
          <div className={styles.headerRight}>
            <span className={`${styles.badge} ${STATUS_CLASS[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
            <span className={styles.price}>{order.total.toLocaleString('es-ES')} €</span>
          </div>
        </div>

        <p className={styles.date}>
          Contratado el {new Date(order.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className={styles.layout}>

          {/* Timeline */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Estado del proyecto</h2>
            <ol className={styles.timeline}>
              {TIMELINE.map((step, i) => {
                const isActive = step.active(order.status)
                return (
                  <li key={step.key} className={`${styles.step} ${isActive ? styles.stepDone : ''}`}>
                    <span className={styles.stepDot}>{isActive ? '✓' : i + 1}</span>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </li>
                )
              })}
            </ol>
          </section>

          {/* Entregables */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Entregables</h2>
            {order.deliverables?.length === 0 ? (
              <p className={styles.empty}>
                Todavía no hay entregables. Te avisaremos cuando estén listos.
              </p>
            ) : (
              <ul className={styles.deliverablesList}>
                {order.deliverables.map((d) => (
                  <li key={d.id} className={styles.deliverable}>
                    <span className={styles.deliverableIcon}>📎</span>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.deliverableLink}
                    >
                      {d.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Datos del formulario */}
        {order.configData && Object.keys(order.configData).length > 0 && (
          <section className={`${styles.card} ${styles.configCard}`}>
            <h2 className={styles.cardTitle}>Datos aportados</h2>
            <dl className={styles.configList}>
              {Object.entries(order.configData).map(([key, val]) => (
                val ? (
                  <div key={key} className={styles.configItem}>
                    <dt className={styles.configKey}>{key}</dt>
                    <dd className={styles.configVal}>{val}</dd>
                  </div>
                ) : null
              ))}
            </dl>
          </section>
        )}
      </div>
    </main>
  )
}

export default OrderDetail
