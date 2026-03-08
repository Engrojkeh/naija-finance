require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Config and Middlewares
require('./config/db'); // Initialize DB pool
require('./scheduler/cronJobs'); // Initialize Recurring Tasks
const { helmet, corsOptions, sanitizeInput, apiLimiter } = require('./middleware/securityMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// ==========================================
// SECURITY & GLOBAL MIDDLEWARES
// ==========================================
app.use(helmet());
app.use(express.json());
app.use(sanitizeInput);
app.use(cors(corsOptions));

// Apply rate limiting specifically to /api
app.use('/api', apiLimiter);

// ==========================================
// ROUTES
// ==========================================
app.use('/api', authRoutes); // Login, Register, Forgot Password
app.use('/api', apiRoutes);  // Protected Budget and Transaction endpoints

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
    console.error(`[SERVER ERROR] ${new Date().toISOString()}:`, err.stack || err);
    res.status(500).json({ error: "An unexpected error occurred while processing your request." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));