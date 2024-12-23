import { PrismaClient } from "@prisma/client"
import fs from 'fs'
import jwt, { JwtPayload } from 'jsonwebtoken'

const publickey=fs.readFileSync("./public.key","utf8")
const prisma=new PrismaClient()

type edu={
    coursename:string,
    yearfrom:string,
    yearto:string,
    institutename:string
}

type exp={
    title:string,
    company:string,
    from:string,
    to:string,
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
            },
            include:{educations:true,experiences:true}
        })
        if(!user) return {status:"400",message:"User Not Found"}
        return {status:"200",message:"user found !",user:user}
    }
    catch(err:any){
        return {status:"400",message:err.message}
    }
}

export async function addEducation(accessToken:string,cname:string,from:string,to:string,institute:string){
    try{
        const decodedtoken= jwt.verify(accessToken,publickey)
        const userid=await (decodedtoken as JwtPayload).id
        const newEducation = await prisma.education.create({
            data: {
                courseName: cname,
                yearFrom: from,
                yearTo: to,
                institute: institute,
                user: {
                    connect: { id: userid }, // Link the user by ID
                },
            },
        });
        
        // const updatedEducation=await prisma.users.update({
        //     where:{
        //         id:userid
        //     },
        //     data:{
        //         educations:{
        //             create:[
        //                 {
        //                     courseName:cname,
        //                     yearFrom:from,
        //                     yearTo:to,
        //                     institute:institute
        //                 }
        //             ]
        //         }
        //     }
        // })
        return {status:"200",message:"Education Added Successfully"};
    }
    catch(err:any){
        return {status:"400",message:err.message}
    }
}
export async function addExperience(accessToken:string,title:string,company:string,from:string,to:string,description:string){
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
                            title:title,
                            company:company,
                            yearFrom:from,
                            yearTo:to,
                            description:description
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