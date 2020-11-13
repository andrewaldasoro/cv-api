const express = require('express')
const router = express.Router()
const https = require('https')

const baseUrl = 'https://ckan0.cf.opendata.inter.prod-toronto.ca'
const apiPath = '/api/3/action'
const apiUrl = baseUrl + apiPath

const requestsMap = new Map([
  ['/covid-cases', '64b54586-6180-4485-83eb-81e8fae3b8fe'],
  ['/neighbourhoods', '4def3f65-2a65-4a4f-83c4-b2a4aed72d46']
])

router.get('/request', function (req, res, next) {
  https.get(baseUrl + req.query.path, (response) => {
    const dataChunks = []
    response
      .on('data', (chunk) => {
        dataChunks.push(chunk)
      })
      .on('end', () => {
        res.status(200).send(JSON.parse(Buffer.concat(dataChunks).toString()).result)
      })
      .on('error', (error) => {
        next(error)
      })
  })
})

for (const [path, id] of requestsMap) {
  router.get(path, function (_, res, next) {
    getData(id)
      .then(resource => res.status(200).send(resource))
      .catch(error => {
        next(error)
      })
  })
}

const requestData = (path, extra) => new Promise((resolve, reject) =>
  https.get(apiUrl + path, (response) => {
    const dataChunks = []
    response
      .on('data', (chunk) => {
        dataChunks.push(chunk)
      })
      .on('end', () => {
        if (extra) {
          resolve({ ...JSON.parse(Buffer.concat(dataChunks).toString()).result, ...extra })
        } else {
          resolve(JSON.parse(Buffer.concat(dataChunks).toString()).result)
        }
      })
      .on('error', (error) => {
        reject(error)
      })
  })
)

const getData = async id =>
  requestData(`/package_show?id=${id}`)
    .then(data => data.resources.filter(resource => resource.datastore_active))
    .then(datastoreResources => requestData(`/datastore_search?id=${datastoreResources[0].id}`, { last_modified: datastoreResources[0].last_modified }))
    .catch(err => { throw err })

module.exports = router
