const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList
} = require('graphql');
const Token = require('../../models/sequelize').Token;

const TokenType = new GraphQLObjectType({
  name: 'TokenType',
  fields: () => ({
    tokenHash: { type: GraphQLID },
    id: { type: GraphQLID },
    device: { type: GraphQLString },
    ip: { type: GraphQLString }
  })
})

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    tokens: {
      type: new GraphQLList(TokenType),
      resolve: async (root, args, context) => {
        let where = { userId: root.id }
        let tokens = Token.findAll({ where })
        return tokens
      }
    }
  })
})

module.exports = UserType;