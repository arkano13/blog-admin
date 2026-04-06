import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/NavBar/Navbar";
import styles from "./PostEdit.module.css";
import PostForm from "../../components/PostForm/PostForm";
import { useNavigate } from "react-router-dom";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
<div className={styles.container}>
  <div className={styles.editor}>
    <div className={styles.title}>Edit Post</div>

    <PostForm
      initialData={{ title: post.title, message: post.message }}
      postId={post.id}
      onPostCreated={() => navigate("/")}
    />
  </div>
</div>
  );
}

export default Post;
