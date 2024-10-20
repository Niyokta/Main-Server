import express, { Request } from "express";
import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser";
import { reSignAccessToken, signAccessToken, signRefreshToken, verifyToken } from "./Handlers/tokenhandler";
import cookieParser from "cookie-parser"
import cors from "cors"
import { createNewProject, deleteProject, findProject, findProjects,projectPayload } from "./Handlers/projecthandler";
import { bidPayload, deleteBid, findBid, findBids, placeBid } from "./Handlers/bidhandler";

const prisma = new PrismaClient()
const app = express();
const cookieparser = cookieParser()
app.use(cookieparser)
app.use(cors({
    origin: ["*",],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'user-agent', 'X-Client-Type']
}))
var a = bodyParser.json()

app.listen(3000, () => {
    console.log("Listening")
})


//Authentication Endpoints


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
    catch (err: any) {
        res.send({
            status: "400",
            message: err.message
        })
    }
})

app.get("/auth/verifyToken", (req, res) => {
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

app.get("/auth/refreshToken", (req, res) => {
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




//Project Endpoints

app.post("/project/getProject",a,async (req: Request, res) => {
    try {
        const { projectID } = req.body

        const project = await findProject(projectID)
        .then((response)=>res.send(response))
        .catch((err)=>res.send(err.message))
    }
    catch (err: any) {
        res.send({
            status: 400,
            message: err.message
        })
    }
})

app.post("/project/getProjects",a,async(req:Request,res)=>{
    try{
        const {cleintID}=req.body

        const projects=await findProjects(cleintID)
        .then((response)=>res.send(response))
        .catch((err)=>res.send(err.message))
    }
    catch(err:any){
        res.send({
            status:400,
            message:err.message
        })
    }
})

app.post("/project/createProject",a,async(req:Request,res)=>{
    try{
        const {title,description,client_id,max_budget}=req.body
        const newProject=await createNewProject({title,description,client_id,max_budget})
        .then((response)=>res.send(response))
        .catch((err)=>res.send(err.message))
    }
    catch(err:any){
        res.send({
            status:400,
            message:err.message
        })
    }
})

app.post("/project/deleteProject",a,async(req:Request,res)=>{
    try{
        const {projectID}=req.body

        const deleteproject=await deleteProject(projectID)
        .then((response)=>res.send(response))
        .catch((err)=>res.send(err.message))
    }
    catch(err:any){
        res.send({
            status:400,
            message:err.message
        })
    }
})



//bid Endpoints

app.post("/bid/getBid",a,async(req:Request,res)=>{
    try{
        const {bidID}=req.body
        const getbid=await findBid(bidID)
        .then((response)=>res.send(response))
        .catch((err)=>{res.send({status:400,message:err.message})})
    }
    catch(err:any){
        res.send({
            status:400,
            message:err.message
        })
    }
})

app.post("/bid/getBids",a,async (req:Request,res)=>{
    try{
        const {projectID}=req.body
        const bids=await findBids(projectID)
        .then((response)=>res.send(response))
        .catch((err)=>res.send({status:400,messsage:err.message}))
    }
    catch(err:any){
        res.send({status:400,message:err.message})
    }
})

app.post("/bid/placeBid",a,async (req:Request,res)=>{
    try{
        const {freelancerID,projectID,bidingPrice,freelancerName,proposal}=req.body
        // const payload:bidPayload={
        //     freelancerID:freelancer_id,
        //     projectID:project_id,
        //     bidingPrice:bidding_price,
        //     freelancerName:freelancer_name,
        //     proposal:proposal
        // }
        const newBid=await placeBid({freelancerID,projectID,bidingPrice,freelancerName,proposal})
        .then((response)=>res.send(response))
        .catch((err)=>res.send({status:400,message:err.message}))
    }
    catch(err:any){
        res.send({status:400,message:err.message})
    }
})

app.post("/bid/deleteBid",a,async(req:Request,res)=>{
    try{
        const {bidId}=req.body
        const deletebid=await deleteBid(bidId)
        .then((response)=>res.send(response))
        .catch((err)=>res.send({status:400,message:err.message}))
    }
    catch(err:any){
        res.send({status:400,message:err.message})
    }
})