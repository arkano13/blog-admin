import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from "./pages/dashboard/Dashboard"
import Login from "./pages/login/Login"
import PostEdit from "./pages/PostEdit/PostEdit"




function App() {

  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/PostEdit/:id' element={<PostEdit/>}/>
    </Routes>
  )
}

export default App
