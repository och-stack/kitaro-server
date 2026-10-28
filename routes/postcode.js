
const express = require("express");
const supabase = require("../supabaseClient");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/lookup", authenticateUser, async (req, res) => {
    const { postal_code } = req.body;

    if (
        typeof postal_code !== "string" ||
        !/^\d{5}$/.test(postal_code.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid 5-digit Malaysian postcode",
        });
    }

    try {
        const postcode = postal_code.trim();

        const response = await fetch(
            `https://countries.dev/postal/MY/${encodeURIComponent(postcode)}`,
            { signal: AbortSignal.timeout(8000) }
        );

        if (response.status === 404) {
            return res.status(404).json({
                success: false,
                message: "Postcode not found",
            });
        }

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: "Postcode lookup service is unavailable",
            });
        }

        const result = await response.json();

        // The postal endpoint returns a list of matching places.
        const place = Array.isArray(result) ? result[0] : result;

        if (!place || !place.placeName) {
            return res.status(404).json({
                success: false,
                message: "No area information found for this postcode",
            });
        }

        const matchedArea = [
            place.placeName,
            place.adminName1,
        ]
            .filter(Boolean)
            .join(", ");

        const { data, error } = await supabase
            .from("kitaro_users")
            .update({
                postal_code: postcode,
                matched_area: matchedArea,
                updated_at: new Date().toISOString(),
            })
            .eq("id", req.user.id)
            .select("id, postal_code, matched_area")
            .single();

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Postcode matched successfully",
            profile: data,
        });
    } catch (error) {
        console.error("Postcode lookup error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to look up postcode",
        });
    }
});

module.exports = router;
