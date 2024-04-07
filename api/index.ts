import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import db from './util/database'
import errorMiddleware from './middlewares/error-middleware'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.get('/', (_, res) => {
  res.send('test')
})
app.use(errorMiddleware)

db.sync()
  .then((_) => {
    console.log('Database connected')
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((err) => console.log(err))
