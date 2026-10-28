
const express = require("express");
const supabase = require("../supabaseClient");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

async function getAnalytics(functionName) {
    const { data, error } = await supabase.rpc(functionName);

    if (error) {
        throw error;
    }

    return data;
}

// Waste hotspots.
router.get("/hotspots", authenticateUser, async (req, res) => {
    try {
        const data = await getAnalytics("kitaro_analytics_hotspots");

        return res.status(200).json({
            success: true,
            analytics: data,
        });
    } catch (error) {
        console.error("Hotspot analytics error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to calculate waste hotspots",
        });
    }
});

// Waste composition.
router.get("/composition", authenticateUser, async (req, res) => {
    try {
        const data = await getAnalytics("kitaro_analytics_composition");

        return res.status(200).json({
            success: true,
            analytics: data,
        });
    } catch (error) {
        console.error("Composition analytics error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to calculate waste composition",
        });
    }
});

// Monthly reporting trends.
router.get("/trends", authenticateUser, async (req, res) => {
    try {
        const data = await getAnalytics("kitaro_analytics_trends");

        return res.status(200).json({
            success: true,
            analytics: data,
        });
    } catch (error) {
        console.error("Reporting trends error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to calculate reporting trends",
        });
    }
});

module.exports = router;
