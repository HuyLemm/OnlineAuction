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
exports.AdminController = void 0;
var admin_service_1 = require("../services/admin.service");
var AdminController = /** @class */ (function () {
    function AdminController() {
    }
    // ===============================
    // GET /admin/seller-upgrade-requests
    // ===============================
    AdminController.getUpgradeRequests = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, admin_service_1.AdminService.getUpgradeRequests()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: data
                            })];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_1.message || "Failed to load requests"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // POST /admin/categories/parent
    // ==================================================
    AdminController.createParentCategory = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, name, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        name = req.body.name;
                        if (!adminId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!name) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Category name is required"
                                })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.createParentCategory(name)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                message: result.message,
                                data: { id: result.id }
                            })];
                    case 2:
                        error_2 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_2.message || "Create parent category failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // POST /admin/categories/sub
    // ==================================================
    AdminController.createSubcategory = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, _b, parentId, name, result, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        _b = req.body, parentId = _b.parentId, name = _b.name;
                        if (!adminId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!parentId || !name) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "parentId and name are required"
                                })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.createSubcategory(Number(parentId), name)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                message: result.message,
                                data: { id: result.id }
                            })];
                    case 2:
                        error_3 = _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_3.message || "Create subcategory failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /admin/categories/parent/:id
    AdminController.updateParentCategory = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, name, result, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        name = req.body.name;
                        if (!adminId)
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        return [4 /*yield*/, admin_service_1.AdminService.updateParentCategory(Number(id), name)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: result.message })];
                    case 2:
                        error_4 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ success: false, message: error_4.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /admin/categories/sub/:id
    AdminController.updateSubcategory = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, name, result, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        name = req.body.name;
                        if (!adminId)
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        return [4 /*yield*/, admin_service_1.AdminService.updateSubcategory(Number(id), name)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: result.message })];
                    case 2:
                        error_5 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ success: false, message: error_5.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /admin/categories/parent/:id
    AdminController.deleteParentCategory = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, result, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        if (!adminId)
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        return [4 /*yield*/, admin_service_1.AdminService.deleteParentCategory(Number(id))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: result.message })];
                    case 2:
                        error_6 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ success: false, message: error_6.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /admin/categories/sub/:id
    AdminController.deleteSubcategory = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, result, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        if (!adminId)
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        return [4 /*yield*/, admin_service_1.AdminService.deleteSubcategory(Number(id))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: result.message })];
                    case 2:
                        error_7 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ success: false, message: error_7.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // GET /admin/products
    // ==================================================
    AdminController.getAdminProducts = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, _b, parentCategoryId, sortBy, minPrice, maxPrice, params, data, error_8;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!adminId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        _b = req.query, parentCategoryId = _b.parentCategoryId, sortBy = _b.sortBy, minPrice = _b.minPrice, maxPrice = _b.maxPrice;
                        params = {};
                        if (parentCategoryId) {
                            params.parentCategoryId = Number(parentCategoryId);
                        }
                        if (sortBy) {
                            params.sortBy = String(sortBy);
                        }
                        if (minPrice) {
                            params.minPrice = Number(minPrice);
                        }
                        if (maxPrice) {
                            params.maxPrice = Number(maxPrice);
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.getAdminProducts(params)];
                    case 1:
                        data = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: data
                            })];
                    case 2:
                        error_8 = _c.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_8.message || "Failed to load products"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // PUT /admin/products/:id
    // ==================================================
    AdminController.updateProduct = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, _b, title, description, buyNowPrice, status, result, error_9;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        _b = req.body, title = _b.title, description = _b.description, buyNowPrice = _b.buyNowPrice, status = _b.status;
                        if (!adminId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!id) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Product id is required"
                                })];
                        }
                        if (!title || !status) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Title and status are required"
                                })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.updateProduct(id, {
                                title: title,
                                description: description,
                                buyNowPrice: buyNowPrice,
                                status: status
                            })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: result.message
                            })];
                    case 2:
                        error_9 = _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_9.message || "Update product failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // DELETE /admin/products/:id
    // ==================================================
    AdminController.toggleDeleteProduct = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, expired, result, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        expired = req.body.expired;
                        if (!adminId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!id) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Product id is required"
                                })];
                        }
                        if (typeof expired !== "boolean") {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "`expired` boolean is required"
                                })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.toggleDeleteProduct(id, expired)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: result.message
                            })];
                    case 2:
                        e_1 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: e_1.message || "Toggle delete product failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // GET /admin/users
    // ==================================================
    AdminController.getAdminUsers = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.getAdminUsers()];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.json({ success: true, data: data })];
                    case 2:
                        e_2 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ success: false, message: e_2.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // POST /admin/seller-upgrade-requests/:id/approve
    // ==================================================
    AdminController.approveSellerUpgrade = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, result, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        if (!adminId) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        }
                        if (!id) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ success: false, message: "Request id is required" })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.approveUpgradeRequest(id, adminId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.json({ success: true, message: result.message })];
                    case 2:
                        e_3 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ success: false, message: e_3.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // POST /admin/seller-upgrade-requests/:id/reject
    // ==================================================
    AdminController.rejectSellerUpgrade = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, result, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        if (!adminId) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        }
                        if (!id) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ success: false, message: "Request id is required" })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.rejectUpgradeRequest(id, adminId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.json({ success: true, message: result.message })];
                    case 2:
                        e_4 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ success: false, message: e_4.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // GET /admin/users/:id
    // ==================================================
    AdminController.getUserDetails = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, data, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        if (!adminId) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        }
                        if (!id) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ success: false, message: "User id is required" })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.getUserById(id)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: data
                            })];
                    case 2:
                        e_5 = _b.sent();
                        return [2 /*return*/, res.status(404).json({ success: false, message: e_5.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // PUT /admin/users/:id
    // ==================================================
    AdminController.updateUser = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, _b, fullName, email, role, isBlocked, isVerified, dob, address, result, e_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        _b = req.body, fullName = _b.fullName, email = _b.email, role = _b.role, isBlocked = _b.isBlocked, isVerified = _b.isVerified, dob = _b.dob, address = _b.address;
                        if (!adminId) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ success: false, message: "Unauthorized" })];
                        }
                        if (!id || !fullName || !email || !role) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Missing required fields"
                                })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.updateUser(id, {
                                fullName: fullName,
                                email: email,
                                role: role,
                                isBlocked: Boolean(isBlocked),
                                isVerified: Boolean(isVerified),
                                dob: dob,
                                address: address
                            })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: result.message
                            })];
                    case 2:
                        e_6 = _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: e_6.message
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminController.toggleBanUser = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, ban, result, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        ban = req.body.ban;
                        if (!adminId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!id) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "User id is required"
                                })];
                        }
                        if (typeof ban !== "boolean") {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "`ban` boolean is required"
                                })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.toggleBanUser(id, ban)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: result.message
                            })];
                    case 2:
                        e_7 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: e_7.message || "Toggle ban failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // DELETE /admin/users/:id
    // ==================================================
    AdminController.toggleDeleteUser = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var adminId, id, deleted, result, e_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        id = req.params.id;
                        deleted = req.body.deleted;
                        if (!adminId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!id) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "User id is required"
                                })];
                        }
                        if (typeof deleted !== "boolean") {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "`deleted` boolean is required"
                                })];
                        }
                        return [4 /*yield*/, admin_service_1.AdminService.toggleDeleteUser(id, deleted)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: result.message
                            })];
                    case 2:
                        e_8 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: e_8.message || "Toggle delete user failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AdminController;
}());
exports.AdminController = AdminController;
