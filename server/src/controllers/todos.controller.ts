import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'
import todosService from '../services/todos.service'
import { TodoInputType } from '../types/input.type'
import { LocalType, TodoResponse } from '../types/response.type'
import internalServerError from '../utils/internalServerError'

class TodosController {
	createTodo(
		req: Request<{}, {}, TodoInputType>,
		res: Response<TodoResponse, LocalType>
	) {
		try {
			todosService.createTodo(req.body).then(async newTodo => {
				const todo = await newTodo.populate('user', [
					'_id',
					'username',
					'email'
				])

				return res.status(StatusCodes.CREATED).json({
					success: true,
					message: 'Created todo successfully',
					todo
				})
			})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	readTodos(
		req: Request<{}, {}, {}, { page: string; limit: string }>,
		res: Response<TodoResponse, LocalType>
	) {
		const page = Number(req.query.page)
		const limit = Number(req.query.limit)

		try {
			todosService
				.findTodos(res.locals.user._id, { page, limit })
				.then(existingTodos => {
					return res.status(StatusCodes.OK).json({
						success: true,
						message: 'Read all todo of user successfully',
						todos: existingTodos
					})
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	updateTodo(
		req: Request<{ todoId: Types.ObjectId }, {}, TodoInputType>,
		res: Response<TodoResponse, LocalType>
	) {
		try {
			todosService
				.updateTodo(req.body, req.params.todoId, res.locals.user._id)
				.then(async updatedTodo => {
					if (!updatedTodo)
						return res.status(StatusCodes.BAD_REQUEST).json({
							success: false,
							message: 'Todo not found'
						})

					const todo = await updatedTodo.populate('user', [
						'_id',
						'username',
						'email'
					])

					return res.status(StatusCodes.OK).json({
						success: true,
						message: 'Updated todo successfully',
						todo
					})
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}

	deleteTodo(
		req: Request<{ todoId: Types.ObjectId }>,
		res: Response<TodoResponse, LocalType>
	) {
		try {
			todosService
				.deleteTodo(req.params.todoId, res.locals.user._id)
				.then(isDeletedTodo => {
					if (!isDeletedTodo)
						return res.status(StatusCodes.BAD_REQUEST).json({
							success: false,
							message: 'Todo not found'
						})

					return res.status(StatusCodes.OK).json({
						success: true,
						message: 'Delete todo successfully'
					})
				})
		} catch (err) {
			throw internalServerError(err, res)
		}
	}
}

const todoController = new TodosController()

export default todoController
