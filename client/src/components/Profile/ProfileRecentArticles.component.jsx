import { Link } from 'react-router-dom';
import { useProfileStore } from '../../App/useUserProfileStore';
import moment from 'moment';
import { useArticleStore } from '../../App/useArticleStore';
import { useUserStore } from '../../App/useAuthStore';

const ProfileRecentArticles = () => {
  const user = useUserStore((state) => state.user);
  const { userProfile } = useProfileStore((state) => ({
    userProfile: state.userProfile,
  }));

  const { getArticleById, userArticles } = useArticleStore((state) => ({
    getArticleById: state.getArticleById,
    userArticles: state.userArticles,
  }));

  let slicedArticle = userArticles;

  if (Array.isArray(userArticles) && userArticles.length > 6) {
    slicedArticle = userArticles.slice(0, 6);
  }

  return (
    <main>
      <div className='mt-[3.69rem] min-w-[25rem] mx-[5%]'>
        <div className='mx-[10%]  px-[1.06rem]  py-[1.13rem] shadow-xl rounded-lg'>
          <h1 className='mb-[1.25rem] text-[#0D2436] font-Roboto text-[1rem] font-medium'>
            Your Articles
          </h1>
          <div className='flex gap-[1.6rem] mb-5 flex-col flex-wrap md:flex-row'>
            {Array.isArray(slicedArticle) &&
              slicedArticle?.map((post) => (
                <Link
                  to={`/article/get/${post?._id}`}
                  key={post?._id}
                  onClick={() => getArticleById(post?._id)}
                  className='flex gap-3 cursor-pointer'
                >
                  <div className='sm:w-[5rem] sm:h-[5rem] w-[3.5625rem] bg-slate-400 h-[3.6875rem] rounded-[0.75rem] overflow-hidden'>
                    <img
                      className='object-cover w-full h-full'
                      src={post?.thumbnail}
                      alt=''
                    />
                  </div>

                  <div>
                    <h1 className='text-[#0D2436] mb-[0.51rem] font-Roboto sm:text-[1rem] text-[0.875rem] font-medium'>
                      {post?.title}
                    </h1>
                    <p className='font-openSans text-[0.625rem] font-light'>
                      {moment(post?.createdAt).format('MMM Do YY')}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
          {user?._id === userProfile?._id && (
            <Link
              to={'/dashboard/articles'}
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
              className='bg-blue-600 my-5 px-4 py-2 rounded-md text-white'
            >
              View all your articles on dashboard
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfileRecentArticles;
