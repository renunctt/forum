import TokenModel from '../models/token-model'
import jwt from 'jsonwebtoken'

class TokenService {
  private accessSecret: string
  private refreshSecret: string

  constructor() {
    const accessSecret = process.env.JWT_ACCESS_SECRET
    const refreshSecret = process.env.JWT_REFRESH_SECRET
    if (!accessSecret || !refreshSecret) {
      throw new Error('jwt access and refresh secret not found')
    }
    this.accessSecret = accessSecret
    this.refreshSecret = refreshSecret
  }

  generateTokens = (payload: object) => {
    const accessToken = jwt.sign(payload, this.accessSecret, { expiresIn: '30m' })
    const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: '30d' })
    return {
      accessToken,
      refreshToken,
    }
  }

  saveToken = async (userId: number, refreshToken: string) => {
    const tokenData = await TokenModel.findOne({ where: { userId } })
    if (tokenData && 'refreshToken' in tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({ userId, refreshToken })
    return token
  }

  removeToken = async (refreshToken: string) => {
    const tokenData = await TokenModel.destroy({where: {refreshToken}})
    return tokenData
  }

  validateAccessToken = (token: string) => {
    try {
      const userData = jwt.verify(token, this.accessSecret)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken = (token: string) => {
    try {
      const userData = jwt.verify(token, this.refreshSecret)
      return userData
    } catch (e) {
      return null
    }
  }

  findToken = async (refreshToken: string) => {
    const tokenData = await TokenModel.findOne({where: {refreshToken}})
    return tokenData
  }
}

export default new TokenService()
