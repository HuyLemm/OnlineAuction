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
exports.sendQuestionNotificationMail = exports.sendOtpMail = void 0;
var mailer_1 = require("../config/mailer");
var env_1 = require("../config/env");
function sendOtpMail(email, otp) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mailer_1.mailer.sendMail({
                        from: env_1.env.MAIL_FROM,
                        to: email,
                        subject: "Verify your email - LuxeAuction",
                        html: "\n      <div style=\"font-family: Arial, sans-serif; line-height: 1.6\">\n        <h2>Verify your email</h2>\n        <p>Your verification code is:</p>\n        <h1 style=\"letter-spacing: 6px; color: #d4a446\">" + otp + "</h1>\n        <p>This code will expire in <b>2 minutes</b>.</p>\n        <p>\u2014 LuxeAuction Team</p>\n      </div>\n    "
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendOtpMail = sendOtpMail;
function sendQuestionNotificationMail(_a) {
    var to = _a.to, receiverName = _a.receiverName, senderName = _a.senderName, productTitle = _a.productTitle, productId = _a.productId, message = _a.message;
    return __awaiter(this, void 0, void 0, function () {
        var productLink;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    productLink = env_1.env.FRONTEND_URL + "/product/" + productId;
                    return [4 /*yield*/, mailer_1.mailer.sendMail({
                            from: env_1.env.MAIL_FROM,
                            to: to,
                            subject: "New message about \"" + productTitle + "\"",
                            html: "\n      <div style=\"font-family: Arial; line-height:1.6\">\n        <h2>Hello " + receiverName + ",</h2>\n\n        <p><b>" + senderName + "</b> has sent a new message about your product:</p>\n\n        <blockquote style=\"border-left:4px solid #d4a446; padding-left:12px; font-size: 16px\">\n          " + message + "\n        </blockquote>\n\n        <p>Click this link button below to follow up</p>\n\n        <a href=\"" + productLink + "\"\n           style=\"\n             display:inline-block;\n             margin-top:16px;\n             padding:10px 16px;\n             background:#d4a446;\n             color:black;\n             text-decoration:none;\n             font-weight:bold;\n             border-radius:6px;\n           \">\n          View product & reply\n        </a>\n\n        <p style=\"margin-top:24px\">\u2014 LuxeAuction Team</p>\n      </div>\n    "
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendQuestionNotificationMail = sendQuestionNotificationMail;
