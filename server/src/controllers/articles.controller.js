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

    //check if the author is in db and return with 404 response if user not found
    if (!user) {
      return res.status(404).json({
        error: 'Author not found!',
      });
    }

    // Uploading the new thumbnail and getting the secure URL and public id
    const { secureUrl, publicId } = await uploadThumbnail(thumbnail, authorId);

    //make the first letter of title and summary upper case
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

    //increment count of articles the user posted by 1
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

// This function updates an article in the database based on the request body.

async function updateArticle(req, res) {
  // Destructure the properties from the request body
  let { articleId, thumbnail, authorId, title, summary, category, body, tags } =
    req.body;

  try {
    // Find the article in the database based on the articleId
    const article = await ArticleModel.findById(articleId);

    // If the article is not found, return a 404 error
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    // Get the current thumbnail public ID from the article
    let thumbnailPublicId = article?.thumbnailPublicId;

    // Delete the current thumbnail from the cloud storage using the public ID
    await cloudinary.uploader.destroy(thumbnailPublicId);

    // If a new thumbnail is provided, upload it to the cloud storage and update the article's thumbnail and thumbnail public ID
    if (thumbnail) {
      const { secureUrl, publicId } = await uploadThumbnail(
        thumbnail,
        authorId
      );
      article.thumbnail = secureUrl;
      article.thumbnailPublicId = publicId;
    }

    // Update the article properties if they are provided in the request body
    authorId ? (article.articleAuthorId = authorId) : null;
    title ? (article.title = title) : null;
    summary ? (article.summary = summary) : null;
    category ? (article.category = category) : null;
    body ? (article.body = body) : null;
    tags ? (article.tags = tags) : null;

    // Save the updated article in the database
    const response = await article.save();

    // Return the updated article as the response
    res.status(200).json(response);
  } catch (error) {
    // If an error occurs, log the error message and return a 500 error
    console.error(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

// This function retrieves all articles from the database based on the request query parameters.
async function getAllArticles(req, res) {
  // Destructure the page, limit, and search parameters from the request query
  let { page, limit, search } = req.query;

  // Parse the page and limit parameters as integers, defaulting to 1 and 10 respectively if not provided
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  // Calculate the number of documents to skip based on the page and limit parameters
  skip = (page - 1) * limit;

  // Define the aggregation pipeline for retrieving the articles
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
        verified: '$articleAuthor.stats.verified',
      },
    },
    // {
    //   $skip: skip,
    // },
    // {
    //   $limit: limit,
    // },
  ];

  // If a search query is provided, add a $match stage to the beginning of the aggregation pipeline to filter the articles based on the search query
  if (search) {
    aggregation.unshift({ $match: { $text: { $search: search } } });
  }

  try {
    // Execute the aggregation pipeline to retrieve the articles
    const articles = await ArticleModel.aggregate(aggregation);

    // Return the retrieved articles as the response
    res.status(200).json(articles);
  } catch (error) {
    // If an error occurs during the process, log the error message and return a 500 error
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

// This is an asynchronous function named 'getArticlesById' that takes in a request and response object.
async function getArticlesById(req, res) {
  // Destructure 'articleId' from the request parameters.
  const { articleId } = req.params;

  // Start of try block to catch any errors.
  try {
    // Find the article in the database by its ID.
    const article = await ArticleModel.findById(articleId);

    // Increment the views of the article by 1.
    article.views++;

    // Save the updated article back to the database.
    await article.save();

    // Use the aggregate function to perform a complex query on the 'ArticleModel' collection.
    const articleData = await ArticleModel.aggregate([
      {
        // Match documents in the collection that have the same '_id' as 'articleId'.
        $match: {
          _id: new mongoose.Types.ObjectId(articleId),
        },
      },
      {
        // Perform a left outer join to the 'users' collection in the same database to filter in documents from the "joined" collection for processing.
        $lookup: {
          from: 'users',
          localField: 'articleAuthorId',
          foreignField: '_id',
          as: 'Author',
        },
      },
      {
        // Deconstruct an array field from the input documents to output a document for each element.
        $unwind: '$Author',
      },
      {
        // Passes along the documents with the requested fields to the next stage in the pipeline.
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
          authorVerified: '$articleAuthor.stats.verified',
        },
      },
    ]);

    // If the article or the article data is not found, return a 404 error.
    if (!article || !articleData) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    // Send a response with a status of 200 and the article data in JSON format.
    res.status(200).json(articleData);
  } catch (error) {
    // If an error occurs, log the error message to the console.
    console.error(error.message);
    // Send a response with a status of 500 and the error message in JSON format.
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

// This is an asynchronous function named 'getArticlesByUserId' that takes in a request and response object.
async function getArticlesByUserId(req, res) {
  // Destructure 'articleAuthorId' from the request parameters.
  const { articleAuthorId } = req.params;

  // Start of try block to catch any errors.
  try {
    // Use the aggregate function to perform a complex query on the 'ArticleModel' collection.
    const articles = await ArticleModel.aggregate([
      {
        // Match documents in the collection that have the same 'articleAuthorId' as 'articleAuthorId'.
        $match: {
          articleAuthorId: new mongoose.Types.ObjectId(articleAuthorId),
        },
      },
      {
        // Perform a left outer join to the 'users' collection in the same database to filter in documents from the "joined" collection for processing.
        $lookup: {
          from: 'users',
          localField: 'articleAuthorId',
          foreignField: '_id',
          as: 'articleAuthor',
        },
      },
      {
        // Deconstruct an array field from the input documents to output a document for each element.
        $unwind: '$articleAuthor',
      },
      {
        // Passes along the documents with the requested fields to the next stage in the pipeline.
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
          verified: '$articleAuthor.stats.verified',
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

// This is an asynchronous function named 'deleteArticleById' that takes in a request and response object.
async function deleteArticleById(req, res) {
  // Destructure 'articleId' and 'authorId' from the request parameters.
  const { articleId, authorId } = req.params;

  // Start of try block to catch any errors.
  try {
    // Find the article in the database by its ID and delete it.
    const article = await ArticleModel.findByIdAndDelete(articleId);

    // Get the public ID of the article's thumbnail.
    const thumbnailPublicId = article?.thumbnailPublicId;

    // If the article is not found, return a 404 error.
    if (!articleId) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    // Delete the thumbnail of the article from the cloud storage.
    await cloudinary.uploader.destroy(thumbnailPublicId);

    // Find the user in the database by their ID.
    const user = await UserModel.findById(authorId);

    // Decrement the count of articles the user posted by 1.
    user.stats[0].articlesCount--;

    // Save the updated user back to the database.
    await user.save();

    // Send a response with a status of 200 and a success message in JSON format.
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully!',
    });
  } catch (error) {
    // If an error occurs, log the error message to the console.
    console.error(error.message);
    // Send a response with a status of 500 and the error message in JSON format.
    res.status(500).json({
      error: 'Internal server error!',
    });
  }
}

// This is an asynchronous function named 'likeOrDislikeArticle' that takes in a request and response object.
async function likeOrDislikeArticle(req, res) {
  // Destructure 'userId' and 'articleId' from the request body.
  const { userId, articleId } = req.body;

  // Start of try block to catch any errors.
  try {
    // Find the article in the database by its ID.
    const article = await ArticleModel.findById(articleId);

    // Find the user in the database by their ID.
    const user = await UserModel.findById(userId);

    // Check if the user has already liked the article.
    const alreadyLiked =
      user.likedArticles.includes(article._id.toString()) &&
      article.likedBy.includes(user._id.toString());

    // If the user has already liked the article, remove the like.
    if (alreadyLiked) {
      user.likedArticles = user.likedArticles.filter(
        (id) => id.toString() !== article._id.toString()
      );
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== user._id.toString()
      );
      // Decrement the likes count of the article by 1.
      article.likes--;
    }
    // If the user has not liked the article, add a like.
    else if (!alreadyLiked) {
      user.likedArticles.push(article._id);
      article.likedBy.push(userId);

      // Increment the likes count of the article by 1.
      article.likes++;
    }

    // Save the updated article back to the database.
    const savedArticle = await article.save();
    // Save the updated user back to the database.
    await user.save();
    // Send a response with a status of 200 and the updated article in JSON format.
    res.status(200).json(savedArticle);
  } catch (error) {
    // If an error occurs, log the error message to the console.
    console.error(error.message);
    // Send a response with a status of 500 and the error message in JSON format.
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
