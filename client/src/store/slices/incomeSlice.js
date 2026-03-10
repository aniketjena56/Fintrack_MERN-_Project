import { createSlice } from '@reduxjs/toolkit'

const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    income:  [],
    loading: false,
  },
  reducers: {
    setIncomeLoading(state, action) { state.loading = action.payload },
    setIncome(state, action)        { state.income = action.payload },
    addIncome(state, action)        { state.income.unshift(action.payload) },
    removeIncome(state, action) {
      state.income = state.income.filter(i => i._id !== action.payload)
    },
  },
})

export const { setIncomeLoading, setIncome, addIncome, removeIncome } = incomeSlice.actions
export default incomeSlice.reducer