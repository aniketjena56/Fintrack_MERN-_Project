// middleware/authMiddleware.js
// This runs BEFORE protected routes
// It checks if the user has a valid token
// If yes → allow them in
// If no  → send back "not authorized"

// We will use this in future steps to protect routes like
// /api/expenses, /api/income etc.

import jwt from 'jsonwebtoken'

function protect(req, res, next) {
  // The frontend sends the token in the request header like:
  // Authorization: Bearer eyJhbGciOiJIUzI1...

  const authHeader = req.headers.authorization

  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Please login.' })
  }

  // Extract just the token part (remove "Bearer ")
  const token = authHeader.split(' ')[1]

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user id to the request so next route can use it
    req.userId = decoded.id

    // Move on to the actual route
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Token expired. Please login again.' })
  }
}

export default protect