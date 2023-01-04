import express from 'express'
import todosMiddleware from '../middlewares/todos,middleware'
import todoController from '../controllers/todos.controller'
import authMiddleware from '../middlewares/auth.middleware'

const todosRouter = express.Router()

todosRouter.post(
	'/create',
	authMiddleware.verifyToken,
	todosMiddleware.validateTodoInput,
	todoController.createTodo
)

todosRouter.get('/', authMiddleware.verifyToken, todoController.readTodos)

todosRouter.put(
	'/:todoId',
	authMiddleware.verifyToken,
	todosMiddleware.validateTodoInput,
	todoController.updateTodo
)

todosRouter.delete(
	'/:todoId',
	authMiddleware.verifyToken,
	todoController.deleteTodo
)

export default todosRouter
