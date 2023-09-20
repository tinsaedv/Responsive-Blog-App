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
import { useProfileStore } from './useUserProfileStore';
const useCommentStore = create((set, get) => ({
  responseComment: null,
  comment: '',
  commentLoading: false,
  commentLoadError: null,

  updateComment: '',
  commentInputOpen: false,

  //id state to track currently clicked comment
  editingCommentId: '',

  setEditingCommentId: (id) => set({ editingCommentId: id }),

  setCommentInputOpen: (boolean) => set({ commentInputOpen: boolean }),
  setComment: (value) => set({ comment: value }),
  setUpdateComment: (value) => set({ updateComment: value }),

  /* extract the comment text from responseComment state with specified comment id*/
  getComment: (id) => {
    const state = get();

    const commentFound = state.responseComment?.find((res) => res?._id === id);

    return commentFound ? set({ updateComment: commentFound?.text }) : null;
  },

  postComment: async (articleId) => {
    try {
      const state = get();
      const response = await postRequest(`${BASE_URL}/comments/post`, {
        articleId: articleId,
        authorId: useUserStore.getState().user._id,
        text: state.comment,
      });

      if (response.error) {
        return toast.error(response.message);
      }

      set((prevState) => ({
        ...prevState,
        responseComment: [
          ...prevState.responseComment,
          {
            ...response,
            authorPic: useProfileStore.getState().userProfile?.profilePicture,
            author: useProfileStore.getState().userProfile?.name,
          },
        ],
      }));
    } catch (error) {
      console.error(error.message);
    }
  },

  getCommentsByArticleId: async (id) => {
    try {
      set({ commentLoading: true, commentLoadError: null });

      const response = await getRequest(`${BASE_URL}/comments/get/${id}`);

      set({ commentLoading: false });

      if (response.error) {
        return set({ commentLoadError: response.message });
      }

      set({ responseComment: response });
    } catch (error) {
      console.error(error.message);
    }
  },

  updateCommentById: async (id) => {
    try {
      const state = get();
      const response = await updateRequest(`${BASE_URL}/comments/update`, {
        commentId: id,
        text: state.updateComment,
      });

      if (response.error) {
        toast.error(`${response.message}`);
        return set({ commentLoadError: response.message });
      }

      //map over the responseComment array and check if an object with that id exist if it does change the text value by spreading that object
      set((state) => ({
        responseComment: state.responseComment?.map((comment) =>
          comment?._id === id
            ? {
                ...comment,
                text: state.updateComment,
              }
            : comment
        ),
      }));
      toast.success('Comment updated successfully', { autoClose: 2000 });
    } catch (error) {
      console.error(error.message);
    }
  },

  deleteCommentById: async (id) => {
    try {
      const response = await deleteRequest(`${BASE_URL}/comments/delete/${id}`);

      if (response.error) {
        toast.error(`${response.message}`);
        return set({ commentLoadError: response.message });
      }

      set((state) => ({
        responseComment: state.responseComment.filter((res) => res?._id !== id),
      }));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error(error.message);
    }
  },
}));

export default useCommentStore;
