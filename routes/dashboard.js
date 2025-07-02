const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Summary
router.get('/summary', auth, async (req, res) => {
  const { month, year } = req.query;
  const match = { userId: req.user.id };

  if (month && year) {
    match.date = {
      $gte: new Date(`${year}-${month}-01`),
      $lt: new Date(`${year}-${Number(month) + 1}-01`)
    };
  }

  const transactions = await Transaction.find(match);

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions.slice(-5).reverse();

  res.json({
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    recentTransactions
  });
});

module.exports = router;
