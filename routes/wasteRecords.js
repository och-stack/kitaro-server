const express = require("express");
const router = express.Router();

const supabase = require("../supabaseClient");
const authenticateUser = require("../middleware/authenticateUser");
const validateUUID = require("../middleware/validateUUID");

router.param("id", validateUUID);

const WASTE_TYPES = [
    "General / Residual Waste & Food Waste",
    "Paper & Cardboard",
    "Plastic",
    "Glass",
    "Metal",
    "Electronic Waste (E-waste)",
];

// Submit a waste report.
router.post("/", authenticateUser, async (req, res) => {
    const { waste_type, waste_weight, area, description } = req.body;

    if (
        !WASTE_TYPES.includes(waste_type) ||
        typeof area !== "string" ||
        !area.trim() ||
        typeof description !== "string" ||
        !description.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid waste type, area, and description are required",
        });
    }

    if (
        waste_weight !== undefined &&
        waste_weight !== null &&
        (!Number.isFinite(Number(waste_weight)) ||
            Number(waste_weight) <= 0)
    ) {
        return res.status(400).json({
            success: false,
            message: "Waste weight must be a positive number",
        });
    }

    try {
        const { data, error } = await supabase
            .from("kitaro_waste_records")
            .insert({
                user_id: req.user.id,
                waste_type,
                waste_weight:
                    waste_weight === undefined || waste_weight === null
                        ? null
                        : Number(waste_weight),
                area: area.trim(),
                description: description.trim(),
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return res.status(201).json({
            success: true,
            message: "Waste report submitted successfully",
            report: data,
        });
    } catch (error) {
        console.error("Create waste report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to submit waste report",
        });
    }
});

// List the logged-in user's waste reports.
router.get("/", authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("kitaro_waste_records")
            .select("*")
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            reports: data,
        });
    } catch (error) {
        console.error("List waste reports error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve waste reports",
        });
    }
});

// Retrieve one report owned by the logged-in user.
router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("kitaro_waste_records")
            .select("*")
            .eq("id", req.params.id)
            .eq("user_id", req.user.id)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Waste report not found",
            });
        }

        return res.status(200).json({
            success: true,
            report: data,
        });
    } catch (error) {
        console.error("Get waste report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve waste report",
        });
    }
});

module.exports = router;
