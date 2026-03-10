import { createSlice } from '@reduxjs/toolkit'

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    loading:  false,
  },
  reducers: {
    setLoading(state, action)  { state.loading = action.payload },
    setExpenses(state, action) { state.expenses = action.payload },
    addExpense(state, action)  { state.expenses.unshift(action.payload) },
    removeExpense(state, action) {
      state.expenses = state.expenses.filter(e => e._id !== action.payload)
    },
  },
})

export const { setLoading, setExpenses, addExpense, removeExpense } = expenseSlice.actions
export default expenseSlice.reducer