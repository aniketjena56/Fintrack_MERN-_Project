// routes/authRoutes.js
// This file defines the URL endpoints for auth
// It connects the URL to the right controller function

import express from 'express'
import { register, login } from '../controllers/authController.js'


const router = express.Router()

// POST /api/auth/register → runs the register function
router.post('/register', register)

// POST /api/auth/login → runs the login function
router.post('/login', login)

export default router