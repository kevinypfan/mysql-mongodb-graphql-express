const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');
const UserType = require('./user_type');
const PostType = require('./post_type')
const User = require('../../models/sequelize').User;
const Post = require('../../models/mongoose/post');

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
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (root, args, context) => {
        let posts = await Post.find();
        return posts;
      }
    },
    post: {
      type: PostType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (root, { postId }, context) => {
        let post = await Post.findOne({ _id: postId });
        return post;
      }
    }
  }
})

module.exports = RootQueryType;