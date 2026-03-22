require('dotenv').config();
const mysql = require('mysql2/promise');

async function installDatabase() {
    console.log("⏳ Connecting to Cloud Database...");
    
    try {
        // Connect to TiDB with multipleStatements enabled
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true,
            ssl: { rejectUnauthorized: false } // Required for secure cloud connections
        });

        console.log("✅ Connected! Installing tables and inserting your data...");

        const sql = `
            SET FOREIGN_KEY_CHECKS=0;
            DROP TABLE IF EXISTS budgets, categories, recurring_transactions, transactions, users;
            SET FOREIGN_KEY_CHECKS=1;

            CREATE TABLE users (
                user_id int(11) NOT NULL AUTO_INCREMENT,
                name varchar(100) NOT NULL,
                email varchar(150) NOT NULL,
                password_hash varchar(255) NOT NULL,
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                role varchar(10) DEFAULT 'user',
                refresh_token text DEFAULT NULL,
                PRIMARY KEY (user_id),
                UNIQUE KEY email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            INSERT INTO users (user_id, name, email, password_hash, created_at, role, refresh_token) VALUES
            (3, 'Aru Benjamin', 'arubenjamin99@gmail.com', '$2b$10$xGWNTEDGYHxVc4/EGz/EQu16qLIkzEWZM.fiG/Oik3lfccQCUxcpy', '2026-03-04 12:50:50', 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3NzMwMDg3MDksImV4cCI6MTc3MzYxMzUwOX0.VawI2BOJ5So0e5AoEhr__MEzV_qUbdsgKO70nXvGbos');

            CREATE TABLE categories (
                category_id int(11) NOT NULL AUTO_INCREMENT,
                user_id int(11) NOT NULL,
                category_name varchar(100) NOT NULL,
                PRIMARY KEY (category_id),
                CONSTRAINT categories_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            INSERT INTO categories (category_id, user_id, category_name) VALUES
            (13, 3, 'food'), (14, 3, 'transport');

            CREATE TABLE budgets (
                budget_id int(11) NOT NULL AUTO_INCREMENT,
                user_id int(11) NOT NULL,
                category_id int(11) NOT NULL,
                monthly_limit decimal(10,2) NOT NULL,
                month_year varchar(7) NOT NULL,
                PRIMARY KEY (budget_id),
                CONSTRAINT budgets_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                CONSTRAINT budgets_ibfk_2 FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            INSERT INTO budgets (budget_id, user_id, category_id, monthly_limit, month_year) VALUES
            (5, 3, 13, 25000.00, '2026-03'), (6, 3, 14, 15000.00, '2026-03');

            CREATE TABLE transactions (
                transaction_id int(11) NOT NULL AUTO_INCREMENT,
                user_id int(11) NOT NULL,
                category_id int(11) NOT NULL,
                amount decimal(10,2) NOT NULL,
                transaction_type enum('Income','Expense') NOT NULL,
                description varchar(255) DEFAULT NULL,
                transaction_date date NOT NULL,
                created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (transaction_id),
                CONSTRAINT transactions_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                CONSTRAINT transactions_ibfk_2 FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            INSERT INTO transactions (transaction_id, user_id, category_id, amount, transaction_type, description, transaction_date, created_at) VALUES
            (6, 3, 13, 2000.00, 'Expense', '', '2026-03-04', '2026-03-04 17:00:21'),
            (7, 3, 14, 1000.00, 'Expense', '', '2026-03-05', '2026-03-05 11:30:39');
        `;

        await db.query(sql);
        console.log("🚀 SUCCESS! Your cloud database is 100% ready.");
        process.exit();

    } catch (error) {
        console.error("❌ ERROR:", error.message);
        process.exit(1);
    }
}

installDatabase();