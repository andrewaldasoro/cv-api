const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/create', function (_, res, next) {
  // console.log('"' + process.env.MAPBOX_ACCESS_TOKEN + '"')
  // console.log(new Date(new Date().getTime() + 30 * 60000))
  request({
    url: `https://api.mapbox.com/tokens/v2/andrewaldasoro?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ expires: new Date(new Date().getTime() + 30 * 60000), scopes: ['styles:read', 'fonts:read'] })
  }, (error, _, body) => {
    if (error) next(error)

    res.status(200).send(JSON.parse(body))
  })
})

module.exports = router
