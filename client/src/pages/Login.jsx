import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../api/api'
import { showSuccess, showError } from '../utils/toast'
import { loginSuccess } from '../store/slices/authSlice'
import '../css/auth.css'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading,  setLoading]  = useState(false)
  const [showPwd,  setShowPwd]  = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function validate() {
    if (!formData.email)               { showError('Email is required');                      return false }
    if (!formData.email.includes('@')) { showError('Enter a valid email address');            return false }
    if (!formData.password)            { showError('Password is required');                   return false }
    if (formData.password.length < 6)  { showError('Password must be at least 6 characters'); return false }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const response = await api.post('/auth/login', {
        email:    formData.email,
        password: formData.password,
      })

      dispatch(loginSuccess({
        user:  response.data.user,
        token: response.data.token,
      }))

      showSuccess('Login successful! Welcome back 👋')
      setTimeout(() => navigate('/dashboard'), 1000)

    } catch (error) {
      showError(error.response?.data?.message || 'Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-logo">₹</div>
          <span className="auth-brand-name">FinTrack</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type={showPwd ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPwd(!showPwd)}
              style={{ fontSize: '12px', color: '#f0b429', cursor: 'pointer', marginTop: '5px', display: 'inline-block' }}
            >
              {showPwd ? 'Hide password' : 'Show password'}
            </span>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

      </div>
    </div>
  )
}

export default Login