var createError = require('http-errors')
var express = require('express')
var cors = require('cors')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var bitmojiRouter = require('./routes/bitmoji')
var torontoCovid19Router = require('./routes/toronto-covid19')
var mapboxTokenRouter = require('./routes/mapbox-token')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(cors({
  origin: /\.andrewaldasoro\.me$/,
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/bitmoji', bitmojiRouter)
app.use('/toronto-covid19', torontoCovid19Router)
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
