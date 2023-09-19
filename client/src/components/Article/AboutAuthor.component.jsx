import { useNavigate } from 'react-router-dom';
import { useArticleStore } from '../../App/useArticleStore';
import { useProfileStore } from '../../App/useUserProfileStore';
import { useUserStore } from '../../App/useAuthStore';

const AboutAuthor = () => {
  const { article, getUserArticles } = useArticleStore((state) => ({
    article: state.article,
    getUserArticles: state.getUserArticles,
  }));

  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const navigate = useNavigate();

  const { setOtherUserProfile } = useProfileStore((state) => ({
    setOtherUserProfile: state.setOtherUserProfile,
  }));

  return (
    <section className='bg-gray-100 w-[80%] rounded-2xl p-10 mt-10 place-self-center'>
      {article && (
        <div
          onClick={() => {
            if (user?._id === article?.articleAuthorId) {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              return navigate(`/dashboard/profile`);
            }
            navigate(`/users/${article?.articleAuthorId}`);
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
            setOtherUserProfile(article?.articleAuthorId);
            getUserArticles(article?.articleAuthorId);
          }}
          className='flex sm:flex-row text-center cursor-pointer sm:text-start flex-col items-center gap-5  '
        >
          <div className='w-[6rem] sm:w-[7rem]  h-[6rem]  rounded-full overflow-hidden'>
            <img
              className='w-full h-full object-cover'
              src={article?.authorPic}
              alt=''
            />
          </div>

          <div className=' overflow-auto w-[90%] h-[90%] flex flex-col'>
            <h1 className='font-Roboto relative text-4xl font-bold my-1'>
              {article?.author}
            </h1>

            {article?.authorProfession && (
              <p className='font-openSans text-[1.2rem] mb-5 text-gray-400'>
                {article?.authorProfession}
              </p>
            )}

            {article?.socials && (
              <p className='font-openSans  text-gray-500'>{article?.socials}</p>
            )}

            {article?.authorBio && (
              <p className='font-openSans text-gray-600 font-light'>
                &quot;{article?.authorBio}&quot;
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutAuthor;
