import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:       localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token:      localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
  },
  reducers: {
    loginSuccess(state, action) {
      state.user       = action.payload.user
      state.token      = action.payload.token
      state.isLoggedIn = true
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.user       = null
      state.token      = null
      state.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer