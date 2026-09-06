import express from "express"
import {SignUp , SignIn, SignOut, sendOtp, verifyOtp, resetPassword, GoogleAuth } from "../controllers/auth.controller.js"
const authRouter = express.Router()

authRouter.post("/signup" ,SignUp)

authRouter.post("/signin" ,SignIn)

authRouter.get("/signout" ,SignOut)

authRouter.post("/send-otp" ,sendOtp)

authRouter.post("/verify-otp" ,verifyOtp)

authRouter.post("/reset-password" ,resetPassword)

authRouter.post("/google-auth" ,GoogleAuth)

export default authRouter