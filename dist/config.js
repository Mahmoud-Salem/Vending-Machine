"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    COINS: [5, 10, 20, 50, 100]
};
exports.default = config;
//# sourceMappingURL=config.js.map