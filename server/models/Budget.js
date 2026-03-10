import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount:   { type: Number, required: true },   // the budget limit
  month:    { type: String, required: true },   // e.g. "2024-12"
}, { timestamps: true })

const Budget = mongoose.model('Budget', budgetSchema)
export default Budget