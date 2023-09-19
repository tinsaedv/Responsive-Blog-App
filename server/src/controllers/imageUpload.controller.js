const ArticleModel = require('../models/articles.model');
const UserModel = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const {
  uploadThumbnail,
  uploadProfilePicture,
} = require('../services/imageUpload');

async function uploadProfileImage(req, res) {
  const { id, image } = req.body;

  try {
    const user = await UserModel.findById(id);

    const profilePicturePublicId = user?.profilePicturePublicId;
    if (profilePicturePublicId) {
      await cloudinary.uploader.destroy(profilePicturePublicId);
    }

    const { secureUrl, publicId } = await uploadProfilePicture(image, id);

    user.profilePicture = secureUrl;
    user.profilePicturePublicId = publicId;
    const response = await user.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
}
async function uploadThumbnailImage(req, res) {
  const { id, thumbnail } = req.body;

  try {
    const article = await ArticleModel.findById(id);

    const public_Id = article?.thumbnailPublicId;

    const { secureUrl, publicId } = await uploadThumbnail(thumbnail, public_Id);

    article.thumbnail = secureUrl;

    article.thumbnailPublicId = publicId;

    const response = await article.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = { uploadProfileImage, uploadThumbnailImage };
