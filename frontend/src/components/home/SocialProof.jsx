import React, { useState } from "react";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/SocialProof.module.css";

/**
 * SOCIAL PROOF - Logos de clientes + Testimonios
 * Componente con carrusel de testimonios
 * Datos vienen de config centralizada
 */
const SocialProof = ({ config = SECTOR_CONFIG.socialProof }) => {
  const { title, subtitle, logos, testimonials } = config;
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index % testimonials.length);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const current = testimonials[currentTestimonial];

  return (
    <section className={styles["social-proof-section"]} id="social-proof">
      <div className={styles["social-proof-container"]}>
        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-subtitle"]}>{subtitle}</p>
        </div>

        {/* Logos Grid */}
        <div className={styles["logos-section"]}>
          <h3 className={styles["logos-title"]}>Clientes y Partners</h3>
          <div className={styles["logos-grid"]}>
            {logos.map((logo) => (
              <div key={logo.id} className={styles["logo-item"]}>
                <img src={logo.image} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className={styles["testimonials-section"]}>
          <h3 className={styles["testimonials-title"]}>
            Lo que dicen nuestros clientes
          </h3>

          <div className={styles["testimonial-carousel"]}>
            <div className={styles["testimonial-card"]}>
              <div className={styles.stars}>
                {Array(current.rating).fill("⭐").join("")}
              </div>
              <blockquote className={styles["testimonial-quote"]}>
                "{current.quote}"
              </blockquote>
              <div className={styles["testimonial-author"]}>
                <p className={styles["author-name"]}>{current.author}</p>
                <p className={styles["author-role"]}>{current.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className={styles["carousel-controls"]}>
            <button
              className={`${styles["carousel-btn"]} ${styles.prev}`}
              onClick={prevTestimonial}
              aria-label="Testimonial anterior"
            >
              ←
            </button>

            <div className={styles["carousel-dots"]}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentTestimonial ? styles.active : ""}`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Testimonial ${index + 1}`}
                ></button>
              ))}
            </div>

            <button
              className={`${styles["carousel-btn"]} ${styles.next}`}
              onClick={nextTestimonial}
              aria-label="Siguiente testimonial"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
