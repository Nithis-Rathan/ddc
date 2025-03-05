require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.post("/submit", async (req, res) => {
    try {
        const formData = req.body.data;
        const query = `
            INSERT INTO process_table (process, date, site, manpower, files, images, backblocks) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        for (const row of formData) {
            await pool.query(query, [
                row.process, row.date, row.site, row.manpower, row.files, row.images, row.backblocks
            ]);
        }
        res.json({ message: "Data inserted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database insertion failed" });
    }
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
