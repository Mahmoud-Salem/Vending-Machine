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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const database_1 = __importDefault(require("../database"));
// middleware function to be called before each request to authenticate user.
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get('token');
    if (!token)
        return res.status(401).json({ mesage: 'No token provided' });
    jsonwebtoken_1.default.verify(token, config_1.default.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mesage: 'Invalid token' });
        }
        else {
            database_1.default.user.findUnique({ where: { id: decoded.id } })
                .then(output => {
                req.body.decoded = output;
                next();
            }).catch(error => {
                // tslint:disable-next-line
                console.log(error);
                return res.status(401).json({ mesage: 'Invalid token' });
            });
        }
    });
});
exports.default = isLoggedIn;
//# sourceMappingURL=authenticate.js.map