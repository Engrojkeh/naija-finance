const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        db.query("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            [req.body.name, req.body.email, hashedPassword], (err) => {
                if (err) return res.status(500).json({ error: "Email already exists" });
                res.status(201).json({ message: "User registered successfully!" });
            });
    } catch (error) { next(error); }
};

const login = (req, res, next) => {
    db.query("SELECT * FROM users WHERE email = ?", [req.body.email], async (err, results) => {
        try {
            if (err || results.length === 0) return res.status(401).json({ error: "Invalid credentials" });
            const user = results[0];
            const match = await bcrypt.compare(req.body.password, user.password_hash);
            if (!match) return res.status(401).json({ error: "Invalid credentials" });

            const accessToken = jwt.sign({ id: user.user_id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ id: user.user_id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            db.query("UPDATE users SET refresh_token = ? WHERE user_id = ?", [refreshToken, user.user_id], () => {
                res.status(200).json({ accessToken, refreshToken, user: { id: user.user_id, name: user.name, role: user.role } });
            });
        } catch (error) { next(error); }
    });
};

const refresh = (req, res, next) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: "Refresh token required." });

    db.query("SELECT * FROM users WHERE refresh_token = ?", [token], (err, results) => {
        try {
            if (err || results.length === 0) return res.status(403).json({ error: "Invalid refresh token." });
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403).json({ error: "Expired refresh token." });
                const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                const newRefreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                db.query("UPDATE users SET refresh_token = ? WHERE user_id = ?", [newRefreshToken, user.id], () => {
                    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
                });
            });
        } catch (error) { next(error); }
    });
};

const forgotPassword = (req, res) => {
    res.status(200).json({ message: "If that email exists, a reset link has been sent." });
};

module.exports = {
    register,
    login,
    refresh,
    forgotPassword
};
