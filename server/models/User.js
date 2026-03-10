// models/User.js
// This defines what a User looks like in the database
// Think of it like a table structure in SQL

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

  fullname: {
    type: String,
    required: true,  // this field is compulsory
  },

  email: {
    type: String,
    required: true,
    unique: true,    // no two users can have the same email
  },

  password: {
    type: String,
    required: true,  // this will store the hashed password
  },

}, { timestamps: true }) // automatically adds createdAt and updatedAt fields

// 'User' becomes the collection name 'users' in MongoDB
const User = mongoose.model('User', userSchema)

export default User