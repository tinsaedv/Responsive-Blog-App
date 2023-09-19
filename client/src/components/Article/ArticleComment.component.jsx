import { FiMessageSquare } from 'react-icons/fi';
import { RiPencilFill } from 'react-icons/ri';
import { MdOutlineDelete } from 'react-icons/md';
import useCommentStore from '../../App/useCommentStore';
import { memo, useEffect, useState } from 'react';
import moment from 'moment';
import { useUserStore } from '../../App/useAuthStore';
import { useArticleStore } from '../../App/useArticleStore';
import CommentUpdateInput from './CommentUpdateInput.component';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
const ArticleComment = memo(({ articleId }) => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const {
    responseComment,
    getCommentsByArticleId,
    postComment,
    deleteCommentById,
    getComment,
    updateComment,
    setUpdateComment,
    updateCommentById,
    commentInputOpen,
    setCommentInputOpen,
    setEditingCommentId,
    editingCommentId,
  } = useCommentStore((state) => ({
    responseComment: state.responseComment,
    getCommentsByArticleId: state.getCommentsByArticleId,
    postComment: state.postComment,
    deleteCommentById: state.deleteCommentById,
    getComment: state.getComment,
    updateComment: state.updateComment,
    setUpdateComment: state.setUpdateComment,
    updateCommentById: state.updateCommentById,
    commentInputOpen: state.commentInputOpen,
    setCommentInputOpen: state.setCommentInputOpen,
    setEditingCommentId: state.setEditingCommentId,
    editingCommentId: state.editingCommentId,
  }));

  const { article } = useArticleStore((state) => ({
    article: state.article,
  }));

  console.log('responseComment', responseComment);
  console.log('editingCommentId', editingCommentId);

  useEffect(() => {
    articleId && getCommentsByArticleId(articleId);
  }, [articleId, postComment]);

  return (
    <div className='mx-[1.6rem] mt-[3.13rem] '>
      <p className='mb-[1rem] font-Roboto text-[1rem] font-bold'>
        All Comments ({responseComment?.length})
      </p>

      {/* check is response comment is an array and map over */}
      {Array.isArray(responseComment) &&
        responseComment?.map((comment) => (
          <div
            key={comment?._id}
            className='flex gap-[0.5rem] relative bg-[#F2F4F5] rounded-lg py-[0.75rem] px-[0.69rem] '
          >
            <img
              className='w-[2.5rem] h-[2.5rem] rounded-[62.4375rem]'
              src={comment?.authorPic}
              alt=''
            />

            <div>
              <h1 className='text-[0.825rem] sm:text-[0.875rem] text-[#0D2436] font-Roboto font-bold'>
                {comment.author}
              </h1>
              <p className='mb-[0.5rem] sm:text-[0.625rem] text-[#77808B] text-[0.625rem] font-openSans'>
                {moment(comment.createdAt).format('Do MMMM  YYYY, h:mm a')}
              </p>
              {comment?.edited && <p>(edited)</p>}

              {/* if the user clicks on edit button hide the comment text */}
              {comment._id !== editingCommentId && (
                <p
                  className={`${
                    article?.articleAuthorId === comment?.commentAuthorId &&
                    'bg-[#77808B] text-white rounded-md px-3 inline-block'
                  } mb-[0.75rem] sm:text-[1rem] text-[#77808B] text-[0.925rem] font-openSans`}
                >
                  {comment.text}
                </p>
              )}

              {/* only show the input text field for the comment author */}
              {comment._id === editingCommentId && (
                <CommentUpdateInput comment={comment} />
              )}
              <div className='flex gap-5'>
                <div className='flex gap-2 items-center'>
                  <FiMessageSquare className='sm:w-4 sm:h-4 w-[0.9rem] h-[0.9rem]' />
                  <p className='font-Roboto sm:text-[0.875rem] text-[0.8rem] font-medium'>
                    Reply
                  </p>
                </div>

                {/* only show the all fields including delete and edit for the comment author */}
                {user?._id !== comment?.commentAuthorId ? null : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getComment(comment?._id);
                        setCommentInputOpen(true);
                        setEditingCommentId(comment?._id);
                      }}
                      className='flex gap-2 items-center'
                    >
                      <RiPencilFill className='sm:w-4 sm:h-4 w-[0.9rem] h-[0.9rem]' />
                      <p className='font-Roboto sm:text-[0.875rem] text-[0.8rem] font-medium'>
                        Edit
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setDeletingCommentId(comment?._id);
                        setDeleteButtonClicked(true);
                      }}
                      className='flex gap-2 cursor-pointer items-center'
                    >
                      <MdOutlineDelete className='sm:w-4 sm:h-4 w-[0.9rem] h-[0.9rem]' />
                      <p className='font-Roboto sm:text-[0.875rem]  text-[0.8rem] font-medium'>
                        Delete
                      </p>
                    </button>
                  </>
                )}
              </div>
              {deletingCommentId === comment?._id && deleteButtonClicked ? (
                <div
                  className={`z-30 absolute top-0 right-[3rem] bg-white text-center shadow-lg rounded-md p-2`}
                >
                  <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                    Delete this Comment?
                  </h3>
                  <div className='flex justify-center gap-4'>
                    <button
                      className='bg-red-600 text-white font-Roboto font-bold px-4 py-2 rounded-md'
                      onClick={() => deleteCommentById(comment?._id)}
                    >
                      Delete
                    </button>

                    <button
                      className='bg-slate-400 text-white font-Roboto font-bold px-4 py-2 rounded-md'
                      onClick={() => {
                        setDeleteButtonClicked(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
    </div>
  );
});

export default ArticleComment;
