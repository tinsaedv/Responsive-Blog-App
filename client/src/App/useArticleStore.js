import { create } from 'zustand';
import {
  BASE_URL,
  deleteRequest,
  getRequest,
  postRequest,
  updateRequest,
} from '../utils/request';
import { useUserStore } from './useAuthStore';
import { toast } from 'react-toastify';

const useArticleStore = create((set, get) => ({
  //post article
  userArticles: [],
  article: null,
  allArticles: [],
  articles: [],
  body: '',
  thumbnail: '',
  title: '',
  summary: '',
  category: '',
  tags: [],
  onchangeCategory: '',

  articleError: null,
  articleLoading: false,
  singleArticleLoading: false,

  currentPage: 1,
  articlesPerPage: 2,
  searchQuery: '',

  userArticleLoading: false,

  //update article
  articleId: '',
  updateBody: '',
  updateThumbnail: '',
  updateTitle: '',
  updateSummary: '',
  updateCategory: '',
  updateTags: [],

  editingArticleId: '',

  setEditingArticleId: (id) => set({ editingArticleId: id }),

  getArticleContent: (id) => {
    const state = get();

    const articleFound = state.userArticles?.find(
      (article) => article._id === id
    );

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

  //set post article content
  setTags: (tag) => set({ tags: tag }),
  setThumbnail: (base64) => set({ thumbnail: base64 }),
  setArticle: (value) => set({ body: value }),
  setTitle: (value) => set({ title: value }),
  setSummary: (value) => set({ summary: value }),
  setCategory: (value) => set({ category: value }),

  //set update article content
  setUpdateTags: (tag) => set({ updateTags: tag }),
  setUpdateThumbnail: (base64) => set({ updateThumbnail: base64 }),
  setUpdateArticle: (value) => set({ updateBody: value }),
  setUpdateTitle: (value) => set({ updateTitle: value }),
  setUpdateSummary: (value) => set({ updateSummary: value }),
  setUpdateCategory: (value) => set({ updateCategory: value }),

  //set search query for articles
  setSearchQuery: (value) => set({ searchQuery: value }),

  setCurrentPage: () =>
    set((state) => ({ currentPage: state.currentPage + 1 })),

  setArticles: (articles) => set({ articles: articles }),

  postArticle: async () => {
    try {
      const state = get();
      set({ articleError: null, articleLoading: true });
      toast.info('Posting Article...', { autoClose: 2000 });
      const response = await postRequest(`${BASE_URL}/articles/post`, {
        authorId: useUserStore.getState().user._id,
        thumbnail: state.thumbnail,
        body: state.body,
        title: state.title,
        tags: state.tags,
        summary: state.summary,
        category: state.category,
      });

      set({ articleLoading: false });

      if (response.error) {
        toast.error(`${response.message}`);
        return set({ articleError: response });
      }

      toast.success('Article posted successfully!', { autoClose: 2000 });

      set((prevState) => ({
        ...prevState,
        article: [...prevState.article, ...response],
      }));
    } catch (error) {
      console.error(error.message);
    }
  },

  updateArticle: async (articleId) => {
    try {
      const state = get();

      toast.info('Updating Article...', { autoClose: 2000 });

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

      if (response.error) {
        toast.error(`${response.message}`);
        return set({ articleError: response });
      }

      let checkThumbnail;

      if (state.thumbnail !== '') {
        checkThumbnail = state.thumbnail;
      } else {
        const articleToUpdate = state.userArticles.find(
          (article) => article._id === articleId
        );
        checkThumbnail = articleToUpdate?.thumbnail;
      }

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

      toast.success('Article updated successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error(error.message);
    }
  },

  getArticles: async () => {
    try {
      const state = get();

      set({ articleLoading: true });

      const response = await getRequest(
        `${BASE_URL}/articles/get?page=${state.currentPage}&limit=${
          state.articlesPerPage
        }&search=${encodeURIComponent(state.searchQuery)}`
      );

      set({ articleLoading: false });
      if (response.error) {
        toast.error(`${response.message}`);
        return set({ articleError: response });
      }

      if (response.length === 0) {
        set({ endOfArticle: true });
        return;
      }

      set({ articles: response });
    } catch (error) {
      console.error(error.message);
    }
  },

  getArticleById: async (articleId) => {
    try {
      set({ singleArticleLoading: true });

      const response = await getRequest(`${BASE_URL}/articles/${articleId}`);

      set({ singleArticleLoading: false });
      if (response.error) {
        toast.error(`${response.message}`);
        return set({ articleError: response });
      }

      if (Array.isArray(response)) {
        const [destructuredArticle] = response;
        set({ article: destructuredArticle });
      }
    } catch (error) {
      console.error(error.message);
    }
  },

  getUserArticlesById: async (id) => {
    try {
      set({ userArticleLoading: true });
      const response = await getRequest(`${BASE_URL}/articles/get/${id}`);

      set({ userArticleLoading: false });
      if (response.error) {
        return toast.error(`${response.message}`);
      }

      set({ userArticles: response });
    } catch (error) {
      console.error(error.message);
    }
  },

  deleteArticlesById: async (id) => {
    try {
      const response = await deleteRequest(`${BASE_URL}/articles/delete/${id}`);
      if (response.error) {
        return toast.error('There was an error deleting article');
      }

      set((state) => ({
        userArticles: state.userArticles.filter(
          (article) => article._id !== id
        ),
      }));
      toast.success('Article removed!');
    } catch (error) {
      console.error(error.message);
    }
  },

  likeArticle: async (articleId) => {
    try {
      const response = await postRequest(`${BASE_URL}/articles/like`, {
        articleId: articleId,
        userId: useUserStore.getState().user?._id,
      });

      if (response.error) {
        return toast.error('There was error liking the article');
      }

      set({ article: response });
    } catch (error) {
      console.error(error.message);
    }
  },
}));

export { useArticleStore };
