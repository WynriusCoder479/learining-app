import * as EmailValidator from 'email-validator'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import usersService from '../services/users.service'
import { LoginInputType, RegisterInputType } from '../types/input.type'
import { LocalType, UserResponse } from '../types/response.type'
import internalServerError from '../utils/internalServerError'
import argon2 from 'argon2'

class UsersMiddleware {
	validateRegisterInput(
		req: Request<{}, {}, RegisterInputType>,
		res: Response<UserResponse>,
		next: NextFunction
	) {
		const passwordPartern: RegExp =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

		const { username, email, password } = req.body

		if (username.length <= 4 || EmailValidator.validate(username))
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'Invalid username',
				errors: [
					{
						field: 'username',
						message:
							'Username must be 4 or greater than, and not contain "@" character'
					}
				]
			})

		if (!EmailValidator.validate(email))
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'Invalid email',
				errors: [
					{
						field: 'email',
						message: 'Email wrong form'
					}
				]
			})

		if (!passwordPartern.test(password))
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'Invalid password',
				errors: [
					{
						field: 'password',
						message:
							'Password must have at least 1 capitalize letter, 1 number digit, and 1 special charator'
					}
				]
			})

		return next()
	}

	duplicatedUser(
		req: Request<{}, {}, RegisterInputType>,
		res: Response<UserResponse>,
		next: NextFunction
	) {
		const { username, email } = req.body

		try {
			usersService.findUser({ username, email }).then(existingUser => {
				if (existingUser)
					return res.status(StatusCodes.BAD_REQUEST).json({
						success: false,
						message: 'Duplicated user',
						errors:
							existingUser.username === username && existingUser.email === email
								? [
										{
											field: 'username',
											message: 'Username is already taken'
										},
										{
											field: 'email',
											message: 'Email is already taken'
										}
								  ]
								: existingUser.username === username
								? [
										{
											field: 'username',
											message: 'Username is already taken'
										}
								  ]
								: [
										{
											field: 'email',
											message: 'Email is alredy taken'
										}
								  ]
					})

				return next()
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	verifyPassword(
		req: Request<{}, {}, LoginInputType>,
		res: Response<UserResponse, LocalType>,
		next: NextFunction
	) {
		const { usernameOrEmail, password } = req.body

		try {
			usersService
				.findUser(
					EmailValidator.validate(usernameOrEmail)
						? { email: usernameOrEmail }
						: { username: usernameOrEmail }
				)
				.then(async existingUser => {
					if (!existingUser)
						return res.status(StatusCodes.BAD_REQUEST).json({
							success: false,
							message: 'User not found',
							errors: [
								{
									field: 'usernameOrEmail',
									message: 'Username or email is incorrect'
								}
							]
						})

					const verifyPassword = await argon2.verify(
						existingUser.password,
						password
					)

					if (!verifyPassword)
						return res.status(StatusCodes.FORBIDDEN).json({
							success: false,
							message: 'Wrong password',
							errors: [
								{
									field: 'password',
									message: 'Password is incorrect'
								}
							]
						})

					res.locals.user = existingUser.toObject()

					return next()
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}
}

const usersMiddleware = new UsersMiddleware()

export default usersMiddleware
