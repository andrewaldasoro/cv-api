const express = require('express')
const router = express.Router()
const { graphqlHTTP } = require('express-graphql')
const resourcesSchema = require('../graphqlSchemas/toronto/resources')
const dataSchema = require('../graphqlSchemas/toronto/data')

router.post('/package(-show)?', graphqlHTTP({
  schema: resourcesSchema
}))

router.post('/data-?(store)?', graphqlHTTP({
  schema: dataSchema
}))

module.exports = router
