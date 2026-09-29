const express = require("express")
const issueController = require("../controllers/issueController")

const issueRouter = express.Router()

issueRouter.post("/repo/id/:id/issue/create", issueController.createIssue)
issueRouter.patch("/issue/:id/update", issueController.updateIssue)
issueRouter.patch("/issue/:id/status", issueController.updateIssueStatus)
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById)
issueRouter.get("/issue/:id", issueController.getIssueById)
issueRouter.get("/issue/user/:userId", issueController.getAllIssuesForUser)

module.exports = issueRouter    