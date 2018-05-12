const { GraphQLObjectType } = require('graphql')
const userMutate = require('./user')

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...userMutate
  })
})


module.exports = mutation;