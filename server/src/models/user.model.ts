import { Prop, getModelForClass } from '@typegoose/typegoose'
import { Types } from 'mongoose'

export class User {
	@Prop({ auto: true, required: true })
	_id!: Types.ObjectId

	@Prop({ required: true, unique: true })
	username!: string

	@Prop({ required: true, unique: true })
	email!: string

	@Prop({ required: true })
	password!: string

	@Prop({ required: true, default: 0 })
	tokenVersion: number
}

const userModel = getModelForClass(User, {
	schemaOptions: {
		collection: 'user',
		timestamps: true
	}
})

export default userModel
