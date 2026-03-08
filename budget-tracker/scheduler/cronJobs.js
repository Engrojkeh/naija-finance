const cron = require('node-cron');
const db = require('../config/db');

// Run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('[CRON] Checking for recurring transactions...');

    const today = new Date().toISOString().split('T')[0];

    // Assuming a table structure like: recurring_transactions (recurring_id, user_id, category_id, amount, transaction_type, description, frequency, next_date)
    const sqlSelect = `SELECT * FROM recurring_transactions WHERE next_date <= ?`;

    db.query(sqlSelect, [today], (err, results) => {
        if (err) {
            console.error('[CRON ERROR] Failed to fetch recurring transactions:', err);
            return;
        }

        if (results.length === 0) {
            console.log('[CRON] No recurring transactions due today.');
            return;
        }

        results.forEach(recurring => {
            // 1. Insert into transactions
            const insertSql = `INSERT INTO transactions (user_id, category_id, amount, transaction_type, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [recurring.user_id, recurring.category_id, recurring.amount, recurring.transaction_type, recurring.description + " (Auto-Recurring)", today];

            db.query(insertSql, params, (insertErr) => {
                if (insertErr) {
                    console.error('[CRON ERROR] Failed to log recurring transaction for User:', recurring.user_id, insertErr);
                } else {
                    console.log(`[CRON] Logged recurring ${recurring.transaction_type} for User ${recurring.user_id}`);

                    // 2. Calculate next date
                    const nextDateObj = new Date(recurring.next_date);
                    if (recurring.frequency === 'monthly') {
                        nextDateObj.setMonth(nextDateObj.getMonth() + 1);
                    } else if (recurring.frequency === 'weekly') {
                        nextDateObj.setDate(nextDateObj.getDate() + 7);
                    } else if (recurring.frequency === 'daily') {
                        nextDateObj.setDate(nextDateObj.getDate() + 1);
                    }
                    const nextDateStr = nextDateObj.toISOString().split('T')[0];

                    // 3. Update next_date in recurring_transactions
                    db.query(`UPDATE recurring_transactions SET next_date = ? WHERE recurring_id = ?`,
                        [nextDateStr, recurring.recurring_id], (updateErr) => {
                            if (updateErr) console.error('[CRON ERROR] Failed to update next_date:', updateErr);
                        });
                }
            });
        });
    });
});

console.log('[CRON] Recurring transaction scheduler initialized.');
module.exports = {};
