import { Types } from 'mongoose'
import { TodoStatus } from '../utils/constant'
import todoModel from '../models/todo.model'
import { TodoInputType } from '../types/input.type'

class TodosService {
	async createTodo(todoInput: TodoInputType) {
		const { url, user } = todoInput

		const newTodo = new todoModel({
			...todoInput,
			url: url.startsWith('https://') ? url : `https://${url}`,
			user
		})

		await newTodo.save()

		return newTodo
	}

	async findTodos(
		userId: Types.ObjectId,
		query: { page?: number; limit?: number }
	) {
		const { page, limit } = query

		const isQuery = page !== undefined && limit !== undefined

		const todos = await todoModel.find(
			{ user: userId },
			{},
			isQuery
				? {
						skip: (page - 1) * limit,
						limit
				  }
				: {}
		)

		return todos
	}

	async findTodo(todoId: Types.ObjectId) {
		const todo = await todoModel.findById(todoId)

		return todo
	}

	async updateTodo(
		updateTodoInput: TodoInputType,
		todoId: Types.ObjectId,
		userId: Types.ObjectId
	) {
		const { title, content, description, url, status } = updateTodoInput

		const todoUpdateConditon = { _id: todoId, user: userId }

		const updatedTodo = await todoModel.findByIdAndUpdate(
			todoUpdateConditon,
			{
				title,
				content,
				description: description || ' ',
				url: (url?.startsWith('https://') ? url : `https://${url}`) || ' ',
				status: status || TodoStatus.TO_LEARN
			},
			{ new: true }
		)

		return updatedTodo
	}

	async deleteTodo(todoId: Types.ObjectId, userId: Types.ObjectId) {
		const todoDeleteCondition = { _id: todoId, user: userId }

		const deletedTodo = await todoModel.findByIdAndDelete(todoDeleteCondition)

		if (deletedTodo) return true

		return false
	}
}

const todosService = new TodosService()

export default todosService
