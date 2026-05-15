import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../config/api";
import styles from "./Dashboard.module.css";

const STATUS_LABEL = {
  PENDING: "Pendiente",
  PROGRESS: "En producción",
  DONE: "Completado",
};
const STATUS_CLASS = {
  PENDING: styles.badgePending,
  PROGRESS: styles.badgeProgress,
  DONE: styles.badgeDone,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/orders")
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PROGRESS",
  ).length;
  const doneCount = orders.filter((o) => o.status === "DONE").length;

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Cargando tu dashboard...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.error}>{error}</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Panel de cliente</p>
            <h1 className={styles.title}>
              Hola{user?.email ? ` ${user.email.split("@")[0]}` : ""}
            </h1>
          </div>
          <Link to="/perfil" className={styles.profileLink}>
            Mi perfil →
          </Link>
        </div>

        {/* Contadores */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{activeCount}</span>
            <span className={styles.statLabel}>Servicios activos</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{doneCount}</span>
            <span className={styles.statLabel}>Completados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{orders.length}</span>
            <span className={styles.statLabel}>Total pedidos</span>
          </div>
        </div>

        {/* Lista de pedidos */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mis proyectos</h2>
            <Link to="/servicios" className={styles.newOrderBtn}>
              + Nuevo servicio
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className={styles.empty}>
              <p>Todavía no tienes ningún pedido.</p>
              <Link to="/servicios" className={styles.emptyLink}>
                Explorar servicios →
              </Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/dashboard/pedido/${order.id}`}
                  className={styles.orderCard}
                >
                  <div className={styles.orderInfo}>
                    <span
                      className={`${styles.badge} ${STATUS_CLASS[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                    <h3 className={styles.orderName}>{order.service?.name}</h3>
                    <p className={styles.orderMeta}>
                      {order.service?.category} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={styles.orderPrice}>
                      {order.total.toLocaleString("es-ES")} €
                    </span>
                    <span className={styles.orderArrow}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
