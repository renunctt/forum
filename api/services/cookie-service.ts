import type { Response } from 'express'

class CookieService {
  private readonly THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, { maxAge: this.THIRTY_DAYS_IN_MS, sameSite: 'none', httpOnly: true })
  }
}

export default new CookieService()
