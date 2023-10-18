# Blog App

A simple full-stack blog application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This app allows users to create, read, update, and delete blog posts.

## Installation

1. Clone the repository:

   git clone https://github.com/your-username/mern-blog-app.git

2. Navigate to the project directory:

- cd blog-app

3. Install the dependencies for both the server and client:
- Server 
    ```
   cd server && npm install
    
- Client
    ```
   cd client && npm install

4. Set up the environment variables:

- Create a .env file in the server directory.
- Add the following variables:

  - PORT=3001
  - MONGO_URI=your-mongodb-connection-string
  - JWT_KEYS=your-jwt-keys
  - CLIENT_ID=your-google-client-id
  - CLIENT_SECRET=your-google-client-secret
  - CLOUD_NAME=your-cloudinary-cloud-name
  - API_KEY=your-cloudinary-api-key
  - API_SECRET=your-cloudinary-api-secret

5.  Start the server:
    ```
     cd server && npm run devStart

6. Start the client:
    ```
   cd client && npm run dev

Open your browser and navigate to http://localhost:3000 to access the blog app.

## Usage

- Register a new user account, log in with an existing account, logout and delete account.
- Create, edit, and delete blog posts.
- View, Create, edit, and delete comment on other users' blog posts.
- Browse and search for specific blog posts.

## Technologies Used

- MongoDB: Database for storing blog posts, users, and comments.
- Express.js: Web application framework for the backend.
- React.js: JavaScript library for building the user interface.
- Node.js: JavaScript runtime environment for the server.
- Cloudinary: Cloud service for image storage.
- Zustand: state management library
- React-Quill: Rich text editor
- Additional libraries: Mongoose, bcrypt, validator, jwt, React Router etc.

## Features

- User authentication (register, login, logout, delete account).
- Create, edit, and delete blog posts.
- Create, edit, and delete Comments on blog posts.
- Search functionality to find specific blog posts.
- Responsive design for mobile and desktop.

## API Documentation
The API documentation for this blog app can be found in the API Documentation file.

## Deployment
This blog app is deployed on Render. You can access it [here](https://blog-app-tinsae.onrender.com/).

## Contributing
Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](LICENCE.txt).

## Acknowledgments
- MongoDB
- Express.js
- React.js
- Node.js
- Cloudinary
- Zustand
