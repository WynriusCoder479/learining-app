import { Response } from 'express'
import { Secret, sign } from 'jsonwebtoken'
import { User } from 'src/models/user.model'

class JWT {
	createAccessToken(user: User) {
		const { _id, username } = user

		return sign(
			{ userId: _id, username },
			process.env.ACCESS_TOKEN_SECRET as Secret,
			{
				expiresIn: '1h'
			}
		)
	}

	sendRefreshToken(user: User, res: Response) {
		const { _id, username, tokenVersion } = user

		res.cookie(
			process.env.JWT_COOKIE_NAME as string,
			sign(
				{ userId: _id, username, tokenVersion },
				process.env.REFRESH_TOKEN_SECRET as Secret,
				{ expiresIn: '7d' }
			),
			{
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/api/auth/refresh-token'
			}
		)
	}
}

const jwt = new JWT()

export default jwt
