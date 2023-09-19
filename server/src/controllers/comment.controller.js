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
      error: 'Internal server error',
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
      error: 'Internal server error',
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
      error: 'Internal server error',
    });
  }
}

async function getCommentsByArticleId(req, res) {
  const { articleId } = req.params;
  try {
    const comments = await CommentModel.aggregate([
      {
        $match: { articleId: new mongoose.Types.ObjectId(articleId) },
      },
      {
        $lookup: {
          from: 'articles',
          localField: 'articleId',
          foreignField: '_id',
          as: 'article',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'commentAuthorId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$article',
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          _id: 1,
          text: 1,
          commentAuthorId: 1,
          createdAt: 1,
          updatedAt: 1,
          author: '$author.name',
          authorPic: '$author.profilePicture',
        },
      },
    ]);

    res.status(200).json(comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

module.exports = {
  postComment,
  deleteComment,
  updateComment,
  getCommentsByArticleId,
};
