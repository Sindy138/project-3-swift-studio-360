import React from "react";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/EngineSection.module.css";

/**
 * ENGINE SECTION - Diferenciación de Swift Studio
 * Explica cómo la tecnología + dashboard diferencia de agencias tradicionales
 * Sección visual y convincente
 */
const EngineSection = ({ config = SECTOR_CONFIG.engine }) => {
  const { title, subtitle, description, advantages, cta } = config;

  return (
    <section className={styles["engine-section"]} id="engine">
      <div className={styles["engine-container"]}>
        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-subtitle"]}>{subtitle}</p>
          <p className={styles["section-description"]}>{description}</p>
        </div>

        {/* Advantages Grid */}
        <div className={styles["advantages-grid"]}>
          {advantages.map((advantage) => (
            <div key={advantage.id} className={styles["advantage-card"]}>
              <div className={styles["advantage-icon"]}>{advantage.icon}</div>
              <h3 className={styles["advantage-title"]}>{advantage.title}</h3>
              <p className={styles["advantage-description"]}>
                {advantage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Divider - "Agencias Tradicionales vs Swift Studio" */}
        <div className={styles["comparison-section"]}>
          <h3 className={styles["comparison-title"]}>Comparación</h3>
          <div className={styles["comparison-table"]}>
            {/* Traditional */}
            <div
              className={`${styles["comparison-column"]} ${styles.traditional}`}
            >
              <h4>Agencia Tradicional</h4>
              <ul>
                <li>❌ Múltiples herramientas sin integración</li>
                <li>❌ Reportes manuales cada 15 días</li>
                <li>❌ Equipo disperso en especialidades</li>
                <li>❌ ROI difícil de medir</li>
                <li>❌ Procesos lentos y burocráticos</li>
              </ul>
            </div>

            {/* Swift Studio */}
            <div className={`${styles["comparison-column"]} ${styles.modern}`}>
              <h4>Swift Studio</h4>
              <ul>
                <li>✅ Dashboard centralizado en tiempo real</li>
                <li>✅ Datos live y automatización n8n</li>
                <li>✅ Equipo integrado + especialistas</li>
                <li>✅ ROI visible al día siguiente</li>
                <li>✅ Escalable y ágil</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className={styles["engine-cta-section"]}>
          <a
            href={cta.link}
            className={`${styles.btn} ${styles["btn-primary"]} ${styles["btn-lg"]}`}
          >
            {cta.text}
          </a>
          <p className={styles["cta-subtitle"]}>
            Acceso a tu panel de control y gestión de proyectos
          </p>
        </div>
      </div>
    </section>
  );
};

export default EngineSection;
