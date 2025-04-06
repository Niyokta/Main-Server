import express,{Request} from "express"
import { findBid,findBids,placeBid,deleteBid, acceptBid, rejectBid } from "../Handlers/bidhandler"
import { authMiddleware } from "../Middleware"

const bidRouter=express.Router()

bidRouter.post("/getBid",authMiddleware,async(req:Request,res)=>{
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

bidRouter.post("/getBids",authMiddleware,async (req:Request,res)=>{
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

bidRouter.post("/placeBid",authMiddleware,async (req:Request,res)=>{
    try{
        const {freelancerID,projectID,bidingPrice,freelancerName,proposal,projectTitle,clientName,freelancerRating,clientCountry}=req.body
        const newBid=await placeBid({freelancerID,projectID,bidingPrice,freelancerName,proposal,projectTitle,clientName,freelancerRating,clientCountry})
        .then((response)=>res.send(response))
        .catch((err)=>res.send({status:400,message:err.message}))
    }
    catch(err:any){
        res.send({status:400,message:err.message})
    }
})

bidRouter.post("/deleteBid",authMiddleware,async(req:Request,res)=>{
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

bidRouter.post("/acceptBid",authMiddleware,async(req:Request,res)=>{
    try{
        const {bidId}=req.body;
        const acceptedBid=await acceptBid({bidId})
        .then((response)=>res.send(response))
        .catch((err)=>res.send({status:400,message:err.message}));
    }
    catch(err:any){
        res.send({status:400,message:err.message})
    }
})
bidRouter.post("/rejectBid",authMiddleware,async(req:Request,res)=>{
    try{
        const {bidId}=req.body;
        const rejectedBid=await rejectBid(bidId)
        .then((response)=>res.send(response))
        .catch((err)=>res.send({status:400,message:err.message}));
    }
    catch(err:any){
        res.send({status:400,message:err.message})
    }

})

export default bidRouter;