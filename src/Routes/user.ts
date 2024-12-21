import express, { Request } from "express"
import { authMiddleware } from "../Middleware";
import { getuserdetails,addEducation, addExperience } from "../Handlers/userhandler";
const userRouter = express.Router();

userRouter.get("/getuser",authMiddleware, async (req, res) => {
    try {
        const accessToken = req.headers['authorization']
        if (accessToken) {
            const user = await getuserdetails(accessToken)
            res.send(user)
            return
        }
        res.send({ status: "400", message: "Token not present" })
    }
    catch (err: any) {
        res.send({
            status: "400",
            message: "internal server error"
        })
    }
})
userRouter.post("/addEducation",authMiddleware, async (req, res) => {
    try {
        const accessToken = req.headers['authorization']
        const {cname,from,to,institute}=req.body;
        const edu={
            coursename:cname,
            yearfrom:from,
            yearto:to,
            institutename:institute
        }
        if (accessToken) {
            const add = await addEducation(accessToken,edu);
            res.send(add)
            return
        }
        res.send({ status: "400", message: "Token not present" })
    }
    catch (err: any) {
        res.send({
            status: "400",
            message: "internal server error"
        })
    }
})
userRouter.post("/addExperience",authMiddleware, async (req, res) => {
    try {
        const accessToken = req.headers['authorization']
        const {title,company,from,to,description}=req.body;
        const exp={
            title:title,
            company:company,
            from:from,
            to:to,
            description:description
        }
        
        if (accessToken) {
            const add = await addExperience(accessToken,exp);
            res.send(add)
            return
        }
        res.send({ status: "400", message: "Token not present" })
    }
    catch (err: any) {
        res.send({
            status: "400",
            message: "internal server error"
        })
    }
})

export default userRouter