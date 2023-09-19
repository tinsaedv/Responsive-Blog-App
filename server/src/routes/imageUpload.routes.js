const express = require('express');
const {
  uploadProfileImage,
  uploadThumbnailImage,
} = require('../controllers/imageUpload.controller');

const UploadImageRouter = express.Router();

UploadImageRouter.post('/uploadImage', uploadProfileImage).post(
  '/thumbnailUpload',
  uploadThumbnailImage
);

module.exports = UploadImageRouter;
