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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const product = {
    // get product from parameter id from the product Table .
    getProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentProduct = yield database_1.default.product.findUnique({ where: { id: parseInt(req.params.id, 10) } });
            res.status(200).json({ product: currentProduct });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    // get products from the product Table  using the skip and take for pagination where each page has 10 products.
    getProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const skip = (req.params.page) ? (parseInt(req.params.page, 10) - 1) * 10 : 0;
            const currents = yield database_1.default.product.findMany({ skip, take: 10 });
            res.status(200).json({ products: currents });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    // delete product from product Table, making sure that the loggedin seller is the owner of the product.
    deleteProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield database_1.default.product.deleteMany({ where: { userId: req.body.decoded.id, id: parseInt(req.params.id, 10) } });
            res.status(201).json({ message: 'Deleted Successfully' });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    // add product to the product table.
    addProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const productData = {
            id: undefined,
            name: req.body.name,
            cost: parseInt(req.body.cost, 10),
            stock: parseInt(req.body.stock, 10),
            userId: req.body.decoded.id
        };
        try {
            const newProduct = yield database_1.default.product.create({ data: productData });
            res.status(201).json({ message: 'created Successfully', product: newProduct });
        }
        catch (e) {
            // tslint:disable-next-line
            //console.log(e);
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    // update product to the product table, making sure that the loggedin seller is the owner of the product.
    updateProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.params.id)
            res.status(400).json({ message: 'product id is missing !!' });
        const productData = {
            id: parseInt(req.params.id, 10),
            name: (req.body.name) ? req.body.name : undefined,
            cost: (req.body.cost) ? parseInt(req.body.cost, 10) : undefined,
            stock: (req.body.stock) ? parseInt(req.body.stock, 10) : undefined,
            userId: req.body.decoded.id
        };
        try {
            yield database_1.default.product.updateMany({ data: productData, where: { id: parseInt(req.params.id, 10), userId: req.body.decoded.id } });
            res.status(201).json({ message: 'Updated Successfully', product: req.params.id });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
};
exports.default = product;
//# sourceMappingURL=product.js.map