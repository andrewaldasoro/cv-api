const express = require('express')
const router = express.Router()
const request = require('request')

const BITMOJI = [
  '9e669e76-bd42-43ba-bc81-83741de280f5',
  'a41da708-81e9-4ec3-9364-9d8748f7063d',
  '8f42bf78-97e6-4e35-8ec5-709ed099f8e9',
  '096dffe0-3934-41db-842c-34c180d0615c',
  '36d2d62a-fc90-4604-933b-52a066b5c1b4',
  'fc5507ba-0b77-439b-a135-1fa8827aa188',
  '76c3b171-f0cf-4dd6-b91f-91bd86693f61'
]

/* GET bitmoji. */
router.get('/', function (_, res, next) {
  const bitmojiUrl = `https://sdk.bitmoji.com/render/panel/${BITMOJI[Math.floor(Math.random() * BITMOJI.length)]}-36692507-a781-4645-83d1-17df60d447bc-v1.png?transparent=1&palette=1`
  request({
    url: bitmojiUrl,
    method: 'GET',
    encoding: null // This is actually important, or the image string will be encoded to the default encoding
  }, (error, _, body) => {
    if (error) next(error)
    if (!body) res.status(401).send('body is undefined') // TODO no connection

    const image = body.toString('base64')
    res.status(200).send(`data:image/png;base64,${image}`)
  })
})

module.exports = router
