const express = require("express");
const router = express.Router();

const supabase = require("../supabaseClient");
const authenticateUser = require("../middleware/authenticateUser");
const validateUUID = require("../middleware/validateUUID");

router.param("id", validateUUID);

const ALLOWED_STATUSES = [
    "Submitted",
    "Going",
    "Resolved",
    "Rejected",
];

router.patch("/:id/status", authenticateUser, async (req, res) => {
    const { status, rejection_reason } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid report status",
        });
    }

    if (
        status === "Rejected" &&
        (typeof rejection_reason !== "string" ||
            !rejection_reason.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: "A rejection reason is required",
        });
    }

    try {
        // Check whether the authenticated user is an admin.
        const { data: admin, error: adminError } = await supabase
            .from("kitaro_admins")
            .select("user_id")
            .eq("user_id", req.user.id)
            .maybeSingle();

        if (adminError) {
            throw adminError;
        }

        if (!admin) {
            return res.status(403).json({
                success: false,
                message: "Administrator permission required",
            });
        }

        const updates = {
            status,
            rejection_reason:
                status === "Rejected" ? rejection_reason.trim() : null,
            last_edited_by: req.user.id,
            updated_at: new Date().toISOString(),
            resolved_at:
                status === "Resolved" ? new Date().toISOString() : null,
        };

        const { data, error } = await supabase
            .from("kitaro_waste_records")
            .update(updates)
            .eq("id", req.params.id)
            .select()
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
            message: "Waste report status updated",
            report: data,
        });
    } catch (error) {
        console.error("Admin status update error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update report status",
        });
    }
});

module.exports = router;
