import { PrismaClient } from "@prisma/client"
import fs from 'fs'
import jwt, { JwtPayload } from 'jsonwebtoken'

const publickey=fs.readFileSync("./public.key","utf8")
const prisma=new PrismaClient()

type edu={
    coursename:string,
    yearfrom:number,
    yearto:number,
    institutename:string
}

type exp={
    title:string,
    company:string,
    from:number,
    to:number,
    description:string
}


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

export async function addEducation(accessToken:string,education:edu){
    try{
        const decodedtoken= jwt.verify(accessToken,publickey)
        const userid=await (decodedtoken as JwtPayload).id
        const updatedEducation=await prisma.users.update({
            where:{
                id:userid
            },
            data:{
                educations:{
                    create:[
                        {
                            courseName:education.coursename,
                            yearFrom:education.yearfrom,
                            yearTo:education.yearto,
                            institute:education.institutename
                        }
                    ]
                }
            }
        })
        return {status:"200",message:"Education Added Successfully"};
    }
    catch(err:any){
        return {status:"400",message:err.message}
    }
}
export async function addExperience(accessToken:string,experience:exp){
    try{
        const decodedtoken= jwt.verify(accessToken,publickey)
        const userid=await (decodedtoken as JwtPayload).id
        const updatedExperience=await prisma.users.update({
            where:{
                id:userid
            },
            data:{
                experiences:{
                    create:[
                        {
                            title:experience.title,
                            company:experience.company,
                            yearFrom:experience.from,
                            yearTo:experience.to,
                            description:experience.description
                        }
                    ]
                }
            }
        })
        return {status:"200",message:"Experience Added Successfully"};
    }
    catch(err:any){
        return {status:"400",message:err.message}
    }
}