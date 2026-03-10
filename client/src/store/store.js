import { configureStore } from '@reduxjs/toolkit'
import authReducer    from './slices/authSlice'
import expenseReducer from './slices/expenseSlice'
import incomeReducer  from './slices/incomeSlice'
import budgetReducer  from './slices/budgetSlice'

const store = configureStore({
  reducer: {
    auth:     authReducer,
    expenses: expenseReducer,
    income:   incomeReducer,
    budget:   budgetReducer,
  },
})

export default store