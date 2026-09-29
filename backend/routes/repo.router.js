const express = require("express")
const repoController = require("../controllers/repoController")

const repoRouter = express.Router()

repoRouter.post("/repo/create", repoController.createRepository)
repoRouter.get("/repo/user/:userId", repoController.fetchRepositoriesForCurrentUser)
repoRouter.get("/repo/id/:id", repoController.fetchRepositoryById)
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById)
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById)

module.exports = repoRouter