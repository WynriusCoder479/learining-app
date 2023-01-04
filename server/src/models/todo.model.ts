import { Prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { TodoStatus } from '../utils/constant'
import { User } from './user.model'

export class Todo {
	@Prop({ auto: true, required: true })
	_id: Types.ObjectId

	@Prop({ require: true })
	title!: string

	@Prop({ require: true })
	content!: string

	@Prop()
	url: string

	@Prop()
	description: string

	@Prop({ required: true, enum: TodoStatus, default: TodoStatus.TO_LEARN })
	status: TodoStatus

	@Prop({ ref: () => User })
	user: Ref<User>
}

const todoModel = getModelForClass(Todo, {
	schemaOptions: {
		collection: 'todo',
		timestamps: true
	}
})

export default todoModel
