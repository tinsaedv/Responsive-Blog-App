import { memo } from 'react';
import useCommentStore from '../../App/useCommentStore';

const ArticleCommentInput = memo(({ articleId }) => {
  const { comment, setComment, postComment } = useCommentStore((state) => ({
    comment: state.comment,
    setComment: state.setComment,
    postComment: state.postComment,
  }));

  function handleOnChangeInput(e) {
    setComment(e.target.value);
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    postComment(articleId);
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className='relative mx-[1.56rem] h-[10rem] rounded-lg overflow-hidden bg-white  shadow-md  border-[#76AEFF] border-[1px] '
    >
      <textarea
        value={comment}
        onChange={handleOnChangeInput}
        className='w-full px-3 py-2 h-full outline-none resize-none'
        rows='4'
        placeholder='Type your comment here...'
      ></textarea>
      <button
        type='submit'
        className='mt-3 absolute right-[1.12rem] bottom-[1.12rem] bg-blue-500 hover:bg-blue-600 text-white font-semibold py-[0.59rem] px-[2rem] rounded'
      >
        Send
      </button>
    </form>
  );
});

export default ArticleCommentInput;
