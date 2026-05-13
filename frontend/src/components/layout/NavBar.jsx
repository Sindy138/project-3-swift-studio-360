import React from "react";
import styles from "./NavBar.module.css";

/**
 * NAVBAR - Barra de navegación
 * Componente básico de navegación
 */
const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-container"]}>
        <a href="/" className={styles["navbar-logo"]}>
          <img
            src="/logo-swift.svg"
            alt="Swift Studio"
            className={styles["logo-image"]}
          />
        </a>

        <ul className={styles["navbar-menu"]}>
          <li>
            <a href="/quienes-somos">Quienes Somos</a>
          </li>
          <li>
            <a href="/servicios">Servicios</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="/contacto">Contacto</a>
          </li>
          <li>
            <a
              href="https://ecommerce.swiftstudio.com"
              className={styles["btn-dashboard"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              360º
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
