import ratelimiter from "../src/config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimiter.limit("My-rate-limit");
        if (!success) {
            return res.staus(429).json({ message: "Too many requests ,try again later" });
        }
        next();
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
}
export default ratelimiter;