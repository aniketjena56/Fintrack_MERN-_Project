import { createSlice } from '@reduxjs/toolkit'

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    budgets: [],
    loading: false,
  },
  reducers: {
    setBudgetLoading(state, action) { state.loading = action.payload },
    setBudgets(state, action)       { state.budgets = action.payload },
    upsertBudget(state, action) {
      // If budget for same category exists update it, else add it
      const index = state.budgets.findIndex(
        b => b.category === action.payload.category
      )
      if (index !== -1) {
        state.budgets[index] = action.payload
      } else {
        state.budgets.push(action.payload)
      }
    },
  },
})

export const { setBudgetLoading, setBudgets, upsertBudget } = budgetSlice.actions
export default budgetSlice.reducer