import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const transaction = await sql`SELECT * FROM transactions  WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.status(200).json(transaction);
    } catch (error) {
        console.log("Error getting the transactions", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/", async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !category || !user_id || amount === undefined) {
            return res.status(400).json({ message: "All fields are required " });
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category) 
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *`;


        console.log(transaction);
        res.status(201).json(transaction[0]);
    } catch (error) {
        console.log("Error creating the transaction ", error);
        res.status(500).json({ message: "Internal backend issue " });
    }
})

router.delete("/:Id", async (req, res) => {
    try {
        const { Id } = req.params;

        if (isNaN(parseInt(Id))) {
            res.status(400).json({ message: "Invalid Transaction id " });
        }
        const result = await sql` DELETE FROM transactions WHERE id=${Id} RETURNING *`;

        if (result.length === 0) {
            res.status(404).json({ message: "transcation not found" });
        }
        res.status(200).json({ message: "transaction deleted successfully" });
    } catch (error) {
        console.log("Error in finding the transaction ", error);
        res.status(500).json({ message: "Internal backend issue " });
    }
})

router.get("/:userId/summary", async (req, res) => {
    try {
        const { userId } = req.params;

        const balanceResult = await sql` SELECT COALESCE(SUM(amount), 0 )  as balance FROM transactions WHERE user_id = ${userId}`;

        const incomeResult = await sql`SELECT COALESCE(SUM(amount) , 0) as income FROM transactions WHERE user_id = ${userId} AND amount>0`;

        const expenseResult = await sql`SELECT COALESCE(SUM(amount) , 0) as expense FROM transactions WHERE user_id = ${userId} AND amount<0`;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense,
        })
    } catch (error) {
        console.log("Error in getting Summary", error)
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
})

