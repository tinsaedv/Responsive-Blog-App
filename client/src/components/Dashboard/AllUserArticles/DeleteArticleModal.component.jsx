import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DeleteArticleModal = ({
  deleteOpen,
  setDeleteOpen,
  post,
  deleteArticlesById,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`${
        deleteOpen ? 'block' : 'hidden'
      } z-30 bg-white absolute sm:right-[10%] sm:left-[10%] sm:top-[-5rem] top-0 right-0  text-center shadow-md rounded-md p-2`}
    >
      <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
      <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
        Are you sure you want to delete this Article? This action can not be
        undone!
      </h3>
      <div className='flex justify-center gap-4'>
        <button
          className='bg-red-600 text-white font-Roboto font-bold px-4 py-2 rounded-md'
          onClick={() => {
            deleteArticlesById(post?._id);
          }}
        >
          Yes, I&apos;m sure
        </button>
        <button
          className='bg-slate-400 text-white font-Roboto font-bold px-4 py-2 rounded-md'
          onClick={() => setDeleteOpen(false)}
        >
          No, cancel
        </button>
      </div>
    </div>
  );
};
export default DeleteArticleModal;
