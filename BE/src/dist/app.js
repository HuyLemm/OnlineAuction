"use strict";
exports.__esModule = true;
var cors_1 = require("cors");
var express_1 = require("express");
var index_1 = require("./routes/index");
var error_middleware_1 = require("./middlewares/error.middleware");
var seller_upload_route_1 = require("./routes/seller.upload.route");
require("./cron/cron");
var app = express_1["default"]();
app.use(cors_1["default"]({
    origin: "https://online-auction-tw92.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use("/seller", seller_upload_route_1["default"]);
// Middlewares
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
// Routes
app.use("/", index_1["default"]);
// Error handler cuối cùng
app.use(error_middleware_1["default"]);
exports["default"] = app;
