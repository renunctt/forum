import type { Handler } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../exeptions/api-error'
import userService from '../services/user-service'
import cookieService from '../services/cookie-service'

class UserController {
  registration: Handler = async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидаций', errors.array()))
      }
      const { name, email, password } = req.body
      const userData = await userService.registration(name, email, password)
      cookieService.setRefreshTokenCookie(res, userData.refreshToken)
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  login: Handler = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      cookieService.setRefreshTokenCookie(res, userData.refreshToken)
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  logout: Handler = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
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
      cookieService.setRefreshTokenCookie(res, userData.refreshToken)
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  getUsers: Handler = async (_, res, next) => {
    try {
      const users = await userService.getUsers()
      return res.json({ users })
    } catch (e) {
      next(e)
    }
  }
  
  createPost: Handler = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies
      const { title, content, tags = '' } = req.body
      const post = await userService.createPost(refreshToken, title, content, tags)
      return res.json(post)
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController()
