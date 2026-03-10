import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { addExpense, getExpenses, deleteExpense } from '../controllers/expenseController.js'

const router = express.Router()

router.post('/',      protect, addExpense)
router.get('/',       protect, getExpenses)
router.delete('/:id', protect, deleteExpense)

export default router