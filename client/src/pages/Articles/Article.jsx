import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import RecentArticles from '../../components/Article/RecentArticles.component';
import { useArticleStore } from '../../App/useArticleStore';
import ArticleComment from '../../components/Article/ArticleComment.component';
import ArticleCommentInput from '../../components/Article/ArticleCommentInput.component';
import AboutAuthor from '../../components/Article/AboutAuthor.component';

import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import './ArticleFontSize.css';
import { useProfileStore } from '../../App/useUserProfileStore';
import { useUserStore } from '../../App/useAuthStore';
const Article = () => {
  //to get the id of currently showing article
  const { id } = useParams();

  const [likeBtnClicked, setLikeBtnClicked] = useState(false);
  const { userProfile, getUserProfile } = useProfileStore((state) => ({
    userProfile: state.userProfile,
    getUserProfile: state.getUserProfile,
  }));
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const navigate = useNavigate();
  const {
    article,
    getArticleById,
    getArticles,
    singleArticleLoading,
    likeArticle,
  } = useArticleStore((state) => ({
    article: state.article,
    getArticleById: state.getArticleById,
    getArticles: state.getArticles,
    singleArticleLoading: state.singleArticleLoading,
    likeArticle: state.likeArticle,
  }));

  useEffect(() => {
    getUserProfile(user?._id);
  }, [getUserProfile, user?._id]);

  //render the fetch function every time the dependency changes
  useEffect(() => {
    getArticleById(id);
  }, [id, getArticleById]);

  //fetching data for Recent Articles component
  useEffect(() => {
    getArticles();
  }, [getArticles]);

  userProfile && console.log('userProfile', userProfile);

  function handleLike() {
    if (!user) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return navigate('/login');
    }
    setLikeBtnClicked(!likeBtnClicked);
    userProfile && likeArticle(article?._id);
  }

  const alreadyLiked = article?.likedBy?.includes(user?._id);

  console.log('alreadyLiked', alreadyLiked);
  return (
    <main className='mx-[1.5rem] relative top-0   mb-[6.25rem] '>
      {/* Bread crumbs */}
      <section className='flex ml-5' aria-label='Breadcrumb'>
        <ol className='inline-flex items-center space-x-1 md:space-x-3'>
          <li className='inline-flex items-center'>
            <NavLink
              to={'/'}
              className='inline-flex font-Roboto items-center text-sm  text-[0.75rem] text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-black'
            >
              Home
            </NavLink>
          </li>
          <li>
            <div className='flex items-center'>
              /
              <NavLink
                to={'/articles'}
                className='ml-1 text-sm  font-Roboto text-gray-700 text-[0.75rem] hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-black'
              >
                Articles
              </NavLink>
            </div>
          </li>
          <li aria-current='page'>
            <div className='flex items-center'>
              /
              <span className='ml-1 text-sm  font-Roboto text-[0.75rem] text-gray-500 md:ml-2 dark:text-black'>
                {article?.title}
              </span>
            </div>
          </li>
        </ol>
      </section>
      {/* main Article */}

      <section className='flex flex-col sm:mx-[1rem] lg:flex-row '>
        {singleArticleLoading ? (
          <div
            role='status'
            className='w-full h-full p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700'
          >
            <div className='flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700'>
              <svg
                className='w-10 h-10 text-gray-200 dark:text-gray-600'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 16 20'
              >
                <path d='M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z' />
                <path d='M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z' />
              </svg>
            </div>
            <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4'></div>
            <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5'></div>
            <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5'></div>
            <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
            <div className='flex items-center mt-4 space-x-3'>
              <svg
                className='w-10 h-10 text-gray-200 dark:text-gray-700'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
              </svg>
              <div>
                <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2'></div>
                <div className='w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
              </div>
            </div>
            <span className='sr-only'>Loading...</span>
          </div>
        ) : (
          <div className='lg:min-w-[50rem] flex flex-col justify-center '>
            <div className='mx-[1.5rem] bg-slate-300 mt-[1rem] h-[30rem] overflow-hidden rounded-xl'>
              <img
                className='object-cover w-full h-full '
                src={article?.thumbnail}
                alt=''
              />
            </div>
            <div className='mx-[1.5rem] mb-[2.5rem]'>
              <h1 className='mt-[0.6rem] text-[#1565D8] mb-[1.06rem] font-Roboto text-[0.875rem] sm:text-[1rem]'>
                {article?.category}
              </h1>
              <h2 className='text-[1.375rem] mb-[1.06rem] sm:text-[1.625rem] text-[#0D2436] font-Roboto font-medium'>
                {article?.title}
              </h2>
              <div
                className='ql-editor '
                dangerouslySetInnerHTML={{
                  __html: ` ${article?.body}`,
                }}
              />
            </div>

            <div className='w-[70%] flex gap-2 my-5 ml-6'>
              {alreadyLiked ? (
                <button
                  onClick={handleLike}
                  className='text-[1.5rem] text-red-600'
                >
                  <AiFillHeart />
                </button>
              ) : (
                <button onClick={handleLike} className='text-[1.5rem]'>
                  <AiOutlineHeart />
                </button>
              )}

              <p>{article?.likes}</p>
            </div>

            {/* Comment box */}
            <ArticleCommentInput articleId={article?._id} />

            {/* Comments */}
            <ArticleComment articleId={article?._id} />

            {/* About Author */}
            <AboutAuthor />
          </div>
        )}

        {/* Recent Article */}
        <RecentArticles />
      </section>
    </main>
  );
};

export default Article;
