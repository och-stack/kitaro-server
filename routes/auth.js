
const express = require("express");
const supabase = require("../supabaseClient");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

// Register a new user.
router.post("/signup", async (req, res) => {
    const { email, password, display_name } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof display_name !== "string" ||
        !email.trim() ||
        !password ||
        !display_name.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Email, password, and display name are required",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters",
        });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    display_name: display_name.trim(),
                },
            },
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: data.session
                ? "Account created successfully"
                : "Account created. Check your email to confirm your account.",
            user: data.user
                ? {
                    id: data.user.id,
                    email: data.user.email,
                }
                : null,
            access_token: data.session?.access_token ?? null,
            refresh_token: data.session?.refresh_token ?? null,
        });
    } catch (error) {
        console.error("Signup error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create account",
        });
    }
});

// Sign in an existing user.
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (error || !data.user || !data.session) {
            return res.status(401).json({
                success: false,
                message: "Unable to sign in with these credentials",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: data.user.id,
                email: data.user.email,
            },
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to sign in",
        });
    }
});

// Return the currently authenticated user.
router.get("/me", authenticateUser, (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
        },
    });
});

module.exports = router;
