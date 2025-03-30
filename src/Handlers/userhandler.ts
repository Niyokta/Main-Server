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
            include:{educations:true,experiences:true,projects:{
                include:{
                    bids:true
                }
            },bids:true}
        })
        if(!user) return {status:"400",message:"User Not Found"}
        return {status:"200",message:"user found !",user:user}
    }
    catch(err:any){
        return {status:"400",message:err.message}
    }
}
export async function getUserByUsername(username:string){
    try{    
        const user=await prisma.users.findUnique({
            where:{
                username:username
            },
            include:{
                educations:true,projects:true,experiences:true,
            }
            
        })
        if(!user) return{status:"401",message:"User Not Found"}
        const payload={
            username:user.username,
            email:user.email,
            phoneNumber:user.phoneNumber,
            linkedin:user.linkedin,
            github:user.github,
            x:user.x,
            workingHours:user.workingHours,
            DOB:user.DOB,
            freelancer_rating:user.freelancer_rating,
            country:user.country,
            educations:user.educations,
            experience:user.experiences,
            createdAt:user.createdAt
        }
        return {status:"200",message:"User Found Successfully",user:payload}
    }
    catch(err){
        return{status:"400",message:err instanceof Error?err.message:"Internal Server Error"}
    }
}

export async function getAllUsers() {
    try{
        const allusers=await prisma.users.findMany({
            select:{
                username:true,
                email:true,
                phoneNumber:true,
                linkedin:true,
                github:true,
                x:true,
                country:true,
                workingHours:true,
                DOB:true,
                password:false
            },
        });
        return{
            status:"200",
            message:"Users Fetches Successfully",
            users:allusers
        }
    }
    catch(err){
        if(err instanceof Error)
        return{
            status:"400",
            message:err.message
        }
        else return{
            status:"400",
            message:"Internal Server Error"
        }
    }
}

export async function addEducation(user:number,cname:string,from:string,to:string,institute:string){
    try{
        
        
        const updatedEducation=await prisma.users.update({
            where:{
                id:user
            },
            data:{
                educations:{
                    create:[
                        {
                            courseName:cname,
                            yearFrom:from,
                            yearTo:to,
                            institute:institute
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
export async function addExperience(user:number,title:string,company:string,from:string,to:string,description:string){
    try{
        const updatedExperience=await prisma.users.update({
            where:{
                id:user
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
export async function deleteEducation(educationId:number){
    try{
        const deleteEdu=await prisma.education.delete({
            where:{
                id:educationId
            }
        })
        return {satus:"200",message:"Record Deleted Successfully"};
    }
    catch(err:any){
        return {status:"400",message:err.message};
    }
}
export async function deleteExperience(experienceId:number){
    try{
        const deleteEdu=await prisma.experience.delete({
            where:{
                id:experienceId
            }
        })
        return {satus:"200",message:"Record Deleted Successfully"};
    }
    catch(err:any){
        return {status:"400",message:err.message};
    }
}