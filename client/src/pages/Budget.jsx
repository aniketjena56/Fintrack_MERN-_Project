// Budget page — set budget per category, see progress bars

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/api'
import { showSuccess, showError } from '../utils/toast'
import { setBudgets, setBudgetLoading, upsertBudget } from '../store/slices/budgetSlice'
import Navbar from '../components/Navbar'
import '../css/budget.css'

const CATEGORIES = ['Groceries','Food & Dining','Transport','Utilities','Entertainment','Shopping','Healthcare','Other']

function Budget() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const token    = useSelector(state => state.auth.token)
  const budgets  = useSelector(state => state.budget.budgets)
  const loading  = useSelector(state => state.budget.loading)
  const expenses = useSelector(state => state.expenses.expenses)

  // Default month is current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  const [formData,   setFormData]   = useState({ category: '', amount: '' })
  const [loadingAdd, setLoadingAdd] = useState(false)

  const authHeader = { headers: { Authorization: `Bearer ${token}` } }

   async function fetchBudgets() {
    dispatch(setBudgetLoading(true))
    try {
      const res = await api.get(`/budget?month=${selectedMonth}`, authHeader)
      dispatch(setBudgets(res.data.budgets))
    } catch { showError('Could not load budgets') }
    dispatch(setBudgetLoading(false))
  }
  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchBudgets()
  }, [selectedMonth])

 

  async function handleSetBudget(e) {
    e.preventDefault()
    if (!formData.category) { showError('Please select a category'); return }
    if (!formData.amount)   { showError('Budget amount is required'); return }
    if (formData.amount <= 0){ showError('Amount must be greater than 0'); return }

    setLoadingAdd(true)
    try {
      const res = await api.post('/budget', { ...formData, month: selectedMonth }, authHeader)
      dispatch(upsertBudget(res.data.budget))
      setFormData({ category: '', amount: '' })
      showSuccess('Budget saved!')
    } catch { showError('Could not save budget') }
    setLoadingAdd(false)
  }

  // For a given category, calculate how much was spent this month
  function getSpentForCategory(category) {
    return expenses
      .filter(e => e.category === category && e.date.startsWith(selectedMonth))
      .reduce((sum, e) => sum + e.amount, 0)
  }

  return (
    <div className="budget-page">
      <Navbar />
      <div className="budget-content">

        {/* Month Picker */}
        <div className="month-row">
          <label>Select Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </div>

        {/* Set Budget Form */}
        <p className="section-title">Set Budget</p>
        <div className="budget-form">
          <form onSubmit={handleSetBudget}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Budget Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  min="1"
                />
              </div>
            </div>
            <button type="submit" className="btn-set" disabled={loadingAdd}>
              {loadingAdd ? 'Saving...' : 'Save Budget'}
            </button>
          </form>
        </div>

        {/* Budget Progress Cards */}
        <p className="section-title">Budget Overview — {selectedMonth}</p>

        {loading ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '30px' }}>Loading...</p>
        ) : budgets.length === 0 ? (
          <div className="empty-state">No budgets set for this month yet.</div>
        ) : (
          <div className="budget-cards">
            {budgets.map(budget => {
              const spent      = getSpentForCategory(budget.category)
              const percent    = Math.min((spent / budget.amount) * 100, 100).toFixed(0)
              const isOver     = spent > budget.amount

              // Progress bar color: green → yellow → red based on usage
              const barColor   = percent < 60 ? '#34d399' : percent < 85 ? '#f0b429' : '#f87171'

              return (
                <div className="budget-card" key={budget._id}>
                  <div className="budget-card-top">
                    <span className="budget-category">{budget.category}</span>
                    <span className="budget-amounts">
                      <span>₹{spent}</span> / ₹{budget.amount}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%`, background: barColor }}
                    />
                  </div>

                  <div className="budget-footer">
                    <span className="budget-pct">{percent}% used</span>
                    <span className="budget-status" style={{ color: barColor }}>
                      {isOver ? `Over by ₹${spent - budget.amount}` : `₹${budget.amount - spent} left`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default Budget