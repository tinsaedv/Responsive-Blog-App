const bcrypt = require('bcrypt');
const validator = require('validator');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

// Function to create JWT tokens
function createTokens(_id) {
  const jwt_keys = process.env.JWT_KEYS;
  return jwt.sign({ _id }, jwt_keys, { expiresIn: '3d' });
}

// Function to register a new user
async function registerUser(req, res) {
  let { name, email, password } = req.body;
  try {
    let user = await UserModel.findOne({
      email,
    });

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'All fields are required!',
      });
    }

    // Check if a user with the provided email already exists
    if (user) {
      return res.status(400).json({
        error: 'User with the given email already exists',
      });
    }

    name.toLowerCase();
    email.toLowerCase();

    const userName = await UserModel.findOne({ name });

    if (userName) {
      return res.status(403).json({
        error: 'Username exists. try other!',
      });
    }

    // Check if the username has at least 3 characters
    if (!validator.isLength(name, { min: 3 })) {
      return res.status(400).json({
        error: 'Username must contain at least 3 characters',
      });
    }

    // Check if the email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
      });
    }

    // Check if the password is strong
    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) {
      return res.status(400).json({
        error: 'Password is not strong',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    name = name.charAt(0).toUpperCase() + name.slice(1);

    // Create a new user instance with the provided data

    user = new UserModel({
      profilePicture: '',
      profilePicturePublicId: '',
      name: name,
      email: email,
      bio: '',
      profession: '',
      password: hashedPassword,
      socials: {
        facebook: '',
        instagram: '',
        linkedIn: '',
        twitter: '',
        github: '',
      },
    });

    // Initialize the user's stats
    user.stats = [{ followersCount: 0, followingCount: 0 }];

    // Save the new user
    const response = await user.save();

    // Create a JWT token for the user
    const token = createTokens(user._id);

    // Return the response with the user's data and token
    res.status(200).json({
      _id: user._id,
      name,
      email,
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// Function to authenticate a user and generate a token
async function loginUser(req, res) {
  let { nameOrEmail, password } = req.body;

  try {
    // Find the user by their name or email

    nameOrEmail = nameOrEmail.charAt(0).toUpperCase() + nameOrEmail.slice(1);

    const user = await UserModel.findOne({
      $or: [{ name: nameOrEmail }, { email: nameOrEmail.toLowerCase() }],
    });

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
      });
    }

    // Compare the provided password with the hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If the password is incorrect, return a 400 error
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Password incorrect.',
      });
    }

    // Create a JWT token for the user
    const token = createTokens(user._id);

    // Return the response with the user's data and token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// This function retrieves a user by their ID
async function getUserById(req, res) {
  const { id } = req.params; // Extract the _id parameter from the request
  try {
    const user = await UserModel.findById(id, { password: 0 }).populate({
      path: 'likedArticles',
      select: '_id thumbnail title summary createdAt',
    });

    if (!user) {
      // If no user is found, return a 404 error response
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.status(200).json(user); // Return the user as a JSON response
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}

// This function retrieves all users
async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find({}, { password: 0 }); // Find all users while excluding the password field

    res.status(200).json(users); // Return the users as a JSON response
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}

// This function allows a user to follow another user
async function follow(req, res) {
  const { userId, followerId } = req.params; // Extract the userId and followerId parameters from the request
  try {
    const user = await UserModel.findById(userId); // Find the user to follow

    if (userId === followerId) {
      // If the user is trying to follow themselves, return a 403 error response
      return res.status(403).json({
        error: `You can't follow yourself.`,
      });
    }

    if (!user) {
      // If no user is found, return a 404 error response
      return res.status(404).json({
        error: 'User not found!',
      });
    }

    const follower = await UserModel.findById(followerId); // Find the user who wants to follow

    const followerExist = user.followers.includes(followerId); // Check if the follower is already in the user's followers array

    if (!followerExist) {
      user.stats[0].followersCount++;
      follower.stats[0].followingCount++;
      user.followers.push(followerId);
    } else {
      user.stats[0].followersCount--;
      follower.stats[0].followingCount--;
      user.followers = user.followers.filter((follower) => {
        return follower.toString() !== followerId;
      });
    }

    await follower.save(); // Save the follower
    const response = await user.save(); // Save the user
    res.status(200).json(response); // Return the response as a JSON response
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}

async function updateProfile(req, res) {
  let { userId, socials, name, bio, profession } = req.body;
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    name = name.charAt(0).toUpperCase() + name.slice(1);
    bio = bio.charAt(0).toUpperCase() + bio.slice(1);

    const userFound = await UserModel.findOne({ name });

    if (userFound && userFound.name === name) {
      return res.status(409).json({
        error: "That's your current name",
      });
    }

    if (userFound) {
      return res.status(404).json({
        error: 'User already exist',
      });
    }

    name ? (user.name = name) : null;
    bio ? (user.bio = bio) : null;
    profession ? (user.profession = profession) : null;

    // Add the link to the appropriate platform in the socials object
    socials.forEach((social) => {
      const { platform, link } = social;
      if (link) {
        user.socials[platform] = link;
      }
    });

    user.markModified('socials');

    const response = await user.save();
    res.status(200).json(response);
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}

async function deleteAccount(req, res) {
  const { userId } = req.params;
  try {
    const userToDelete = await UserModel.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({
        error: 'User not found!',
      });
    }

    const profilePicturePublicId = userToDelete?.profilePicturePublicId;

    await cloudinary.uploader.destroy(profilePicturePublicId);

    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted Permanently!',
    });
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}

// Export the functions to be used in other modules
module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  follow,
  updateProfile,
  deleteAccount,
};
