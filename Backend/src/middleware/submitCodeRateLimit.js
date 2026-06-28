const redisClient = require("../config/redis");


const submitCodeRateLimit = async (req, res, next) => {
    const userId = req.user._id.toString();

    const result = await redisClient.set(
        `submit:${userId}`,
        "1",
        {
            NX: true,
            EX: 10
        }
    );

    if (!result) {
        return res.status(429).json({
            message: "Please wait 10 seconds before submitting again."
        });
    }

    next();
};
module.exports = submitCodeRateLimit ;