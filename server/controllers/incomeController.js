import Income from '../models/Income.js'

// POST /api/income
export async function addIncome(req, res) {
  try {
    const { amount, source, frequency, description, date } = req.body

    if (!amount || !source || !frequency || !date) {
      return res.status(400).json({ message: 'Amount, source, frequency and date are required' })
    }

    const income = new Income({
      userId: req.userId,
      amount,
      source,
      frequency,
      description,
      date,
    })
    await income.save()

    return res.status(201).json({ message: 'Income added', income })

  } catch (error) {
    console.log('Add income error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}

// GET /api/income
export async function getIncome(req, res) {
  try {
    const income = await Income.find({ userId: req.userId }).sort({ createdAt: -1 })
    return res.status(200).json({ income })
  } catch (error) {
    console.log('Get income error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}

// DELETE /api/income/:id
export async function deleteIncome(req, res) {
  try {
    const income = await Income.findById(req.params.id)

    if (!income) {
      return res.status(404).json({ message: 'Income not found' })
    }

    if (income.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await Income.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: 'Income deleted' })

  } catch (error) {
    console.log('Delete income error:', error.message)
    return res.status(500).json({ message: 'Server error. Try again.' })
  }
}