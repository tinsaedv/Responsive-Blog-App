// Importing the create function from zustand for state management
import { create } from 'zustand';

// Importing the BASE_URL and request methods from the request utility file
import { BASE_URL, deleteRequest, postRequest } from '../utils/request';

// Importing the toast function from 'react-toastify' for displaying notifications
import { toast } from 'react-toastify';

// Creating a store for the logged in user
const useUserStore = create(() => ({
  user: null, // Initial state of the user is null
}));

// Function to get user data from local storage
function getUserFromLocalStorage() {
  const user = localStorage.getItem('User'); // Get the user data from local storage
  if (user) {
    return JSON.parse(user); // If user data exists, parse it from JSON string to an object
  }
}

// Get user info from local storage
const userInfo = getUserFromLocalStorage();

// Set the state of the user store with the user info
useUserStore.setState({ user: userInfo });

// Creating a store for authentication
const useAuthStore = create((set, get) => ({
  registerInfo: {
    // Information needed for registration
    name: '',
    email: '',
    password: '',
  },
  registerError: null, // Error message during registration
  registerLoading: false, // Loading state during registration
  loginInfo: {
    // Information needed for login
    nameOrEmail: '',
    password: '',
  },
  loginError: null, // Error message during login
  loginLoading: false, // Loading state during login

  // Function to set the registration info
  setRegisterInfo: (key, value) =>
    set((state) => ({
      registerInfo: { ...state.registerInfo, [key]: value },
    })),

  // Function to set the login info
  setLoginInfo: (key, value) =>
    set((state) => ({
      loginInfo: { ...state.loginInfo, [key]: value },
    })),

  // Function to register a user
  registerUser: async (e) => {
    try {
      const state = get(); // Get the current state
      e.preventDefault(); // Prevent the default form submission behavior

      // Set the loading and error states for registration
      set({ registerError: null, registerLoading: true });

      // Send a POST request to register the user
      const response = await postRequest(
        `${BASE_URL}/users/register`,
        state.registerInfo
      );

      // Set the loading state to false after the request is done
      set({ registerLoading: false });

      // If there's an error in the response, handle it
      if (response.error) {
        if (response.message === 'getaddrinfo ENOTFOUND api.cloudinary.com') {
          return set({
            registerError: 'There is a problem with your network!',
          });
        }
        return set({ registerError: response });
      }

      // If registration is successful, save the user data in local storage
      localStorage.setItem('User', JSON.stringify(response));
      useUserStore.setState({ user: response }); // Update the user store with the new user data
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error(error.message); // Log any error that occurs during the process
    }
  },

  // Function to login a user
  loginUser: async (e) => {
    try {
      const state = get(); // Get the current state
      e.preventDefault(); // Prevent the default form submission behavior
      set({ loginError: null, loginLoading: true }); // Set the loading and error states for login

      // Send a POST request to login the user
      const response = await postRequest(
        `${BASE_URL}/users/login`,
        state.loginInfo
      );

      // Set the loading state to false after the request is done
      set({ loginLoading: false });

      // If there's an error in the response, handle it
      if (response.error) {
        return set({ loginError: response });
      }

      // If login is successful, save the user data in local storage
      localStorage.setItem('User', JSON.stringify(response));
      useUserStore.setState({ user: response }); // Update the user store with the new user data
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error(error.message); // Log any error that occurs during the process
    }
  },

  // Function to log out a user
  logOutUser: () => {
    localStorage.removeItem('User'); // Remove the user data from local storage
  },

  // Function to delete a user account
  deleteAccount: async (userId) => {
    try {
      // Send a DELETE request to delete the user account
      const response = await deleteRequest(
        `${BASE_URL}/users/delete/${userId}`
      );

      // If there's an error in the response, display an error notification
      if (response.error) {
        return toast.error(response.message);
      }

      // If the account is successfully deleted, display a success notification
      toast.success(response.message);
    } catch (error) {
      console.error(error.message); // Log any error that occurs during the process
    }
  },
}));

// Export the authentication and user stores
export { useAuthStore, useUserStore };
