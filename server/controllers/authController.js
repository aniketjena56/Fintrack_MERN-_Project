

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'


// -----------------------------------------------
// REGISTER
// Called when user submits the register form
// POST /api/auth/register
// -----------------------------------------------
export async function register(req, res) {
  try {
    // Step 1: Get the data sent from the frontend
    const { fullname, email, password } = req.body

    // Step 2: Check all fields are present
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Step 3: Check if this email is already registered
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login.' })
    }

    // Step 4: Hash the password before saving
    // bcrypt turns "mypassword123" into something like "$2a$10$xyz..."
    // saltRounds = 10 means how strong the hashing is (10 is standard)
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Step 5: Save the new user to MongoDB
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword, // save hashed, never plain text
    })
    await newUser.save()

    // Step 6: Send success response
    return res.status(201).json({ message: 'Account created successfully' })

  } catch (error) {
    console.log('Register error:', error.message)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
}


// -----------------------------------------------
// LOGIN
// Called when user submits the login form
// POST /api/auth/login
// -----------------------------------------------
export async function login(req, res) {
  try {
    // Step 1: Get the data sent from the frontend
    const { email, password } = req.body

    // Step 2: Check all fields are present
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Step 3: Find user by email in MongoDB
    const user = await User.findOne({ email })
    if (!user) {
      // Don't say "email not found" — just say invalid credentials (safer)
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Step 4: Compare the entered password with the hashed one in DB
    // bcrypt.compare("mypassword123", "$2a$10$xyz...") → true or false
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Step 5: Create a JWT token
    // This token is like a temporary ID card for the user
    // It expires in 7 days — after that they need to login again
    const token = jwt.sign(
      { id: user._id },           // what to store inside the token
      process.env.JWT_SECRET,     // secret key to sign it
      { expiresIn: '7d' }         // when it expires
    )

    // Step 6: Send the token and user info back to frontend
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      }
    })

  } catch (error) {
    console.log('Login error:', error.message)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
}