import express from 'express'
import authRouter from './auth.route'
import todosRouter from './todos.route'
import usersRouter from './users.route'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/todos', todosRouter)
router.use('/auth', authRouter)

export default router
