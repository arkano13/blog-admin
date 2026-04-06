import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PostCard from "../../components/postCard/PostCard";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  
  const [post, setPost] = useState([]);
  const isLoggedIn = !!localStorage.getItem("token");

  const fetchPosts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/admin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
      if (Array.isArray(data)) {
        setPost(data)
      } else {
        navigate('/login')  // ← no es admin, redirige
      }
    })
      
  };

  useEffect(() => {
    fetchPosts();
  }, []);

return (
  <div className={styles.page}>
    <Navbar />

    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Dashboard</div>
          <div className={styles.subtitle}>
            manage your posts
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {post.length === 0 ? (
          <div className={styles.empty}>
            No posts yet...
          </div>
        ) : (
          post.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={(id) =>
                setPost((prev) => prev.filter((p) => p.id !== id))
              }
              onUpdate={(id, changes) =>
                setPost((prev) =>
                  prev.map((p) =>
                    p.id === id ? { ...p, ...changes } : p
                  )
                )
              }
            />
          ))
        )}
      </div>
    </div>
  </div>
);
}

export default Dashboard;
