import express, { Request } from "express";
import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser";
import { signAccessToken, verifyToken } from "./Handlers/tokenhandler";



const prisma = new PrismaClient()
const app = express();
var a = bodyParser.json()

app.listen(3000, () => {
    console.log("Listening")
})

app.post("/auth/signin", a, async (req: Request, res) => {
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
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt
                }
                const token = signAccessToken(payload)
                res.send({
                    status: "200",
                    message: "signin successfull",
                    accessToken: token
                })
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

app.post("/auth/create-account", a, async (req: Request, res) => {
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
    catch(err:any){
        res.send({
            status:"400",
            message:err.message
        })
    }
})

app.get("/auth/verifyToken", (req, res) => {
    try {
        const token = req.headers["authorization"]
        if (token) {
            const verify = verifyToken(token)
            if (verify) {
                res.send({
                    status:"200",
                    message: "valid token"
                })
            }
            return
        }
    }
    catch (err: any) {
        res.send({
            status: "401",
            message: err.message
        })
    }

})

