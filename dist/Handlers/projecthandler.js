"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProject = findProject;
exports.findProjects = findProjects;
exports.createNewProject = createNewProject;
exports.deleteProject = deleteProject;
exports.updateProject = updateProject;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function findProject(projectID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield prisma.project.findUnique({
                where: {
                    project_id: projectID
                }
            });
            if (!project) {
                return {
                    status: 401,
                    message: "Project Not Found"
                };
            }
            return {
                status: 200,
                message: "Project Found",
                project: project
            };
        }
        catch (err) {
            return { status: 400, message: err.message };
        }
    });
}
function findProjects(clientID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projects = yield prisma.project.findMany({
                where: {
                    client_id: clientID
                }
            });
            if (projects.length === 0) {
                return {
                    status: 401,
                    message: "No Projects Found"
                };
            }
            return {
                status: 200,
                message: "Projects Found",
                projects: projects
            };
        }
        catch (err) {
            return { status: 400, message: err.message };
        }
    });
}
function createNewProject(_a) {
    return __awaiter(this, arguments, void 0, function* ({ title, description, client_id, max_budget }) {
        try {
            const payload = {
                title: title,
                description: description,
                client_id: client_id,
                max_budget: max_budget
            };
            const checkUser = yield prisma.users.findUnique({
                where: {
                    id: payload.client_id
                }
            });
            if (!checkUser) {
                return {
                    status: 401,
                    message: "Client Not Found"
                };
            }
            const newProject = yield prisma.project.create({
                data: payload
            });
            if (!newProject) {
                return {
                    status: 402,
                    message: "Internal Error"
                };
            }
            return {
                status: 200,
                message: "Project Hosted Successfully"
            };
        }
        catch (err) {
            return {
                status: 400,
                message: err.message
            };
        }
    });
}
function deleteProject(projectID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkproject = yield prisma.project.findUnique({
                where: {
                    project_id: projectID
                }
            });
            if (!checkproject) {
                return {
                    status: 401,
                    message: "Invalid Project ID"
                };
            }
            const deleteProject = yield prisma.project.delete({
                where: {
                    project_id: projectID
                }
            });
            if (deleteProject) {
                return {
                    status: 200,
                    message: "Project Removed Successfuly"
                };
            }
            return {
                status: 402,
                message: "Internal Error"
            };
        }
        catch (err) {
            return {
                status: 400,
                message: err.message
            };
        }
    });
}
function updateProject(_a) {
    return __awaiter(this, arguments, void 0, function* ({ projectID, newtitle, newdescription }) {
        try {
            const checkproject = yield prisma.project.findUnique({
                where: {
                    project_id: projectID
                }
            });
            if (!checkproject) {
                return {
                    status: 401,
                    message: "Invalid Project ID"
                };
            }
            const updateProject = yield prisma.project.update({
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
                };
            })
                .catch(() => {
                return {
                    status: 402,
                    message: "Internal Error"
                };
            });
        }
        catch (err) {
            return {
                status: 400,
                message: err.message
            };
        }
    });
}
