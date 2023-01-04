import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import router from './routes/index.route'

const app = express()

app.use(
	cors({
		origin: '*',
		credentials: true
	})
)
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)

export default app
