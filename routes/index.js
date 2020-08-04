var express = require('express')
var router = express.Router()

/* GET health. */
router.get('/', function (req, res, next) {
  res.status(200).send('')
})

module.exports = router
