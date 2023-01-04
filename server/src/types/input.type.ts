import { TodoStatus } from '../utils/constant'

interface LoginInputType {
	usernameOrEmail: string
	password: string
}

interface RegisterInputType {
	username: string
	email: string
	password: string
}

interface TodoInputType {
	title: string
	content: string
	url: string
	description: string
	status?: TodoStatus
	user: string
}

export { LoginInputType, RegisterInputType, TodoInputType }
