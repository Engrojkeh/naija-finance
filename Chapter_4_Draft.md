# CHAPTER FOUR

# SYSTEM TESTING, INTEGRATION, AND IMPLEMENTATION

## 4.1 Introduction

This chapter discusses the implementation, testing, and integration of the Real-Time Personal Finance Visualizer and Budget Tracker. It outlines the system requirements, the deployment environment, the testing strategies employed to ensure reliability, and a comprehensive walkthrough of the system’s core functionalities. The goal is to demonstrate how the designed system translates into a functional application that addresses the financial literacy and spending habit challenges among young professionals.

## 4.2 System Requirements

To ensure optimal performance of the application, specific hardware and software requirements must be met by both the host server and the client machines.

### 4.2.1 Software Requirements

* **Operating System:** Windows 10/11, macOS, or Linux.
* **Frontend Technologies:** React.js, Chart.js, HTML5, CSS3 (with Glassmorphism aesthetics).
* **Backend Technologies:** Node.js, Express.js.
* **Database Management System:** MySQL.
* **Other Tools:** `node-cron` for automated tasks, JSON Web Tokens (JWT) for authentication.
* **Web Browser:** Modern browsers such as Google Chrome, Mozilla Firefox, or Microsoft Edge.

### 4.2.2 Hardware Requirements (Minimum)

* **Processor:** Intel Core i3 or equivalent AMD processor (2.0 GHz or higher).
* **Memory (RAM):** 4 GB minimum (8 GB recommended for seamless local execution).
* **Storage:** At least 500 MB of free hard disk space.
* **Internet Connection:** Required for fetching real-time data and remote database access (if hosted on the cloud).

## 4.3 System Implementation

The system was implemented using a decoupled architecture separating the frontend user interface from the backend API services.

### 4.3.1 Frontend Implementation

The user interface was developed using React.js, utilizing a component-based architecture for enhanced maintainability. The UI heavily incorporates modern "Glassmorphism" design principles, utilizing translucent panes and 3D virtual elements (such as the virtual bank card) to create a premium, engaging experience for young professionals.

Key modules implemented include:

* **Dashboard Overview:** Integrates `react-chartjs-2` to render dynamic Pie, Bar, and Line charts that update instantaneously as new transactions are recorded.
* **Transaction Logger:** A unified form handling both Income and Expense datasets.
* **Granular Budget Alerts:** A real-time calculation engine that checks category spending against defined limits, rendering visual warning banners when 50%, 75%, and 90% thresholds are surpassed.

### 4.3.2 Backend Implementation

The backend was developed using Node.js and Express.js, following a strict Model-View-Controller (MVC) design pattern. This architectural choice improves code organization and scalability.

* **Database Connectivity:** A robust MySQL connection pool was established to ensure non-blocking query executions.
* **Automated Recurring Transactions:** A dedicated background scheduler (`node-cron`) was engineered to execute daily at midnight. It evaluates a `recurring_transactions` table to automatically log fixed subscriptions (e.g., utility bills, internet), directly addressing the automation scope defined in Chapter 1.
* **Security Middlewares:** Implementations include Helmet for HTTP header security, precise CORS policies, and Rate Limiting to protect against brute-force attacks.

## 4.4 System Testing

System testing was conducted at multiple levels to ensure that the integrated components function correctly and securely under various computational loads.

### 4.4.1 Unit Testing

Individual modules, such as the `budgetController` and `transactionController`, were tested in isolation. The mathematical logic calculating the total expenditure versus the budget limits was validated with specific dummy datasets to guarantee that the 50%, 75%, and 90% threshold alerts triggered accurately.

### 4.4.2 Integration Testing

Integration testing focused on the data flow between the React.js frontend and the Node.js backend. The API endpoints (e.g., `/api/transactions`, `/api/budgets`) were rigorously tested to ensure that HTTP POST and GET requests correctly mutated and retrieved data from the MySQL database, and that JWT authentication securely protected these private routes.

### 4.4.3 System and User Acceptance Testing

The entire application was tested end-to-end to evaluate the user experience. This involved simulating the typical workflow of a young professional:

1. Registering a new account.
2. Setting monthly limits for various categories (Food, Transport, Utilities).
3. Logging a mix of regular and recurring expenses.
4. Observing the dynamic state changes in the Chart.js visualizers.
The system responded reliably to all inputs without crashing, confirming its stability.

## 4.5 Description of Core System Interfaces

The application presents several intuitive interfaces designed to maximize user engagement:

* **Authentication Portal:** A secure, visually appealing gateway for user login and registration.
* **The Main Dashboard:** The focal point of the application displaying a 3D Virtual Card showing the total balance, flanked by responsive Pie and Line charts depicting spending behavior.
* **Budget Management Tab:** A dedicated module for setting and reviewing customized monthly spending constraints per category.
* **Record Management Array:** A tabular, filterable layout visualizing the historical ledger of all performed financial interactions.

## 4.6 Deployment Environment

For the scope of this project, the system was configured for local deployment using the `.env` configuration file to safely assign server ports and database credentials without exposing sensitive information. The frontend React development server runs on port 3000, while the Node API engine concurrently listens on port 5000, ensuring a smooth, real-time development environment.
