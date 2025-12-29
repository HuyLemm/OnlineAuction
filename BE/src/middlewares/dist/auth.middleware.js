"use strict";
exports.__esModule = true;
exports.authenticateOptional = exports.authenticate = void 0;
var jwt_1 = require("../utils/jwt");
function authenticate(req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Missing or invalid Authorization header"
        });
    }
    var token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Missing or invalid Authorization header"
        });
    }
    try {
        var payload = jwt_1.verifyAccessToken(token);
        req.user = {
            userId: payload.userId,
            role: payload.role
        };
        next();
    }
    catch (_a) {
        return res.status(401).json({
            success: false,
            message: "Access token expired or invalid"
        });
    }
}
exports.authenticate = authenticate;
// authenticateOptional.ts (hoặc cùng file)
function authenticateOptional(req, _res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        delete req.user;
        return next();
    }
    var token = authHeader.split(" ")[1];
    if (!token) {
        delete req.user;
        return next();
    }
    try {
        var payload = jwt_1.verifyAccessToken(token);
        req.user = {
            userId: payload.userId,
            role: payload.role
        };
    }
    catch (_a) {
        delete req.user;
    }
    next();
}
exports.authenticateOptional = authenticateOptional;
