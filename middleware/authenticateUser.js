
const supabase = require("../supabaseClient");

async function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    const accessToken = authHeader.slice(7).trim();

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Access token is missing",
        });
    }

    try {
        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }

        req.user = data.user;

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to verify authentication",
        });
    }
}

module.exports = authenticateUser;
