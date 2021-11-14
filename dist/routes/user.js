"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const authenticate_1 = __importDefault(require("../authorization/authenticate"));
const userValidators_1 = require("../validation/userValidators");
const router = express_1.default.Router();
// CRUD User
router.post('/register', userValidators_1.checkRegisterData, user_1.default.register);
router.post('/login', userValidators_1.checkLoginData, user_1.default.login);
router.get('/', authenticate_1.default, user_1.default.getUserData);
router.put('/', authenticate_1.default, user_1.default.updateUserData);
router.delete('/', authenticate_1.default, user_1.default.deleteUser);
// Deposit to your buyer account
router.post('/deposit', authenticate_1.default, userValidators_1.checkDeposit, user_1.default.deposit);
// Buy products
router.post('/buy', authenticate_1.default, userValidators_1.checkBuying, user_1.default.buy);
// Reset your deposited money
router.get('/reset', authenticate_1.default, user_1.default.reset);
exports.default = router;
//# sourceMappingURL=user.js.map