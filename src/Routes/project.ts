import express from "express"
import { Request } from "express"
import { findProject, findProjects, createNewProject, deleteProject } from "../Handlers/projecthandler"
import { authMiddleware } from "../Middleware"
const projectRouter = express.Router()


projectRouter.post("/getProject", authMiddleware, async (req: Request, res) => {
    try {
        const { projectID } = req.body
        const project = await findProject(projectID)
            .then((response) => res.send(response))
            .catch((err) => res.send(err.message))
    }
    catch (err: any) {
        res.send({
            status: 400,
            message: err.message
        })
    }
})

projectRouter.post("/getProjects", authMiddleware, async (req: Request, res) => {
    try {
        const { cleintID } = req.body

        const projects = await findProjects(cleintID)
            .then((response) => res.send(response))
            .catch((err) => res.send(err.message))
    }
    catch (err: any) {
        res.send({
            status: 400,
            message: err.message
        })
    }
})

projectRouter.post("/createProject", authMiddleware, async (req: Request, res) => {
    try {
        const { title, description, client_id, max_budget } = req.body
        const newProject = await createNewProject({ title, description, client_id, max_budget })
            .then((response) => res.send(response))
            .catch((err) => res.send(err.message))
    }
    catch (err: any) {
        res.send({
            status: 400,
            message: err.message
        })
    }
})

projectRouter.post("/deleteProject", authMiddleware, async (req: Request, res) => {
    try {
        const { projectID } = req.body

        const deleteproject = await deleteProject(projectID)
            .then((response) => res.send(response))
            .catch((err) => res.send(err.message))
    }
    catch (err: any) {
        res.send({
            status: 400,
            message: err.message
        })
    }
})

export default projectRouter;