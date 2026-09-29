const express = require("express") 
const userController = require("../controllers/userController")

const userRouter = express.Router()

userRouter.post("/signup" , userController.signup)
userRouter.post("/login" , userController.login)
userRouter.get("/userProfile/:id" , userController.getUserProfile)
userRouter.patch("/userProfile/:id/update", userController.updateUsername)

module.exports = userRouter
