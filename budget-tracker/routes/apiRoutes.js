const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const transactionController = require('../controllers/transactionController');
const budgetController = require('../controllers/budgetController');
const { authenticateToken, requireAdminOrCreator } = require('../middleware/authMiddleware');

// Secure all API routes
router.use(authenticateToken);

// Categories
router.post('/categories', requireAdminOrCreator, categoryController.createCategory);

// Transactions
router.post('/transactions', requireAdminOrCreator, transactionController.createTransaction);
router.get('/transactions/:user_id', requireAdminOrCreator, transactionController.getTransactions);
router.delete('/transactions/:id', transactionController.deleteTransaction);

// Budgets
router.post('/budgets', requireAdminOrCreator, budgetController.setBudget);
router.get('/budget-summary/:user_id/:month_year', requireAdminOrCreator, budgetController.getBudgetSummary);
router.get('/budgets/:user_id', requireAdminOrCreator, budgetController.getBudgets);
router.delete('/budgets/:id', budgetController.deleteBudget);

module.exports = router;
