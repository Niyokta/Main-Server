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
exports.findBid = findBid;
exports.findBids = findBids;
exports.placeBid = placeBid;
exports.deleteBid = deleteBid;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function findBid(bidID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bid = yield prisma.bid.findUnique({
                where: {
                    bid_id: bidID
                }
            });
            if (!bid) {
                return {
                    status: 401,
                    message: "Bid not found"
                };
            }
            return {
                status: 200,
                message: "Big Found Successfully"
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
function findBids(projectID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bids = yield prisma.bid.findMany({
                where: {
                    project_id: projectID
                }
            });
            if (bids.length === 0) {
                return {
                    status: 401,
                    message: "No Bid Found on This project"
                };
            }
            return {
                status: 200,
                message: "Bids found successfully",
                bids: bids
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
function placeBid(_a) {
    return __awaiter(this, arguments, void 0, function* ({ freelancerID, projectID, bidingPrice, freelancerName, proposal }) {
        try {
            const checkProject = yield prisma.project.findUnique({
                where: {
                    project_id: projectID
                }
            });
            if (!checkProject) {
                return {
                    status: 401,
                    message: "Project Does Not Exist"
                };
            }
            const checkBid = yield prisma.bid.findMany({
                where: {
                    project_id: projectID,
                    freelancer_id: freelancerID
                }
            });
            if (checkBid.length !== 0) {
                return {
                    status: 404,
                    message: "Bid Already Placed"
                };
            }
            const bid = yield prisma.bid.create({
                data: {
                    freelancer_id: freelancerID,
                    project_id: projectID,
                    bidding_price: bidingPrice,
                    freelancer_name: freelancerName,
                    proposal: proposal
                }
            }).catch((err) => { return { status: 402, message: err.message }; });
            if (!bid)
                return { status: 403, message: "Internal Error" };
            return { status: 200, message: "Bid Placed Successfully" };
        }
        catch (err) {
            return { status: 400, message: err.message };
        }
    });
}
function deleteBid(bidID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletebid = yield prisma.bid.delete({
                where: {
                    bid_id: bidID
                }
            }).catch((err) => { return { status: 401, message: err.message }; });
            return { status: 200, message: "Bid Removed Successfully" };
        }
        catch (err) {
            return { status: 400, message: err.message };
        }
    });
}
