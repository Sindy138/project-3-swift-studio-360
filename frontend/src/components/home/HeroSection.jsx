import React from "react";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/HeroSection.module.css";

/**
 * HERO SECTION - Propuesta de valor + CTA principal
 * Componente reutilizable: Recibe config de contenido
 * Escalable: Cambiar SECTOR_CONFIG para otros sectores
 */
const HeroSection = ({ config = SECTOR_CONFIG.hero }) => {
  const { valueProp, cta, backgroundType, backgroundUrl } = config;

  return (
    <section className={styles["hero-section"]} id="hero">
      {/* Background dinámico */}
      {backgroundType === "video" && (
        <video className={styles["hero-background"]} autoPlay muted loop>
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      )}
      {backgroundType === "image" && (
        <img
          src={backgroundUrl}
          alt="Background"
          className={styles["hero-background"]}
        />
      )}

      {/* Overlay para mejor legibilidad */}
      <div className={styles["hero-overlay"]}></div>

      {/* Contenido principal */}
      <div className={styles["hero-content"]}>
        <div className={styles["hero-container"]}>
          <h1 className={styles["hero-headline"]}>{valueProp.headline}</h1>
          <p className={styles["hero-subheadline"]}>{valueProp.subheadline}</p>
          <p className={styles["hero-description"]}>{valueProp.description}</p>

          {/* CTA Buttons */}
          <div className={styles["hero-cta-group"]}>
            <a
              href={cta.primary.link}
              className={`${styles.btn} ${styles["btn-primary"]} ${styles["btn-lg"]}`}
            >
              {cta.primary.text}
            </a>
            <a
              href={cta.secondary.link}
              className={`${styles.btn} ${styles["btn-secondary"]} ${styles["btn-lg"]}`}
            >
              {cta.secondary.text}
            </a>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className={styles["scroll-indicator"]}>
        <span className={styles["scroll-text"]}>Scroll para explorar</span>
        <svg
          className={styles["scroll-arrow"]}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
