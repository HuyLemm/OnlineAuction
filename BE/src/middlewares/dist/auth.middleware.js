"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.authenticateOptional = exports.authenticate = void 0;
var jwt_1 = require("../utils/jwt");
var db_1 = require("../config/db");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, payload, user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authHeader = req.headers.authorization;
                    if (!authHeader || !authHeader.startsWith("Bearer ")) {
                        return [2 /*return*/, res.status(401).json({
                                success: false,
                                message: "Missing or invalid Authorization header"
                            })];
                    }
                    token = authHeader.split(" ")[1];
                    if (!token) {
                        return [2 /*return*/, res.status(401).json({
                                success: false,
                                message: "Missing or invalid Authorization header"
                            })];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    payload = jwt_1.verifyAccessToken(token);
                    return [4 /*yield*/, db_1.db("users")
                            .select("id", "role", "is_deleted")
                            .where({ id: payload.userId })
                            .first()];
                case 2:
                    user = _b.sent();
                    if (!user) {
                        return [2 /*return*/, res.status(401).json({
                                success: false,
                                message: "User not found"
                            })];
                    }
                    if (user.is_deleted) {
                        return [2 /*return*/, res.status(403).json({
                                success: false,
                                message: "Account has been disabled"
                            })];
                    }
                    req.user = {
                        userId: user.id,
                        role: user.role
                    };
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: "Access token expired or invalid"
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.authenticate = authenticate;
function authenticateOptional(req, _res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, payload, user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authHeader = req.headers.authorization;
                    if (!authHeader || !authHeader.startsWith("Bearer ")) {
                        delete req.user;
                        return [2 /*return*/, next()];
                    }
                    token = authHeader.split(" ")[1];
                    if (!token) {
                        delete req.user;
                        return [2 /*return*/, next()];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    payload = jwt_1.verifyAccessToken(token);
                    return [4 /*yield*/, db_1.db("users")
                            .select("id", "role", "is_deleted")
                            .where({ id: payload.userId })
                            .first()];
                case 2:
                    user = _b.sent();
                    if (!user || user.is_deleted) {
                        delete req.user;
                        return [2 /*return*/, next()];
                    }
                    req.user = {
                        userId: user.id,
                        role: user.role
                    };
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    delete req.user;
                    return [3 /*break*/, 4];
                case 4:
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
exports.authenticateOptional = authenticateOptional;
