const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');
const UserType = require('./user_type');
const User = require('../../models/sequelize').User;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (root, { userId }, context) => {
        let user = await User.findOne({ where: { id: userId } });
        return user;
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (root, args, context) => {
        let users = await User.findAll();
        return users
      }
    }
  }
})

module.exports = RootQueryType;