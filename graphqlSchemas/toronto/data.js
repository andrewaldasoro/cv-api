const {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql')
const https = require('https')

const baseUrl = 'https://ckan0.cf.opendata.inter.prod-toronto.ca'
const apiPath = '/api/3/action'
const apiUrl = baseUrl + apiPath

const neighbourhoodType = new GraphQLObjectType({
  name: 'Neighbourhood',
  fields: {
    geometry: { type: GraphQLString, resolve: root => root.geometry },
    areaId: { type: GraphQLString, resolve: root => root.AREA_ID },
    areaName: { type: GraphQLString, resolve: root => root.AREA_NAME },
    areaAttrId: { type: GraphQLInt, resolve: root => root.AREA_ATTR_ID },
    parentAreaId: { type: GraphQLInt, resolve: root => root.PARENT_AREA_ID },
    areaShortCode: { type: GraphQLString, resolve: root => root.AREA_SHORT_CODE },
    areaLongCode: { type: GraphQLString, resolve: root => root.AREA_LONG_CODE },
    areaDesc: { type: GraphQLString, resolve: root => root.AREA_DESC },
    x: { type: GraphQLInt, resolve: root => root.X },
    y: { type: GraphQLInt, resolve: root => root.Y },
    longitude: { type: GraphQLInt, resolve: root => root.LONGITUDE },
    latitude: { type: GraphQLInt, resolve: root => root.LATITUDE },
    objectId: { type: GraphQLInt, resolve: root => root.OBJECTID },
    shapeArea: { type: GraphQLFloat, resolve: root => root.Shape__Area },
    shapeLenght: { type: GraphQLFloat, resolve: root => root.Shape__Length }
  }
})

const covidType = new GraphQLObjectType({
  name: 'Covid',
  fields: {
    id: { type: GraphQLID, resolve: root => root._id },
    assignedId: { type: GraphQLInt, resolve: root => root.Assigned_ID },
    outbreakAssociated: { type: GraphQLString, resolve: root => root['Outbreak Associated'] },
    ageGroup: { type: GraphQLString, resolve: root => root['Age Group'] },
    neighbourhoodName: { type: GraphQLString, resolve: root => root['Neighbourhood Name'] },
    FSA: { type: GraphQLString, resolve: root => root.FSA },
    sourceOfInfection: { type: GraphQLString, resolve: root => root['Source of Infection'] },
    classification: { type: GraphQLString, resolve: root => root.Classification },
    episodeDate: { type: GraphQLString, resolve: root => root['Episode Date'] },
    reportedDate: { type: GraphQLString, resolve: root => root['Reported Date'] },
    clientGender: { type: GraphQLString, resolve: root => root['Client Gender'] },
    outcome: { type: GraphQLString, resolve: root => root.Outcome },
    currentlyHospitalized: { type: GraphQLString, resolve: root => root['Currently Hospitalized'] },
    currentlyInICU: { type: GraphQLString, resolve: root => root['Currently in ICU'] },
    currentlyIntubated: { type: GraphQLString, resolve: root => root['Currently Intubated'] },
    everHospitalized: { type: GraphQLString, resolve: root => root['Ever Hospitalized'] },
    everInICU: { type: GraphQLString, resolve: root => root['Ever in ICU'] },
    everIntubated: { type: GraphQLString, resolve: root => root['Ever Intubated'] }
  }
})

const infoType = new GraphQLObjectType({
  name: 'Info',
  fields: {
    notes: { type: GraphQLString, resolve: root => root.notes },
    typeOverride: { type: GraphQLString, resolve: root => root.type_override },
    label: { type: GraphQLString, resolve: root => root.label }
  }
})

const fieldType = new GraphQLObjectType({
  name: 'Field',
  fields: {
    info: { type: infoType, resolve: root => root.info },
    type: { type: GraphQLString, resolve: root => root.type },
    id: { type: GraphQLString, resolve: root => root.id }
  }
})

const linksType = new GraphQLObjectType({
  name: 'Links',
  fields: {
    prev: { type: GraphQLString, resolve: root => root.prev },
    start: { type: GraphQLString, resolve: root => root.start },
    next: { type: GraphQLString, resolve: root => root.next }
  }
})

const dataStoreType = new GraphQLObjectType({
  name: 'DataStore',
  fields: {
    includeTotal: { type: GraphQLBoolean, resolve: root => root.include_total },
    resourceId: { type: GraphQLID, resolve: root => root.resource_id },
    fields: { type: new GraphQLList(fieldType), resolve: root => root.fields },
    recordsFormat: { type: GraphQLString, resolve: root => root.records_format },
    neighbourhoodsRecords: { type: new GraphQLList(neighbourhoodType), resolve: root => root.records },
    covidRecords: { type: new GraphQLList(covidType), resolve: root => root.records },
    links: { type: linksType, resolve: root => root._links },
    total: { type: GraphQLInt, resolve: root => root.total }
  }
})

const resultType = new GraphQLObjectType({
  name: 'Result',
  fields: {
    result: {
      type: dataStoreType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        page: { type: GraphQLInt }
      },
      resolve: async (_, args) => await getDataStore(args.id, args.page)
    }
  }
})

const getDataStore = (id, page) =>
  request(page ? `/datastore_search?id=${id}&offset=${page * 100}` : `/datastore_search?id=${id}`)
    .catch(err => { console.log(err) })

const request = path => new Promise((resolve, reject) =>
  https.get(apiUrl + path, (response) => {
    const dataChunks = []
    response
      .on('data', (chunk) => {
        dataChunks.push(chunk)
      })
      .on('end', () => {
        resolve(JSON.parse(Buffer.concat(dataChunks).toString()).result)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
)

module.exports = new GraphQLSchema({ query: resultType })
