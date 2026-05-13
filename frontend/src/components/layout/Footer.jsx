import React from "react";
import styles from "./Footer.module.css";

/**
 * FOOTER - Pie de página
 * Componente básico del footer
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        {/* Secciones del footer */}
        <div className={styles["footer-section"]}>
          <h4>Swift Studio</h4>
          <p>
            Agencia 360º | Fotografía • Social Media • SEO • Blogs •
            Automatización
          </p>
        </div>

        <div className={styles["footer-section"]}>
          <h4>Servicios</h4>
          <ul>
            <li>
              <a href="/servicios/seo">SEO</a>
            </li>
            <li>
              <a href="/servicios/social-media">Social Media</a>
            </li>
            <li>
              <a href="/servicios/fotografia">Fotografía</a>
            </li>
            <li>
              <a href="/servicios/content">Content</a>
            </li>
            <li>
              <a href="/servicios/automatizacion">Automatización</a>
            </li>
          </ul>
        </div>

        <div className={styles["footer-section"]}>
          <h4>Enlaces</h4>
          <ul>
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/contacto">Contacto</a>
            </li>
            <li>
              <a href="/portafolio">Portafolio</a>
            </li>
          </ul>
        </div>

        <div className={styles["footer-section"]}>
          <h4>Conecta</h4>
          <ul>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a href="mailto:contact@swiftstudio.com">Email</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles["footer-bottom"]}>
        <p>&copy; {currentYear} Swift Studio. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
