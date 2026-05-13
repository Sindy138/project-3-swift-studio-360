import { Link } from 'react-router-dom'
import styles from './OrderSuccess.module.css'

const OrderSuccess = () => {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>¡Pedido enviado!</h1>
        <p className={styles.message}>
          Hemos recibido tu solicitud. Nuestro equipo revisará los detalles
          y se pondrá en contacto contigo en menos de 24&nbsp;horas.
        </p>
        <div className={styles.actions}>
          <Link to="/dashboard" className={styles.btnPrimary}>
            Ver mis pedidos
          </Link>
          <Link to="/servicios" className={styles.btnSecondary}>
            Explorar más servicios
          </Link>
        </div>
      </div>
    </main>
  )
}

export default OrderSuccess
