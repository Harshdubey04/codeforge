const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const adminMiddleware = async (req, res, next) => {
    try {
        //  Get token from cookies
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token is not present...");
        }

        //  Check if token is blacklisted in Redis
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error("Token is blocked. Please login again.");
        }

        //  Verify token
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id) {
            throw new Error("Invalid Token...");
        }

        //  Find user
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User does not exist...");
        }

        if(payload.role!='admin'){
            throw new Error("Invalid Token");
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports = adminMiddleware;