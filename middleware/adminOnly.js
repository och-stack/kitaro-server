// Check whether the authenticated user is an administrator
async function adminOnly(req, res, next) {
    try {
        const { data, error } = await req.supabase.rpc(
            "kitaro_is_admin"
        );

        if (error) {
            console.error("Admin verification error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to verify administrator access",
            });
        }

        if (!data) {
            return res.status(403).json({
                success: false,
                message: "Administrator permission required",
            });
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = adminOnly;