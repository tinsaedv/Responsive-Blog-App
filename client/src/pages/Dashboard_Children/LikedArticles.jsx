import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../App/useUserProfileStore';
import moment from 'moment';
import { useArticleStore } from '../../App/useArticleStore';
import Footer from '../../components/Footer';

const LikedArticles = () => {
  const { userProfile } = useProfileStore((state) => ({
    userProfile: state.userProfile,
  }));

  const navigate = useNavigate();

  const { getArticleById } = useArticleStore((state) => ({
    getArticleById: state.getArticleById,
  }));

  let slicedArticles = userProfile?.likedArticles;

  slicedArticles = userProfile?.likedArticles.map((article) => {
    if (article.summary.length > 90) {
      return { ...article, summary: article.summary.substring(0, 65) + '...' };
    }
    return article;
  });

  return (
    <main className=' flex flex-col justify-center items-center w-full  relative bg-gray-100 rounded-md'>
      <div>
        <div className='lg:mx-[10rem]'>
          <p className='font-Roboto w-full font-semibold text-[1.5rem] mb-5 text-center'>
            Articles you liked
          </p>
          {Array.isArray(userProfile) &&
          userProfile?.likedArticles.length === 0 ? (
            <div className='text-center'>
              Seems like you have not liked any article!
            </div>
          ) : (
            <div className='grid mx-[.5rem]  gap-5 w-full  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  place-items-center'>
              {slicedArticles &&
                slicedArticles?.map((article) => (
                  <div
                    key={article?._id}
                    className=' w-[15rem] overflow-hidden  rounded-[0.75rem] shadow-md'
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
                        <h1 className='text-[1.3rem] font-Roboto font-bold leading-[1.5rem] mt-[1rem] lg:mt-[1.94rem] mb-[0.7rem]'>
                          {article?.title}
                        </h1>
                        <p className='text-[#5A7184] sm:text-[1rem] min-w-[90%]  font-openSans text-[0.875rem] mb-[1.5rem] leading-[1.5rem]'>
                          {article?.summary}
                        </p>
                        <p className='text-[#5A7184] py-2 text-end sm:text-[1rem] text-[0.875rem] italic font-openSans font-bold leading-[1.25rem]'>
                          {moment(article?.createdAt).format('MMM Do YY')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default LikedArticles;
