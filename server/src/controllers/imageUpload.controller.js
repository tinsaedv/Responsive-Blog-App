const ArticleModel = require('../models/articles.model');
const UserModel = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const {
  uploadThumbnail,
  uploadProfilePicture,
} = require('../services/imageUpload');

// Asynchronous function to handle profile image upload
async function uploadProfileImage(req, res) {
  const { id, image } = req.body; // Destructuring id and image from the request body

  try {
    const user = await UserModel.findById(id); // Finding the user by id in the database

    const profilePicturePublicId = user?.profilePicturePublicId; // Getting the public id of the user's profile picture

    if (profilePicturePublicId) {
      // If the user has a profile picture
      await cloudinary.uploader.destroy(profilePicturePublicId); // Delete the existing profile picture from Cloudinary
    }

    const { secureUrl, publicId } = await uploadProfilePicture(image, id); // Uploading the new profile picture and getting the secure URL and public id

    user.profilePicture = secureUrl; // Setting the user's profile picture to the new secure URL
    user.profilePicturePublicId = publicId; // Setting the user's profile picture public id to the new public id
    const response = await user.save(); // Saving the user's new data to the database

    res.status(200).json(response); // Sending a response with the updated user data
  } catch (error) {
    console.error(error);
    res.status(500).json({
      // Sending a 500 status code and the error message
      error: error.message,
    });
  }
}

// Asynchronous function to handle thumbnail image upload
async function uploadThumbnailImage(req, res) {
  const { id, thumbnail } = req.body; // Destructuring id and thumbnail from the request body

  try {
    const article = await ArticleModel.findById(id); // Finding the article by id in the database

    const public_Id = article?.thumbnailPublicId; // Getting the public id of the article's thumbnail

    const { secureUrl, publicId } = await uploadThumbnail(thumbnail, public_Id); // Uploading the new thumbnail and getting the secure URL and public id

    article.thumbnail = secureUrl; // Setting the article's thumbnail to the new secure URL

    article.thumbnailPublicId = publicId; // Setting the article's thumbnail public id to the new public id

    const response = await article.save(); // Saving the article's new data to the database

    res.status(200).json(response); // Sending a response with the updated article data
  } catch (error) {
    console.error(error);
    // Sending a 500 status code and the error message
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = { uploadProfileImage, uploadThumbnailImage };
