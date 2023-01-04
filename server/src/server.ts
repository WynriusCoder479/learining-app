import { createServer } from 'http'
import app from './app'
import connectDB from './databases/init.mongo'
import dotenv from 'dotenv'

const server = async () => {
	dotenv.config()

	connectDB()

	const PORT = process.env.PORT || 4000

	const httpServer = createServer(app)

	await new Promise<void>(resolver => httpServer.listen({ port: PORT }, resolver))
		.then(_ => console.log(`httpServer starting on port ${PORT}`))
		.catch(err => console.log(`An error occurred while stating httpServer: ${err.message}`))
}

server().catch(err => console.error(`Initialize server error: ${err}`))
