import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../config/api'
import styles from './Profile.module.css'

const Profile = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({ fullName: '', phone: '', companyName: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    apiFetch(`/api/users/${user.id}`)
      .then((data) => {
        setForm({
          fullName: data.profile?.fullName || '',
          phone: data.profile?.phone || '',
          companyName: data.profile?.companyName || '',
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSuccess(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await apiFetch(`/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <main className={styles.page}><div className={styles.loading}>Cargando perfil...</div></main>
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Cuenta</p>
          <h1 className={styles.title}>Mi perfil</h1>
        </div>

        <div className={styles.layout}>
          {/* Info de cuenta (solo lectura) */}
          <aside className={styles.accountCard}>
            <div className={styles.avatar}>
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <p className={styles.accountEmail}>{user.email}</p>
            <span className={styles.roleBadge}>{user.role === 'ADMIN' ? 'Admin' : 'Cliente'}</span>
          </aside>

          {/* Formulario de perfil */}
          <section className={styles.formCard}>
            <h2 className={styles.formTitle}>Datos de perfil</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>Nombre completo</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Tu nombre y apellidos"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>Teléfono</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="companyName" className={styles.label}>Empresa</label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nombre de tu empresa (opcional)"
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.successMsg}>✓ Perfil actualizado correctamente.</p>}

              <button type="submit" className={styles.btn} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Profile
