import express from 'express'
import authController from '../controllers/auth.controller'

const authRouter = express.Router()

authRouter.get('/refresh-token', authController.refreshToken)

export default authRouter
