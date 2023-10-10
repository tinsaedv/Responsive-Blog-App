const bcrypt = require('bcrypt');
const validator = require('validator');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const ArticleModel = require('../models/articles.model');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

// Function to create JWT tokens
function createTokens(_id) {
  // Get the JWT keys from the environment variables
  const jwt_keys = process.env.JWT_KEYS;
  // Sign a new JWT token with the user's ID and the JWT keys, set to expire in 3 days
  return jwt.sign({ _id }, jwt_keys);
}

function verifyToken(req, res, next) {
  // Get the token from the request headers
  const authHeaders = req.headers['authorization'];

  const token = authHeaders.split(' ')[1];

  // If no token is provided, return a 401 (unauthorized) status
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Get the JWT keys from the environment variables
  const jwt_keys = process.env.JWT_KEYS;

  // Verify the token
  jwt.verify(token, jwt_keys, (err, decoded) => {
    // If an error occurs during verification, return a 500 (server error) status
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    // If the token is verified successfully, set the decoded object to req.user
    req.user = decoded;

    // Call the next middleware or controller
    next();
  });
}

// Function to register a new user
async function registerUser(req, res) {
  // Destructure 'name', 'email', and 'password' from the request body
  let { name, email, password } = req.body;
  try {
    // Find a user in the database with the provided email
    let user = await UserModel.findOne({
      email,
    });

    // Check if all required fields are provided
    if (!name || !email || !password) {
      // If not, return a 400 error with a message
      return res.status(400).json({
        error: 'All fields are required!',
      });
    }

    // Check if a user with the provided email already exists
    if (user) {
      // If so, return a 400 error with a message
      return res.status(400).json({
        error: 'User with the given email already exists',
      });
    }

    // Convert the name and email to lowercase
    name.toLowerCase();
    email.toLowerCase();

    // Find a user in the database with the provided name
    const userName = await UserModel.findOne({ name });

    // If a user with the provided name exists, return a 403 error with a message
    if (userName) {
      return res.status(403).json({
        error: 'Username exists. try other!',
      });
    }

    // Check if the username has at least 3 characters
    if (!validator.isLength(name, { min: 3 })) {
      // If not, return a 400 error with a message
      return res.status(400).json({
        error: 'Username must contain at least 3 characters',
      });
    }

    // Check if the email is valid
    if (!validator.isEmail(email)) {
      // If not, return a 400 error with a message
      return res.status(400).json({
        error: 'Invalid email',
      });
    }

    // Check if the password is strong
    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) {
      // If not, return a 400 error with a message
      return res.status(400).json({
        error: 'Password is not strong',
      });
    }

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Capitalize the first letter of the name
    name = name.charAt(0).toUpperCase() + name.slice(1);

    // Create a new user instance with the provided data
    user = new UserModel({
      profilePicture: '',
      profilePicturePublicId: '',
      name: name,
      email: email.toLowerCase(),
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

    // Save the new user to the database
    await user.save();

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
  // Destructure 'nameOrEmail' and 'password' from the request body
  let { nameOrEmail, password } = req.body;

  try {
    // Capitalize the first letter of 'nameOrEmail'
    nameOrEmail = nameOrEmail.charAt(0).toUpperCase() + nameOrEmail.slice(1);

    // Find the user by their name or email
    const user = await UserModel.findOne({
      // Use MongoDB's $or operator to find the user by either name or email
      $or: [{ name: nameOrEmail }, { email: nameOrEmail.toLowerCase() }],
    });

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
      });
    }

    // Compare the provided password with the hashed password stored in the database
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If the password is incorrect, return a 400 error
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Password incorrect.',
      });
    }

    // Create a JWT token for the user using the 'createTokens' function
    const token = createTokens(user._id);

    // Return the response with the user's data and token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    // Log the error message to the console
    console.error(error.message);
    // Return a 500 error response
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// This function retrieves a user by their ID
async function getUserById(req, res) {
  const { id } = req.params; // Extract the _id parameter from the request
  try {
    if (id) {
      // find the user with user Id and exclude password
      const user = await UserModel.findById(id, { password: 0 }).populate({
        // go to likedArticles array path
        path: 'likedArticles',
        // only include the specified properties
        select: '_id thumbnail title summary createdAt',
      });

      if (!user) {
        // If no user is found, return a 404 error response
        return res.status(404).json({
          error: 'User not found',
        });
      }

      res.status(200).json(user); // Return the user as a JSON response
    }
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
  // Extract the userId and followerId parameters from the request
  const { userId, followerId } = req.params;

  try {
    // Find the user to follow
    const user = await UserModel.findById(userId);

    // If the user is trying to follow themselves, return a 403 error response
    if (userId === followerId) {
      return res.status(403).json({
        error: `You can't follow yourself.`,
      });
    }

    // If no user is found, return a 404 error response
    if (!user) {
      return res.status(404).json({
        error: 'User not found!',
      });
    }

    // Find the user who wants to follow
    const follower = await UserModel.findById(followerId);

    // Check if the follower is already in the user's followers array
    const followerExist = user.followers.includes(followerId);

    // If the follower does not exist in the user's followers array
    if (!followerExist) {
      // Increment the followers count of the user and the following count of the follower
      user.stats.followersCount++;
      follower.stats.followingCount++;
      // Add the follower to the user's followers array
      user.followers.push(followerId);
    } else {
      // If the follower exists in the user's followers array
      // Decrement the followers count of the user and the following count of the follower
      user.stats.followersCount--;
      follower.stats.followingCount--;
      // Remove the follower from the user's followers array
      user.followers = user.followers.filter((follower) => {
        return follower.toString() !== followerId;
      });
    }

    // Save the follower
    await follower.save();
    // Save the user
    const response = await user.save();
    // Return the response as a JSON response
    res.status(200).json(response);
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}

// This function updates a user's profile
async function updateProfile(req, res) {
  // Destructure 'userId', 'socials', 'name', 'bio', and 'profession' from the request body
  let { userId, socials, name, bio, profession } = req.body;
  console.log(req.body);
  try {
    // Find the user by their ID
    const user = await UserModel.findById(userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Capitalize the first letter of 'name' and 'bio'
    if (name) {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    if (bio) {
      bio = bio.charAt(0).toUpperCase() + bio.slice(1);
    }

    // Find a user by their name
    const userFound = await UserModel.findOne({ name });

    // If a user with the provided name exists and it's the same as the current user's name, return a 409 error
    if (userFound && userFound.name === name) {
      return res.status(409).json({
        error: "That's your current name",
      });
    }

    // If a user with the provided name exists, return a 404 error
    if (userFound) {
      return res.status(404).json({
        error: 'User already exist',
      });
    }

    // If 'name', 'bio', and 'profession' are provided, update the user's profile with these values
    name ? (user.name = name) : null;
    bio ? (user.bio = bio) : null;
    profession ? (user.profession = profession) : null;

    // For each social platform provided, add the link to the appropriate platform in the user's 'socials' object
    socials.forEach((social) => {
      const { platform, link } = social;
      if (link) {
        user.socials[platform] = link;
      }
    });

    // Indicate that the 'socials' field has been modified
    user.markModified('socials');

    // Save the user
    const response = await user.save();
    // Return the response as a JSON response
    res.status(200).json(response);
  } catch (error) {
    // If an error occurs, handle it
    console.error(error.message); // Log the error message
    res.status(500).json({
      error: 'Internal server error',
    }); // Return a 500 error response
  }
}

// This function deletes a user's account
async function deleteAccount(req, res) {
  // Extract the 'userId' parameter from the request
  const { userId } = req.params;

  try {
    // Find the user by their ID
    const userToDelete = await UserModel.findById(userId);

    // If the user is not found, return a 404 error
    if (!userToDelete) {
      return res.status(404).json({
        error: 'User not found!',
      });
    }

    const article = await ArticleModel.deleteMany({
      articleAuthorId: userId,
    });

    // Get the user's profile picture public ID
    const profilePicturePublicId = userToDelete?.profilePicturePublicId;

    // Delete the user's profile picture from Cloudinary
    await cloudinary.uploader.destroy(profilePicturePublicId);

    // Delete the user from the database
    await UserModel.findByIdAndDelete(userId);

    // Return a success response
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
  verifyToken,
};
