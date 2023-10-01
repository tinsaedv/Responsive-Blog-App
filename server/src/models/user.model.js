const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    profilePicture: String,
    profilePicturePublicId: String,
    bio: String,
    profession: String,
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.google;
      },
    },
    stats: {
      followersCount: {
        type: Number,
        default: 0,
      },
      followingCount: {
        type: Number,
        default: 0,
      },
      articlesCount: {
        type: Number,
        default: 0,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },

    socials: {
      facebook: String,
      instagram: String,
      linkedIn: String,
      twitter: String,
      github: String,
    },

    likedArticles: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Article' }],
    followers: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    google: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
