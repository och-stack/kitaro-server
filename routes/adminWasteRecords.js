// ADMIN: View all waste records
router.get("/", authenticateUser, adminOnly, async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from("kitaro_waste_records")
            .select(`
                *,
                user:kitaro_users!kitaro_waste_records_user_id_fkey (
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