import { PrismaClient } from "@prisma/client"

const prisma=new PrismaClient()
export type bidPayload={
    freelancerID:number,
    projectID:number,
    bidingPrice:number,
    freelancerName:string,
    proposal:string
}
export async function findBid(bidID:number){    
    try{
        const bid=await prisma.bid.findUnique({
            where:{
                bid_id:bidID
            }
        })
        
        if(!bid){
            return{
                status:401,
                message:"Bid not found"
            }
        }
        return{
            status:200,
            message:"Big Found Successfully"
        }
    }
    catch(err:any){
        return{
            status:400,
            message:err.message
        }
    }
}

export async function findBids(projectID:number){
    try{
        const bids=await prisma.bid.findMany({
            where:{
                project_id:projectID
            }
        })
        if(bids.length===0){
            return{
                status:401,
                message:"No Bid Found on This project"
            }
        }
        return{
            status:200,
            message:"Bids found successfully",
            bids:bids
        }
    }
    catch(err:any){
        return{
            status:400,
            message:err.message
        }
    }
}

export async function placeBid({freelancerID,projectID,bidingPrice,freelancerName,proposal}:{freelancerID:number,projectID:number,bidingPrice:number,freelancerName:string,proposal:string}) {
    try{
        const checkProject=await prisma.project.findUnique({
            where:{
                project_id:projectID
            }
        })
        if(!checkProject){
            return{
                status:401,
                message:"Project Does Not Exist"
            }
        }
        const checkBid=await prisma.bid.findMany({
            where:{
                project_id:projectID,
                freelancer_id:freelancerID
            }
        })
        if(checkBid.length!==0){
            return{
                status:404,
                message:"Bid Already Placed"
            }
        }
        const bid=await prisma.bid.create({
            data:{
                freelancer_id:freelancerID,
                project_id:projectID,
                bidding_price:bidingPrice,
                freelancer_name:freelancerName,
                proposal:proposal
            }
        }).catch((err)=>{return{status:402,message:err.message}})
        if(!bid) return{status:403,message:"Internal Error"}
        
        return{status:200,message:"Bid Placed Successfully"}
    }
    catch(err:any){
        return{status:400,message:err.message}
    }
}

export async function deleteBid(bidID:number) {
    try{
        const deletebid=await prisma.bid.delete({
            where:{
                bid_id:bidID
            }
        }).catch((err)=>{return{status:401,message:err.message}})

        return{status:200,message:"Bid Removed Successfully"}
    }
    catch(err:any){
        return{status:400,message:err.message}
    }
}