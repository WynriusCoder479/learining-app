import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserResponse } from '../types/response.type'

const internalServerError = (err: any, res: Response<UserResponse>) => {
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		success: false,
		message: `Internal server error: ${err}`
	})
}

export default internalServerError
