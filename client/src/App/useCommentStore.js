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

// Importing toast for showing notifications
import { toast } from 'react-toastify';

// Importing useProfileStore for user profile related state
import { useProfileStore } from './useUserProfileStore';

// Creating a store for comments using zustand
const useCommentStore = create((set, get) => ({
  // State for storing the response of a comment request
  responseComment: null,

  // State for storing the current comment
  comment: '',

  // State for tracking if a comment is being loaded
  commentLoading: false,

  // State for storing any error that occurs while loading a comment
  commentLoadError: null,

  // State for storing the updated comment
  updateComment: '',

  // State for tracking if the comment input is open
  commentInputOpen: false,

  // State for tracking the id of the comment currently being edited
  editingCommentId: '',

  // Function for setting the id of the comment currently being edited
  setEditingCommentId: (id) => set({ editingCommentId: id }),

  // Function for setting the state of the comment input
  setCommentInputOpen: (boolean) => set({ commentInputOpen: boolean }),

  // Function for setting the current comment
  setComment: (value) => set({ comment: value }),

  // Function for setting the updated comment
  setUpdateComment: (value) => set({ updateComment: value }),

  // Function for getting a comment by its id
  getComment: (id) => {
    // Getting the current state
    const state = get();

    // Finding the comment with the given id
    const commentFound = state.responseComment?.find((res) => res?._id === id);

    // If the comment is found, set the updateComment state to its text, otherwise return null
    return commentFound ? set({ updateComment: commentFound?.text }) : null;
  },

  // Function for posting a comment
  postComment: async (articleId) => {
    try {
      // Getting the current state
      const state = get();

      // Making a post request to post a comment
      const response = await postRequest(`${BASE_URL}/comments/post`, {
        articleId: articleId,
        authorId: useUserStore.getState().user._id,
        text: state.comment,
      });

      // If there is an error in the response, show a toast notification with the error message
      if (response.error) {
        return toast.error(response.message);
      }

      // If the request is successful, update the responseComment state with the new comment
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
      // If an error occurs, log it to the console
      console.error(error.message);
    }
  },

  // Function for getting comments by article id
  getCommentsByArticleId: async (id) => {
    try {
      // Setting the commentLoading state to true and commentLoadError state to null
      set({ commentLoading: true, commentLoadError: null });

      // Making a get request to get comments by article id
      const response = await getRequest(`${BASE_URL}/comments/get/${id}`);

      // Setting the commentLoading state to false
      set({ commentLoading: false });

      // If there is an error in the response, set the commentLoadError state to the error message
      if (response.error) {
        return set({ commentLoadError: response.message });
      }

      // If the request is successful, set the responseComment state to the response
      set({ responseComment: response });
    } catch (error) {
      // If an error occurs, log it to the console
      console.error(error.message);
    }
  },

  // Function for updating a comment by its id
  updateCommentById: async (id) => {
    try {
      // Getting the current state
      const state = get();

      // Making an update request to update a comment
      const response = await updateRequest(`${BASE_URL}/comments/update`, {
        commentId: id,
        text: state.updateComment,
      });

      // If there is an error in the response, show a toast notification with the error message and set the commentLoadError state to the error message
      if (response.error) {
        toast.error(`${response.message}`);
        return set({ commentLoadError: response.message });
      }

      // If the request is successful, update the text of the comment in the responseComment state
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

      // Show a toast notification that the comment was updated successfully
      toast.success('Comment updated successfully', { autoClose: 2000 });
    } catch (error) {
      // If an error occurs, log it to the console
      console.error(error.message);
    }
  },

  // Function for deleting a comment by its id
  deleteCommentById: async (id) => {
    try {
      // Making a delete request to delete a comment
      const response = await deleteRequest(`${BASE_URL}/comments/delete/${id}`);

      // If there is an error in the response, show a toast notification with the error message and set the commentLoadError state to the error message
      if (response.error) {
        toast.error(`${response.message}`);
        return set({ commentLoadError: response.message });
      }

      // If the request is successful, remove the comment from the responseComment state
      set((state) => ({
        responseComment: state.responseComment.filter((res) => res?._id !== id),
      }));

      // Show a toast notification that the comment was deleted successfully
      toast.success('Comment deleted successfully');
    } catch (error) {
      // If an error occurs, log it to the console
      console.error(error.message);
    }
  },
}));

// Exporting the useCommentStore hook
export default useCommentStore;
