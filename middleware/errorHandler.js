
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    // Invalid JSON sent in the request body.
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body",
        });
    }

    console.error("Unexpected API error:", err.message);

    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}

module.exports = errorHandler;
