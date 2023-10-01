// Importing necessary modules and functions
import { create } from 'zustand'; // Zustand is a small, fast and scaleable bearbones state-management solution
import { toast } from 'react-toastify'; // React-Toastify allows you to add notifications to your app with ease
import { BASE_URL, getRequest, postRequest } from '../utils/request'; // Importing base URL and request methods from request utility
import { useUserStore } from './useAuthStore'; // Importing useAuthStore custom hook

// Creating a Zustand store for user profile
const useProfileStore = create((set, get) => ({
  // Initial state values
  userProfile: null, // User profile data
  userProfileError: null, // Error while fetching user profile
  userProfileLoading: false, // Loading state for user profile
  otherUserProfile: null, // Profile of other users
  socialInfos: [
    // Social information of the user
    {
      platform: 'facebook',
      link: '',
    },
    {
      platform: 'instagram',
      link: '',
    },
    {
      platform: 'github',
      link: '',
    },
    {
      platform: 'linkedIn',
      link: '',
    },
    {
      platform: 'twitter',
      link: '',
    },
  ],

  // Form fields for updating user profile
  name: '',
  bio: '',
  profession: '',

  // Values for form fields
  nameValue: '',
  bioValue: '',
  facebookValue: '',
  twitterValue: '',
  instagramValue: '',
  githubValue: '',
  linkedInValue: '',
  professionValue: '',

  pageTheme: 'dark',
  setPageTheme: (state) => set({ pageTheme: state }),

  // Function to get profile info values
  getProfileInfoValue: () => {
    const state = get(); // Get current state
    set({
      // Set new state values
      nameValue: state.userProfile?.name,
      bioValue: state.userProfile?.bio,
      professionValue: state.userProfile?.profession,
      facebookValue: state.userProfile?.socials?.facebook,
      twitterValue: state.userProfile?.socials?.twitter,
      instagramValue: state.userProfile?.socials?.instagram,
      githubValue: state.userProfile?.socials?.github,
      linkedInValue: state.userProfile?.socials?.linkedIn,
    });
  },

  // Functions to set form field values
  setName: (value) => set({ name: value }),
  setBio: (value) => set({ bio: value }),
  setProfession: (value) => set({ profession: value }),

  // Function to set social info values
  setSocialInfos: (key, value) =>
    set((state) => ({
      socialInfos: state.socialInfos.map((social) => {
        if (social.platform === key) {
          return { ...social, link: value };
        }
        return social;
      }),
    })),

  // Function to get user profile
  getUserProfile: async () => {
    try {
      set({ userProfileError: null, userProfileLoading: true }); // Set loading state

      if (!useUserStore.getState().user) return;

      const response = await getRequest(
        `${BASE_URL}/users/${useUserStore.getState().user?._id}`
      ); // Send GET request to get user profile

      set({ userProfileLoading: false }); // Set loading state

      if (response.error) {
        return set({ userProfileError: response }); // Set error state if there's an error
      }

      set({ userProfile: response }); // Set user profile data
    } catch (error) {
      console.error(error.message); // Log error message
    }
  },

  // Function to update user socials
  updateUserSocials: async (userId) => {
    // Get the user object from local storage
    const user = JSON.parse(localStorage.getItem('User'));

    // Get the token from the user object
    const token = user.token;

    try {
      const updatedSocials = get().socialInfos.filter(
        (social) => social.link !== ''
      );
      const state = get(); // Get current state
      const response = await postRequest(
        `${BASE_URL}/users/updateProfile`,
        {
          // Send POST request to update profile
          userId: userId,
          socials: updatedSocials,
          name: state.name,
          bio: state.bio,
          profession: state.profession,
        },
        token
      );

      if (response.error) {
        toast.error(`${response.message}`); // Show error toast if there's an error
        return;
      }

      const updatedSocialLinks = { ...state.userProfile.socials }; // Copy current social links

      // Update social links
      for (let info of state.socialInfos) {
        info.link ? (updatedSocialLinks[info.platform] = info.link) : null;
      }

      // Update name, bio, and profession
      let updatedName = state.name !== '' ? state.name : state.userProfile.name;
      let updatedBio = state.bio !== '' ? state.bio : state.userProfile.bio;
      let updatedProfession =
        state.profession !== ''
          ? state.profession
          : state.userProfile.profession;

      // Update user profile state
      set({
        userProfile: {
          ...state.userProfile,
          socials: updatedSocialLinks,
          name: updatedName,
          bio: updatedBio,
          profession: updatedProfession,
        },
      });
    } catch (error) {
      console.error(error.message); // Log error message
    }
  },

  // Function to get other user's profile
  getOtherUserProfile: (userId) =>
    set(async () => {
      try {
        set({ userProfileError: null, userProfileLoading: true }); // Set loading state

        const response = await getRequest(`${BASE_URL}/users/${userId}`); // Send GET request to get other user's profile

        set({ userProfileLoading: false }); // Set loading state

        if (response.error) {
          return set({ userProfileError: response }); // Set error state if there's an error
        }

        set({ otherUserProfile: response }); // Set other user's profile data
      } catch (error) {
        console.error(error.message); // Log error message
      }
    }),

  // Function to follow author
  followAuthor: async (userId) => {
    // Get the user object from local storage
    const user = JSON.parse(localStorage.getItem('User'));

    // Get the token from the user object
    const token = user.token;
    try {
      const response = await getRequest(
        `${BASE_URL}/users/follow/${userId}/${
          useUserStore.getState().user?._id
        }`,
        token
      ); // Send GET request to follow author

      if (response.error) {
        return toast.error(response.message); // Show error toast if there's an error
      }

      set({ otherUserProfile: response }); // Set other user's profile data
    } catch (error) {
      console.error(error.message); // Log error message
    }
  },
}));

// Creating a Zustand store for profile picture
const useProfilePictureStore = create((set) => ({
  profilePictureUrl: '', // URL of profile picture
  profilePictureLoading: false, // Loading state for profile picture
  profilePictureError: null, // Error while uploading profile picture

  // Function to set profile picture URL
  setProfilePictureUrl: (base64) =>
    set(async () => {
      try {
        set({ profilePictureError: null, profilePictureLoading: true }); // Set loading state
        toast.info('Uploading Image...', { autoClose: 3000 }); // Show info toast

        const response = await postRequest(`${BASE_URL}/uploadImage`, {
          // Send POST request to upload image
          id: useUserStore.getState().user?._id,
          image: base64,
        });

        set({ profilePictureLoading: false }); // Set loading state

        if (response.error) {
          toast.error(`Network error!`); // Show error toast if there's an error
          return set({ profilePictureError: response }); // Set error state
        }

        toast.success('Image uploaded successfully!'); // Show success toast

        // Update userProfile in useProfileStore
        useProfileStore.setState({ userProfile: response });
      } catch (error) {
        console.error(error.message); // Log error message
        toast.error('Failed to upload image!'); // Show error toast
      }
    }),
}));

// Exporting Zustand stores
export { useProfileStore, useProfilePictureStore };
