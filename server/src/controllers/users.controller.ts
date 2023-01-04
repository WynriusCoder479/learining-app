import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'
import usersService from '../services/users.service'
import { LoginInputType, RegisterInputType } from '../types/input.type'
import { LocalType, UserResponse } from '../types/response.type'
import internalServerError from '../utils/internalServerError'
import jwt from '../utils/jwt'

class UsersController {
	register(
		req: Request<{}, {}, RegisterInputType>,
		res: Response<UserResponse>
	) {
		try {
			usersService.createUser(req.body).then(newUser => {
				const { password, tokenVersion, ...user } = newUser.toObject()

				jwt.sendRefreshToken(newUser, res)

				return res.status(StatusCodes.CREATED).json({
					success: true,
					message: 'User signed up in successfully',
					user,
					accessToken: jwt.createAccessToken(newUser)
				})
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	login(
		_req: Request<{}, {}, LoginInputType>,
		res: Response<UserResponse, LocalType>
	) {
		try {
			jwt.sendRefreshToken(res.locals.user, res)

			const { password, tokenVersion, ...user } = res.locals.user

			return res.status(StatusCodes.OK).json({
				success: true,
				message: 'User signed in successfully',
				user,
				accessToken: jwt.createAccessToken(res.locals.user)
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	logout(
		req: Request<{ userId: Types.ObjectId }>,
		res: Response<UserResponse>
	) {
		const userId = req.params.userId

		try {
			usersService.findUser({ _id: userId }).then(async existingUser => {
				if (!existingUser)
					return res.status(StatusCodes.FORBIDDEN).json({
						success: false,
						message: 'User not found'
					})

				existingUser.tokenVersion += 1

				await existingUser.save()

				res.clearCookie(process.env.JWT_COOKIE_NAME as string, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/api/auth/refresh-token'
				})

				return res.status(StatusCodes.OK).json({
					success: true,
					message: `User signed out successfully`
				})
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}
}

const usersController = new UsersController()

export default usersController
