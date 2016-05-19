import express from 'express'
import path from 'path'

const app = express()
const port = 3000

app.use('/', express.static(__dirname))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'index.html'))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
