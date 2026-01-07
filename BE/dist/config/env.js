"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    DB_HOST: process.env.SUPABASE_HOST,
    DB_PORT: Number(process.env.SUPABASE_PORT),
    DB_NAME: process.env.SUPABASE_DB,
    DB_USER: process.env.SUPABASE_USER,
    DB_PASSWORD: process.env.SUPABASE_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: Number(process.env.PORT) || 3000,
};
//# sourceMappingURL=env.js.map