import { useState } from 'react';
import { useAuthStore, useUserStore } from '../../App/useAuthStore';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
const Settings = () => {
  const navigate = useNavigate();
  const [deleteBtnClicked, setDeleteBtnClicked] = useState(false);

  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const { deleteAccount } = useAuthStore((state) => ({
    deleteAccount: state.deleteAccount,
  }));

  const state = useAuthStore((state) => state);
  console.log(state);
  console.log(typeof deleteAccount);
  return (
    <main className=' flex flex-col justify-center items-center lg:ml-[5rem] relative bg-gray-100 p-3 rounded-md'>
      <div className='flex gap-5 font-medium items-center'>
        <p className='font-Roboto'>Delete Account Permanently</p>
        <button
          onClick={() => setDeleteBtnClicked(true)}
          className='bg-red-600 px-4 py-2 rounded-md text-white font-bold font-Roboto'
        >
          Delete
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          deleteBtnClicked ? 'block' : 'hidden'
        } z-30 bg-white absolute sm:right-[10%] sm:left-[10%] sm:top-[8rem] top-[8rem] right-0  text-center shadow-md rounded-md p-2`}
      >
        <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
        <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
          Are you sure you want to delete your account? This action can not be
          undone!
        </h3>
        <div className='flex justify-center gap-4'>
          <button
            className='bg-red-600 text-white font-Roboto font-bold px-4 py-2 rounded-md'
            onClick={() => {
              deleteAccount && deleteAccount(user?._id);
              navigate('/');
              window.location.reload();
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              localStorage.removeItem('User');
            }}
          >
            Yes, I&apos;m sure
          </button>
          <button
            className='bg-slate-400 text-white font-Roboto font-bold px-4 py-2 rounded-md'
            onClick={() => setDeleteBtnClicked(false)}
          >
            No, cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default Settings;
