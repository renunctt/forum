import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import db from './util/database'
import router from './router'
import errorMiddleware from './middlewares/error-middleware'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
  }),
)
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await db.sync()
    console.log('Database connected')
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
