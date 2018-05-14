const { GraphQLObjectType } = require('graphql')
const userMutate = require('./user')
const postMutate = require('./post')
const commentMutate = require('./comment')

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...userMutate,
    ...postMutate,
    ...commentMutate
  })
})


module.exports = mutation;