import { neon } from '@neondatabase/serverless';
import "dotenv/config";

export const sql = neon(process.env.Database_Url);

export async function initdb() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
       id SERIAL PRIMARY KEY,
       user_id VARCHAR(225) NOT NULL,
       title VARCHAR(225) NOT NULL,
       amount DECIMAL(10,2) NOT NULL,
       category VARCHAR(225) NOT NULL,
       created_at  DATE NOT NULL DEFAULT CURRENT_DATE
       )`
        console.log("Database created successfully");
    } catch (error) {
        console.log("Database error", error);
    }
}

