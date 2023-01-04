import userModel, { User } from '../models/user.model'
import { RegisterInputType } from '../types/input.type'
import argon2 from 'argon2'
import { FilterQuery } from 'mongoose'

class UsersService {
	async createUser(registerInput: RegisterInputType) {
		const { username, email, password } = registerInput

		const newUser = new userModel({
			username,
			email,
			password: await argon2.hash(password)
		})

		await newUser.save()

		return newUser
	}

	async findUser(filter: FilterQuery<User>) {
		const user = await userModel.findOne(filter)

		return user
	}
}

const usersService = new UsersService()

export default usersService
