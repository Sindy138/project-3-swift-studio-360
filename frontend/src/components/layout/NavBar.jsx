import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-container"]}>
        <Link to="/" className={styles["navbar-logo"]}>
          <img
            src="/logos/logo-swift.svg"
            alt="Swift Studio"
            className={styles["logo-image"]}
          />
        </Link>

        <ul className={styles["navbar-menu"]}>
          <li>
            <Link to="/servicios">Servicios</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/perfil">Mi perfil</Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles["btn-logout"]}>
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={styles["btn-dashboard"]}>
                  Entrar
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
