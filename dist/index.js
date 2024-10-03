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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const body_parser_1 = __importDefault(require("body-parser"));
const tokenhandler_1 = require("./Handlers/tokenhandler");
const fs_1 = __importDefault(require("fs"));
const privatekey = fs_1.default.readFileSync('./private.key', 'utf8');
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
var a = body_parser_1.default.json();
app.listen(3000, () => {
    console.log("Listening");
});
app.post("/auth/signin", a, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield prisma.users.findFirst({
            where: {
                username: username === null || username === void 0 ? void 0 : username.toString()
            }
        });
        if (user) {
            const payload = {
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                createdAt: user.createdAt
            };
            const token = (0, tokenhandler_1.signAccessToken)(payload);
            if (user.password === password) {
                res.send({
                    status: "200",
                    message: "signin successfull",
                    accessToken: token
                });
                return;
            }
        }
        res.send({
            status: "405",
            message: "invalid credentials"
        });
    }
    catch (err) {
        res.send({
            status: "400",
            message: err.message
        });
    }
}));
app.post("/auth/create-account", a, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const user = yield prisma.users.findFirst({
            where: {
                username: username === null || username === void 0 ? void 0 : username.toString()
            }
        });
        if (user) {
            console.log(user);
            res.send({
                status: "401",
                message: "user already exist"
            });
            return;
        }
        const newuser = yield prisma.users.create({
            data: {
                username: username,
                password: password,
                email: email
            }
        });
        if (newuser) {
            res.send({
                status: "200",
                message: "user created"
            });
            return;
        }
    }
    catch (err) {
        res.send({
            status: "400",
            message: err.message
        });
    }
}));
app.get("/auth/verifyToken", (req, res) => {
    try {
        const token = req.headers["authorization"];
        if (token) {
            const verify = (0, tokenhandler_1.verifyToken)(token);
            console.log("verify : ", verify);
            if (verify) {
                res.send({
                    status: "200",
                    message: "valid token"
                });
            }
            return;
        }
    }
    catch (err) {
        res.send({
            status: "401",
            message: err.message
        });
    }
});
