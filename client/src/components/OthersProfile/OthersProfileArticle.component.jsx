import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';
import { useArticleStore } from '../../App/useArticleStore';
import { useEffect } from 'react';
import verified from '../../assets/Icons/Icon.svg';
const OthersProfileArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getArticleById, userArticles, getUserArticlesById } = useArticleStore(
    (state) => ({
      getArticleById: state.getArticleById,
      userArticles: state.userArticles,
      getUserArticlesById: state.getUserArticlesById,
    })
  );

  useEffect(() => {
    getUserArticlesById(id);
  }, [id, getUserArticlesById]);

  let slicedArticles = userArticles;

  slicedArticles = userArticles.map((article) => {
    if (article.summary.length > 90) {
      return { ...article, summary: article.summary.substring(0, 65) + '...' };
    }
    return article;
  });

  return (
    <main>
      <div className='mt-[3.69rem] min-w-[23rem]'>
        {userArticles && (
          <div className='mx-[1.5rem]  px-[1.06rem]  py-[1.13rem] shadow-xl rounded-lg'>
            <h1 className='mb-[1.25rem] text-center  text-[#0D2436] font-Roboto text-[1.5rem] font-semibold'>
              Articles written by this Author
            </h1>
            <div className='grid mx-[1rem] gap-7  lg:max-w-full lg:min-w-[60rem]   grid-cols-1 sm:grid-cols-2  lg:grid-cols-3  xl:mx-10 place-items-center'>
              {slicedArticles &&
                slicedArticles?.map((article) => (
                  <div
                    key={article?._id}
                    className='max-w-xs min-w-[18rem] sm:min-w-[19rem] overflow-hidden  rounded-[0.75rem] shadow-md'
                  >
                    <div
                      className='cursor-pointer'
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        });
                        navigate(`/article/get/${article?._id}`);
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
                        <h1 className='text-[1.25rem] sm:text-[1.5rem] lg:text-[1.75rem] font-Roboto font-bold leading-[1.5rem] mt-[1rem] lg:mt-[1.94rem] mb-[0.7rem]'>
                          {article?.title}
                        </h1>
                        <p className='text-[#5A7184] sm:text-[1rem] font-openSans text-[0.875rem] mb-[1.5rem] leading-[1.5rem]'>
                          {article?.summary}
                        </p>
                      </div>
                    </div>
                    <div className='flex justify-between items-center py-[1rem] px-[1rem]'>
                      <div className='flex gap-[0.75rem] items-center'>
                        <div>
                          <img
                            className='w-[2.5rem] h-[2.5rem] rounded-[62.4375rem]'
                            src={article?.authorPic}
                            alt=''
                          />
                        </div>
                        <div className='flex flex-col gap-[0.13rem]'>
                          <h1 className='text-[#183B56] sm:text-[1rem] font-openSans text-[0.875rem] font-bold italic'>
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
                      <p className='text-[#5A7184] sm:text-[1rem] text-[0.875rem] italic font-openSans font-bold leading-[1.25rem]'>
                        {moment(article?.createdAt).format('MMM Do YY')}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OthersProfileArticle;
