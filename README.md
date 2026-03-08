# Real-Time Personal Finance Visualizer and Budget Tracker

**Final Year Project (FYP)** by Benjamin.
Topic: *DESIGN AND IMPLEMENTATION OF A REAL-TIME PERSONAL FINANCE VISUALIZER AND BUDGET TRACKER TO IMPROVE FINANCIAL LITERACY AND SPENDING HABITS AMONG YOUNG PROFESSIONALS.*

This repository contains the complete source code for the project, structured as a monorepo containing both the React frontend and the Node.js/Express backend.

## 🚀 Features

- **3D Interactive Dashboard**: Built with modern CSS glassmorphism and React.
- **Granular Budget Alerts**: Visual indicators trigger automatically when spending reaches 50%, 75%, and 90% of set category limits.
- **Dynamic Charts**: Interactive Pie, Bar, and Line charts using Chart.js to visualize spending distribution and trends over time.
- **Transaction Logger**: Easily record both Income and Expenses to maintain an accurate cash flow.
- **Automated Recurring Transactions**: A background scheduler built with `node-cron` automatically logs subscriptions and fixed daily/weekly/monthly costs.
- **Secure Authentication**: JWT-based login and registration system with refresh token rotation.

---

## 🛠️ Project Structure

- `/frontend` - The UI layer, built with React, Axios, and Chart.js.
- `/budget-tracker` - The API backend layer, built with Node.js, Express, and MySQL.

---

## 💻 Local Setup Instructions for Examiners

To run this application on your local machine, you will need **Node.js** and **MySQL** installed.

### 1. Database Setup

1. Open your MySQL server (via XAMPP, Workbench, or terminal).
2. Create a database named `budget_tracker`.
3. The application will automatically create the necessary tables (`users`, `categories`, `budgets`, `transactions`, `recurring_transactions`) upon the first successful backend connection if they do not exist. *(Note: Ensure you have imported any provided SQL dumps if your examiner package included one).*

### 2. Backend Setup

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd budget-tracker
   ```

2. Install the required Node dependencies:

   ```bash
   npm install
   ```

3. Configure the environment variables:
   - Create a `.env` file in the `budget-tracker` folder.
   - Add the following keys (adjust database credentials to match your local MySQL setup):

     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=budget_tracker
     ACCESS_TOKEN_SECRET=your_jwt_access_secret_here
     REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_here
     ```

4. Start the server:

   ```bash
   npm start
   ```

   *(The server will run on `http://localhost:5000`)*

### 3. Frontend Setup

1. Open a **new** terminal window and navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install the required React dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   *(The application will automatically open in your default browser at `http://localhost:3000`)*

---

## 🧪 Testing the Application

1. **Register a New Account:** Open `http://localhost:3000` and create a test user account.
2. **Log Transactions:** Navigate to the "Transactions" tab to log sample salaries (Income) and purchases (Expenses).
3. **Set Budgets:** Navigate to the "Budgets" tab to assign spending limits to specific categories (e.g., Food: ₦10,000).
4. **View Alerts:** Go back to the Dashboard Overview. As you log expenses against a budgeted category, observe the 50%, 75%, and 90% alerts appearing automatically.
5. **Verify Automation:** The background cron job will log recurring transactions every day at midnight.

---
*Developed as a Final Year Project by Benjamin.*
