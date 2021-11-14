"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBuying = exports.checkDeposit = exports.checkUpdateData = exports.checkLoginData = exports.checkRegisterData = void 0;
const express_validator_1 = require("express-validator");
const client_1 = require(".prisma/client");
// Validation Data
// check data for registeration.
const checkRegisterData = [
    (0, express_validator_1.check)('username')
        .exists().withMessage({ message: 'Username should be provided' }).bail()
        .isString()
        .isAlphanumeric().withMessage({ message: 'Username should not contain special characters' }).bail()
        .isLength({ min: 4, max: 30 }).withMessage({ message: 'Username should be between 4 and 30 characters' }),
    (0, express_validator_1.check)('password')
        .exists().withMessage({ message: "Password is missing" }).bail()
        .isString()
        .isLength({ min: 8, max: 30 }).withMessage({ message: 'Password should be between 8 and 30 characters' }).bail(),
    (0, express_validator_1.check)('role')
        .exists().withMessage({ message: "Role is missing" }).bail()
        .isString()
        .custom((value) => {
        if (Object.values(client_1.Role).includes(value))
            return true;
        else
            return false;
    }).withMessage({ message: 'Role should be BUYER or SELLER' }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.checkRegisterData = checkRegisterData;
// check data for login.
const checkLoginData = [
    (0, express_validator_1.check)('username')
        .exists().withMessage({ message: 'Username should be provided' }).bail()
        .isString()
        .isAlphanumeric().withMessage({ message: 'Username should not contain special characters' }).bail()
        .isLength({ min: 4, max: 30 }).withMessage({ message: 'Username should be between 4 and 30 characters' }),
    (0, express_validator_1.check)('password')
        .exists().withMessage({ message: "Password is missing" }).bail()
        .isString()
        .isLength({ min: 8, max: 30 }).withMessage({ message: 'Password should be between 8 and 30 characters' }).bail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.checkLoginData = checkLoginData;
// check data for update.
const checkUpdateData = [
    (0, express_validator_1.check)('username')
        .optional()
        .isString()
        .isAlphanumeric().withMessage({ message: 'Username should not contain special characters' }).bail()
        .isLength({ min: 4, max: 30 }).withMessage({ message: 'Username should be between 4 and 30 characters' }),
    (0, express_validator_1.check)('password')
        .optional()
        .isString()
        .isLength({ min: 8, max: 30 }).withMessage({ message: 'Password should be between 8 and 30 characters' }).bail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.checkUpdateData = checkUpdateData;
// check data for deposit.
const checkDeposit = [
    (0, express_validator_1.check)('deposit')
        .exists().withMessage({ message: "Deposit array is missing" }).bail()
        .isArray()
        .custom((value) => {
        if (value.length === 5)
            return true;
        else
            return false;
    }).withMessage({ message: 'Deposit should be array of length 5' }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.checkDeposit = checkDeposit;
// check data for buying.
const checkBuying = [
    (0, express_validator_1.check)('productId')
        .exists().withMessage({ message: 'ProductId should be provided' }).bail()
        .isNumeric().withMessage({ message: 'productId should be a number' }).bail(),
    (0, express_validator_1.check)('amount')
        .exists().withMessage({ message: 'amount should be provided' }).bail()
        .isNumeric().withMessage({ message: 'amount should be a number' }).bail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.checkBuying = checkBuying;
//# sourceMappingURL=userValidators.js.map