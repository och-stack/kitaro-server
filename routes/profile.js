
const express = require("express");
const supabase = require("../supabaseClient");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

// Get the authenticated user's profile.
router.get("/", authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("kitaro_users")
            .select(
                "id, display_name, user_type, postal_code, matched_area, created_at, updated_at"
            )
            .eq("id", req.user.id)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found",
                });
            }

            throw error;
        }

        return res.status(200).json({
            success: true,
            profile: data,
        });
    } catch (error) {
        console.error("Get profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve profile",
        });
    }
});

// Update permitted profile fields.
router.patch("/", authenticateUser, async (req, res) => {
    const { display_name, user_type, postal_code } = req.body;
    const updates = {};

    if (Object.hasOwn(req.body, "display_name")) {
        if (
            typeof display_name !== "string" ||
            !display_name.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Display name must not be empty",
            });
        }

        updates.display_name = display_name.trim();
    }

    if (Object.hasOwn(req.body, "user_type")) {
        if (!["resident", "small_business"].includes(user_type)) {
            return res.status(400).json({
                success: false,
                message: "User type must be resident or small_business",
            });
        }

        updates.user_type = user_type;
    }

    if (Object.hasOwn(req.body, "postal_code")) {
        if (
            postal_code !== null &&
            (
                typeof postal_code !== "string" ||
                !/^\d{5}$/.test(postal_code.trim())
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 5-digit Malaysian postcode",
            });
        }

        updates.postal_code =
            postal_code === null ? null : postal_code.trim();

        // Clear the old area when the postcode changes.
        updates.matched_area = null;
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide at least one valid field to update",
        });
    }

    updates.updated_at = new Date().toISOString();

    try {
        const { data, error } = await supabase
            .from("kitaro_users")
            .update(updates)
            .eq("id", req.user.id)
            .select(
                "id, display_name, user_type, postal_code, matched_area, updated_at"
            )
            .single();

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: data,
        });
    } catch (error) {
        console.error("Update profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile",
        });
    }
});

module.exports = router;
