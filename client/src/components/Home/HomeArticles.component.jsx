import verified from '../../assets/Icons/Icon.svg';
import { FiArrowRight } from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useArticleStore } from '../../App/useArticleStore';
import { useEffect } from 'react';
import moment from 'moment';
import { useProfileStore } from '../../App/useUserProfileStore';
import { useUserStore } from '../../App/useAuthStore';

const Articles = () => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const { articles, getArticles, getArticleById, getUserArticlesById } =
    useArticleStore((state) => ({
      articles: state.articles,
      getArticles: state.getArticles,
      getArticleById: state.getArticleById,
      getUserArticlesById: state.getUserArticlesById,
    }));

  const navigate = useNavigate();
  const { getOtherUserProfile } = useProfileStore((state) => ({
    getOtherUserProfile: state.getOtherUserProfile,
  }));

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  let slicedArticles = articles;

  if (articles.length > 9) {
    slicedArticles = articles.slice(0, 9).sort((a, b) => b.views - a.views);
  }

  slicedArticles = slicedArticles.map((article) => {
    if (article.summary.length > 90) {
      return { ...article, summary: article.summary.substring(0, 65) + '...' };
    }
    return article;
  });

  return (
    <section className='grid place-items-center'>
      <div className='grid mx-[1rem] gap-7  lg:max-w-full lg:min-w-[60rem]   grid-cols-1 sm:grid-cols-2  lg:grid-cols-3  xl:mx-10 place-items-center'>
        {slicedArticles?.map((article) => (
          <div
            key={article?._id}
            className='max-w-xs min-w-[17rem] dark:bg-slate-700 sm:min-w-[18rem] overflow-hidden  rounded-[0.75rem] shadow-md'
          >
            <NavLink
              to={`/article/${article?._id}`}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                getArticleById(article?._id);
              }}
            >
              <div className='h-[12rem] w-full'>
                <img
                  className='h-full w-full object-cover'
                  src={article?.thumbnail}
                  alt=''
                />
              </div>
              <div className='px-[1.25rem]'>
                <h1 className='text-[1.3rem] lg:text-[1.5rem] font-Roboto font-bold leading-[1.5rem] mt-[1rem] lg:mt-[1.94rem] mb-[0.7rem]'>
                  {article?.title}
                </h1>
                <p className='text-[#5A7184] dark:text-gray-400 sm:text-[1rem] font-openSans text-[0.9rem] mb-[1.5rem] leading-[1.5rem]'>
                  {article?.summary}
                </p>
              </div>
            </NavLink>
            <div
              onClick={() => {
                if (user?._id === article?.articleAuthorId) {
                  navigate('/dashboard/profile');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                  getOtherUserProfile(article?.articleAuthorId);
                  getUserArticlesById(article?.articleAuthorId);
                  return;
                }
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                getOtherUserProfile(article?.articleAuthorId);
                getUserArticlesById(article?.articleAuthorId);

                navigate(`/users/${article?.articleAuthorId}`);
              }}
              className='flex justify-between cursor-pointer items-center py-[1rem] px-[1rem]'
            >
              <div className='flex gap-[0.75rem] items-center'>
                <div className='w-[2.5rem] h-[2.5rem] '>
                  <img
                    className='w-full h-full object-cover rounded-[62.4375rem]'
                    src={article?.authorPic}
                    alt=''
                  />
                </div>
                <div className='flex flex-col gap-[0.13rem]'>
                  <h1 className='text-[#183B56] dark:text-gray-300 sm:text-[1rem] font-openSans text-[0.875rem] font-bold italic'>
                    {article?.author}
                  </h1>
                  {article && article?.verified ? (
                    <div className='flex gap-[0.5rem]'>
                      <img src={verified} alt='' />
                      <p className='text-[#5A7184] sm:text-[0.875rem] text-[0.75rem] font-openSans italic'>
                        Verified
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              <p className='text-[#5A7184] dark:text-[#9ec1dd] sm:text-[1rem] text-[0.875rem] italic font-openSans font-bold leading-[1.25rem]'>
                {moment(article?.createdAt).format('MMM Do YY')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to={'/articles'}
        onClick={() => window.scrollTo(0, 0)}
        className='relative group mt-[2rem] transition-all duration-150 hover:bg-[#1565D8] hover:text-white text-[#1565D8] text-[1rem] font-openSans font-bold border-[#1565D8] border-[3px] rounded-md place-self-center py-[0.56rem] pr-[3.06rem] pl-[1.13rem]'
      >
        More Articles
        <FiArrowRight className='absolute transition-all duration-75 font-bold group-hover:text-white right-[1.25rem] top-[0.8rem] b-[0.69rem]' />
      </Link>
    </section>
  );
};

export default Articles;
