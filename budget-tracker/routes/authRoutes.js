const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { passwordResetLimiter, allowedOrigins } = require('../middleware/securityMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);

router.get('/redirect', (req, res) => {
    const targetUrl = req.query.url;
    if (!allowedOrigins.includes(targetUrl)) return res.status(400).json({ error: "Invalid redirect URL." });
    res.redirect(targetUrl);
});

module.exports = router;
