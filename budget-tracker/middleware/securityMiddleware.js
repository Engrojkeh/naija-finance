const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const allowedOrigins = ['http://localhost:3000', 'https://fyp-personal-finance-tracker.vercel.app'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    credentials: true
};

const sanitizeInput = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
            }
        }
    }
    next();
};

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: { error: "Too many requests. Please try again later." }
});

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { error: "Too many password reset attempts. Try again in an hour." }
});

module.exports = {
    helmet,
    corsOptions,
    sanitizeInput,
    apiLimiter,
    passwordResetLimiter,
    allowedOrigins
};
