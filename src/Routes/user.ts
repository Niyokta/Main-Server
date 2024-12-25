import express, { Request } from "express"
import { authMiddleware } from "../Middleware";
import { getuserdetails,addEducation, addExperience,deleteEducation,deleteExperience } from "../Handlers/userhandler";
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
userRouter.post("/addEducation",authMiddleware, async (req, res) => {
    try {
        const accessToken = req.headers['authorization']
        const {user,cname,from,to,institute}= req.body;
        if (accessToken) {
            const add = await addEducation(user,cname,from,to,institute);
            res.send(add)
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
userRouter.post("/addExperience",authMiddleware, async (req, res) => {
    try {
        const accessToken = req.headers['authorization']
        const {user,title,company,from,to,description}=req.body;
        if (accessToken) {
            const add = await addExperience(user,title,company,from,to,description);
            res.send(add)
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

userRouter.post("/deleteEducation",authMiddleware,async(req,res)=>{
    try{
        const {educationId}=req.body;
        const deleteeducation=deleteEducation(educationId);
        res.send(deleteeducation);
    }
    catch(err:any){
        res.send({status:"400",message:err.message});
    }
})
userRouter.post("/deleteExperience",authMiddleware,async(req,res)=>{
    try{
        const {experienceId}=req.body;
        const deleteexperience=deleteExperience(experienceId);
        res.send(deleteexperience);
    }
    catch(err:any){
        res.send({status:"400",message:err.message});
    }
})

export default userRouter