const { default: mongoose } = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    articleAuthorId: mongoose.SchemaTypes.ObjectId,
    thumbnail: String,
    thumbnailPublicId: String,
    title: String,
    summary: String,
    body: String,
    tags: [String],
    category: String,
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: Array,
  },
  { timestamps: true }
);

articleSchema.index({
  title: 'text',
  summary: 'text',
  body: 'text',
  category: 'text',
  tags: 'text',
});

const ArticleModel = mongoose.model('Article', articleSchema);

module.exports = ArticleModel;
