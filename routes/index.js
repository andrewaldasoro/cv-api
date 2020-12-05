const express = require('express')
const router = express.Router()
const pjson = require('../package.json')

/* GET health. */
router.get('/', function (req, res, next) {
  res.status(200).send('')
})

router.get('/v(ersion)?', function (req, res, next) {
  res.status(200).send(pjson.version)
})

module.exports = router
