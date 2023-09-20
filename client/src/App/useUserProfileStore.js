import { create } from 'zustand';
import { toast } from 'react-toastify';
import { BASE_URL, getRequest, postRequest } from '../utils/request';
import { useUserStore } from './useAuthStore';

const useProfileStore = create((set, get) => ({
  userProfile: null,
  userProfileError: null,
  userProfileLoading: false,
  otherUserProfile: null,
  socialInfos: [
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

  name: '',
  bio: '',
  profession: '',

  nameValue: '',
  bioValue: '',
  facebookValue: '',
  twitterValue: '',
  instagramValue: '',
  githubValue: '',
  linkedInValue: '',
  professionValue: '',

  getProfileInfoValue: () => {
    const state = get();
    set({
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

  setName: (value) => set({ name: value }),
  setBio: (value) => set({ bio: value }),
  setProfession: (value) => set({ profession: value }),

  setSocialInfos: (key, value) =>
    set((state) => ({
      /* map over socialInfos state and if the provided key is the same with platform  
      then spread social object and add the value provided to the link or else just return the social object
      */
      socialInfos: state.socialInfos.map((social) => {
        if (social.platform === key) {
          return { ...social, link: value };
        }
        return social;
      }),
    })),

  getUserProfile: async () => {
    try {
      set({ userProfileError: null, userProfileLoading: true });

      const response = await getRequest(
        `${BASE_URL}/users/${useUserStore.getState().user?._id}`
      );

      set({ userProfileLoading: false });

      if (response.error) {
        return set({ userProfileError: response });
      }

      set({ userProfile: response });
    } catch (error) {
      console.error(error.message);
    }
  },

  updateUserSocials: async (userId) => {
    try {
      const state = get();
      const response = await postRequest(`${BASE_URL}/users/updateProfile`, {
        userId: userId,
        socials: state.socialInfos,
        name: state.name,
        bio: state.bio,
        profession: state.profession,
      });

      if (response.error) {
        toast.error(`${response.message}`);
        return;
      }

      const updatedSocialLinks = { ...state.userProfile.socials };

      // loop over socialInfos and if  info.link value is defined, then updated the links in updatedSocialLinks
      for (let info of state.socialInfos) {
        info.link ? (updatedSocialLinks[info.platform] = info.link) : null;
      }

      //check is state.name is defined and if it is assign the updatedName to state.name or else get the name from userProfile state
      let updatedName = state.name !== '' ? state.name : state.userProfile.name;

      //check is state.bio is defined and if it is assign the updatedName to state.bio or else get the bio from userProfile state
      let updatedBio = state.bio !== '' ? state.bio : state.userProfile.bio;
      let updatedProfession =
        state.profession !== ''
          ? state.profession
          : state.userProfile.profession;

      //then spread the user profile and add updatedSocialLinks to the socials object
      set({
        userProfile: {
          ...state.userProfile,
          socials: updatedSocialLinks,
          name: updatedName,
          bio: updatedBio,
          profession: updatedProfession,
        },
      });

      /* the same functionality with different approach */
      // set({
      //   userProfile: {
      //     ...state.userProfile,
      //     socials: {
      //       ...state.userProfile.socials,
      //       ...state.socialInfos.reduce(
      //         (acc, curr) =>
      //           curr.link ? { ...acc, [curr.platform]: curr.link } : acc,
      //         {}
      //       ),
      //     },
      //   },
      // });
    } catch (error) {
      console.error(error.message);
    }
  },
  // This function gets profile of other users apart from user currently logged in
  getOtherUserProfile: (userId) =>
    set(async () => {
      try {
        set({ userProfileError: null, userProfileLoading: true });

        const response = await getRequest(`${BASE_URL}/users/${userId}`);

        set({ userProfileLoading: false });

        if (response.error) {
          return set({ userProfileError: response });
        }

        set({ otherUserProfile: response });
      } catch (error) {
        console.error(error.message);
      }
    }),

  followAuthor: async (userId) => {
    try {
      const response = await getRequest(
        `${BASE_URL}/users/follow/${userId}/${
          useUserStore.getState().user?._id
        }`
      );

      if (response.error) {
        return toast.error(response.message);
      }

      set({ otherUserProfile: response });
    } catch (error) {
      console.error(error.message);
    }
  },
}));

//This is another separate store for handling profile picture upload
const useProfilePictureStore = create((set) => ({
  profilePictureUrl: '',
  profilePictureLoading: false,
  profilePictureError: null,

  setProfilePictureUrl: (base64) =>
    set(async () => {
      try {
        set({ profilePictureError: null, profilePictureLoading: true });
        toast.info('Uploading Image...', { autoClose: 3000 });

        const response = await postRequest(`${BASE_URL}/uploadImage`, {
          id: useUserStore.getState().user?._id,
          image: base64,
        });

        set({ profilePictureLoading: false });

        if (response.error) {
          toast.error(`Network error!`);
          return set({ profilePictureError: response });
        }

        toast.success('Image uploaded successfully!');
        document.location.reload();

        set({ profilePictureUrl: response });
      } catch (error) {
        console.error(error.message);
        toast.error('Failed to upload image!');
      }
    }),
}));

export { useProfileStore, useProfilePictureStore };
