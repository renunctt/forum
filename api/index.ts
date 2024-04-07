import express from 'express'

const PORT = process.env.PORT || 3000
const app = express()

app.get('/', (_, res) => {
  res.send('test')
})

app.listen(PORT, () => console.log(`Server listening port ${PORT}`))
