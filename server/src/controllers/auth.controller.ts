import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Secret, verify } from 'jsonwebtoken'
import usersService from '../services/users.service'
import { UserAuthPayload } from '../types/auth.type'
import { IResponse } from '../types/response.type'
import jwt from '../utils/jwt'

class AuthController {
	refreshToken(req: Request, res: Response<IResponse>) {
		const refreshToken = req.cookies[process.env.JWT_COOKIE_NAME as string]

		if (!refreshToken)
			return res.status(StatusCodes.FORBIDDEN).json({
				success: false,
				message: 'Missing refresh token'
			})

		verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET as Secret,
			(error: any, verifyToken: any) => {
				if (error)
					return res.status(StatusCodes.REQUEST_TIMEOUT).json({
						success: false,
						message: 'Token is expried'
					})

				const decodedToken = verifyToken as UserAuthPayload

				usersService
					.findUser({
						_id: decodedToken.userId,
						username: decodedToken.username
					})
					.then(existingUser => {
						if (!existingUser)
							return res.status(StatusCodes.UNAUTHORIZED).json({
								success: false,
								message: 'User unauthorized'
							})

						jwt.sendRefreshToken(existingUser, res)

						return res.status(StatusCodes.ACCEPTED).json({
							success: true,
							message: 'Refresh token successfully',
							accessToken: jwt.createAccessToken(existingUser)
						})
					})
			}
		)
	}
}

const authController = new AuthController()

export default authController
