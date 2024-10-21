import express,{Request} from "express"
import { findBid,findBids,placeBid,deleteBid } from "../Handlers/bidhandler"
const bidRouter=express.Router()

bidRouter.post("/getBid",async(req:Request,res)=>{
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

bidRouter.post("/getBids",async (req:Request,res)=>{
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

bidRouter.post("/placeBid",async (req:Request,res)=>{
    try{
        const {freelancerID,projectID,bidingPrice,freelancerName,proposal}=req.body
        const newBid=await placeBid({freelancerID,projectID,bidingPrice,freelancerName,proposal})
        .then((response)=>res.send(response))
        .catch((err)=>res.send({status:400,message:err.message}))
    }
    catch(err:any){
        res.send({status:400,message:err.message})
    }
})

bidRouter.post("/deleteBid",async(req:Request,res)=>{
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

export default bidRouter;