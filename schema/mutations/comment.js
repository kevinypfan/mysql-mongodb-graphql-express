const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');

const Post = require('../../models/mongoose/post');

const commentMutate = {
  newComment: {
    type: require('../types/comment_type'),
    args: {
      postId: { type: new GraphQLNonNull(GraphQLID) },
      message: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (root, { postId, message }, context) => {
      let data = {
        message,
        commmentor: context.req.user.id
      }
      const post = await Post.findOne({ _id: postId });
      post.comments.push(data);
      const result = await post.save();
      return result.comments[result.comments.length - 1];
    }
  },
  delComment: {
    type: require('../types/comment_type'),
    args: {
      commentId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (root, { commentId }, context) => {
      const post = await Post.findOne({ 'comments._id': commentId })
      if (!post) throw new Error("找不到此留言！")
      const filterData = post.comments.filter(c => c._id.toHexString() === commentId)
      try {
        const deleteData = await post.update({
          $pull: {
            comments: { _id: commentId }
          }
        })
      } catch (err) {
        throw new Error(err)
      }
      return filterData[0];
    }
  },
  updateComment: {
    type: require('../types/comment_type'),
    args: {
      commentId: { type: new GraphQLNonNull(GraphQLID) },
      updateMessage: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (root, { commentId, updateMessage }, context) => {
      let update = await Post.update({ 'comments._id': commentId }, {
        $set: {
          'comments.$.message': updateMessage
        }
      });
      const post = await Post.findOne({ 'comments._id': commentId });
      if (!post) throw new Error('沒有此留言！')
      return post.comments.filter(c => c._id.toHexString() === commentId)[0];
    }
  }
}

module.exports = commentMutate;