import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { setBudget, getBudgets } from '../controllers/budgetController.js'

const router = express.Router()

router.post('/', protect, setBudget)
router.get('/',  protect, getBudgets)

export default router