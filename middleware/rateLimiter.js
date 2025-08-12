import upstashLimiter from "../config/upstash.js";

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        const { success } = await upstashLimiter.limit("My-rate-limit");
        if (!success) {
            return res.status(429).json({ message: "Too many requests, try again later" });
        }
        next();
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
};

export default rateLimiterMiddleware;
