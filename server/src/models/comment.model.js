const { default: mongoose } = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    articleId: mongoose.SchemaTypes.ObjectId,
    commentAuthorId: mongoose.SchemaTypes.ObjectId,
    text: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
