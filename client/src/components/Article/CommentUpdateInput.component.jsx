import { useEffect, useRef } from 'react';
import useCommentStore from '../../App/useCommentStore';

const CommentUpdateInput = ({ comment }) => {
  const {
    updateComment,
    setUpdateComment,
    updateCommentById,
    commentInputOpen,
    setCommentInputOpen,
    setEditingCommentId,
  } = useCommentStore((state) => ({
    updateComment: state.updateComment,
    setUpdateComment: state.setUpdateComment,
    updateCommentById: state.updateCommentById,
    commentInputOpen: state.commentInputOpen,
    setCommentInputOpen: state.setCommentInputOpen,
    setEditingCommentId: state.setEditingCommentId,
  }));

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  return (
    <div className='mb-4'>
      {commentInputOpen && (
        <>
          <input
            className='rounded-md bg-slate-200 dark:bg-gray-500'
            type='text'
            value={updateComment}
            ref={ref}
            onChange={(e) => {
              setCommentInputOpen(true);
              setUpdateComment(e.target.value);
            }}
          />
          <button
            className='mt-3 ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-[0.5rem] text-[0.9rem] px-[10px] rounded'
            onClick={() => {
              updateCommentById(comment?._id);
              setCommentInputOpen(!commentInputOpen);
              setEditingCommentId('');
            }}
          >
            Save
          </button>
          <button
            className='mt-3 ml-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-[0.5rem] text-[0.9rem] px-[10px] rounded'
            onClick={() => {
              setCommentInputOpen(false);
              setEditingCommentId('');
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default CommentUpdateInput;
