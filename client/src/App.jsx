import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import Budget       from './pages/Budget'
import Transactions from './pages/Transactions'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/"             element={<Navigate to="/login" />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/budget"       element={<Budget />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*"             element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App