// Importing create function from zustand for state management
import { create } from 'zustand';

// Importing necessary functions and constants from request utility
import {
  BASE_URL,
  deleteRequest,
  getRequest,
  postRequest,
  updateRequest,
} from '../utils/request';

// Importing useUserStore for user related state
import { useUserStore } from './useAuthStore';

// Importing toast for notifications
import { toast } from 'react-toastify';

// Creating article store using zustand
const useArticleStore = create((set, get) => ({
  // Array to hold articles posted by the user
  userArticles: [],

  // Object to hold a single article
  article: null,

  // Array to hold all articles
  allArticles: [],

  // Array to hold articles
  articles: [],

  // String to hold the body of an article
  body: '',

  // String to hold the thumbnail of an article
  thumbnail: '',

  // String to hold the title of an article
  title: '',

  // String to hold the summary of an article
  summary: '',

  // String to hold the category of an article
  category: '',

  // Array to hold the tags of an article
  tags: [],

  // String to hold the onchangeCategory of an article
  onchangeCategory: '',

  // Object to hold any error related to an article
  articleError: null,

  // Boolean to indicate if an article is loading
  articleLoading: false,

  // Boolean to indicate if a single article is loading
  singleArticleLoading: false,

  // Number to hold the current page for pagination
  currentPage: 1,

  // Number to hold the number of articles per page for pagination
  articlesPerPage: 2,

  // String to hold the search query for articles
  searchQuery: '',

  // Boolean to indicate if user's articles are loading
  userArticleLoading: false,

  // String to hold the id of an article to be updated
  articleId: '',

  // String to hold the updated body of an article
  updateBody: '',

  // String to hold the updated thumbnail of an article
  updateThumbnail: '',

  // String to hold the updated title of an article
  updateTitle: '',

  // String to hold the updated summary of an article
  updateSummary: '',

  // String to hold the updated category of an article
  updateCategory: '',

  // Array to hold the updated tags of an article
  updateTags: [],

  // String to hold the id of an article being edited
  editingArticleId: '',

  // Function to set the id of an article being edited
  setEditingArticleId: (id) => set({ editingArticleId: id }),

  // Function to get the content of an article
  getArticleContent: (id) => {
    // Getting the current state
    const state = get();

    // Finding the article in userArticles array
    const articleFound = state.userArticles?.find(
      (article) => article._id === id
    );

    // If article is found, set the update fields, else return null
    return articleFound
      ? set({
          updateBody: articleFound?.body,
          updateTitle: articleFound?.title,
          updateCategory: articleFound?.category,
          updateSummary: articleFound?.summary,
          updateTags: articleFound?.tags,
          articleId: id,
        })
      : null;
  },

  // Function to set the tags of an article
  setTags: (tag) => set({ tags: tag }),

  // Function to set the thumbnail of an article
  setThumbnail: (base64) => set({ thumbnail: base64 }),

  // Function to set the body of an article
  setArticle: (value) => set({ body: value }),

  // Function to set the title of an article
  setTitle: (value) => set({ title: value }),

  // Function to set the summary of an article
  setSummary: (value) => set({ summary: value }),

  // Function to set the category of an article
  setCategory: (value) => set({ category: value }),

  // Function to set the updated tags of an article
  setUpdateTags: (tag) => set({ updateTags: tag }),

  // Function to set the updated thumbnail of an article
  setUpdateThumbnail: (base64) => set({ updateThumbnail: base64 }),

  // Function to set the updated body of an article
  setUpdateArticle: (value) => set({ updateBody: value }),

  // Function to set the updated title of an article
  setUpdateTitle: (value) => set({ updateTitle: value }),

  // Function to set the updated summary of an article
  setUpdateSummary: (value) => set({ updateSummary: value }),

  // Function to set the updated category of an article
  setUpdateCategory: (value) => set({ updateCategory: value }),

  // Function to set the search query for articles
  setSearchQuery: (value) => set({ searchQuery: value }),

  // Function to increment the current page for pagination
  setCurrentPage: () =>
    set((state) => ({ currentPage: state.currentPage + 1 })),

  // Function to set the articles
  setArticles: (articles) => set({ articles: articles }),

  // Function to post an article
  postArticle: async () => {
    try {
      // Getting the current state
      const state = get();

      // Setting the loading and error states
      set({ articleError: null, articleLoading: true });

      // Displaying a toast notification for posting article
      toast.info('Posting Article...');

      // Making a post request to post an article
      const response = await postRequest(`${BASE_URL}/articles/post`, {
        authorId: useUserStore.getState().user._id,
        thumbnail: state.thumbnail,
        body: state.body,
        title: state.title,
        tags: state.tags,
        summary: state.summary,
        category: state.category,
      });

      // Setting the loading state to false
      set({ articleLoading: false });

      // If there is an error, display a toast notification and set the error state
      if (response.error) {
        if (response.message === 'getaddrinfo ENOTFOUND api.cloudinary.com') {
          toast.error(`${'Please check your internet connection'}`, {
            autoClose: 4000,
          });
          return set({ articleError: response });
        }
      }

      // If there is no error, display a success toast notification
      toast.success('Article posted successfully!', { autoClose: 2000 });

      // Updating the article state with the new article
      set((prevState) => ({
        ...prevState,
        article: [...prevState.article, ...response],
      }));
    } catch (error) {
      // Logging any error
      console.error(error.message);
    }
  },

  // Function to update an article
  updateArticle: async (articleId) => {
    try {
      // Getting the current state
      const state = get();

      // Displaying a toast notification for updating article
      toast.info('Updating Article...', { autoClose: 2000 });

      // Making a request to update an article
      const response = await updateRequest(`${BASE_URL}/articles/update`, {
        articleId: articleId,
        authorId: useUserStore.getState().user?._id,
        thumbnail: state.thumbnail,
        body: state.updateBody,
        title: state.updateTitle,
        summary: state.updateSummary,
        category: state.updateCategory,
        tags: state.updateTags,
      });

      // If there is an error, display a toast notification and set the error state
      if (response.error) {
        toast.error(`${response.message}`);
        return set({ articleError: response });
      }

      // Variable to hold the thumbnail of the article
      let checkThumbnail;

      // If there is a thumbnail in the state, use it, else use the thumbnail of the article to be updated
      if (state.thumbnail !== '') {
        checkThumbnail = state.thumbnail;
      } else {
        const articleToUpdate = state.userArticles.find(
          (article) => article._id === articleId
        );
        checkThumbnail = articleToUpdate?.thumbnail;
      }

      // Updating the userArticles state with the updated article
      set({
        userArticles: state.userArticles?.map((article) => {
          if (article?._id === articleId) {
            return {
              ...response,
              thumbnail: checkThumbnail,
            };
          } else {
            // return the article unchanged
            return article;
          }
        }),
      });

      // Displaying a success toast notification for updating article
      toast.success('Article updated successfully!', { autoClose: 2000 });
    } catch (error) {
      // Logging any error
      console.error(error.message);
    }
  },

  // Function to get articles
  getArticles: async () => {
    try {
      // Getting the current state
      const state = get();

      // Setting the loading state to true
      set({ articleLoading: true });

      // Making a request to get articles
      const response = await getRequest(
        `${BASE_URL}/articles/get?page=${state.currentPage}&limit=${
          state.articlesPerPage
        }&search=${encodeURIComponent(state.searchQuery)}`
      );

      // Setting the loading state to false
      set({ articleLoading: false });

      // If there is an error, display a toast notification and set the error state
      if (response.error) {
        toast.error(`${response.message}`);
        return set({ articleError: response });
      }

      // If there are no articles, set the endOfArticle state to true
      if (response.length === 0) {
        set({ endOfArticle: true });
        return;
      }

      // Setting the articles state with the fetched articles
      set({ articles: response });
    } catch (error) {
      // Logging any error
      console.error(error.message);
    }
  },

  // Function to get an article by id
  getArticleById: async (articleId) => {
    try {
      // Setting the loading state to true
      set({ singleArticleLoading: true });

      // Making a request to get an article by id
      const response = await getRequest(`${BASE_URL}/articles/${articleId}`);

      // Setting the loading state to false
      set({ singleArticleLoading: false });

      // If there is an error, display a toast notification and set the error state
      if (response.error) {
        toast.error(`${response.message}`);
        return set({ articleError: response });
      }

      // If the response is an array, destructure the first element and set the article state
      if (Array.isArray(response)) {
        const [destructuredArticle] = response;
        set({ article: destructuredArticle });
      }
    } catch (error) {
      // Logging any error
      console.error(error.message);
    }
  },

  // Function to get user's articles by id
  getUserArticlesById: async (id) => {
    try {
      // Setting the loading state to true
      set({ userArticleLoading: true });

      // Making a request to get user's articles by id
      const response = await getRequest(`${BASE_URL}/articles/get/${id}`);

      // Setting the loading state to false
      set({ userArticleLoading: false });

      // If there is an error, display a toast notification
      if (response.error) {
        return toast.error(`${response.message}`);
      }

      // Setting the userArticles state with the fetched articles
      set({ userArticles: response });
    } catch (error) {
      // Logging any error
      console.error(error.message);
    }
  },

  // Function to delete an article by id
  deleteArticlesById: async (id) => {
    try {
      // Making a request to delete an article by id
      const response = await deleteRequest(`${BASE_URL}/articles/delete/${id}`);

      // If there is an error, display a toast notification
      if (response.error) {
        return toast.error('There was an error deleting article');
      }

      // Updating the userArticles state by removing the deleted article
      set((state) => ({
        userArticles: state.userArticles.filter(
          (article) => article._id !== id
        ),
      }));

      // Displaying a success toast notification for deleting article
      toast.success('Article removed!');
    } catch (error) {
      // Logging any error
      console.error(error.message);
    }
  },

  // Function to like an article
  likeArticle: async (articleId) => {
    try {
      // Making a request to like an article
      const response = await postRequest(`${BASE_URL}/articles/like`, {
        articleId: articleId,
        userId: useUserStore.getState().user?._id,
      });

      // If there is an error, display a toast notification
      if (response.error) {
        return toast.error('There was error liking the article');
      }

      // Spreading article state and setting the views and likedBy property with the value from response
      set({
        article: {
          ...get().article,
          likes: response.likes,
          likedBy: response.likedBy,
        },
      });
    } catch (error) {
      // Logging any error
      console.error(error.message);
    }
  },
}));

// Exporting useArticleStore for use in other components
export { useArticleStore };
