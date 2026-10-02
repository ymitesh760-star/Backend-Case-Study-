const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Authorization token is required"
        });
    }

    const match = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return res.status(401).json({
            message: "Authorization header must use the Bearer <token> format"
        });
    }

    try {
        req.user = jwt.verify(match[1], process.env.JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
