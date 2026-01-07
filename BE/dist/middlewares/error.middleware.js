"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
function errorMiddleware(err, req, res, next) {
    console.error("❌ Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
}
//# sourceMappingURL=error.middleware.js.map