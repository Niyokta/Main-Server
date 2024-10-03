"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyToken = verifyToken;
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const privatekey = fs_1.default.readFileSync("./private.key", "utf8");
const publickey = fs_1.default.readFileSync("./public.key", "utf8");
function signAccessToken(payload) {
    const token = jsonwebtoken_1.default.sign(payload, privatekey, {
        algorithm: 'RS256',
        expiresIn: '1h'
    });
    return token;
}
function verifyToken(token) {
    const verifytoken = jsonwebtoken_1.default.verify(token, publickey);
    return verifytoken;
}
