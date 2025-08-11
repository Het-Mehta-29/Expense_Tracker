import express from 'express';
import dotenv from 'dotenv';
import { initdb } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(ratelimiter);
app.use("/api/transactions", transactionsRoute);


initdb().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running at PORT:", PORT);
    });
})