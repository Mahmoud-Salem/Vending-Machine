"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdatedData = exports.checkProductData = void 0;
const express_validator_1 = require("express-validator");
const checkProductData = [
    (0, express_validator_1.check)('name')
        .exists().withMessage({ message: 'Username should be provided' }).bail()
        .isString()
        .isAlphanumeric().withMessage({ message: 'Username should not contain special characters' }).bail(),
    (0, express_validator_1.check)('cost')
        .exists().withMessage({ message: 'cost should be provided' }).bail()
        .isNumeric().withMessage({ message: 'cost should be a number' }).bail(),
    (0, express_validator_1.check)('stock')
        .exists().withMessage({ message: 'stock should be provided' }).bail()
        .isNumeric().withMessage({ message: 'stock should be a number' }).bail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.checkProductData = checkProductData;
const checkUpdatedData = [
    (0, express_validator_1.check)('name')
        .optional()
        .isString()
        .isAlphanumeric().withMessage({ message: 'Username should not contain special characters' }).bail(),
    (0, express_validator_1.check)('cost')
        .optional()
        .isNumeric().withMessage({ message: 'cost should be a number' }).bail(),
    (0, express_validator_1.check)('stock')
        .optional()
        .isNumeric().withMessage({ message: 'stock should be a number' }).bail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.checkUpdatedData = checkUpdatedData;
//# sourceMappingURL=productValidators.js.map