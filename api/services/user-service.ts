import { UserDto } from '../dtos/user-dto'
import { ApiError } from '../exeptions/api-error'
import UserModel from '../models/user-model'
import bcrypt from 'bcrypt'
import tokenService from './token-service'

class UserService {
  registration = async (name: string, email: string, password: string) => {
    const existingUserByEmail = await UserModel.findOne({ where: { email } })
    if (existingUserByEmail) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }

    const existingUserByName = await UserModel.findOne({ where: { name } })
    if (existingUserByName) {
      throw ApiError.BadRequest(`Пользователь с именом ${name} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const user = await UserModel.create({ name, email, password: hashPassword })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  login = async (email: string, password: string) => {
    const user = await UserModel.findOne({ where: { email } })
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  logout = async (refreshToken: string) => {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  refresh = async (refreshToken: string) => {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenfromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenfromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await UserModel.findOne({ where: { id: userData.id } })

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  getUsers = async () => {
    const users = await UserModel.findAll()
    const usersDto = users.map(user => new UserDto(user))
    return usersDto
  }
}

export default new UserService()
