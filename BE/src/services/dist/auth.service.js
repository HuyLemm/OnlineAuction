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
exports.AuthService = void 0;
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var db_1 = require("../config/db");
var sendOtpMail_1 = require("../utils/sendOtpMail");
var jwt_1 = require("../utils/jwt");
var time_1 = require("../utils/time");
var SALT_ROUNDS = 10;
var OTP_EXPIRE_MINUTES = 2; // OTP sống 2 phút
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    // ===============================
    // Login
    // ===============================
    AuthService.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isMatch, accessToken, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users")
                            .select("id", "email", "password_hash", "is_verified", "role")
                            .where({ email: email })
                            .first()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("Email not found.");
                        }
                        // 2️⃣ Check verify
                        if (!user.is_verified) {
                            throw new Error("Please verify your email before logging in.");
                        }
                        return [4 /*yield*/, bcrypt_1["default"].compare(password, user.password_hash)];
                    case 2:
                        isMatch = _a.sent();
                        if (!isMatch) {
                            throw new Error("Password incorrect.");
                        }
                        accessToken = jwt_1.signAccessToken({
                            userId: user.id,
                            role: user.role
                        });
                        refreshToken = jwt_1.signRefreshToken({
                            userId: user.id
                        });
                        return [4 /*yield*/, db_1.db("user_sessions").where({ user_id: user.id }).del()];
                    case 3:
                        _a.sent();
                        // 5️⃣ Lưu refresh token vào DB
                        return [4 /*yield*/, db_1.db("user_sessions").insert({
                                user_id: user.id,
                                refresh_token: refreshToken,
                                created_at: db_1.db.raw("NOW()"),
                                expired_at: db_1.db.raw("NOW() + INTERVAL '7 DAYS'")
                            })];
                    case 4:
                        // 5️⃣ Lưu refresh token vào DB
                        _a.sent();
                        // 6️⃣ Trả kết quả
                        return [2 /*return*/, {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                id: user.id,
                                email: user.email,
                                role: user.role
                            }];
                }
            });
        });
    };
    // ===============================
    // Register
    // ===============================
    AuthService.register = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var dbNow, existingUser, passwordHash, user, otp;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, time_1.getDbNow(trx)];
                                    case 1:
                                        dbNow = _a.sent();
                                        return [4 /*yield*/, trx("users")
                                                .select("id", "is_verified")
                                                .where({ email: dto.email })
                                                .first()];
                                    case 2:
                                        existingUser = _a.sent();
                                        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.is_verified) {
                                            throw new Error("Email already exists");
                                        }
                                        if (!(existingUser && !existingUser.is_verified)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, trx("user_otps").where({ user_id: existingUser.id }).del()];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, trx("users").where({ id: existingUser.id }).del()];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [4 /*yield*/, bcrypt_1["default"].hash(dto.password, SALT_ROUNDS)];
                                    case 6:
                                        passwordHash = _a.sent();
                                        return [4 /*yield*/, trx("users")
                                                .insert({
                                                full_name: dto.fullName,
                                                email: dto.email,
                                                password_hash: passwordHash,
                                                address: dto.address,
                                                role: "bidder",
                                                is_verified: false,
                                                last_otp_sent_at: dbNow,
                                                created_at: dbNow
                                            })
                                                .returning(["id", "email"])];
                                    case 7:
                                        user = (_a.sent())[0];
                                        otp = AuthService.generateOTP();
                                        // 5. Insert OTP
                                        return [4 /*yield*/, trx("user_otps").insert({
                                                user_id: user.id,
                                                otp_code: otp,
                                                purpose: "verify_email",
                                                expired_at: db_1.db.raw("NOW() + INTERVAL '" + OTP_EXPIRE_MINUTES + " MINUTES'")
                                            })];
                                    case 8:
                                        // 5. Insert OTP
                                        _a.sent();
                                        // 6. Gửi mail (thay console.log sau)
                                        return [4 /*yield*/, sendOtpMail_1.sendOtpMail(user.email, otp)];
                                    case 9:
                                        // 6. Gửi mail (thay console.log sau)
                                        _a.sent();
                                        console.log("OTP REGISTER " + user.email + ": " + otp);
                                        return [2 /*return*/, {
                                                message: "OTP sent to your email.",
                                                email: user.email
                                            }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===============================
    // Verify OTP
    // ===============================
    AuthService.verifyOtp = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, otpRow, expired, accessToken, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users")
                            .select("id", "email", "is_verified", "role")
                            .where({ email: dto.email })
                            .first()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        if (user.is_verified)
                            throw new Error("User already verified");
                        return [4 /*yield*/, db_1.db("user_otps")
                                .where({
                                user_id: user.id,
                                otp_code: dto.otp,
                                purpose: dto.purpose
                            })
                                .first()];
                    case 2:
                        otpRow = _a.sent();
                        if (!otpRow)
                            throw new Error("Invalid OTP");
                        return [4 /*yield*/, db_1.db("user_otps")
                                .where({ id: otpRow.id })
                                .andWhere("expired_at", "<", db_1.db.raw("NOW()"))
                                .first()];
                    case 3:
                        expired = _a.sent();
                        if (expired)
                            throw new Error("OTP expired");
                        // Verify user
                        return [4 /*yield*/, db_1.db("users").where({ id: user.id }).update({
                                is_verified: true,
                                last_otp_sent_at: null
                            })];
                    case 4:
                        // Verify user
                        _a.sent();
                        // Xoá toàn bộ OTP
                        return [4 /*yield*/, db_1.db("user_otps").where({ user_id: user.id }).del()];
                    case 5:
                        // Xoá toàn bộ OTP
                        _a.sent();
                        accessToken = jwt_1.signAccessToken({
                            userId: user.id,
                            role: user.role
                        });
                        refreshToken = jwt_1.signRefreshToken({
                            userId: user.id
                        });
                        return [4 /*yield*/, db_1.db("user_sessions").where({ user_id: user.id }).del()];
                    case 6:
                        _a.sent();
                        // ✅ LƯU refresh token
                        return [4 /*yield*/, db_1.db("user_sessions").insert({
                                user_id: user.id,
                                refresh_token: refreshToken,
                                created_at: new Date(),
                                expired_at: db_1.db.raw("NOW() + INTERVAL '7 DAYS'")
                            })];
                    case 7:
                        // ✅ LƯU refresh token
                        _a.sent();
                        return [2 /*return*/, {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role
                                }
                            }];
                }
            });
        });
    };
    // ===============================
    // Resend OTP
    // ===============================
    AuthService.resendOtp = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var now, user, otp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "is_verified")
                                .where({ email: email })
                                .first()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        if (user.is_verified)
                            throw new Error("User already verified");
                        // Xoá OTP cũ
                        return [4 /*yield*/, db_1.db("user_otps")
                                .where({ user_id: user.id, purpose: "verify_email" })
                                .del()];
                    case 2:
                        // Xoá OTP cũ
                        _a.sent();
                        otp = AuthService.generateOTP();
                        return [4 /*yield*/, db_1.db("user_otps").insert({
                                user_id: user.id,
                                otp_code: otp,
                                purpose: "verify_email",
                                expired_at: db_1.db.raw("NOW() + INTERVAL '" + OTP_EXPIRE_MINUTES + " MINUTES'")
                            })];
                    case 3:
                        _a.sent();
                        // Gia hạn account
                        return [4 /*yield*/, db_1.db("users").where({ id: user.id }).update({ last_otp_sent_at: now })];
                    case 4:
                        // Gia hạn account
                        _a.sent();
                        // await sendOtpMail(email, otp);
                        console.log("OTP RESEND " + email + ": " + otp);
                        return [2 /*return*/, { message: "OTP resent successfully" }];
                }
            });
        });
    };
    // ===============================
    // Forgot Password - Request OTP
    // ===============================
    AuthService.requestForgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var now, user, otp, expiredAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "email", "is_verified")
                                .where({ email: email })
                                .first()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("Email not found");
                        }
                        if (!user.is_verified) {
                            throw new Error("Email is not verified");
                        }
                        // ❌ xoá OTP reset cũ
                        return [4 /*yield*/, db_1.db("user_otps")
                                .where({
                                user_id: user.id,
                                purpose: "reset_password"
                            })
                                .del()];
                    case 2:
                        // ❌ xoá OTP reset cũ
                        _a.sent();
                        otp = AuthService.generateOTP();
                        expiredAt = new Date(now.getTime() + OTP_EXPIRE_MINUTES * 60 * 1000);
                        return [4 /*yield*/, db_1.db("user_otps").insert({
                                user_id: user.id,
                                otp_code: otp,
                                purpose: "reset_password",
                                expired_at: db_1.db.raw("NOW() + INTERVAL '" + OTP_EXPIRE_MINUTES + " MINUTES'")
                            })];
                    case 3:
                        _a.sent();
                        // gửi mail
                        return [4 /*yield*/, sendOtpMail_1.sendOtpMail(user.email, otp)];
                    case 4:
                        // gửi mail
                        _a.sent();
                        console.log("OTP RESET PASSWORD " + email + ": " + otp);
                        return [2 /*return*/, {
                                message: "Password reset OTP sent to email"
                            }];
                }
            });
        });
    };
    // ===============================
    // Forgot Password - Verify OTP
    // ===============================
    AuthService.verifyForgotPasswordOtp = function (email, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var user, otpRow, expired;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users").select("id").where({ email: email }).first()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        return [4 /*yield*/, db_1.db("user_otps")
                                .where({
                                user_id: user.id,
                                otp_code: otp,
                                purpose: "reset_password"
                            })
                                .first()];
                    case 2:
                        otpRow = _a.sent();
                        if (!otpRow) {
                            throw new Error("Invalid OTP");
                        }
                        return [4 /*yield*/, db_1.db("user_otps")
                                .where({ id: otpRow.id })
                                .andWhere("expired_at", "<", db_1.db.raw("NOW()"))
                                .first()];
                    case 3:
                        expired = _a.sent();
                        if (expired)
                            throw new Error("OTP expired");
                        return [2 /*return*/, {
                                message: "OTP verified",
                                userId: user.id
                            }];
                }
            });
        });
    };
    // ===============================
    // Forgot Password - Reset Password
    // ===============================
    AuthService.resetPassword = function (userId, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!newPassword || newPassword.length < 8) {
                            throw new Error("Password must be at least 8 characters");
                        }
                        return [4 /*yield*/, bcrypt_1["default"].hash(newPassword, SALT_ROUNDS)];
                    case 1:
                        hash = _a.sent();
                        return [4 /*yield*/, db_1.db("users").where({ id: userId }).update({ password_hash: hash })];
                    case 2:
                        _a.sent();
                        // ❌ xoá OTP reset
                        return [4 /*yield*/, db_1.db("user_otps")
                                .where({
                                user_id: userId,
                                purpose: "reset_password"
                            })
                                .del()];
                    case 3:
                        // ❌ xoá OTP reset
                        _a.sent();
                        // ❌ revoke tất cả session
                        return [4 /*yield*/, db_1.db("user_sessions").where({ user_id: userId }).del()];
                    case 4:
                        // ❌ revoke tất cả session
                        _a.sent();
                        return [2 /*return*/, {
                                message: "Password reset successfully"
                            }];
                }
            });
        });
    };
    // ===============================
    // Refresh access token
    // ===============================
    AuthService.refreshAccessToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, session, user, newAccessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = jwt_1.verifyRefreshToken(refreshToken);
                        return [4 /*yield*/, db_1.db("user_sessions")
                                .where({ refresh_token: refreshToken })
                                .andWhere("expired_at", ">", db_1.db.raw("NOW()"))
                                .first()];
                    case 1:
                        session = _a.sent();
                        if (!session) {
                            throw new Error("Refresh token expired or revoked");
                        }
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "role")
                                .where({ id: payload.userId })
                                .first()];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        newAccessToken = jwt_1.signAccessToken({
                            userId: user.id,
                            role: user.role
                        });
                        return [2 /*return*/, {
                                accessToken: newAccessToken
                            }];
                }
            });
        });
    };
    // ===============================
    // Helpers
    // ===============================
    AuthService.generateOTP = function () {
        return crypto_1["default"].randomInt(100000, 999999).toString();
    };
    return AuthService;
}());
exports.AuthService = AuthService;
