import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import { showSuccess, showError } from '../utils/toast'
import '../css/auth.css'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullname: '', email: '', password: '', confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function validate() {
    if (!formData.fullname)                                  { showError('Full name is required');               return false }
    if (!formData.email)                                     { showError('Email is required');                   return false }
    if (!formData.email.includes('@'))                       { showError('Enter a valid email address');         return false }
    if (!formData.password)                                  { showError('Password is required');                return false }
    if (formData.password.length < 6)                        { showError('Password must be at least 6 characters'); return false }
    if (!formData.confirmPassword)                           { showError('Please confirm your password');        return false }
    if (formData.password !== formData.confirmPassword)      { showError('Passwords do not match');              return false }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await api.post('/auth/register', {
        fullname: formData.fullname,
        email:    formData.email,
        password: formData.password,
      })

      showSuccess('Account created! Please login.')
      setTimeout(() => navigate('/login'), 1500)

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

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start tracking your finances today</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="John Doe"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>

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
              placeholder="Min 6 characters"
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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default Register