
const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

// Reusable analytics function
async function getAnalytics(client, functionName) {
    const { data, error } = await client.rpc(functionName);

    if (error) {
        throw error;
    }

    return data;
}

// Waste hotspots
router.get("/hotspots", authenticateUser, async (req, res) => {
    try {
        const data = await getAnalytics(
            req.supabase,
            "kitaro_analytics_hotspots"
        );

        return res.status(200).json({
            success: true,
            analytics: data,
        });
    } catch (error) {
        console.error("Hotspot analytics error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to calculate waste hotspots",
        });
    }
});

// Waste composition
router.get("/composition", authenticateUser, async (req, res) => {
    try {
        const data = await getAnalytics(
            req.supabase,
            "kitaro_analytics_composition"
        );

        return res.status(200).json({
            success: true,
            analytics: data,
        });
    } catch (error) {
        console.error("Composition analytics error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to calculate waste composition",
        });
    }
});

// Monthly reporting trends
router.get("/trends", authenticateUser, async (req, res) => {
    try {
        const data = await getAnalytics(
            req.supabase,
            "kitaro_analytics_trends"
        );

        return res.status(200).json({
            success: true,
            analytics: data,
        });
    } catch (error) {
        console.error("Reporting trends error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to calculate reporting trends",
        });
    }
});

module.exports = router;
