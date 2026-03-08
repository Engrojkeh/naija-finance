const db = require('../config/db');

const setBudget = (req, res, next) => {
    const { user_id, category_name, monthly_limit, month_year } = req.body;
    db.query("SELECT category_id FROM categories WHERE user_id = ? AND category_name = ?", [user_id, category_name], (err, results) => {
        const catIdQuery = results.length > 0 ? "SELECT ? as insertId" : "INSERT INTO categories (user_id, category_name) VALUES (?, ?)";
        const params = results.length > 0 ? [results[0].category_id] : [user_id, category_name];

        db.query(catIdQuery, params, (err, catRes) => {
            if (err) return next(err);
            const catId = results.length > 0 ? results[0].category_id : catRes.insertId;
            db.query("INSERT INTO budgets (user_id, category_id, monthly_limit, month_year) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE monthly_limit = ?",
                [user_id, catId, monthly_limit, month_year, monthly_limit], (err) => {
                    if (err) return next(err);
                    res.status(201).json({ message: "Budget set successfully" });
                });
        });
    });
};

const getBudgetSummary = (req, res, next) => {
    db.query(`SELECT c.category_name, MAX(b.monthly_limit) as monthly_limit, 
        COALESCE(SUM(CASE WHEN t.transaction_type = 'Expense' THEN t.amount ELSE 0 END), 0) as total_spent,
        COALESCE(SUM(CASE WHEN t.transaction_type = 'Income' THEN t.amount ELSE 0 END), 0) as total_income
        FROM categories c LEFT JOIN budgets b ON c.category_id = b.category_id AND b.user_id = ? AND b.month_year = ?
        LEFT JOIN transactions t ON c.category_id = t.category_id AND t.user_id = ? AND DATE_FORMAT(t.transaction_date, '%Y-%m') = ?
        WHERE c.user_id = ? GROUP BY c.category_id, c.category_name;`,
        [req.params.user_id, req.params.month_year, req.params.user_id, req.params.month_year, req.params.user_id], (err, results) => {
            if (err) return next(err);
            res.status(200).json(results);
        });
};

const getBudgets = (req, res, next) => {
    db.query("SELECT b.budget_id, b.monthly_limit, b.month_year, c.category_name FROM budgets b JOIN categories c ON b.category_id = c.category_id WHERE b.user_id = ? ORDER BY b.month_year DESC",
        [req.params.user_id], (err, results) => {
            if (err) return next(err);
            res.status(200).json(results);
        });
};

const deleteBudget = (req, res, next) => {
    db.query("DELETE FROM budgets WHERE budget_id = ?", [req.params.id], (err) => {
        if (err) return next(err);
        res.status(200).json({ message: "Deleted" });
    });
};

module.exports = {
    setBudget,
    getBudgetSummary,
    getBudgets,
    deleteBudget
};
