// Dashboard — Expense + Income tabs, summary cards

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/api'
import { showSuccess, showError } from '../utils/toast'
import { setExpenses, setLoading, addExpense, removeExpense } from '../store/slices/expenseSlice'
import { setIncome, setIncomeLoading, addIncome, removeIncome } from '../store/slices/incomeSlice'
import Navbar from '../components/Navbar'
import '../css/dashboard.css'

const CATEGORIES  = ['Groceries','Food & Dining','Transport','Utilities','Entertainment','Shopping','Healthcare','Other']
const FREQUENCIES = ['Monthly', 'Weekly', 'Daily', 'One-time']

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const token    = useSelector(state => state.auth.token)
  const expenses = useSelector(state => state.expenses.expenses)
  const income   = useSelector(state => state.income.income)
  const loadingExpenses = useSelector(state => state.expenses.loading)
  const loadingIncome   = useSelector(state => state.income.loading)

  // Which tab is active — 'expense' or 'income'
  const [activeTab, setActiveTab] = useState('expense')

  const [expenseForm, setExpenseForm] = useState({ amount: '', category: '', description: '', date: '' })
  const [incomeForm,  setIncomeForm]  = useState({ amount: '', source: '', frequency: '', description: '', date: '' })
  const [loadingAdd,  setLoadingAdd]  = useState(false)

  const authHeader = { headers: { Authorization: `Bearer ${token}` } }

  async function fetchExpenses() {
    dispatch(setLoading(true))
    try {
      const res = await api.get('/expenses', authHeader)
      dispatch(setExpenses(res.data.expenses))
    } catch { showError('Could not load expenses') }
    dispatch(setLoading(false))
  }

  async function fetchIncome() {
    dispatch(setIncomeLoading(true))
    try {
      const res = await api.get('/income', authHeader)
      dispatch(setIncome(res.data.income))
    } catch { showError('Could not load income') }
    dispatch(setIncomeLoading(false))
  }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchExpenses()
    fetchIncome()
  }, [])

  
  // ---- Add Expense ----
  async function handleAddExpense(e) {
    e.preventDefault()
    if (!expenseForm.amount)     { showError('Amount is required');           return }
    if (expenseForm.amount <= 0) { showError('Amount must be greater than 0'); return }
    if (!expenseForm.category)   { showError('Please select a category');      return }
    if (!expenseForm.date)       { showError('Date is required');              return }

    setLoadingAdd(true)
    try {
      const res = await api.post('/expenses', expenseForm, authHeader)
      dispatch(addExpense(res.data.expense))
      setExpenseForm({ amount: '', category: '', description: '', date: '' })
      showSuccess('Expense added!')
    } catch { showError('Could not add expense') }
    setLoadingAdd(false)
  }

  // ---- Delete Expense ----
  async function handleDeleteExpense(id) {
    try {
      await api.delete(`/expenses/${id}`, authHeader)
      dispatch(removeExpense(id))
      showSuccess('Expense deleted')
    } catch { showError('Could not delete expense') }
  }

  // ---- Add Income ----
  async function handleAddIncome(e) {
    e.preventDefault()
    if (!incomeForm.amount)    { showError('Amount is required');           return }
    if (incomeForm.amount <= 0){ showError('Amount must be greater than 0'); return }
    if (!incomeForm.source)    { showError('Source is required');            return }
    if (!incomeForm.frequency) { showError('Please select a frequency');     return }
    if (!incomeForm.date)      { showError('Date is required');              return }

    setLoadingAdd(true)
    try {
      const res = await api.post('/income', incomeForm, authHeader)
      dispatch(addIncome(res.data.income))
      setIncomeForm({ amount: '', source: '', frequency: '', description: '', date: '' })
      showSuccess('Income added!')
    } catch { showError('Could not add income') }
    setLoadingAdd(false)
  }

  // ---- Delete Income ----
  async function handleDeleteIncome(id) {
    try {
      await api.delete(`/income/${id}`, authHeader)
      dispatch(removeIncome(id))
      showSuccess('Income deleted')
    } catch { showError('Could not delete income') }
  }

  const totalSpent  = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = income.reduce((sum, i)   => sum + i.amount, 0)
  const balance     = totalIncome - totalSpent

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-content">

        {/* Summary Cards */}
        <div className="summary-row">
          <div className="summary-card">
            <p className="card-label">Total Income</p>
            <p className="card-value green">₹ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <p className="card-label">Total Spent</p>
            <p className="card-value red">₹ {totalSpent.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <p className="card-label">Balance</p>
            <p className={`card-value ${balance >= 0 ? 'green' : 'red'}`}>
              ₹ {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            Expenses
          </button>
          <button
            className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
        </div>

        {/* ---- EXPENSE TAB ---- */}
        {activeTab === 'expense' && (
          <>
            <p className="section-title">Add Expense</p>
            <div className="form-card">
              <form onSubmit={handleAddExpense}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" name="amount" placeholder="e.g. 500"
                      value={expenseForm.amount}
                      onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category"
                      value={expenseForm.category}
                      onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Description (optional)</label>
                    <input type="text" placeholder="e.g. Weekly groceries"
                      value={expenseForm.description}
                      onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date"
                      value={expenseForm.date}
                      onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-add" disabled={loadingAdd}>
                  {loadingAdd ? 'Adding...' : '+ Add Expense'}
                </button>
              </form>
            </div>

            <p className="section-title">Your Expenses</p>
            {loadingExpenses ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '30px' }}>Loading...</p>
            ) : expenses.length === 0 ? (
              <div className="empty-state">No expenses yet. Add your first one above!</div>
            ) : (
              <div className="list">
                {expenses.map(exp => (
                  <div className="list-item" key={exp._id}>
                    <div className="item-left">
                      <span className="item-title">{exp.category}</span>
                      {exp.description && <span className="item-sub">{exp.description}</span>}
                      <span className="item-sub">{exp.date}</span>
                    </div>
                    <div className="item-right">
                      <span className="item-amount-red">- ₹{exp.amount}</span>
                      <button className="btn-delete" onClick={() => handleDeleteExpense(exp._id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ---- INCOME TAB ---- */}
        {activeTab === 'income' && (
          <>
            <p className="section-title">Add Income</p>
            <div className="form-card">
              <form onSubmit={handleAddIncome}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" placeholder="e.g. 50000"
                      value={incomeForm.amount}
                      onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Source</label>
                    <input type="text" placeholder="e.g. Salary, Freelance"
                      value={incomeForm.source}
                      onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Frequency</label>
                    <select
                      value={incomeForm.frequency}
                      onChange={e => setIncomeForm({ ...incomeForm, frequency: e.target.value })}
                    >
                      <option value="">Select frequency</option>
                      {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date"
                      value={incomeForm.date}
                      onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <input type="text" placeholder="e.g. March salary"
                    value={incomeForm.description}
                    onChange={e => setIncomeForm({ ...incomeForm, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-add" disabled={loadingAdd}>
                  {loadingAdd ? 'Adding...' : '+ Add Income'}
                </button>
              </form>
            </div>

            <p className="section-title">Your Income</p>
            {loadingIncome ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '30px' }}>Loading...</p>
            ) : income.length === 0 ? (
              <div className="empty-state">No income added yet. Add your first one above!</div>
            ) : (
              <div className="list">
                {income.map(inc => (
                  <div className="list-item" key={inc._id}>
                    <div className="item-left">
                      <span className="item-title">{inc.source}</span>
                      <span className="item-sub">{inc.frequency} · {inc.date}</span>
                      {inc.description && <span className="item-sub">{inc.description}</span>}
                    </div>
                    <div className="item-right">
                      <span className="item-amount-green">+ ₹{inc.amount}</span>
                      <button className="btn-delete" onClick={() => handleDeleteIncome(inc._id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default Dashboard