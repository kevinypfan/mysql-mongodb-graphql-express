const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');

const PostType = require('../types/post_type');

const Post = require('../../models/mongoose/post');

const postMutate = {
  newPost: {
    type: PostType,
    args: {
      subject: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString }
    },
    resolve: async (root, args, context) => {
      if (!context.req.user) throw new Error("您尚未登入，無法貼文！")
      let data = {
        ...args,
        creator: context.req.user.id
      }
      const post = new Post(data);
      let result = await post.save();
      return result;
    }
  },
  delPost: {
    type: PostType,
    args: {
      postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (root, { postId }, context) => {
      if (!context.req.user) throw new Error('您尚未燈入，請先登入！')
      console.log(context.req.user.id)
      const post = await Post.findOne({ _id: postId, creator: context.req.user.id })
      if (!post) throw new Error('您不是貼文者或找不到此文章！')
      try {
        await post.remove();
      } catch (err) {
        throw new Error(err)
      }
      return post;
    }
  },
  updatePost: {
    type: PostType,
    args: {
      postId: { type: new GraphQLNonNull(GraphQLID) },
      subject: { type: GraphQLString },
      description: { type: GraphQLString }
    },
    resolve: async (root, args, context) => {
      if (!context.req.user) throw new Error('您尚未燈入，請先登入！')
      let data = { ...args };
      delete data['postId'];
      const post = await Post.findOne({ _id: args.postId, creator: context.req.user.id });
      if (!post) throw new Error('您不是貼文者或找不到此文章！')
      try {
        const update = await Post.update({ _id: args.postId }, { $set: data });
        const post = await Post.findOne({ _id: args.postId, creator: context.req.user.id });
        return post
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}

module.exports = postMutate;