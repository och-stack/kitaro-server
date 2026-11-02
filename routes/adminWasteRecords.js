
const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authenticateUser");
const adminOnly = require("../middleware/adminOnly");
const validateUUID = require("../middleware/validateUUID");

router.param("id", validateUUID);

const ALLOWED_STATUSES = [
    "Submitted",
    "Going",
    "Resolved",
];

// ADMIN: View all waste records
router.get("/", authenticateUser, adminOnly, async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from("kitaro_waste_records")
            .select(`
                *,
                user:kitaro_users (
                    display_name
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Admin list reports database error:", error);
            throw error;
        }

        return res.status(200).json({
            success: true,
            reports: data || [],
        });

    } catch (error) {
        console.error("Admin list reports error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve waste reports",
        });
    }
});

// ADMIN: Update waste record status
router.patch(
    "/:id/status",
    authenticateUser,
    adminOnly,
    async (req, res) => {
        const { status } = req.body;

        // Validate requested status
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report status",
            });
        }

        try {
            const currentTime = new Date().toISOString();

            const updates = {
                status,
                last_edited_by: req.user.id,
                updated_at: currentTime,
                resolved_at:
                    status === "Resolved"
                        ? currentTime
                        : null,
            };

            const { data, error } = await req.supabase
                .from("kitaro_waste_records")
                .update(updates)
                .eq("id", req.params.id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Admin status update database error:", error);
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
                message: "Waste record status updated successfully",
                report: data,
            });

        } catch (error) {
            console.error("Admin status update error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to update report status",
            });
        }
    }
);

module.exports = router;
