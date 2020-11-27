const {
  GraphQLBoolean,
  GraphQLInt,
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

const resourceType = new GraphQLObjectType({
  name: 'Resource',
  fields: {
    packageId: { type: GraphQLString, resolve: root => root.package_id },
    datastoreActive: { type: GraphQLBoolean, resolve: root => root.datastore_active },
    id: { type: GraphQLID, resolve: root => root.id },
    format: { type: GraphQLString, resolve: root => root.format },
    state: { type: GraphQLString, resolve: root => root.state },
    hash: { type: GraphQLString, resolve: root => root.hash },
    description: { type: GraphQLString, resolve: root => root.description },
    isPreview: { type: GraphQLBoolean, resolve: root => root.is_preview },
    lastModified: { type: GraphQLString, resolve: root => root.last_modified },
    urlType: { type: GraphQLString, resolve: root => root.url_type },
    name: { type: GraphQLString, resolve: root => root.name },
    created: { type: GraphQLString, resolve: root => root.created },
    url: { type: GraphQLString, resolve: root => root.url },
    position: { type: GraphQLInt, resolve: root => root.position },
    revisionId: { type: GraphQLString, resolve: root => root.revision_id },
    total: { type: GraphQLInt, resolve: async root => (await getDataStore(root.id)).total }
  }
})

const tagType = new GraphQLObjectType({
  name: 'Tag',
  fields: {
    state: { type: GraphQLString, resolve: root => root.state },
    displayName: { type: GraphQLString, resolve: root => root.display_name },
    id: { type: GraphQLID, resolve: root => root.id },
    name: { type: GraphQLString, resolve: root => root.name }
  }
})

const organizationType = new GraphQLObjectType({
  name: 'Organization',
  fields: {
    description: { type: GraphQLString, resolve: root => root.description },
    created: { type: GraphQLString, resolve: root => root.created },
    title: { type: GraphQLString, resolve: root => root.title },
    name: { type: GraphQLString, resolve: root => root.name },
    isOrganization: { type: GraphQLBoolean, resolve: root => root.is_organization },
    state: { type: GraphQLString, resolve: root => root.state },
    imageUrl: { type: GraphQLString, resolve: root => root.image_url },
    revisionId: { type: GraphQLString, resolve: root => root.revision_id },
    type: { type: GraphQLString, resolve: root => root.type },
    id: { type: GraphQLID, resolve: root => root.id },
    approvalStatus: { type: GraphQLString, resolve: root => root.approval_status }
  }
})

const packageShowType = new GraphQLObjectType({
  name: 'PackageShow',
  fields: {
    licenseTitle: { type: GraphQLString, resolve: root => root.license_title },
    ownerUnit: { type: GraphQLString, resolve: root => root.owner_unit },
    topics: { type: GraphQLString, resolve: root => root.topics },
    ownerEmail: { type: GraphQLString, resolve: root => root.owner_email },
    excerpt: { type: GraphQLString, resolve: root => root.excerpt },
    private: { type: GraphQLBoolean, resolve: root => root.private },
    ownerDivision: { type: GraphQLString, resolve: root => root.owner_division },
    numTags: { type: GraphQLInt, resolve: root => root.num_tags },
    id: { type: GraphQLID, resolve: root => root.id },
    metadataCreated: { type: GraphQLString, resolve: root => root.metadata_created },
    refreshRate: { type: GraphQLString, resolve: root => root.refresh_rate },
    title: { type: GraphQLString, resolve: root => root.title },
    licenseUrl: { type: GraphQLString, resolve: root => root.license_url },
    state: { type: GraphQLString, resolve: root => root.state },
    informationUrl: { type: GraphQLString, resolve: root => root.information_url },
    licenseId: { type: GraphQLString, resolve: root => root.license_id },
    type: { type: GraphQLString, resolve: root => root.type },
    resources: { type: new GraphQLList(resourceType), resolve: root => root.resources },
    limitations: { type: GraphQLString, resolve: root => root.limitations },
    numResources: { type: GraphQLInt, resolve: root => root.num_resources },
    tags: { type: new GraphQLList(tagType), resolve: root => root.tags },
    isRetired: { type: GraphQLBoolean, resolve: root => root.is_retired },
    creatorUserId: { type: GraphQLString, resolve: root => root.creator_user_id },
    datasetCategory: { type: GraphQLString, resolve: root => root.dataset_category },
    name: { type: GraphQLString, resolve: root => root.name },
    metadataModified: { type: GraphQLString, resolve: root => root.metadata_modified },
    isopen: { type: GraphQLBoolean, resolve: root => root.isopen },
    notes: { type: GraphQLString, resolve: root => root.notes },
    ownerOrg: { type: GraphQLString, resolve: root => root.owner_org },
    lastRefreshed: { type: GraphQLString, resolve: root => root.last_refreshed },
    formats: { type: GraphQLString, resolve: root => root.formats },
    ownerSection: { type: GraphQLString, resolve: root => root.owner_section },
    organization: { type: organizationType, resolve: root => root.organizationorganization },
    revisionId: { type: GraphQLString, resolve: root => root.revision_id }
  }
})

const resultType = new GraphQLObjectType({
  name: 'Result',
  fields: {
    result: {
      type: packageShowType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (_, args) => await getPackageShow(args.id)
    }
  }
})

const getPackageShow = (id) =>
  request(`/package_show?id=${id}`)
    .catch(err => { console.log(err) })

const getDataStore = (id) =>
  request(`/datastore_search?id=${id}`)
    .catch(err => { console.log(err) })

// To get resources
const request = (path) => new Promise((resolve, reject) =>
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
