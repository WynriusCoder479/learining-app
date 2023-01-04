import mongoose from 'mongoose'

const connectDB = async () => {
	await mongoose.set('strictQuery', true).connect(process.env.DB_URL as string, err => {
		if (err) console.log(`An error occurred while connect to db: ${err}`)
		else console.log(`Connect to db successfully`)
	})
}

export default connectDB
