const db = require('../config/db');

const createCategory = (req, res, next) => {
    const { user_id, category_name } = req.body;
    db.query("SELECT category_id FROM categories WHERE user_id = ? AND category_name = ?", [user_id, category_name], (err, results) => {
        if (results.length > 0) return res.status(200).json({ category_id: results[0].category_id });
        db.query("INSERT INTO categories (user_id, category_name) VALUES (?, ?)", [user_id, category_name], (err, result) => {
            if (err) return next(err);
            res.status(201).json({ category_id: result.insertId });
        });
    });
};

module.exports = {
    createCategory
};
