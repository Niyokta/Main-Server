import express, { Request } from "express"
import { authMiddleware } from "../Middleware";
import { getuserdetails } from "../Handlers/userhandler";
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

export default userRouter