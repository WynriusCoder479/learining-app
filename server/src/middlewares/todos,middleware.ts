import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoInputType } from '../types/input.type'
import { TodoResponse } from '../types/response.type'

class TodosMiddleware {
	validateTodoInput(
		req: Request<{}, {}, TodoInputType>,
		res: Response<TodoResponse>,
		next: NextFunction
	) {
		const { title, content } = req.body

		if (title === '' || content === '')
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'Missing data',
				errors: [
					{
						field: title === '' ? 'title' : 'content',
						message: `${title === '' ? 'Title' : 'Content'} is required`
					}
				]
			})

		if (title === '' && content === '')
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'Missing data',
				errors: [
					{
						field: 'title',
						message: 'Title is required'
					},
					{
						field: 'content',
						message: 'Content is required'
					}
				]
			})

		return next()
	}
}

const todosMiddleware = new TodosMiddleware()

export default todosMiddleware
