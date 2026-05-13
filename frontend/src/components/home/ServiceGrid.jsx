import React from "react";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/ServiceGrid.module.css";

/**
 * SERVICE GRID - The Core (5 Pilares)
 * Grid de servicios con cards interactivas
 * Cada card dirige a una subpágina de captación
 * Escalable: Cambiar cantidad de servicios en config
 */
const ServiceGrid = ({ config = SECTOR_CONFIG.services }) => {
  const { title, subtitle, description, serviceCards } = config;

  return (
    <section className={styles["services-section"]} id="services">
      <div className={styles["services-container"]}>
        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-subtitle"]}>{subtitle}</p>
          <p className={styles["section-description"]}>{description}</p>
        </div>

        {/* Services Grid */}
        <div className={styles["services-grid"]}>
          {serviceCards.map((service) => (
            <div key={service.id} className={styles["service-card"]}>
              {/* Color accent bar */}
              <div
                className={styles["color-accent"]}
                style={{ backgroundColor: service.color }}
              ></div>

              {/* Card content */}
              <div className={styles["card-content"]}>
                <div className={styles["service-icon"]}>{service.icon}</div>
                <h3 className={styles["service-name"]}>{service.name}</h3>
                <p className={styles["service-short"]}>
                  {service.shortDescription}
                </p>
                <p className={styles["service-long"]}>
                  {service.longDescription}
                </p>

                {/* Features list */}
                <ul className={styles["service-features"]}>
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className={styles["feature-check"]}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a href={service.link} className={styles["service-cta"]}>
                  {service.ctaText}
                  <span className={styles.arrow}>→</span>
                </a>
              </div>

              {/* Hover effect overlay */}
              <div className={styles["card-hover-overlay"]}></div>
            </div>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className={styles["services-cta-section"]}>
          <h3>¿Quieres conocer todos los detalles?</h3>
          <a
            href="/servicios"
            className={`${styles.btn} ${styles["btn-secondary"]}`}
          >
            Explorar Todos los Servicios
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
