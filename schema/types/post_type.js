const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date')
const User = require('../../models/sequelize').User;


const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: { type: GraphQLID },
    creator: {
      type: require('../types/user_type'),
      resolve: async (root, args, context) => {
        let user = await User.findOne({ where: { id: root.creator } })
        return user;
      }
    },
    subject: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    createAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    comments: { type: new GraphQLList(require('./comment_type')) },
    commentCount: {
      type: GraphQLInt,
      resolve: async (root, args, context) => {
        return root.comments.length
      }
    }
  })
})


module.exports = PostType;