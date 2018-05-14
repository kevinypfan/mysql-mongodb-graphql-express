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

const CommentType = new GraphQLObjectType({
  name: 'CommentType',
  fields: () => ({
    id: { type: GraphQLID },
    message: { type: new GraphQLNonNull(GraphQLString) },
    commmentor: {
      type: require('../types/user_type'),
      resolve: async (root, args, context) => {
        let user = await User.findOne({ where: { id: root.commmentor } })
        return user;
      }
    },
    createAt: { type: new GraphQLNonNull(GraphQLDateTime) }
  })
})

module.exports = CommentType;