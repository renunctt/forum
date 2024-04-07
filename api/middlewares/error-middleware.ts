import { ApiError } from '../exeptions/api-error'
import type { Request, Response } from 'express'

export default function (err: Error, _: Request, res: Response) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors })
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка' })
}
