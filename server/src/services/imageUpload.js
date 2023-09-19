const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadProfilePicture = (image, userId) => {
  //image = > base64
  const opts1 = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
    folder: `blog-app/${userId}/Profiles`,
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts1, (error, result) => {
      if (result && result.secure_url) {
        const publicId = result.public_id; // Retrieve the public ID of the uploaded image
        const secureUrl = result.secure_url; // Retrieve the secure URL of the uploaded image

        console.log(secureUrl);
        // console.log(publicId);

        return resolve({ secureUrl, publicId });
      }

      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

const uploadThumbnail = (image, userId) => {
  const opts2 = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
    folder: `blog-app/${userId}/Thumbnails`,
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts2, (error, result) => {
      if (result && result.secure_url) {
        const publicId = result.public_id; // Retrieve the public ID of the uploaded image
        const secureUrl = result.secure_url; // Retrieve the secure URL of the uploaded image

        console.log('secureUrl', secureUrl);
        // console.log(publicId);

        return resolve({ secureUrl, publicId });
      }

      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

module.exports = { uploadProfilePicture, uploadThumbnail };
