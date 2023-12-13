import express from 'express'
import userController from '../controllers/UserController.js'

const router = express.Router()

router.post('/users', userController.getUsers)
router.post('/user', userController.createUser)
router.patch('/user', userController.updateUser)
router.delete('/user', userController.deleteUser)

export default router