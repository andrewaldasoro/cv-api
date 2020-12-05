const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const bitmojiRouter = require('./routes/bitmoji')
const torontoOpenDataRouter = require('./routes/toronto')
const mapboxTokenRouter = require('./routes/mapbox-token')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(helmet())
app.use(cors({
  origin: ['https://andrewaldasoro.me', /\.andrewaldasoro\.me$/],
  // origin: 'http://localhost:4000',
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/bitmoji', bitmojiRouter)
app.use('/toronto', torontoOpenDataRouter)
app.use('/mapbox-token', mapboxTokenRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // send the error
  res.status(err.status || 500)
  res.send(err.message)
})

module.exports = app
