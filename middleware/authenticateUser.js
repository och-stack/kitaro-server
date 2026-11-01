
const { createClient } = require("@supabase/supabase-js");
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
        // Verify the user's access token
        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }

        req.user = data.user;

        // Create a Supabase client using this user's access token
        req.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                    detectSessionInUrl: false,
                },
            }
        );

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
