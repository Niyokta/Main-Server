import express from "express"
import authRouter from "./auth"
import bidRouter from "./bid"
import projectRouter from "./project"
import userRouter from "./user"
const mainRouter=express()

const bidrouter=bidRouter;
const authrouter=authRouter;
const projectrouter=projectRouter;
const userrouter=userRouter;

mainRouter.use("/auth",authrouter);
mainRouter.use("/bid",bidrouter);
mainRouter.use("/project",projectrouter);
mainRouter.use("/user",userrouter);


export default mainRouter;