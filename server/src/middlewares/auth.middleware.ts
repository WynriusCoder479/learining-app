import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Secret, verify } from 'jsonwebtoken'
import usersService from '../services/users.service'
import { UserAuthPayload } from '../types/auth.type'
import { IResponse, LocalType } from '../types/response.type'

class AuthMiddleware {
	verifyToken(
		req: Request<{}, {}, {}>,
		res: Response<IResponse, LocalType>,
		next: NextFunction
	) {
		const token = req.headers['authorization']?.split(' ')[1]

		if (!token)
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: 'Missing token'
			})

		verify(
			token,
			process.env.ACCESS_TOKEN_SECRET as Secret,
			(error, verifyToken) => {
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

						res.locals.user = existingUser
						return next()
					})
			}
		)
	}
}

const authMiddleware = new AuthMiddleware()

export default authMiddleware
