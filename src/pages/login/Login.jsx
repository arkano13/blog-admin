  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import styles from "./Login.module.css";

  function Login() {
      const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message);
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/");
    };

    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.brand}>// blog.</div>
          <div className={styles.sub}>sign in to your account</div>
          <form onSubmit={handleSubmit}>
            <label className={styles.label}>username</label>
            <input
              className={styles.field}
              type="text"
              placeholder="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className={styles.label}>password</label>
            <input
              className={styles.field}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {authError && <p className={styles.error}>{authError}</p>}
            <button className={styles.btn} type="submit">sign in</button>
          </form>
            <hr className={styles.divider} />
        </div>
      </div>
    );
  }

  export default Login