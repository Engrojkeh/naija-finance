const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Authentication required." });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user;
        next();
    });
};

const requireAdminOrCreator = (req, res, next) => {
    const targetUserId = req.body?.user_id || req.params.user_id || req.params.id;

    if (req.user.role === 'admin' || req.user.id == targetUserId) {
        return next();
    }
    return res.status(403).json({ error: "Access denied." });
};

module.exports = {
    authenticateToken,
    requireAdminOrCreator
};
