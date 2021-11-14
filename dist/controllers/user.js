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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require(".prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user = {
    // register a user data and creating a jwt token for a user. using bcrypt for hashing password.
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const rounds = 10;
        const passwordHash = bcrypt_1.default.hashSync(req.body.password, rounds);
        const userData = {
            id: undefined,
            username: req.body.username,
            password: passwordHash,
            role: req.body.role,
            active: true,
            deposit: 0,
        };
        try {
            const newUser = yield database_1.default.user.create({ data: userData });
            delete newUser.password;
            delete newUser.active;
            const accessToken = jsonwebtoken_1.default.sign(newUser, config_1.default.SECRET, { expiresIn: '1d' });
            res.status(201).json({ message: 'created Successfully', user: newUser, token: accessToken });
        }
        catch (e) {
            res.status(400).json({ message: 'username is duplicated !!' });
        }
    }),
    // login a user and creating a jwt token for a user.
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield database_1.default.user.findUnique({ where: { username: req.body.username } });
            const pass = bcrypt_1.default.compareSync(req.body.password, currentUser.password);
            if (pass === false || currentUser.active === false)
                return res.status(400).json({ message: 'Incorrect username or password !!' });
            delete currentUser.password;
            delete currentUser.active;
            const accessToken = jsonwebtoken_1.default.sign(currentUser, config_1.default.SECRET, { expiresIn: '1d' });
            res.status(200).json({ user: currentUser, token: accessToken });
        }
        catch (e) {
            res.status(400).json({ message: 'Incorrect username or password !!' });
        }
    }),
    // fetch all user's data using jwt token for authentication.
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield database_1.default.user.findUnique({ where: { username: req.body.decoded.username } });
            delete currentUser.password;
            delete currentUser.active;
            if (currentUser.active === false)
                return res.status(400).json({ message: 'Incorrect username or password !!' });
            res.status(200).json({ user: currentUser });
        }
        catch (e) {
            res.status(400).json({ message: 'username is incorrect !!' });
        }
    }),
    // update all user's data using jwt token for authentication.
    updateUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let passwordHash;
        if (req.body.password) {
            const rounds = 10;
            passwordHash = bcrypt_1.default.hashSync(req.body.password, rounds);
        }
        const userData = {
            username: (req.body.username) ? req.body.username : undefined,
            password: (req.body.password) ? passwordHash : undefined,
        };
        try {
            yield database_1.default.user.update({ where: { id: req.body.decoded.id }, data: userData });
            res.status(200).json({ message: 'Updated Successfully' });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    // delete user's data. if the user is seller delete all data and products, if the user is buyer just make active to false.
    // both cases refund the user.
    deleteUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let deposit;
            if (req.body.decoded.role === client_1.Role.BUYER) {
                deposit = yield database_1.default.user.update({ where: { id: req.body.decoded.id }, data: { active: false, deposit: 0 } });
            }
            else {
                deposit = yield database_1.default.user.delete({ where: { id: req.body.decoded.id } });
            }
            res.status(200).json({ message: 'Deleted Successfully', returnedMoney: deposit.deposit });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    // deposit to the user account. user can put the amount to an array of length 5 where every index is coin value [5,10,20,50,100]
    // and value is the count of these coins.
    deposit: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.decoded.Role === client_1.Role.SELLER) {
            res.status(400).json({ message: 'You need a buyer account !!' });
        }
        let money = 0;
        for (let i = 0; i < req.body.deposit.length; i++) {
            money += req.body.deposit[i] * config_1.default.COINS[i];
        }
        try {
            yield database_1.default.user.update({ where: { id: req.body.decoded.id }, data: { deposit: { increment: money } } });
            res.status(200).json({ message: 'Deposited Successfully' });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    /*
    The buy controller handle first to check the buyer current data if he have enough money,
    then if the amount needed is available for the product.
    After that, we make the transaction of taking money from the user and decreasing the stock of the products,
    also, we need to increase the amount of money to the seller data.
    Finally, we need to calculate the remaining amount of money to the buyer to reset it.
    */
    buy: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.decoded.Role === client_1.Role.SELLER) {
            res.status(400).json({ message: 'You need a buyer account !!' });
        }
        try {
            // get buyer and product data
            const productId = parseInt(req.body.productId, 10);
            const amount = parseInt(req.body.amount, 10);
            const buyer = yield database_1.default.user.findUnique({ where: { id: req.body.decoded.id } });
            const product = yield database_1.default.product.findUnique({ where: { id: productId } });
            // check if the amount of products needed exists and the buyer account has enough money.
            if (!product || product.stock < amount || buyer.deposit < amount * product.cost) {
                return res.status(400).json({ message: 'This purchase is not valid !!' });
            }
            const newStock = product.stock - amount;
            const totalPrice = amount * product.cost;
            let remainingPrice = buyer.deposit - totalPrice;
            const newDeposit = remainingPrice % 5;
            // updating data for the transaction.
            const [newUser, newProduct, newSeller] = yield database_1.default.$transaction([
                database_1.default.product.update({ where: { id: productId }, data: { stock: newStock } }),
                database_1.default.user.update({ where: { id: req.body.decoded.id }, data: { deposit: newDeposit } }),
                database_1.default.user.update({ where: { id: product.userId }, data: { deposit: { increment: totalPrice } } })
            ]);
            remainingPrice -= remainingPrice % 5;
            // calculating the remaining money to available coins.
            const change = [];
            for (let i = config_1.default.COINS.length - 1; i >= 0; i--) {
                const temp = Math.floor(remainingPrice / config_1.default.COINS[i]);
                change[i] = temp;
                remainingPrice = remainingPrice % config_1.default.COINS[i];
            }
            res.status(200).json({ message: 'Purchased Successfully', product: product.name, change });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
    // reset money by giving the user his deposit amount from available coins.
    reset: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.decoded.Role === client_1.Role.SELLER) {
            res.status(400).json({ message: 'You need a buyer account !!' });
        }
        try {
            const buyer = yield database_1.default.user.findUnique({ where: { id: req.body.decoded.id } });
            let remainingPrice = buyer.deposit;
            const newDeposit = remainingPrice % 5;
            const userData = {
                deposit: newDeposit,
            };
            yield database_1.default.user.update({ where: { id: req.body.decoded.id }, data: userData, });
            remainingPrice -= remainingPrice % 5;
            const change = [];
            for (let i = config_1.default.COINS.length - 1; i >= 0; i--) {
                const temp = Math.floor(remainingPrice / config_1.default.COINS[i]);
                change[i] = temp;
                remainingPrice = remainingPrice % config_1.default.COINS[i];
            }
            res.status(200).json({ message: 'Refunded Successfully', change });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal Server Error !!' });
        }
    }),
};
exports.default = user;
//# sourceMappingURL=user.js.map