import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export type projectPayload = {
    title: string,
    description: string,
    client_id: number,
    max_budget: string,
    skills_required:string[],
    category:string[],
    client_country:string
}
export async function findProject(projectID: number) {
    try {
        const project = await prisma.project.findUnique({
            where: {
                project_id: projectID
            }
        })
        if (!project) {
            return {
                status: 401,
                message: "Project Not Found"
            }
        }
        return {
            status: 200,
            message: "Project Found",
            project: project
        }
    }
    catch (err: any) { return { status: 400, message: err.message } }
}

export async function getAllProjects() {
    try{
        const allprojects=await prisma.project.findMany();
        return {
            status:"200",
            messgae:"Projects Found",
            projects:allprojects
        }
    }
    catch(err:any){
        return {status:"400",message:err.message}
    }
}

export async function findProjects(clientID: number) {
    try {

        const projects = await prisma.project.findMany({
            where: {
                client_id: clientID
            }
        })
        if (projects.length === 0) {
            return {
                status: 401,
                message: "No Projects Found"
            }
        }
        return {
            status: 200,
            message: "Projects Found",
            projects: projects
        }
    }
    catch (err: any) { return { status: 400, message: err.message } }
}

export async function createNewProject({ title, description, client_id, max_budget,skills,categories,client_name,min_budget,clientCountry }: { title: string, description: string, client_id: number, max_budget: string ,skills:string[],categories:string[],client_name:string,min_budget:string,clientCountry:string}) {
    try {
        const payload: projectPayload = {
            title: title,
            description: description,
            client_id: client_id,
            max_budget: max_budget,
            skills_required:skills,
            category:categories,
            client_country:clientCountry
        }
        const checkUser = await prisma.users.findUnique({
            where: {
                id: payload.client_id
            }
        })
        if (!checkUser) {
            return {
                status: 401,
                message: "Client Not Found"
            }
        }
        const newProject = await prisma.project.create({
            data:{
                title:title,
                description:description,
                client_id:client_id,
                max_budget:max_budget,
                min_budget:min_budget,
                skills_required:skills,
                category:categories,
                client_name:client_name,
                client_country:clientCountry
            }
        })
        if (!newProject) {
            return {
                status: 402,
                message: "Internal Error"
            }
        }
        return {
            status: 200,
            message: "Project Hosted Successfully"
        }
    }
    catch (err: any) {
        return {
            status: 400,
            message: err.message
        }
    }
}

export async function deleteProject(projectID: number) {
    try {
        const checkproject = await prisma.project.findUnique({
            where: {
                project_id: projectID
            }
        })
        if (!checkproject) {
            return {
                status: 401,
                message: "Invalid Project ID"
            }
        }
        const deleteProject = await prisma.project.delete({
            where: {
                project_id: projectID
            }
        }).then(async()=>{
            const deletebids=await prisma.bid.deleteMany({
                where:{
                    project_id:projectID
                }
            })
        })
        .catch((err)=>{return{status:402,message:err.message}})
        
        return{
            status:200,
            message:"Project Removed Successfuly"
        }
        
    }
    catch (err: any) {
        return {
            status: 400,
            message: err.message
        }
    }
}

export async function updateProject({ projectID, newtitle, newdescription }: { projectID: number, newtitle: string, newdescription: string }) {
    try {
        const checkproject = await prisma.project.findUnique({
            where: {
                project_id: projectID
            }
        })
        if (!checkproject) {
            return {
                status: 401,
                message: "Invalid Project ID"
            }
        }

        const updateProject = await prisma.project.update({
            where: {
                project_id: projectID,
            },
            data: {
                title: newtitle,
                description: newdescription
            }
        }).then(() => {
            return {
                status: 200,
                message: "Updated Successfully"
            }
        })
            .catch(() => {
                return {
                    status: 402,
                    message: "Internal Error"
                }
            })
    }
    catch (err: any) {
        return {
            status: 400,
            message: err.message
        }
    }
}