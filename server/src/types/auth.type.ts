import { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'

type UserAuthPayload = JwtPayload & {
	userId: Types.ObjectId
	username: string
	tokenVersion?: number
}

export { UserAuthPayload }
