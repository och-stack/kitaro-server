
// Register a new user.
router.post("/signup", async (req, res) => {
    const { email, password, display_name } = req.body;

    // Check required fields.
    if (!email || !password || !display_name) {
        return res.status(400).json({
            success: false,
            message: "Email, password, and display name are required",
        });
    }

    // Clean up the input values.
    const cleanEmail = email.trim().toLowerCase();
    const cleanDisplayName = display_name.trim();

    // Check email format.
    if (
        !cleanEmail.includes("@") ||
        !cleanEmail.includes(".") ||
        cleanEmail.lastIndexOf(".") < cleanEmail.indexOf("@")
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address",
        });
    }

    // Check password length.
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters",
        });
    }

    try {
        // Create the account in Supabase.
        const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: password,
            options: {
                data: {
                    display_name: cleanDisplayName,
                },
            },
        });

        // Handle Supabase errors.
        if (error) {
            console.log("Signup error:", error.message);

            return res.status(400).json({
                success: false,
                message: error.message,
                code: error.code,
            });
        }

        // Send the successful response.
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
            access_token: data.session?.access_token || null,
            refresh_token: data.session?.refresh_token || null,
        });

    } catch (error) {
        console.log("Signup error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create account",
        });
    }
});
