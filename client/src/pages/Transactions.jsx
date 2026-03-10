// Transactions page — shows all expenses + income together
// with search and filter

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import '../css/transactions.css'

function Transactions() {
  const navigate = useNavigate()

  const token    = useSelector(state => state.auth.token)
  const expenses = useSelector(state => state.expenses.expenses)
  const income   = useSelector(state => state.income.income)

  // Search and filter state
  const [search,     setSearch]     = useState('')
  const [filterType, setFilterType] = useState('all')   // all | expense | income
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    if (!token) navigate('/login')
  }, [])

  // Combine expenses and income into one list
  // Add a 'type' field so we know which is which
  const allTransactions = [
    ...expenses.map(e => ({ ...e, type: 'expense' })),
    ...income.map(i   => ({ ...i, type: 'income'  })),
  ]
  // Sort by date — newest first
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Apply filters
  const filtered = allTransactions.filter(item => {
    // Search filter — check category/source and description
    const searchText = (item.category || item.source || '').toLowerCase()
    const desc       = (item.description || '').toLowerCase()
    const matchSearch = search === '' || searchText.includes(search.toLowerCase()) || desc.includes(search.toLowerCase())

    // Type filter
    const matchType = filterType === 'all' || item.type === filterType

    // Date filter
    const matchDate = filterDate === '' || item.date === filterDate

    return matchSearch && matchType && matchDate
  })

  return (
    <div className="transactions-page">
      <Navbar />
      <div className="transactions-content">

        <p className="section-title">All Transactions</p>

        {/* Search and Filter Row */}
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by category, source or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>

        {/* Transaction List */}
        {filtered.length === 0 ? (
          <div className="empty-state">No transactions found.</div>
        ) : (
          <div className="transaction-list">
            {filtered.map(item => (
              <div className="transaction-item" key={item._id + item.type}>
                <div className="transaction-left">
                  <span className="transaction-title">
                    {item.type === 'expense' ? item.category : item.source}
                  </span>
                  <span className="transaction-sub">{item.date}</span>
                  {item.description && (
                    <span className="transaction-sub">{item.description}</span>
                  )}
                  {item.frequency && (
                    <span className="transaction-sub">{item.frequency}</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${item.type === 'expense' ? 'badge-expense' : 'badge-income'}`}>
                    {item.type}
                  </span>
                  <span className={item.type === 'expense' ? 'transaction-amount-red' : 'transaction-amount-green'}>
                    {item.type === 'expense' ? '- ' : '+ '}₹{item.amount}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Transactions