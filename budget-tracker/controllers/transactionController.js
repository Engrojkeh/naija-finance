const db = require('../config/db');

const createTransaction = (req, res, next) => {
    const { user_id, category_id, amount, transaction_type, description, transaction_date } = req.body;
    db.query("INSERT INTO transactions (user_id, category_id, amount, transaction_type, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, category_id, amount, transaction_type, description, transaction_date], (err) => {
            if (err) return next(err);
            res.status(201).json({ message: "Expense Saved" });
        });
};

const getTransactions = (req, res, next) => {
    db.query("SELECT t.transaction_id, t.amount, t.transaction_date, t.description, c.category_name FROM transactions t JOIN categories c ON t.category_id = c.category_id WHERE t.user_id = ? ORDER BY t.transaction_date DESC",
        [req.params.user_id], (err, results) => {
            if (err) return next(err);
            res.status(200).json(results);
        });
};

const deleteTransaction = (req, res, next) => {
    db.query("DELETE FROM transactions WHERE transaction_id = ?", [req.params.id], (err) => {
        if (err) return next(err);
        res.status(200).json({ message: "Deleted" });
    });
};

module.exports = {
    createTransaction,
    getTransactions,
    deleteTransaction
};
