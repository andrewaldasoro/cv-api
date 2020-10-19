var express = require('express')
var router = express.Router()
const https = require('https')
var debug = require('debug')('cv-api:request')

const packageId = '64b54586-6180-4485-83eb-81e8fae3b8fe'

/* GET COVID cases. */
router.get('/', function (_, res, next) {
  // promise to retrieve the package
  const getPackage = new Promise((resolve, reject) => {
    https.get(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`, (response) => {
      const dataChunks = []
      response
        .on('data', (chunk) => {
          dataChunks.push(chunk)
        })
        .on('end', () => {
          const data = Buffer.concat(dataChunks)
          resolve(JSON.parse(data.toString()).result)
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  })

  // since this package has resources in the datastore, one can get the data rather than just the metadata of the resources
  // promise to retrieve data of a datastore resource
  const getDatastoreResource = resource => new Promise((resolve, reject) => {
    https.get(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource.id}`, (response) => {
      const dataChunks = []
      response
        .on('data', (chunk) => {
          dataChunks.push(chunk)
        })
        .on('end', () => {
          const data = Buffer.concat(dataChunks)
          resolve(JSON.parse(data.toString()).result.records)
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  })

  // get the package information again
  getPackage.then(pkg => {
    // get the datastore resources for the package
    const datastoreResources = pkg.resources.filter(r => r.datastore_active)
    debug('Toronto COVID19 data store length: ' + datastoreResources.length)

    // retrieve the first datastore resource as an example
    getDatastoreResource(datastoreResources[0])
      .then(resource => {
        // this is the actual data of the resource
        res.status(200).send(resource)
      })
      .catch(error => {
        next(error)
      })
  }).catch(error => {
    next(error)
  })
})

module.exports = router
