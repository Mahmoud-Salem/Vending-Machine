"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../controllers/product"));
const authenticate_1 = __importDefault(require("../authorization/authenticate"));
const productValidators_1 = require("../validation/productValidators");
const router = express_1.default.Router();
// CRUD Product
router.get('/:id', product_1.default.getProduct);
// get all product with page parameter
router.get('/viewAll/:page', product_1.default.getProducts);
router.post('/', authenticate_1.default, productValidators_1.checkProductData, product_1.default.addProduct);
router.put('/:id', authenticate_1.default, productValidators_1.checkUpdatedData, product_1.default.updateProduct);
router.delete('/:id', authenticate_1.default, product_1.default.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.js.map