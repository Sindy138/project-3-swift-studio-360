import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiFetch } from '../config/api'
import styles from './Checkout.module.css'

const DynamicField = ({ field, value, onChange }) => {
  const { name, label, type, required, options } = field

  const props = {
    id: name,
    name,
    required,
    value: value ?? '',
    onChange: (e) => onChange(name, e.target.value),
    className: styles.input,
    placeholder: required ? 'Requerido' : 'Opcional',
  }

  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {type === 'textarea' && <textarea {...props} rows={3} className={styles.textarea} />}
      {type === 'select' && (
        <select {...props} className={styles.select}>
          <option value="">Selecciona una opción...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {(type === 'text' || type === 'number') && (
        <input {...props} type={type} />
      )}
    </div>
  )
}

const Checkout = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    apiFetch(`/api/services/${serviceId}`)
      .then((s) => {
        setService(s)
        const initial = {}
        s.formConfig.fields.forEach((f) => { initial[f.name] = '' })
        setFormData(initial)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [serviceId])

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSubmitError('')
  }

  const validate = () => {
    for (const field of service.formConfig.fields) {
      if (field.required && !formData[field.name]?.trim()) {
        return `El campo "${field.label}" es obligatorio.`
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setSubmitting(true)
    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ serviceId, configData: formData }),
      })
      navigate('/gracias')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <main className={styles.page}><div className={styles.loading}>Cargando...</div></main>
  }

  if (error) {
    return <main className={styles.page}><div className={styles.error}>{error}</div></main>
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>

          {/* Panel izquierdo — resumen del servicio */}
          <aside className={styles.summary}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryEyebrow}>{service.category}</p>
              <h2 className={styles.summaryName}>{service.name}</h2>
              <p className={styles.summaryDesc}>{service.description}</p>
              <div className={styles.summaryPrice}>
                <span className={styles.priceLabel}>Total</span>
                <span className={styles.priceAmount}>
                  {service.price.toLocaleString('es-ES')} €
                </span>
              </div>
              <ul className={styles.summaryNotes}>
                <li>✓ Sin permanencia</li>
                <li>✓ Nos ponemos en contacto en 24&nbsp;h</li>
                <li>✓ Pago tras confirmación de proyecto</li>
              </ul>
            </div>
          </aside>

          {/* Panel derecho — formulario dinámico */}
          <section className={styles.formSection}>
            <h1 className={styles.formTitle}>Cuéntanos tu proyecto</h1>
            <p className={styles.formSubtitle}>
              Rellena los datos y te contactamos para arrancar.
            </p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {service.formConfig.fields.map((field) => (
                <DynamicField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleFieldChange}
                />
              ))}

              {submitError && <p className={styles.error}>{submitError}</p>}

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Enviando pedido...' : 'Enviar pedido →'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Checkout
