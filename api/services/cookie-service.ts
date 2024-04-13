import type { Response } from 'express'

class CookieService {
  setRefreshTokenCookie(res: Response, refreshToken: string, maxAge: number) {
    res.cookie('refreshToken', refreshToken, { maxAge, sameSite: 'none', httpOnly: true })
  }
}

export default new CookieService()
