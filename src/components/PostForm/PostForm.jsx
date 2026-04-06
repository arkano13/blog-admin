// components/PostForm/PostForm.jsx
import { useState } from 'react'
import styles from './PostForm.module.css'

function PostForm({ onPostCreated, initialData, postId }) {
  const [form, setForm] = useState(initialData || { title: '', message: '' })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const getError = (field) => errors.find(e => e.path === field)?.msg

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setErrors(data.errors || [])
      return
    }

    onPostCreated?.()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      {getError('title') && <p className={styles.error}>{getError('title')}</p>}

      <textarea
        className={styles.textarea}
        name="message"
        placeholder="What's on your mind?"
        value={form.message}
        onChange={handleChange}
      />
      {getError('message') && <p className={styles.error}>{getError('message')}</p>}

      <button className={styles.btn} type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
}

export default PostForm