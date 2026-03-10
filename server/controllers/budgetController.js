import Budget from '../models/Budget.js'

// POST /api/budget  — set or update a budget for a category
export async function setBudget(req, res) {
  try {
    const { category, amount, month } = req.body

    if (!category || !amount || !month) {
      return res.status(400).json({ message: 'Category, amount and month are required' })
    }

    // If budget for this category+month already exists, update it
    // Otherwise create a new one
    const existing = await Budget.findOne({ userId: req.userId, category, month })

    if (existing) {
      existing.amount = amount
      await existing.save()
      return res.status(200).json({ message: 'Budget updated', budget: existing })
    }

    const budget = new Budget({ userId: req.userId, category, amount, month })
    await budget.save()

    return res.status(201).json({ message: 'Budget set', budget })

  } catch (error) {
    console.log('Set budget error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}

// GET /api/budget?month=2024-12
export async function getBudgets(req, res) {
  try {
    const { month } = req.query
    const budgets = await Budget.find({ userId: req.userId, month })
    return res.status(200).json({ budgets })
  } catch (error) {
    console.log('Get budget error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}