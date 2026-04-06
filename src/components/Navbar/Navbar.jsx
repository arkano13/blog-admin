import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate= useNavigate()
  const   isLoggedIn=  !!localStorage.getItem('token') 

    const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }


  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        MY<span className={styles.dot}>.</span>BLOG
      </div>

      <div className={styles.links}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Home
        </NavLink>

        {!isLoggedIn && (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Login
          </NavLink>
        )}

        {isLoggedIn && (
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <span className={styles.tag}>EST. 2025</span>
    </nav>
  );
}