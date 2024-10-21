import express,{Request} from "express"
import { PrismaClient } from "@prisma/client"
import { verifyToken,reSignAccessToken,signAccessToken,signRefreshToken } from "../Handlers/tokenhandler"
const prisma=new PrismaClient()
const authRouter=express.Router()


authRouter.post("/signin",  async (req: Request, res) => {
    try {
        const { username, password } = req.body

        const user = await prisma.users.findFirst({
            where: {
                username: username?.toString()
            }
        })
        if (user) {
            if (user.password === password) {
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt
                }
                const accessToken = signAccessToken(payload)
                const refreshToken = signRefreshToken(payload)
                const isMobile = req.headers['user-agent']?.includes('Mobile') || req.headers['X-Client-Type'] === 'mobile';
                if (isMobile) {
                    res.send({
                        status: "200",
                        message: "signin successfull",
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    })
                }
                else {
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict"
                    })
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict"
                    })
                    res.send({
                        status: "200",
                        message: "signin successfull",
                    })
                }

                return
            }
        }
        res.send({
            status: "405",
            message: "invalid credentials"
        })
    }
    catch (err: any) {
        res.send({
            status: "400",
            message: err.message
        })
    }
})

authRouter.post("/create-account",  async (req: Request, res) => {
    try {
        const { username, password, email } = req.body
        const user = await prisma.users.findFirst({
            where: {
                username: username?.toString()
            }
        })
        if (user) {
            console.log(user)
            res.send({
                status: "401",
                message: "user already exist"
            })
            return
        }

        const newuser = await prisma.users.create({
            data: {
                username: username,
                password: password,
                email: email
            }
        })
        if (newuser) {
            res.send({
                status: "200",
                message: "user created"
            })
            return
        }
    }
    catch (err: any) {
        res.send({
            status: "400",
            message: err.message
        })
    }
})

authRouter.get("/verifyToken", (req, res) => {
    try {
        const isMobile = req.headers['user-agent']?.includes('Mobile') || req.headers['X-Client-Type'] === 'mobile';
        var token = null
        if (isMobile) {
            token = req.headers["authorization"]
        }
        else {
            token = req.cookies.refreshToken
        }
        if (token) {
            const verify = verifyToken(token)
            if (verify) {
                res.send({
                    status: "200",
                    message: "valid token"
                })
            }
            return
        }
        res.send({
            status: "401",
            message: "No Token Found"
        })
    }
    catch (err: any) {
        res.send({
            status: "400",
            message: err.message
        })
    }

})

authRouter.get("/refreshToken", (req, res) => {
    try {
        const isMobile = req.headers['user-agent']?.includes('Mobile') || req.headers['X-Client-Type'] === 'mobile';
        var refreshToken = null
        if (isMobile) {
            refreshToken = req.headers["authorization"]
        }
        else {
            refreshToken = req.cookies.refreshToken
        }
        if (refreshToken) {
            const verify = verifyToken(refreshToken)
            if (verify) {
                const accessToken = reSignAccessToken(refreshToken)
                if (!accessToken) {
                    res.send({
                        status: "402",
                        message: "payload defected"
                    })
                    return
                }
                if (isMobile) {
                    res.send({
                        status: "200",
                        message: "Token Reassigned successfully",
                        accessToken: accessToken
                    })
                }
                else {
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict"
                    })
                    res.send({
                        status: "200",
                        message: "Token Reassigned successfully"
                    })
                }
            }
            else {
                res.send({
                    status: "401",
                    message: "invalid token"
                })
            }
        }
        else {
            res.send({
                status: "400",
                messge: "Token Missing"
            })
        }
    }
    catch (err: any) {
        res.send({
            status: "405",
            message: err.message
        })
    }
})

export default authRouter;