import React from "react";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/SEOAuthority.module.css";

/**
 * SEO AUTHORITY SECTION
 * Sección optimizada para SEO local y construcción de autoridad
 * Contiene structured data y copy optimizado
 */
const SEOAuthority = ({ config = SECTOR_CONFIG.seoAuthority }) => {
  const { title, subtitle, keyStats, authorityContent } = config;

  return (
    <section className={styles["seo-authority-section"]} id="seo-authority">
      <div className={styles["authority-container"]}>
        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-subtitle"]}>{subtitle}</p>
        </div>

        {/* Key Stats - Proof of Authority */}
        <div className={styles["key-stats-grid"]}>
          {keyStats.map((stat, idx) => (
            <div key={idx} className={styles["stat-card"]}>
              <div className={styles["stat-metric"]}>{stat.metric}</div>
              <div className={styles["stat-label"]}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Authority Content */}
        <div className={styles["authority-content"]}>
          <div className={styles["authority-text"]}>
            <p className={styles["authority-paragraph"]}>
              {authorityContent.mainText}
            </p>
          </div>

          {/* Structured Data JSON-LD (invisible pero importante para SEO) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": authorityContent.schemaType,
                name: SECTOR_CONFIG.companyName,
                description: authorityContent.mainText,
                url: window.location.origin,
                telephone: "+34-XXX-XXX-XXX",
                email: "contact@swiftstudio.com",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Tu Dirección",
                  addressLocality: "Tu Ciudad",
                  postalCode: "XXXXX",
                  addressCountry: "ES",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.9",
                  ratingCount: "150",
                },
              }),
            }}
          />
        </div>

        {/* Call to Action */}
        <div className={styles["authority-cta-section"]}>
          <h3>Listo para potenciar tu presencia digital</h3>
          <a
            href="/contacto"
            className={`${styles.btn} ${styles["btn-primary"]} ${styles["btn-lg"]}`}
          >
            Solicitar Consulta Gratuita
          </a>
        </div>
      </div>
    </section>
  );
};

export default SEOAuthority;
