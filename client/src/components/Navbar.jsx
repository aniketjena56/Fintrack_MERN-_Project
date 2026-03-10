import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { showSuccess } from '../utils/toast'
import '../css/navbar.css'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user     = useSelector(state => state.auth.user)

  function handleLogout() {
    dispatch(logout())
    showSuccess('Logged out successfully')
    setTimeout(() => navigate('/login'), 800)
  }

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <div className="navbar-logo">₹</div>
        <span className="navbar-name">FinTrack</span>
      </div>

      {/* Page navigation links */}
      <div className="navbar-links">
        <NavLink to="/dashboard"    className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/budget"       className={({ isActive }) => isActive ? 'active' : ''}>Budget</NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>Transactions</NavLink>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">Hi, {user?.fullname || 'User'}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

    </nav>
  )
}

export default Navbar