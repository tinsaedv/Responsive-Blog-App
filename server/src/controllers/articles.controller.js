const { default: mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2;
const ArticleModel = require('../models/articles.model');
const UserModel = require('../models/user.model');
const { uploadThumbnail } = require('../services/imageUpload');

// Function to post an article
async function postArticle(req, res) {
  let { thumbnail, authorId, title, summary, category, body, tags } = req.body;

  try {
    // Check if all required fields are provided
    if (!authorId || !title || !body || !category) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }
    // Find the user by their ID
    const user = await UserModel.findById(authorId);

    if (!user) {
      return res.status(404).json({
        error: 'Author not found!',
      });
    }

    const { secureUrl, publicId } = await uploadThumbnail(thumbnail, authorId);

    title = title.charAt(0).toUpperCase() + title.slice(1);
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);

    // Create a new ArticleModel instance with the provided data
    const newArticle = new ArticleModel({
      articleAuthorId: authorId,
      thumbnail: secureUrl,
      thumbnailPublicId: publicId,
      title: title,
      summary: summary,
      body: body,
      tags: tags,
      category: category,
      likes: 0,
      likedBy: [],
    });

    user.stats[0].articlesCount++;

    // Save the updated user
    await user.save();

    // Save the new article
    const response = await newArticle.save();

    // Return the response containing the saved article
    res.status(200).json(response);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function updateArticle(req, res) {
  let { articleId, thumbnail, authorId, title, summary, category, body, tags } =
    req.body;

  try {
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    let thumbnailPublicId = article?.thumbnailPublicId;

    await cloudinary.uploader.destroy(thumbnailPublicId);

    if (thumbnail) {
      const { secureUrl, publicId } = await uploadThumbnail(
        thumbnail,
        authorId
      );
      article.thumbnail = secureUrl;
      article.thumbnailPublicId = publicId;
    }

    authorId ? (article.articleAuthorId = authorId) : null;
    title ? (article.title = title) : null;
    summary ? (article.summary = summary) : null;
    category ? (article.category = category) : null;
    body ? (article.body = body) : null;
    tags ? (article.tags = tags) : null;

    const response = await article.save();

    res.status(200).json(response);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function getAllArticles(req, res) {
  let { page, limit, search } = req.query;
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  skip = (page - 1) * limit;

  const aggregation = [
    {
      $lookup: {
        from: 'users',
        localField: 'articleAuthorId',
        foreignField: '_id',
        as: 'articleAuthor',
      },
    },
    {
      $unwind: '$articleAuthor',
    },

    {
      $project: {
        _id: 1,
        thumbnail: 1,
        title: 1,
        summary: 1,
        body: 1,
        category: 1,
        likes: 1,
        views: 1,
        tags: 1,
        createdAt: 1,
        articleAuthorId: 1,
        bio: '$articleAuthor.bio',
        author: '$articleAuthor.name',
        authorPic: '$articleAuthor.profilePicture',
        verified: {
          $arrayElemAt: ['$articleAuthor.stats.verified', 0],
        },
      },
    },
    // {
    //   $skip: skip,
    // },
    // {
    //   $limit: limit,
    // },
  ];

  if (search) {
    aggregation.unshift({ $match: { $text: { $search: search } } });
  }

  try {
    const articles = await ArticleModel.aggregate(aggregation);

    res.status(200).json(articles);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

// Function to get an article by its ID
async function getArticlesById(req, res) {
  const { articleId } = req.params;

  try {
    // Find the article by its ID and populate the 'comments' field
    const article = await ArticleModel.findById(articleId);

    article.views++;

    await article.save();

    const articleData = await ArticleModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(articleId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'articleAuthorId',
          foreignField: '_id',
          as: 'Author',
        },
      },
      {
        $unwind: '$Author',
      },
      {
        $project: {
          _id: 1,
          articleAuthorId: 1,
          title: 1,
          summary: 1,
          thumbnail: 1,
          body: 1,
          category: 1,
          likes: 1,
          createdAt: 1,
          likedBy: 1,
          author: '$Author.name',
          authorPic: '$Author.profilePicture',
          authorBio: '$Author.bio',
          authorProfession: '$Author.profession',
          authorVerified: {
            $arrayElemAt: ['$Author.stats.verified', 0],
          },
        },
      },
    ]);

    // If the article is not found, return a 404 error
    if (!article || !articleData) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    // Return the article
    res.status(200).json(articleData);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

async function getArticlesByUserId(req, res) {
  const { articleAuthorId } = req.params;

  try {
    const articles = await ArticleModel.aggregate([
      {
        $match: {
          articleAuthorId: new mongoose.Types.ObjectId(articleAuthorId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'articleAuthorId',
          foreignField: '_id',
          as: 'articleAuthor',
        },
      },
      {
        $unwind: '$articleAuthor',
      },
      {
        $project: {
          _id: 1,
          thumbnail: 1,
          title: 1,
          summary: 1,
          category: 1,
          body: 1,
          tags: 1,
          likes: 1,
          createdAt: 1,
          articleAuthorId: 1,
          author: '$articleAuthor.name',
          authorPic: '$articleAuthor.profilePicture',
          verified: {
            $arrayElemAt: ['$articleAuthor.stats.verified', 0],
          },
        },
      },
    ]);

    // If the article is not found, return a 404 error
    if (!articles) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    // Return the article
    res.status(200).json(articles);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

// Function to delete an article by its ID
async function deleteArticleById(req, res) {
  const { articleId, authorId } = req.params;
  try {
    // Find the article by its ID and delete it
    const article = await ArticleModel.findByIdAndDelete(articleId);

    const thumbnailPublicId = article?.thumbnailPublicId;

    // If the article is not found, return a 404 error
    if (!articleId) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    await cloudinary.uploader.destroy(thumbnailPublicId);

    // Find the user by their ID
    const user = await UserModel.findById(authorId);

    user.stats[0].articlesCount--;

    // Save the updated user
    await user.save();

    // Return the deleted article
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully!',
    });
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

async function likeOrDislikeArticle(req, res) {
  const { userId, articleId } = req.body;

  try {
    const article = await ArticleModel.findById(articleId);

    const user = await UserModel.findById(userId);

    const alreadyLiked =
      user.likedArticles.includes(article._id.toString()) &&
      article.likedBy.includes(user._id.toString());

    if (alreadyLiked) {
      user.likedArticles = user.likedArticles.filter(
        (id) => id.toString() !== article._id.toString()
      );
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== user._id.toString()
      );
      article.likes--;
    } else if (!alreadyLiked) {
      user.likedArticles.push(article._id);
      article.likedBy.push(userId);

      article.likes++;
    }

    const savedArticle = await article.save();
    await user.save();
    res.status(200).json(savedArticle);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

module.exports = {
  postArticle,
  getAllArticles,
  getArticlesById,
  getArticlesByUserId,
  deleteArticleById,
  likeOrDislikeArticle,
  updateArticle,
};
