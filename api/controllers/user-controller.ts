import type { Handler } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../exeptions/api-error'
import userService from '../services/user-service'

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000

class UserController {
  registration: Handler = async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидаций', errors.array()))
      }
      const { name, email, password } = req.body
      const userData = await userService.registration(name, email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: THIRTY_DAYS_IN_MS, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  login: Handler = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: THIRTY_DAYS_IN_MS, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  logout: Handler = async (req, res, next) => {
    try {
      const { refereshToken } = req.cookies
      const token = await userService.logout(refereshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }

  refresh: Handler = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: THIRTY_DAYS_IN_MS, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  getUsers: Handler = async (_, res, next) => {
    try {
      const users = await userService.getUsers()
      return res.json({users})
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController()
