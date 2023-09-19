import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrArticle } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { IoSettingsSharp } from 'react-icons/io5';
import { HiLogout } from 'react-icons/hi';
import { AiFillHeart } from 'react-icons/ai';

import { MdClose, MdOutlinePostAdd } from 'react-icons/md';
const SideBar = () => {
  const navigate = useNavigate();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  return (
    <div className='fixed left-0 top-[2rem] mt-[4rem]  h-full z-20'>
      <button
        onClick={() => setSideBarOpen(!sideBarOpen)}
        type='button'
        className='inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
      >
        <span className='sr-only'>Open sidebar</span>
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            clipRule='evenodd'
            fillRule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
          ></path>
        </svg>
      </button>

      <aside
        id='default-sidebar'
        className={`${
          sideBarOpen ? 'block lg:hidden' : 'hidden lg:block'
        } fixed top-[4rem]  lg:top-[6rem] left-0 z-40 w-[12.9rem] h-screen transition-transform translate-x-0 `}
        aria-label='Sidebar'
      >
        <MdClose
          className='absolute sm:hidden cursor-pointer text-[1.5rem] text-gray-400 right-0'
          onClick={() => setSideBarOpen(false)}
        />
        <div
          className={` h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800`}
        >
          <ul className='space-y-2 font-medium'>
            <li>
              <a
                onClick={() => {
                  navigate('/dashboard/articles');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className='flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <GrArticle className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />

                <span className='flex-1 ml-3 whitespace-nowrap'>
                  Your Articles
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate('/dashboard/likedArticles');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className='flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <AiFillHeart className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />

                <span className='flex-1 ml-3 whitespace-nowrap'>
                  Your liked Articles
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate('/dashboard/profile');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className='flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <CgProfile className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />

                <span className='flex-1 ml-3 whitespace-nowrap'>Profile</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate('/dashboard/postArticle');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className='flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <MdOutlinePostAdd className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />

                <span className='flex-1 ml-3 whitespace-nowrap '>
                  Post new article
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate('/dashboard/settings');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className='flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <IoSettingsSharp className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />

                <span className='flex-1 ml-3 whitespace-nowrap '>Settings</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate('/');
                  window.location.reload();
                  localStorage.removeItem('User');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className='flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <HiLogout className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />

                <span className='flex-1 ml-3 whitespace-nowrap '>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
