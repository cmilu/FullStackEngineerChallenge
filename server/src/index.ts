import express from 'express'
import bodyParser from 'body-parser'
import { RouterAdmin } from './routes'
import { ApiError } from './var'

const app = express()

app.use(bodyParser.json())
app.use('/admin/v1', RouterAdmin)

// error handler
app.use(function(err: { code: ApiError }, _, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  switch (err.code) {
    case ApiError.RequestMalformed:
      res.status(400)
      break
    case ApiError.AuthRequired:
      res.status(401)
      break
    case ApiError.AuthForbidden:
      res.status(403)
      break
    default:
      res.status(500)
  }
  res.send(err.code)
})
app.listen(8081)
