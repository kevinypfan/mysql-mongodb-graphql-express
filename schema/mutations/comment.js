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
      if (!context.req.user) throw new Error("您尚未登入，無法留言！")
      let data = {
        message,
        commentor: context.req.user.id
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
      if (!context.req.user) throw new Error("您尚未登入，請先登入！")
      const post = await Post.findOne({ 'comments._id': commentId, 'comments.commmentor': context.req.user.id })
      if (!post) throw new Error("找不到此留言，或您不是留言者！")
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
      if (!context.req.user) throw new Error("您尚未登入，請先登入！")
      const post = await Post.findOne({ 'comments._id': commentId });
      if (!post) throw new Error('找不到此留言！')
      const comment = post.comments.filter(c => c._id.toHexString() === commentId && c.commentor == context.req.user.id)[0];
      if (!comment) throw new Error('您不是留言者！')
      let update = await Post.update({ 'comments._id': commentId }, {
        $set: {
          'comments.$.message': updateMessage
        }
      });
      const rs = await Post.findOne({ 'comments._id': commentId });
      return rs.comments.filter(c => c._id.toHexString() === commentId)[0];
    }
  }
}

module.exports = commentMutate;