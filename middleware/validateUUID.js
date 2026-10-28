
function validateUUID(req, res, next, value) {
    const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(value)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }

    next();
}

module.exports = validateUUID;
