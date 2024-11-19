import { PrismaClient } from "@prisma/client"
import fs from 'fs'
import jwt, { JwtPayload } from 'jsonwebtoken'

const publickey=fs.readFileSync("./public.key","utf8")
const prisma=new PrismaClient()




export async function getuserdetails(accessToken:string){
    try{
        const decodedtoken= jwt.verify(accessToken,publickey)
        const userid=await (decodedtoken as JwtPayload).id
        console.log("id is ",userid)
        const user=await prisma.users.findFirst({
            where:{
                id:userid
            }
        })
        if(!user) return {status:"400",message:"User Not Found"}
        return {status:"200",message:"user found !",user:user}
    }
    catch(err:any){
        return {status:"400",message:err.message}
    }
}