import { useArticleStore } from '../../App/useArticleStore';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
const RecentArticles = () => {
  const navigate = useNavigate();

  const { articles, getArticleById } = useArticleStore((state) => ({
    articles: state.articles,
    getArticleById: state.getArticleById,
  }));

  let slicedArticle = articles;

  if (Array.isArray(articles) && articles.length > 5) {
    slicedArticle = articles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }

  return (
    <div className='mt-[3.69rem] min-w-[23rem]'>
      <div className='mx-[1.5rem] dark:bg-gray-600  px-[1.06rem]  py-[1.13rem] shadow-xl rounded-lg'>
        <h1 className='mb-[1.25rem] text-[#0D2436] dark:text-white  font-Roboto text-[1rem] font-medium'>
          Latest Articles
        </h1>

        <div className='flex gap-[1.6rem] flex-wrap'>
          {slicedArticle &&
            slicedArticle.map((article) => (
              <div
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                  navigate(`/article/${article?._id}`);
                  getArticleById(article?._id);
                }}
                key={article._id}
                className='flex gap-3 dark:bg-slate-700 p-2 rounded-md'
              >
                <div className='sm:w-[5rem] sm:h-[5rem] w-[3.5625rem] bg-slate-400 h-[3.6875rem] rounded-[0.75rem] overflow-hidden'>
                  <img
                    className='object-cover w-full h-full cursor-pointer'
                    src={article?.thumbnail}
                    alt='thumbnail'
                  />
                </div>

                <div className='cursor-pointer'>
                  <h1 className='text-[#0D2436] dark:text-gray-300 mb-[0.51rem] font-Roboto sm:text-[1rem] text-[0.875rem] font-medium'>
                    {article?.title}
                  </h1>
                  <p className='font-openSans text-[0.625rem] font-light'>
                    {moment(article?.createdAt).format('ll')}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* <h1 className='mb-[1.25rem] mt-[1.84rem] dark:text-white  text-[#0D2436] font-Roboto text-[1rem] font-medium'>
          Tags
        </h1>

        <div className='flex flex-wrap gap-[0.75rem] '>
          <button className='px-[0.75rem] sm:text-[0.875rem] sm:py-[0.6rem] sm:px-[0.9rem] py-[0.44rem] font-Roboto text-[0.625rem] text-[white] rounded-md bg-[#1565D8]'>
            Medical
          </button>
          <button className='px-[0.75rem] sm:text-[0.875rem] sm:py-[0.6rem] sm:px-[0.9rem] py-[0.44rem] font-Roboto text-[0.625rem] text-[white] rounded-md bg-[#1565D8]'>
            Lifestyle
          </button>
          <button className='px-[0.75rem] sm:text-[0.875rem] sm:py-[0.6rem] sm:px-[0.9rem] py-[0.44rem] font-Roboto text-[0.625rem] text-[white] rounded-md bg-[#1565D8]'>
            Learn
          </button>
          <button className='px-[0.75rem] sm:text-[0.875rem] sm:py-[0.6rem] sm:px-[0.9rem] py-[0.44rem] font-Roboto text-[0.625rem] text-[white] rounded-md bg-[#1565D8]'>
            Healthy
          </button>
          <button className='px-[0.75rem] sm:text-[0.875rem] sm:py-[0.6rem] sm:px-[0.9rem] py-[0.44rem] font-Roboto text-[0.625rem] text-[white] rounded-md bg-[#1565D8]'>
            Food
          </button>
          <button className='px-[0.75rem] sm:text-[0.875rem] sm:py-[0.6rem] sm:px-[0.9rem] py-[0.44rem] font-Roboto text-[0.625rem] text-[white] rounded-md bg-[#1565D8]'>
            Diet
          </button>
          <button className='px-[0.75rem] sm:text-[0.875rem] sm:py-[0.6rem] sm:px-[0.9rem] py-[0.44rem] font-Roboto text-[0.625rem] text-[white] rounded-md bg-[#1565D8]'>
            Education
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default RecentArticles;
