import express from "express"
import authRouter from "./auth"
import bidRouter from "./bid"
import projectRouter from "./project"

const mainRouter=express()

const bidrouter=bidRouter;
const authrouter=authRouter;
const projectrouter=projectRouter;

mainRouter.use("/auth",authrouter);
mainRouter.use("/bid",bidrouter);
mainRouter.use("/project",projectrouter);


export default mainRouter;