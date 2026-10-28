
const express = require("express");
const supabase = require("../supabaseClient");

const router = express.Router();

// Check whether the Express server is running.
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "KITARO API is running",
    });
});

// Check whether the backend can query Supabase.
router.get("/supabase", async (req, res) => {
    try {
        const { error } = await supabase
            .from("kitaro_users")
            .select("id")
            .limit(1);

        if (error) {
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Supabase connection is working",
        });
    } catch (error) {
        console.error("Supabase health check failed:", error.message);

        res.status(503).json({
            success: false,
            message: "Supabase is unavailable",
        });
    }
});

module.exports = router;
