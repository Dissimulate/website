import express from 'express'
import path from 'path'
import CMS from 'czar'

const app = express()
const port = 8080

app.use('/', express.static(__dirname))

const cms = new CMS(app)

cms.start([
  {
    name: 'blog',
    fields: [
      {type: 'text', name: 'title'},
      {type: 'textarea', name: 'body'}
    ]
  }, {
    name: 'test',
    fields: [
      {type: 'text', name: 'title'},
      {type: 'textarea', name: 'body'}
    ]
  }
])

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'index.html'))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
