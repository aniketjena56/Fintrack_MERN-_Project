import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:      { type: Number, required: true },
  source:      { type: String, required: true },   // e.g. Salary, Freelance
  frequency:   { type: String, required: true },   // Monthly, Weekly, One-time
  description: { type: String, default: '' },
  date:        { type: String, required: true },
}, { timestamps: true })

const Income = mongoose.model('Income', incomeSchema)
export default Income