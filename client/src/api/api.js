// api/api.js
// This file just sets the base URL for all requests
// Instead of writing http://localhost:5000/api every time,
// we just write api.post('/auth/login') anywhere in the app

import axios from 'axios'

const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL,
})

export default api