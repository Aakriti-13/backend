const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all transactions / filter
router.get('/', auth, async (req, res) => {
  const { startDate, endDate, category, description } = req.query;
  const query = { userId: req.user.id };

  if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };
  if (category) query.category = category;
  if (description) query.description = new RegExp(description, 'i');

  const transactions = await Transaction.find(query).sort({ date: -1 });
  res.json(transactions);
});

// Add a transaction
router.post('/', auth, async (req, res) => {
  const { date, description, amount, category, type } = req.body;
  const newTransaction = new Transaction({
    userId: req.user.id,
    date,
    description,
    amount,
    category,
    type
  });
  await newTransaction.save();
  res.status(201).json({ msg: 'Transaction added' });
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Transaction deleted' });
});

// Update
router.put('/:id', auth, async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
