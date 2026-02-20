require('dotenv').config();

const express = require("express");
const { Pool } = require("pg");
const app = express();
const router = express.Router();

// new db pool -- supports testing in azure (requires ssl for db) anf railway (doesn't require db ssl)
const isRailwayInternal = process.env.DATABASE_URL?.includes('.railway.internal');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ...(isRailwayInternal ? {} : { ssl: { rejectUnauthorized: false } })
});
const PORT = process.env.PORT || 8080;

// old db pool
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// });

router.get("/ping", (req, res) => {
    console.log("Ping health check made on server");
    res.status(200).send("Healthy");
});

router.get("/db-test", async (req, res) => {
    try {
        console.log("Testing out the DB connection!");
        const result = await pool.query("SELECT NOW() as current_time, version() as pg_version");
        res.json({
            success: true,
            message: "Database connection successful!",
            data: result.rows[0]
        });
    } catch (err) {
        console.error("Database connection error:", err.message);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: err.message
        });
    }
});

app.use("/program", (req, res) => {
    console.log("\nThis is a new endpoint after running my infrastructure script to build all Cloud infra and the pipeline!\n");
    res.send({ resp: [1, 2, 3] });
});

app.use("/foo", (req, res) => {
    console.log("Foo hit!");
    res.send("bar");
});

app.use("/api", router);

app.get("/", (req, res) => {
    console.log("Base path hit");
    res.send("foo");
});

app.listen(PORT, () => {
    console.log("===========================================================");
    console.log(`============ Server is listening on port: ${PORT} ============`);
    console.log("===========================================================");
});
