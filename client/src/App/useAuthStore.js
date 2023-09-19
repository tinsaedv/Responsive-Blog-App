import { create } from 'zustand';
import { BASE_URL, deleteRequest, postRequest } from '../utils/request';
import { toast } from 'react-toastify';

//logged in user section
const useUserStore = create(() => ({
  user: null,
}));

function getUserFromLocalStorage() {
  const user = localStorage.getItem('User');
  if (user) {
    return JSON.parse(user);
  }
}

const userInfo = getUserFromLocalStorage();

useUserStore.setState({ user: userInfo });

//register section
const useAuthStore = create((set, get) => ({
  registerInfo: {
    name: '',
    email: '',
    password: '',
  },
  registerError: null,

  registerLoading: false,

  loginInfo: {
    nameOrEmail: '',
    password: '',
  },

  loginError: null,
  loginLoading: false,

  setRegisterInfo: (key, value) =>
    set((state) => ({
      registerInfo: { ...state.registerInfo, [key]: value },
    })),

  setLoginInfo: (key, value) =>
    set((state) => ({
      loginInfo: { ...state.loginInfo, [key]: value },
    })),

  registerUser: async (e) => {
    try {
      const state = get();
      e.preventDefault();

      set({ registerError: null, registerLoading: true });

      const response = await postRequest(
        `${BASE_URL}/users/register`,
        state.registerInfo
      );

      set({ registerLoading: false });

      if (response.error) {
        if (response.message === 'getaddrinfo ENOTFOUND api.cloudinary.com') {
          return set({
            registerError: 'There is a problem with your network!',
          });
        }
        return set({ registerError: response });
      }

      localStorage.setItem('User', JSON.stringify(response));
      useUserStore.setState({ user: response });
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  },

  loginUser: async (e) => {
    try {
      const state = get();
      e.preventDefault();
      set({ loginError: null, loginLoading: true });

      const response = await postRequest(
        `${BASE_URL}/users/login`,
        state.loginInfo
      );

      set({ loginLoading: false });

      if (response.error) {
        return set({ loginError: response });
      }

      localStorage.setItem('User', JSON.stringify(response));
      useUserStore.setState({ user: response });
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  },

  logOutUser: () => {
    localStorage.removeItem('User');
  },

  deleteAccount: async (userId) => {
    try {
      const response = await deleteRequest(
        `${BASE_URL}/users/delete/${userId}`
      );

      if (response.error) {
        return toast.error(response.message);
      }

      toast.success(response.message);
    } catch (error) {
      console.error(error.message);
    }
  },
}));

export { useAuthStore, useUserStore };
