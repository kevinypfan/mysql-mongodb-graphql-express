const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const jwt = require('jsonwebtoken')

const UserType = require('../types/user_type');

const User = require('../../models/sequelize').User;
const Token = require('../../models/sequelize').Token;

const os = require('os')

const userMutate = {
  signup: {
    type: UserType,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (root, args, context) => {
      try {
        let user = await User.create(args)
        let token = jwt.sign({ id: user.id, device: os.platform(), date: Date.now() }, process.env.JWT_SECRET).toString();
        const tokenData = {
          tokenHash: token,
          device: os.platform(),
          ip: os.networkInterfaces().lo0[0].address
        }
        await user.createToken(tokenData);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  login: {
    type: UserType,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (root, { email, password }, context) => {
      let user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("電子信箱或密碼有錯誤！")
      }
      let loaded = await user.authenticate(password);
      if (!loaded) {
        throw new Error("電子信箱或密碼有錯誤！")
      }
      let token = jwt.sign({ id: user.id, device: os.platform(), date: Date.now() }, process.env.JWT_SECRET).toString();
      const tokenData = {
        tokenHash: token,
        device: os.platform(),
        ip: os.networkInterfaces().lo0[0].address
      }
      await user.createToken(tokenData);
      return user;
    }
  },
  logout: {
    type: UserType,
    resolve: async (root, args, context) => {
      if (!context.req.token) throw new Error("您尚未登入！")
      let deleteToken = await Token.destroy({ where: { tokenHash: context.req.token } });
      return await User.findOne({ where: { id: context.req.user.id } })
    }
  }
}

module.exports = userMutate