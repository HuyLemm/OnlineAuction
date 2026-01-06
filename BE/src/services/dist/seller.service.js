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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.SellerService = void 0;
var db_1 = require("../config/db");
var supabase_1 = require("../config/supabase");
var crypto_1 = require("crypto");
var path_1 = require("path");
var sendOtpMail_1 = require("../utils/sendOtpMail");
var time_1 = require("../utils/time");
var CANCEL_REASON_COMMENT = {
    payment_timeout: "Buyer did not submit payment on time",
    buyer_unresponsive: "Buyer did not respond to messages",
    suspicious_activity: "Suspicious buyer activity"
};
var SellerService = /** @class */ (function () {
    function SellerService() {
    }
    /* ===============================
     * INTERNAL: read auto-extend config
     * =============================== */
    SellerService.getAutoExtendSettings = function () {
        return __awaiter(this, void 0, Promise, function () {
            var rows, thresholdMinutes, durationMinutes, _i, rows_1, row, key, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("system_settings").select("key", "value")];
                    case 1:
                        rows = _a.sent();
                        thresholdMinutes = null;
                        durationMinutes = null;
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            row = rows_1[_i];
                            key = String(row.key).trim();
                            value = Number(String(row.value).trim());
                            if (Number.isNaN(value))
                                continue;
                            if (key.includes("threshold") && key.includes("minute")) {
                                thresholdMinutes = value;
                            }
                            if (key.includes("duration") && key.includes("minute")) {
                                durationMinutes = value;
                            }
                        }
                        if (thresholdMinutes === null ||
                            durationMinutes === null ||
                            thresholdMinutes <= 0 ||
                            durationMinutes <= 0) {
                            throw new Error("Auto-extend system settings are invalid");
                        }
                        return [2 /*return*/, {
                                thresholdMinutes: thresholdMinutes,
                                durationMinutes: durationMinutes
                            }];
                }
            });
        });
    };
    /* ===============================
     * PUBLIC: get auto-extend config
     * =============================== */
    SellerService.getAutoExtendConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, SellerService.getAutoExtendSettings()];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, {
                                thresholdMinutes: 0,
                                durationMinutes: 0
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ===============================
     * Upload image to Supabase Storage (TEMP)
     * =============================== */
    SellerService.uploadTempProductImage = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var file, uploadSessionId, ext, fileName, storagePath, error, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = params.file, uploadSessionId = params.uploadSessionId;
                        if (!file)
                            throw new Error("No file uploaded");
                        if (!uploadSessionId)
                            throw new Error("uploadSessionId is required");
                        if (!file.mimetype.startsWith("image/")) {
                            throw new Error("Only image files are allowed");
                        }
                        ext = path_1["default"].extname(file.originalname) || ".jpg";
                        fileName = "" + crypto_1["default"].randomUUID() + ext;
                        storagePath = "tmp/" + uploadSessionId + "/" + fileName;
                        return [4 /*yield*/, supabase_1.supabase.storage
                                .from("product_images")
                                .upload(storagePath, file.buffer, {
                                contentType: file.mimetype,
                                upsert: false
                            })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw new Error(error.message);
                        data = supabase_1.supabase.storage
                            .from("product_images")
                            .getPublicUrl(storagePath).data;
                        return [2 /*return*/, {
                                url: data.publicUrl,
                                path: storagePath
                            }];
                }
            });
        });
    };
    /* ===============================
     * INTERNAL: move images tmp → products/{productId}
     * =============================== */
    SellerService.moveImagesFromTmpToProduct = function (uploadSessionId, productId) {
        return __awaiter(this, void 0, Promise, function () {
            var bucket, _a, files, error, movedImages, i, file, fromPath, toPath, fileData, publicUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        bucket = supabase_1.supabase.storage.from("product_images");
                        return [4 /*yield*/, bucket.list("tmp/" + uploadSessionId)];
                    case 1:
                        _a = _b.sent(), files = _a.data, error = _a.error;
                        if (!files || files.length === 0) {
                            throw new Error("No uploaded images found");
                        }
                        files.sort(function (a, b) {
                            var _a, _b;
                            var t1 = new Date((_a = a.created_at) !== null && _a !== void 0 ? _a : 0).getTime();
                            var t2 = new Date((_b = b.created_at) !== null && _b !== void 0 ? _b : 0).getTime();
                            return t1 - t2;
                        });
                        if (error) {
                            throw new Error("Failed to list uploaded images");
                        }
                        if (!files || files.length === 0) {
                            throw new Error("No uploaded images found");
                        }
                        movedImages = [];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < files.length)) return [3 /*break*/, 7];
                        file = files[i];
                        if (!file)
                            return [3 /*break*/, 6];
                        fromPath = "tmp/" + uploadSessionId + "/" + file.name;
                        toPath = "products/" + productId + "/" + file.name;
                        return [4 /*yield*/, bucket.download(fromPath)];
                    case 3:
                        fileData = (_b.sent()).data;
                        if (!fileData)
                            return [3 /*break*/, 6];
                        // upload to final location
                        return [4 /*yield*/, bucket.upload(toPath, fileData, {
                                upsert: true
                            })];
                    case 4:
                        // upload to final location
                        _b.sent();
                        // delete temp
                        return [4 /*yield*/, bucket.remove([fromPath])];
                    case 5:
                        // delete temp
                        _b.sent();
                        publicUrl = bucket.getPublicUrl(toPath).data;
                        movedImages.push({
                            url: publicUrl.publicUrl,
                            isMain: i === 0
                        });
                        _b.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, movedImages];
                }
            });
        });
    };
    /* ===============================
     * Create Auction (FINAL)
     * =============================== */
    SellerService.createAuction = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var seller, autoExtendConfig, dbNowMs, endTime, product, images;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, trx("users")
                                            .select("id", "role", "is_blocked")
                                            .where({ id: dto.sellerId })
                                            .first()];
                                    case 1:
                                        seller = _b.sent();
                                        if (!seller)
                                            throw new Error("Seller not found");
                                        if (seller.role !== "seller") {
                                            throw new Error("Only sellers can create auctions");
                                        }
                                        if (seller.is_blocked) {
                                            throw new Error("Your account is blocked");
                                        }
                                        autoExtendConfig = null;
                                        if (!(dto.autoExtend === true)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, SellerService.getAutoExtendSettings()];
                                    case 2:
                                        autoExtendConfig = _b.sent();
                                        _b.label = 3;
                                    case 3:
                                        /* 3️⃣ Validate duration */
                                        if (!dto.durationMinutes || dto.durationMinutes <= 0) {
                                            throw new Error("Invalid auction duration");
                                        }
                                        if (!dto.uploadSessionId) {
                                            throw new Error("uploadSessionId is required");
                                        }
                                        return [4 /*yield*/, time_1.getDbNowMs(trx)];
                                    case 4:
                                        dbNowMs = _b.sent();
                                        endTime = new Date(dbNowMs + dto.durationMinutes * 60 * 1000);
                                        return [4 /*yield*/, trx("products")
                                                .insert({
                                                title: dto.title,
                                                category_id: dto.categoryId,
                                                seller_id: dto.sellerId,
                                                start_price: dto.startPrice,
                                                bid_step: dto.bidStep,
                                                buy_now_price: (_a = dto.buyNowPrice) !== null && _a !== void 0 ? _a : null,
                                                current_price: dto.startPrice,
                                                highest_bidder_id: null,
                                                bid_requirement: dto.bidRequirement,
                                                auction_type: dto.auctionType,
                                                status: "active",
                                                description: dto.description,
                                                auto_extend: dto.autoExtend,
                                                end_time: endTime,
                                                created_at: trx.raw("NOW()")
                                            })
                                                .returning(["id"])];
                                    case 5:
                                        product = (_b.sent())[0];
                                        return [4 /*yield*/, SellerService.moveImagesFromTmpToProduct(dto.uploadSessionId, product.id)];
                                    case 6:
                                        images = _b.sent();
                                        if (images.length < 3) {
                                            throw new Error("At least 3 images are required");
                                        }
                                        return [4 /*yield*/, trx("product_images").insert(images.map(function (img) { return ({
                                                product_id: product.id,
                                                image_url: img.url,
                                                is_main: img.isMain
                                            }); }))];
                                    case 7:
                                        _b.sent();
                                        return [2 /*return*/, {
                                                message: "Auction created successfully",
                                                productId: product.id,
                                                endTime: endTime,
                                                autoExtend: dto.autoExtend ? autoExtendConfig : null
                                            }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ===============================
     * Get active listings of seller
     * =============================== */
    SellerService.getMyActiveListings = function (sellerId) {
        return __awaiter(this, void 0, Promise, function () {
            var rows, dbNowMs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("products as p")
                            .join("categories as c", "c.id", "p.category_id")
                            .leftJoin("product_images as img", function () {
                            this.on("img.product_id", "p.id").andOn("img.is_main", db_1.db.raw("true"));
                        })
                            .leftJoin("bids as b", "b.product_id", "p.id")
                            .where("p.seller_id", sellerId)
                            .andWhere("p.status", "active")
                            .groupBy("p.id", "c.name", "img.image_url")
                            .orderBy("p.end_time", "asc")
                            .select("p.id", "p.title", "p.description", "p.start_price", "p.current_price", "p.bid_step", "p.buy_now_price", "p.end_time", "c.name as category", "img.image_url as image")
                            .count("b.id as bid_count")];
                    case 1:
                        rows = (_a.sent());
                        return [4 /*yield*/, time_1.getDbNowMs()];
                    case 2:
                        dbNowMs = _a.sent();
                        return [2 /*return*/, rows.map(function (row) {
                                var _a;
                                return ({
                                    id: String(row.id),
                                    title: row.title,
                                    category: row.category,
                                    description: row.description,
                                    startingBid: Number(row.start_price),
                                    currentBid: row.current_price !== null
                                        ? Number(row.current_price)
                                        : Number(row.start_price),
                                    bid_count: row.bid_count,
                                    bid_step: Number(row.bid_step),
                                    buyNowPrice: row.buy_now_price !== null ? Number(row.buy_now_price) : null,
                                    image: (_a = row.image) !== null && _a !== void 0 ? _a : null,
                                    endDate: new Date(row.end_time).toISOString(),
                                    timeLeft: Math.max(0, Math.floor((new Date(row.end_time).getTime() - dbNowMs) / 1000))
                                });
                            })];
                }
            });
        });
    };
    SellerService.appendProductDescription = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, productId, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sellerId = params.sellerId, productId = params.productId, content = params.content;
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var product, now, today, appendedBlock, newDescription;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, trx("products")
                                                .select("id", "description", "seller_id", "status")
                                                .where({ id: productId })
                                                .first()];
                                        case 1:
                                            product = _b.sent();
                                            if (!product)
                                                throw new Error("Product not found");
                                            if (product.seller_id !== sellerId)
                                                throw new Error("Not allowed");
                                            if (product.status !== "active")
                                                throw new Error("Cannot edit inactive auction");
                                            return [4 /*yield*/, trx.raw("SELECT NOW()")];
                                        case 2:
                                            now = (_b.sent()).rows[0].now;
                                            today = new Date(now).toLocaleDateString("vi-VN");
                                            appendedBlock = "\n      <hr />\n      <p><strong>" + today + "</strong> - " + content + "</p>\n    ";
                                            newDescription = ((_a = product.description) !== null && _a !== void 0 ? _a : "") + appendedBlock;
                                            return [4 /*yield*/, trx("products").where({ id: productId }).update({
                                                    description: newDescription
                                                })];
                                        case 3:
                                            _b.sent();
                                            return [2 /*return*/, { success: true }];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ===============================
     * Get ended auctions with winner + rating
     * =============================== */
    SellerService.getEndedAuctions = function (sellerId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("products as p")
                            // ✅ order (bắt buộc)
                            .join("orders as o", "o.product_id", "p.id")
                            // buyer
                            .leftJoin("users as b", "b.id", "o.buyer_id")
                            // seller
                            .join("users as s", "s.id", "p.seller_id")
                            // ✅ category
                            .leftJoin("categories as c", "c.id", "p.category_id")
                            // main image
                            .leftJoin("product_images as img", function () {
                            this.on("img.product_id", "p.id").andOn("img.is_main", db_1.db.raw("true"));
                        })
                            // 🔒 quyền
                            .where("p.seller_id", sellerId)
                            // 🔒 auction đã kết thúc
                            .where("p.status", "closed")
                            .select(
                        // order
                        "o.id as id", "o.status as order_status", "o.final_price", 
                        // product
                        "p.id as productId", "p.title", "p.end_time", 
                        // buyer
                        "b.full_name as buyerName", 
                        // category
                        "c.name as category", 
                        // image
                        "img.image_url as image")
                            .orderBy("p.end_time", "desc")];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(function (r) {
                                var _a, _b, _c;
                                return ({
                                    id: r.id,
                                    productId: r.productId,
                                    title: r.title,
                                    image: (_a = r.image) !== null && _a !== void 0 ? _a : null,
                                    finalPrice: Number(r.final_price),
                                    endTime: r.end_time,
                                    buyerName: (_b = r.buyerName) !== null && _b !== void 0 ? _b : null,
                                    orderStatus: r.order_status,
                                    category: (_c = r.category) !== null && _c !== void 0 ? _c : "Uncategorized"
                                });
                            })];
                }
            });
        });
    };
    /* ===============================
     * Q&A - Seller answer question
     * =============================== */
    SellerService.answerQuestion = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, questionId, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sellerId = params.sellerId, questionId = params.questionId, content = params.content;
                        if (!content || !content.trim()) {
                            throw new Error("Answer content is required");
                        }
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var seller, question, answer, participants, receiversMap, _i, participants_1, p;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("users")
                                                .select("id", "role", "is_blocked", "full_name")
                                                .where({ id: sellerId })
                                                .first()];
                                        case 1:
                                            seller = _a.sent();
                                            if (!seller)
                                                throw new Error("Seller not found");
                                            if (seller.role !== "seller") {
                                                throw new Error("Only sellers can answer questions");
                                            }
                                            if (seller.is_blocked) {
                                                throw new Error("Your account is blocked");
                                            }
                                            return [4 /*yield*/, trx("questions as q")
                                                    .join("products as p", "p.id", "q.product_id")
                                                    .join("users as u", "u.id", "q.user_id") // người hỏi gốc
                                                    .select("q.id as questionId", "q.product_id as productId", "p.title as productTitle", "p.seller_id as sellerId", "p.status as productStatus", "u.id as askerId", "u.full_name as askerName", "u.email as askerEmail")
                                                    .where("q.id", questionId)
                                                    .first()];
                                        case 2:
                                            question = _a.sent();
                                            if (!question) {
                                                throw new Error("Question not found");
                                            }
                                            if (question.sellerId !== sellerId) {
                                                throw new Error("You are not the seller of this product");
                                            }
                                            if (question.productStatus !== "active") {
                                                throw new Error("Cannot answer question for inactive product");
                                            }
                                            return [4 /*yield*/, trx("answers")
                                                    .insert({
                                                    question_id: questionId,
                                                    user_id: sellerId,
                                                    role: "seller",
                                                    content: content.trim(),
                                                    created_at: trx.raw("NOW()")
                                                })
                                                    .returning(["id", "content", "created_at"])];
                                        case 3:
                                            answer = (_a.sent())[0];
                                            return [4 /*yield*/, trx("answers as a")
                                                    .join("users as u", "u.id", "a.user_id")
                                                    .where("a.question_id", questionId)
                                                    .andWhereNot("a.user_id", sellerId) // ❌ không gửi cho seller
                                                    .select("u.id", "u.email", "u.full_name")];
                                        case 4:
                                            participants = _a.sent();
                                            receiversMap = new Map();
                                            // 5.1️⃣ Người hỏi gốc LUÔN được notify
                                            if (question.askerId !== sellerId && question.askerEmail) {
                                                receiversMap.set(question.askerId, {
                                                    id: question.askerId,
                                                    email: question.askerEmail,
                                                    full_name: question.askerName
                                                });
                                            }
                                            // 5.2️⃣ Các user đã reply trong thread
                                            for (_i = 0, participants_1 = participants; _i < participants_1.length; _i++) {
                                                p = participants_1[_i];
                                                if (!receiversMap.has(p.id)) {
                                                    receiversMap.set(p.id, p);
                                                }
                                            }
                                            /* =============================
                                             * 6️⃣ Send mail to ALL participants
                                             * ============================= */
                                            return [4 /*yield*/, Promise.all(__spreadArrays(receiversMap.values()).map(function (user) {
                                                    return sendOtpMail_1.sendQuestionNotificationMail({
                                                        to: user.email,
                                                        receiverName: user.full_name,
                                                        senderName: seller.full_name,
                                                        productTitle: question.productTitle,
                                                        productId: question.productId,
                                                        message: content
                                                    });
                                                }))];
                                        case 5:
                                            /* =============================
                                             * 6️⃣ Send mail to ALL participants
                                             * ============================= */
                                            _a.sent();
                                            /* =============================
                                             * 7️⃣ Return answer DTO
                                             * ============================= */
                                            return [2 /*return*/, {
                                                    id: answer.id,
                                                    content: answer.content,
                                                    createdAt: answer.created_at
                                                }];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ======================================
     * 1️⃣ GET – List bid requests of a product
     * ====================================== */
    SellerService.getBidRequests = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, productId, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sellerId = params.sellerId, productId = params.productId;
                        return [4 /*yield*/, db_1.db("bid_requests as br")
                                .join("users as u", "u.id", "br.bidder_id")
                                .leftJoin("ratings as r", "r.to_user", "u.id")
                                .where({
                                "br.product_id": productId,
                                "br.seller_id": sellerId
                            })
                                .groupBy("br.id", "u.id")
                                .select("br.id", "br.status", "br.message", "br.created_at", "u.id as bidderId", "u.full_name as bidderName", db_1.db.raw("COUNT(r.id) AS totalVotes"), db_1.db.raw("SUM(CASE WHEN r.score > 0 THEN 1 ELSE 0 END) AS positiveVotes"))
                                .orderBy("br.created_at", "desc")];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(function (r) {
                                var _a, _b;
                                var totalVotes = Number((_a = r.totalVotes) !== null && _a !== void 0 ? _a : 0);
                                var positiveVotes = Number((_b = r.positiveVotes) !== null && _b !== void 0 ? _b : 0);
                                return {
                                    id: r.id,
                                    status: r.status,
                                    message: r.message,
                                    createdAt: r.created_at,
                                    bidder: {
                                        id: r.bidderId,
                                        name: r.bidderName,
                                        rating: {
                                            totalVotes: totalVotes,
                                            positiveVotes: positiveVotes,
                                            positiveRate: totalVotes > 0
                                                ? Number(((positiveVotes / totalVotes) * 100).toFixed(1))
                                                : 0
                                        }
                                    }
                                };
                            })];
                }
            });
        });
    };
    /* ======================================
     * 2️⃣ POST – Approve / Reject bid request
     * ====================================== */
    SellerService.handleBidRequest = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, requestId, action, request, newStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sellerId = params.sellerId, requestId = params.requestId, action = params.action;
                        return [4 /*yield*/, db_1.db("bid_requests")
                                .where({
                                id: requestId,
                                seller_id: sellerId
                            })
                                .first()];
                    case 1:
                        request = _a.sent();
                        if (!request) {
                            throw new Error("Bid request not found or not authorized");
                        }
                        if (request.status !== "pending") {
                            throw new Error("Request already processed");
                        }
                        newStatus = action === "approve" ? "approved" : "rejected";
                        return [4 /*yield*/, db_1.db("bid_requests")
                                .where({ id: requestId })
                                .update({
                                status: newStatus,
                                updated_at: db_1.db.raw("NOW()")
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                requestId: requestId,
                                status: newStatus,
                                productId: request.product_id,
                                bidderId: request.bidder_id
                            }];
                }
            });
        });
    };
    SellerService.getActiveBidders = function (productId, sellerId) {
        return __awaiter(this, void 0, void 0, function () {
            var product, bidders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("products")
                            .select("id", "seller_id")
                            .where({ id: productId })
                            .first()];
                    case 1:
                        product = _a.sent();
                        if (!product)
                            throw new Error("Product not found");
                        if (product.seller_id !== sellerId)
                            throw new Error("You are not allowed to view bidders of this product");
                        return [4 /*yield*/, db_1.db["with"]("active_bidders", function (qb) {
                                qb.select("bidder_id")
                                    .from("bids")
                                    .where("product_id", productId)
                                    .union(db_1.db("auto_bids").select("bidder_id").where("product_id", productId));
                            })
                                .select("u.id", "u.full_name", "u.email", db_1.db.raw("COUNT(DISTINCT b.id)::int AS bidsCount"), db_1.db.raw("MAX(b.bid_amount)::int AS highestBid"), db_1.db.raw("MAX(ab.max_price)::int AS maxAutoBid"))
                                .from("active_bidders as abx")
                                .join("users as u", "u.id", "abx.bidder_id")
                                .leftJoin("bids as b", function () {
                                this.on("b.bidder_id", "=", "u.id").andOn("b.product_id", "=", db_1.db.raw("?", [productId]));
                            })
                                .leftJoin("auto_bids as ab", function () {
                                this.on("ab.bidder_id", "=", "u.id").andOn("ab.product_id", "=", db_1.db.raw("?", [productId]));
                            })
                                // ❌ loại bidder đã bị block
                                .whereNotExists(function () {
                                this.select(1)
                                    .from("blocked_bidders")
                                    .whereRaw("blocked_bidders.product_id = ?", [productId])
                                    .andWhereRaw("blocked_bidders.bidder_id = u.id");
                            })
                                .groupBy("u.id", "u.full_name", "u.email")
                                // ✅ ORDER BY ĐÚNG
                                .orderByRaw("MAX(b.bid_amount) DESC NULLS LAST")];
                    case 2:
                        bidders = _a.sent();
                        return [2 /*return*/, bidders];
                }
            });
        });
    };
    SellerService.kickBidderFromAuction = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, productId, bidderId, reason;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sellerId = params.sellerId, productId = params.productId, bidderId = params.bidderId, reason = params.reason;
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var product, _a, bidder, productNew, mailData;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, trx("products")
                                                .select("id", "seller_id", "highest_bidder_id")
                                                .where({ id: productId })
                                                .first()];
                                        case 1:
                                            product = _b.sent();
                                            if (!product)
                                                throw new Error("Product not found");
                                            if (product.seller_id !== sellerId) {
                                                throw new Error("You are not allowed to block bidders for this product");
                                            }
                                            if (product.seller_id === bidderId) {
                                                throw new Error("Seller cannot block himself");
                                            }
                                            /* =============================
                                             * 2️⃣ Insert blocked bidder
                                             * ============================= */
                                            return [4 /*yield*/, trx("blocked_bidders")
                                                    .insert({
                                                    product_id: productId,
                                                    bidder_id: bidderId,
                                                    seller_id: sellerId,
                                                    reason: reason || "Blocked by seller",
                                                    created_at: trx.raw("NOW()")
                                                })
                                                    .onConflict(["product_id", "bidder_id"])
                                                    .ignore()];
                                        case 2:
                                            /* =============================
                                             * 2️⃣ Insert blocked bidder
                                             * ============================= */
                                            _b.sent();
                                            /* =============================
                                             * 3️⃣ Remove auto-bid
                                             * ============================= */
                                            return [4 /*yield*/, trx("auto_bids")
                                                    .where({
                                                    product_id: productId,
                                                    bidder_id: bidderId
                                                })
                                                    .del()];
                                        case 3:
                                            /* =============================
                                             * 3️⃣ Remove auto-bid
                                             * ============================= */
                                            _b.sent();
                                            /* =============================
                                             * 4️⃣ Log kick event (CHỈ 1 LẦN)
                                             * ============================= */
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: bidderId,
                                                    type: "kicked",
                                                    description: "Bidder was removed by seller during auction"
                                                })];
                                        case 4:
                                            /* =============================
                                             * 4️⃣ Log kick event (CHỈ 1 LẦN)
                                             * ============================= */
                                            _b.sent();
                                            return [4 /*yield*/, Promise.all([
                                                    trx("users")
                                                        .select("email", "full_name")
                                                        .where({ id: bidderId })
                                                        .first(),
                                                    trx("products").select("title").where({ id: productId }).first(),
                                                ])];
                                        case 5:
                                            _a = _b.sent(), bidder = _a[0], productNew = _a[1];
                                            mailData = bidder && productNew
                                                ? {
                                                    bidder_email: bidder.email,
                                                    bidder_name: bidder.full_name,
                                                    product_title: productNew.title
                                                }
                                                : null;
                                            if (!mailData) return [3 /*break*/, 7];
                                            return [4 /*yield*/, sendOtpMail_1.sendBidRejectedMail({
                                                    to: mailData.bidder_email,
                                                    bidderName: mailData.bidder_name,
                                                    productTitle: mailData.product_title,
                                                    productId: productId,
                                                    reason: "The seller has restricted your bidding access for this auction."
                                                })];
                                        case 6:
                                            _b.sent();
                                            _b.label = 7;
                                        case 7: return [2 /*return*/, {
                                                productId: productId,
                                                bidderId: bidderId,
                                                wasHighest: product.highest_bidder_id === bidderId
                                            }];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SellerService.recalculateAfterKick = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, kickedBidderId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        productId = params.productId, kickedBidderId = params.kickedBidderId;
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var product, startPrice, bidStep, autoBids, newHighestBidderId, newCurrentPrice, a, b, winner, loser, aMax, bMax;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("products")
                                                .select("id", "status", "start_price", "bid_step", "current_price", "highest_bidder_id")
                                                .where({ id: productId })
                                                .first()];
                                        case 1:
                                            product = _a.sent();
                                            if (!product)
                                                throw new Error("Product not found");
                                            if (product.status !== "active")
                                                return [2 /*return*/, null];
                                            startPrice = Number(product.start_price);
                                            bidStep = Number(product.bid_step);
                                            return [4 /*yield*/, trx("auto_bids")
                                                    .where({ product_id: productId })
                                                    .select("bidder_id", "max_price", "created_at")
                                                    .orderBy([
                                                    { column: "max_price", order: "desc" },
                                                    { column: "created_at", order: "asc" },
                                                ])
                                                    .limit(2)];
                                        case 2:
                                            autoBids = _a.sent();
                                            newHighestBidderId = null;
                                            if (!(autoBids.length === 0)) return [3 /*break*/, 3];
                                            newHighestBidderId = null;
                                            newCurrentPrice = startPrice;
                                            return [3 /*break*/, 8];
                                        case 3:
                                            if (!(autoBids.length === 1)) return [3 /*break*/, 4];
                                            newHighestBidderId = autoBids[0].bidder_id;
                                            newCurrentPrice = startPrice + bidStep;
                                            return [3 /*break*/, 8];
                                        case 4:
                                            a = autoBids[0], b = autoBids[1];
                                            winner = a;
                                            loser = b;
                                            aMax = Number(a.max_price);
                                            bMax = Number(b.max_price);
                                            if (!(bMax > aMax)) return [3 /*break*/, 5];
                                            winner = b;
                                            loser = a;
                                            return [3 /*break*/, 7];
                                        case 5:
                                            if (!(aMax === bMax)) return [3 /*break*/, 7];
                                            if (new Date(b.created_at) < new Date(a.created_at)) {
                                                winner = b;
                                                loser = a;
                                            }
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: winner.bidder_id,
                                                    type: "tie_break_win",
                                                    max_bid: aMax,
                                                    description: "Won tie-break after bidder removal"
                                                })];
                                        case 6:
                                            _a.sent();
                                            _a.label = 7;
                                        case 7:
                                            newHighestBidderId = winner.bidder_id;
                                            // ✅ GIÁ ĐÚNG SAU KICK
                                            newCurrentPrice = Math.min(Number(winner.max_price), Number(loser.max_price) + bidStep);
                                            _a.label = 8;
                                        case 8: 
                                        /* =============================
                                         * 4️⃣ Update product state
                                         * ============================= */
                                        return [4 /*yield*/, trx("products").where({ id: productId }).update({
                                                highest_bidder_id: newHighestBidderId,
                                                current_price: newCurrentPrice
                                            })];
                                        case 9:
                                            /* =============================
                                             * 4️⃣ Update product state
                                             * ============================= */
                                            _a.sent();
                                            if (!newHighestBidderId) return [3 /*break*/, 11];
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: newHighestBidderId,
                                                    type: "auto_bid",
                                                    amount: newCurrentPrice,
                                                    description: "Auction recalculated after bidder removal"
                                                })];
                                        case 10:
                                            _a.sent();
                                            _a.label = 11;
                                        case 11: return [2 /*return*/, {
                                                productId: productId,
                                                newCurrentPrice: newCurrentPrice,
                                                newHighestBidderId: newHighestBidderId
                                            }];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SellerService.createShipment = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var orderId, sellerId, shipping_code, shipping_provider, note;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderId = input.orderId, sellerId = input.sellerId, shipping_code = input.shipping_code, shipping_provider = input.shipping_provider, note = input.note;
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var order, existingShipment, shipment;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("orders")
                                                .select("id", "seller_id", "status")
                                                .where("id", orderId)
                                                .first()];
                                        case 1:
                                            order = _a.sent();
                                            if (!order)
                                                throw new Error("Order not found");
                                            if (order.seller_id !== sellerId) {
                                                throw new Error("Forbidden");
                                            }
                                            // 2️⃣ Check order status hợp lệ
                                            if (!["shipping_pending"].includes(order.status)) {
                                                throw new Error("Order is not ready for shipping");
                                            }
                                            return [4 /*yield*/, trx("order_shipments")
                                                    .where("order_id", orderId)
                                                    .first()];
                                        case 2:
                                            existingShipment = _a.sent();
                                            if (existingShipment) {
                                                throw new Error("Shipment already exists for this order");
                                            }
                                            return [4 /*yield*/, trx("order_shipments")
                                                    .insert({
                                                    order_id: orderId,
                                                    seller_id: sellerId,
                                                    shipping_code: shipping_code,
                                                    shipping_provider: shipping_provider !== null && shipping_provider !== void 0 ? shipping_provider : null,
                                                    note: note !== null && note !== void 0 ? note : null,
                                                    shipped_at: trx.fn.now()
                                                })
                                                    .returning("*")];
                                        case 3:
                                            shipment = (_a.sent())[0];
                                            // 5️⃣ Update order status
                                            return [4 /*yield*/, trx("orders").where("id", orderId).update({
                                                    status: "delivered_pending"
                                                })];
                                        case 4:
                                            // 5️⃣ Update order status
                                            _a.sent();
                                            return [2 /*return*/, shipment];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SellerService.rateBuyer = function (_a) {
        var sellerId = _a.sellerId, orderId = _a.orderId, score = _a.score, comment = _a.comment;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                        var order, existing;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, trx("orders")
                                        .select("id", "seller_id", "buyer_id", "product_id", "status")
                                        .where({ id: orderId })
                                        .first()];
                                case 1:
                                    order = _a.sent();
                                    if (!order) {
                                        throw new Error("Order not found");
                                    }
                                    if (order.seller_id !== sellerId) {
                                        throw new Error("You are not the seller of this order");
                                    }
                                    if (order.status !== "completed") {
                                        throw new Error("Order is not completed yet");
                                    }
                                    return [4 /*yield*/, trx("ratings")
                                            .where({
                                            from_user: sellerId,
                                            product_id: order.product_id
                                        })
                                            .first()];
                                case 2:
                                    existing = _a.sent();
                                    if (!existing) return [3 /*break*/, 4];
                                    return [4 /*yield*/, trx("ratings")
                                            .where({ id: existing.id })
                                            .update({
                                            score: score,
                                            comment: comment.trim(),
                                            created_at: trx.raw("NOW()")
                                        })];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            message: "Rating updated successfully",
                                            score: score,
                                            updated: true
                                        }];
                                case 4: return [4 /*yield*/, trx("ratings").insert({
                                        from_user: sellerId,
                                        to_user: order.buyer_id,
                                        product_id: order.product_id,
                                        score: score,
                                        comment: comment.trim(),
                                        created_at: trx.raw("NOW()")
                                    })];
                                case 5:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            message: "Rating submitted successfully",
                                            score: score,
                                            created: true
                                        }];
                            }
                        });
                    }); })];
            });
        });
    };
    SellerService.cancelOrderBySeller = function (orderId, sellerId, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                        var order, comment, existingRating;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, trx("orders")
                                        .where({ id: orderId })
                                        .select("id", "status", "product_id", "buyer_id", "seller_id")
                                        .first()];
                                case 1:
                                    order = _a.sent();
                                    if (!order) {
                                        throw new Error("Order not found");
                                    }
                                    if (order.seller_id !== sellerId) {
                                        throw new Error("Unauthorized");
                                    }
                                    if (order.status !== "payment_pending") {
                                        throw new Error("Only payment pending orders can be cancelled");
                                    }
                                    // 2️⃣ Update order status
                                    return [4 /*yield*/, trx("orders")
                                            .where({ id: orderId })
                                            .update({ status: "cancelled" })];
                                case 2:
                                    // 2️⃣ Update order status
                                    _a.sent();
                                    comment = CANCEL_REASON_COMMENT[reason];
                                    return [4 /*yield*/, trx("ratings")
                                            .where({
                                            product_id: order.product_id,
                                            from_user: sellerId,
                                            to_user: order.buyer_id
                                        })
                                            .first()];
                                case 3:
                                    existingRating = _a.sent();
                                    if (!existingRating) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx("ratings").where({ id: existingRating.id }).update({
                                            score: -1,
                                            comment: comment,
                                            created_at: trx.fn.now()
                                        })];
                                case 4:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, trx("ratings").insert({
                                        product_id: order.product_id,
                                        from_user: sellerId,
                                        to_user: order.buyer_id,
                                        score: -1,
                                        comment: comment
                                    })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7: return [2 /*return*/, { success: true }];
                            }
                        });
                    }); })];
            });
        });
    };
    return SellerService;
}());
exports.SellerService = SellerService;
