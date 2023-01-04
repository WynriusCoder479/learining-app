import { User } from 'src/models/user.model'
import { Document, Types } from 'mongoose'
import {
	BeAnObject,
	IObjectWithTypegooseFunction
} from '@typegoose/typegoose/lib/types'

interface IResponse {
	success: boolean
	message: string
	accessToken?: string
}

type UserDocument = Document<Types.ObjectId, BeAnObject, User> &
	User &
	IObjectWithTypegooseFunction &
	Required<{
		_id: Types.ObjectId
	}>

interface FieldError {
	field: string
	message: string
}

type UserResponse = IResponse & {
	user?: {
		_id: Types.ObjectId
		username: string
		email: string
	}
	errors?: FieldError[]
}

type TodoResponse = IResponse & {
	todo?: any
	todos?: any
	errors?: FieldError[]
}

type LocalType = {
	user: User
}

export {
	IResponse,
	FieldError,
	UserResponse,
	LocalType,
	UserDocument,
	TodoResponse
}
