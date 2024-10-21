import {Request,NextFunction} from "express"
import { verifyToken } from "../Handlers/tokenhandler";

export default function authMiddleware(req:Request,res:any,next:NextFunction){
    const isMobile = req.headers['user-agent']?.includes('Mobile') || req.headers['X-Client-Type'] === 'mobile';
    var accessToken=null;
    if(isMobile){
        accessToken=req.headers['authorization']
    }
    else{
        accessToken=req.cookies.accessToken
    }
    if(!accessToken){
        return res.send({status:420,message:"Unauthorized Request"})
    }
    const validation=verifyToken(accessToken)
    if(!validation){
        return res.send({status:420,message:"Unauthorized Request"})
    }
    next()
}