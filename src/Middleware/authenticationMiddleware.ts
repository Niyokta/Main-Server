import { Request, NextFunction } from "express"
import { verifyToken } from "../Handlers/tokenhandler";

export default function authMiddleware(req: Request, res: any, next: NextFunction) {

    const accessToken = req.headers['authorization']

    if (!accessToken) {
        return res.send({ status: 420, message: "Unauthorized Request" })
    }
    const validation = verifyToken(accessToken)
    if (!validation) {
        return res.send({ status: 420, message: "Unauthorized Request" })
    }
    next()
}