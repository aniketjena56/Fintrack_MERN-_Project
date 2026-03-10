import Expense from '../models/Expense.js'

// POST /api/expenses
export async function addExpense(req, res) {
  try {
    const { amount, category, description, date } = req.body

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Amount, category and date are required' })
    }

    const expense = new Expense({
      userId: req.userId,
      amount,
      category,
      description,
      date,
    })
    await expense.save()

    return res.status(201).json({ message: 'Expense added', expense })

  } catch (error) {
    console.log('Add expense error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}

// GET /api/expenses
export async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ createdAt: -1 })
    return res.status(200).json({ expenses })
  } catch (error) {
    console.log('Get expenses error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}

// DELETE /api/expenses/:id
export async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await Expense.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: 'Expense deleted' })

  } catch (error) {
    console.log('Delete expense error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}