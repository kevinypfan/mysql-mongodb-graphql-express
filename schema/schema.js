const { GraphQLSchema } = require('graphql');
const RootQueryType = require('./types/root_query_type');
const mutations = require('./mutations/mutations');

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: mutations
})

module.exports = schema;