import express from 'express'
import usersMiddleware from '../middlewares/users.middleware'
import usersController from '../controllers/users.controller'

const usersRouter = express.Router()

usersRouter.post(
	'/register',
	usersMiddleware.validateRegisterInput,
	usersMiddleware.duplicatedUser,
	usersController.register
)

usersRouter.post(
	'/login',
	usersMiddleware.verifyPassword,
	usersController.login
)

usersRouter.put('/:userId', usersController.logout)

export default usersRouter
