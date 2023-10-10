const { default: mongoose } = require('mongoose');
const CommentModel = require('../models/comment.model');

// Function to post a comment
async function postComment(req, res) {
  const { authorId, text, articleId } = req.body;

  try {
    // Create a new CommentModel instance with the provided data
    const newComment = new CommentModel({
      articleId: articleId,
      commentAuthorId: authorId,
      text: text,
    });

    // Save the new comment
    const response = await newComment.save();

    // Return the response containing the saved comment
    res.status(200).json(response);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

// Function to update a comment
async function updateComment(req, res) {
  const { commentId, text } = req.body;
  try {
    // Find the comment by its ID
    const comment = await CommentModel.findByIdAndUpdate(commentId);

    // Update the text and mark it as edited
    comment.text = text;
    comment.edited = true;

    // Save the updated comment
    await comment.save();

    // Return the response containing the updated comment
    res.status(200).json(comment);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

// Function to delete a comment
async function deleteComment(req, res) {
  const { commentId } = req.params;
  try {
    // Find the comment by its ID and delete it
    const comment = await CommentModel.findByIdAndDelete(commentId);

    // If the comment is not found, return a 404 error
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found',
      });
    }

    // Return the deleted comment
    res.status(200).json(comment);
  } catch (error) {
    // If an error occurs, log the error and return an internal server error response
    console.error(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

// This function retrieves comments for a specific article by its ID
async function getCommentsByArticleId(req, res) {
  // Extract the 'articleId' parameter from the request
  const { articleId } = req.params;

  try {
    // Use MongoDB's aggregation framework to retrieve the comments
    const comments = await CommentModel.aggregate([
      {
        // Match documents where 'articleId' is the same as the provided 'articleId'
        $match: { articleId: new mongoose.Types.ObjectId(articleId) },
      },
      {
        // Perform a left outer join to the 'articles' collection in the same database to filter in documents from the "joined" collection for processing
        $lookup: {
          from: 'articles',
          localField: 'articleId',
          foreignField: '_id',
          as: 'article',
        },
      },
      {
        // Perform a left outer join to the 'users' collection in the same database to filter in documents from the "joined" collection for processing
        $lookup: {
          from: 'users',
          localField: 'commentAuthorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        // Deconstruct an array field from the input documents to output a document for each element
        $unwind: '$article',
      },
      {
        // Deconstruct an array field from the input documents to output a document for each element
        $unwind: '$author',
      },
      {
        // Pass along the documents with the requested fields to the next stage in the pipeline
        $project: {
          _id: 1,
          text: 1,
          commentAuthorId: 1,
          createdAt: 1,
          edited: 1,
          updatedAt: 1,
          author: '$author.name',
          authorPic: '$author.profilePicture',
        },
      },
    ]);

    // Return the comments as a JSON response
    res.status(200).json(comments);
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}
module.exports = {
  postComment,
  deleteComment,
  updateComment,
  getCommentsByArticleId,
};
