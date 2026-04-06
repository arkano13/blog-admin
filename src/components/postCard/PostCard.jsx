import { useState, useEffect,useRef } from "react";
import styles from "./PostCards.module.css";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post, onDelete, onUpdate }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(post.isPublic);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete() {
    setMenuOpen(false);
    if (!confirm("¿Seguro que quieres eliminar este post?")) return;  
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/${post.id}`, {
         method: "DELETE", 
         headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
         }
        
        });
      onDelete?.(post.id);
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  }

  async function handleToggleVisibility() {
    setMenuOpen(false); 
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/${post.id}/publish`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
           Authorization:`Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (res.ok) {
        setIsPublic((prev) => !prev);
        onUpdate?.(post.id, { isPublic: !isPublic });
      }
    } catch (err) {
      console.error("Error al cambiar visibilidad:", err);
    } 
  }


  async function handleEdit() {
    setMenuOpen(false)
    navigate(`/PostEdit/${post.id}`);
    
  }
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {post.user?.username?.slice(0, 2).toUpperCase() ?? "??"}
        </div>
        <div>
          <div className={styles.author}>{post.user?.username ?? "Unknown"}</div>
          <div className={styles.date}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Badge de visibilidad */}
        <span className={`${styles.badge} ${isPublic ? styles.badgePublic : styles.badgePrivate}`}>
          {isPublic ? "público" : "privado"}
        </span>

        {/* Menú tres puntos */}
        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Opciones"
          >
            &#8942;
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleEdit}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar
              </button>

              <button className={styles.dropdownItem} onClick={handleToggleVisibility}>
                {isPublic ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Hacer privado
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Hacer público
                  </>
                )}
              </button>

              <div className={styles.dropdownDivider} />

              <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleDelete}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.title}>{post.title}</div>
      <div className={styles.message}>{post.message}</div>

      <div className={styles.footer}>
        <button className={styles.commentBtn} onClick={() => navigate(`/post/${post.id}`)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.count}>{post._count?.comments ?? 0}</span>
        </button>

        <span className={styles.likes}>
          ♥ {post._count?.likes ?? 0}
        </span>
      </div>
    </div>
  );
}
