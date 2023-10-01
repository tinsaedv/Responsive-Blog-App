import React, { useEffect, useState } from 'react';
import verified from '../../assets/Icons/Icon.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useArticleStore } from '../../App/useArticleStore';
import moment from 'moment';
import CategoryButtons from '../../components/AllArticles/CategoryButtons.component';
import InputSearch from '../../components/Home/InputSearch.Component';
import { useUserStore } from '../../App/useAuthStore';
import { useProfileStore } from '../../App/useUserProfileStore';

const AllArticles = () => {
  const navigate = useNavigate();
  const {
    articles,
    getArticles,
    getArticleById,
    searchQuery,
    getUserArticlesById,
  } = useArticleStore((state) => ({
    articles: state.articles,
    getArticles: state.getArticles,
    getArticleById: state.getArticleById,
    searchQuery: state.searchQuery,
    getUserArticlesById: state.getUserArticlesById,
  }));

  const { getOtherUserProfile } = useProfileStore((state) => ({
    getOtherUserProfile: state.getOtherUserProfile,
  }));
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  let [items, setItems] = useState(articles);

  useEffect(() => {
    if (searchQuery === '') {
      getArticles();
    }
  }, [searchQuery, getArticles]);

  useEffect(() => {
    setItems(articles);
  }, [articles]);

  //to get the  category from article
  const menuItems = [...new Set(articles.map((article) => article.category))];

  function filteredItems(category) {
    let newItems = articles.filter((article) => article.category === category);

    newItems = newItems.map((article) => {
      if (article?.summary.length > 65) {
        return {
          ...article,
          summary: article?.summary.substring(0, 65) + '...',
        };
      }

      if (article?.author.length > 15) {
        return { ...article, author: article?.author.substring(0, 15) + '...' };
      }

      return article;
    });

    setItems(newItems);
  }

  //map through items array and truncate the summary string in each articles and add "..." at the end if the length is > 90 characters
  items = items.map((article) => {
    if (article?.summary.length > 90) {
      return { ...article, summary: article?.summary.substring(0, 65) + '...' };
    }
    if (article?.author.length > 15) {
      return { ...article, author: article?.author.substring(0, 15) + '...' };
    }
    return article;
  });

  return (
    <main>
      <section className='flex ml-10' aria-label='Breadcrumb'>
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
        </ol>
      </section>
      <section className='mx-[10%] my-10'>
        {' '}
        <InputSearch />
        {/* This is category buttons from  AllArticles component*/}
        <CategoryButtons
          filteredItems={filteredItems}
          menuItems={menuItems}
          setItems={setItems}
        />
      </section>
      <div className='grid place-items-center'>
        {/* used input search from home component */}

        <div className='grid mx-[1rem] gap-7  lg:max-w-full lg:min-w-[60rem]   grid-cols-1 sm:grid-cols-2  lg:grid-cols-3  xl:mx-10 place-items-center'>
          {items?.map((article) => (
            <div
              key={article?._id}
              className='max-w-xs min-w-[18rem] dark:bg-slate-700 sm:min-w-[19rem] overflow-hidden  rounded-[0.75rem] shadow-md'
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
      </div>
      <div>{/* <LoadMore /> */}</div>
    </main>
  );
};

export default React.memo(AllArticles);
