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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const cookieparser = (0, cookie_parser_1.default)();
app.use(cookieparser);
app.use((0, cors_1.default)({
    origin: ["*",],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'user-agent', 'X-Client-Type']
}));
var a = body_parser_1.default.json();
app.listen(3000, () => {
    console.log("Listening");
});
app.post("/auth/signin", a, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, password } = req.body;
        const user = yield prisma.users.findFirst({
            where: {
                username: username === null || username === void 0 ? void 0 : username.toString()
            }
        });
        if (user) {
            if (user.password === password) {
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt
                };
                const accessToken = (0, tokenhandler_1.signAccessToken)(payload);
                const refreshToken = (0, tokenhandler_1.signRefreshToken)(payload);
                const isMobile = ((_a = req.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.includes('Mobile')) || req.headers['X-Client-Type'] === 'mobile';
                if (isMobile) {
                    res.send({
                        status: "200",
                        message: "signin successfull",
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    });
                }
                else {
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict"
                    });
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict"
                    });
                    res.send({
                        status: "200",
                        message: "signin successfull",
                    });
                }
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
    var _a;
    try {
        const isMobile = ((_a = req.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.includes('Mobile')) || req.headers['X-Client-Type'] === 'mobile';
        var token = null;
        if (isMobile) {
            token = req.headers["authorization"];
        }
        else {
            token = req.cookies.refreshToken;
        }
        if (token) {
            const verify = (0, tokenhandler_1.verifyToken)(token);
            if (verify) {
                res.send({
                    status: "200",
                    message: "valid token"
                });
            }
            return;
        }
        res.send({
            status: "401",
            message: "No Token Found"
        });
    }
    catch (err) {
        res.send({
            status: "401",
            message: err.message
        });
    }
});
app.get("/auth/refreshToken", (req, res) => {
    var _a;
    try {
        const isMobile = ((_a = req.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.includes('Mobile')) || req.headers['X-Client-Type'] === 'mobile';
        var refreshToken = null;
        if (isMobile) {
            refreshToken = req.headers["authorization"];
        }
        else {
            refreshToken = req.cookies.refreshToken;
        }
        if (refreshToken) {
            const verify = (0, tokenhandler_1.verifyToken)(refreshToken);
            if (verify) {
                const accessToken = (0, tokenhandler_1.reSignAccessToken)(refreshToken);
                if (!accessToken) {
                    res.send({
                        status: "402",
                        message: "payload defected"
                    });
                    return;
                }
                if (isMobile) {
                    res.send({
                        status: "200",
                        message: "Token Reassigned successfully",
                        accessToken: accessToken
                    });
                }
                else {
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict"
                    });
                    res.send({
                        status: "200",
                        message: "Token Reassigned successfully"
                    });
                }
            }
            else {
                res.send({
                    status: "401",
                    message: "invalid token"
                });
            }
        }
        else {
            res.send({
                status: "400",
                messge: "Token Missing"
            });
        }
    }
    catch (err) {
        res.send({
            status: "405",
            message: err.message
        });
    }
});
