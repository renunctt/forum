import express from 'express'
import userController from '../controllers/user-controller'

const router = express.Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)

export default router
