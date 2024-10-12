"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyToken = verifyToken;
exports.signRefreshToken = signRefreshToken;
exports.reSignAccessToken = reSignAccessToken;
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const privatekey = fs_1.default.readFileSync("./private.key", "utf8");
const publickey = fs_1.default.readFileSync("./public.key", "utf8");
function signAccessToken(payload) {
    const token = jsonwebtoken_1.default.sign(payload, privatekey, {
        algorithm: 'RS256',
        expiresIn: '20m'
    });
    return token;
}
function verifyToken(token) {
    const verifytoken = jsonwebtoken_1.default.verify(token, publickey);
    return verifytoken;
}
function signRefreshToken(payload) {
    const token = jsonwebtoken_1.default.sign(payload, privatekey, {
        algorithm: 'RS256',
        expiresIn: '7d'
    });
    return token;
}
function reSignAccessToken(refreshToken) {
    const decodedToken = jsonwebtoken_1.default.decode(refreshToken);
    if (decodedToken && typeof decodedToken === 'object') {
        const payload = {
            createdAt: decodedToken.createdAt,
            username: decodedToken.username,
            email: decodedToken.email,
            phone: decodedToken.phone
        };
        const token = signAccessToken(payload);
        return token;
    }
    return null;
}
