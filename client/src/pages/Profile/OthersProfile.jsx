import { useProfileStore } from '../../App/useUserProfileStore';
import { BiSolidUserCircle } from 'react-icons/bi';
import { TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FaInstagram } from 'react-icons/fa';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';
import verified from '../../assets/Icons/Icon.svg';

import OthersProfileArticle from '../../components/OthersProfile/OthersProfileArticle.component';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../../App/useAuthStore';

const OthersProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { otherUserProfile, getOtherUserProfile, followAuthor } =
    useProfileStore((state) => ({
      otherUserProfile: state.otherUserProfile,
      getOtherUserProfile: state.getOtherUserProfile,
      followAuthor: state.followAuthor,
    }));

  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const alreadyFollowed =
    user && otherUserProfile?.followers.includes(user?._id);

  useEffect(() => {
    getOtherUserProfile(id);
  }, [getOtherUserProfile, id]);

  const socialsUnavailable =
    otherUserProfile?.socials?.facebook !== '' ||
    otherUserProfile?.socials?.instagram !== '' ||
    otherUserProfile?.socials?.twitter !== '' ||
    otherUserProfile?.socials?.github !== '' ||
    otherUserProfile?.socials?.linkedIn !== '';

  function formatCount(num) {
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'k';
    } else {
      return num;
    }
  }

  return (
    <main className=' flex  justify-center  items-center flex-col '>
      <div className='flex sm:w-[80%] sm:min-w-[25rem] p-2   rounded-2xl backdrop-blur-sm  shadow-xl  bg-gray-200 dark:bg-gray-600    flex-col items-center justify-center'>
        {/* Author profile picture */}
        {otherUserProfile && otherUserProfile.profilePicture !== '' ? (
          <div className='w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden'>
            {' '}
            <img
              className='w-full h-full object-cover'
              src={otherUserProfile?.profilePicture}
              alt=''
            />
          </div>
        ) : (
          <BiSolidUserCircle size={60} className='text-black' />
        )}
        <div className='relative'>
          {/* Author name */}
          <p className='mb-1 text-2xl md:text-4xl dark:text-gray-300  tracking-tight font-extrabold text-center text-gray-900 '>
            {otherUserProfile?.name}
          </p>

          {/* Author profession */}
          {otherUserProfile && otherUserProfile?.profession && (
            <p className='mb-5 text-xl md:text-2xl tracking-tight font-bold text-center text-gray-500 dark:text-gray-400'>
              {otherUserProfile?.profession}
            </p>
          )}

          {/* Author verified check */}
          {otherUserProfile && otherUserProfile?.stats?.verified ? (
            <div className='flex gap-[0.5rem] absolute top-0 right-[-5rem]'>
              <img src={verified} alt='' />
              <p className='text-[#5A7184] dark:text-gray-300  sm:text-[0.875rem] text-[0.75rem] font-openSans italic'>
                Verified
              </p>
            </div>
          ) : null}
        </div>

        <div className='w-[70%]'>
          {/* Author bio */}
          {otherUserProfile?.bio && (
            <p className='gap-3 dark:text-gray-300  items-center italic font-medium text-gray-600  my-3'>
              &quot;{otherUserProfile?.bio}&quot;
            </p>
          )}
        </div>

        {/* Author stats */}

        <div className='flex gap-5'>
          <p className='font-openSans dark:text-gray-300  font-semibold'>
            Followers: {formatCount(otherUserProfile?.stats?.followersCount)}
          </p>
          <p className='font-openSans dark:text-gray-300  font-semibold'>
            Following: {formatCount(otherUserProfile?.stats?.followingCount)}
          </p>
          <p className='font-openSans dark:text-gray-300  font-semibold'>
            Articles: {formatCount(otherUserProfile?.stats?.articlesCount)}
          </p>
        </div>

        {/* Author social media presence */}
        {socialsUnavailable && (
          <p className='mt-[1rem] font-openSans font-semibold italic text-[1rem]'>
            Follow me on social media!
          </p>
        )}
        <div className='flex gap-5 mt-[1rem]'>
          {otherUserProfile && socialsUnavailable ? (
            <a
              href={otherUserProfile?.socials?.facebook}
              className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-[#3179C2]'
            >
              <TiSocialFacebook
                size={30}
                className='text-white object-cover '
              />
            </a>
          ) : null}
          {otherUserProfile && socialsUnavailable ? (
            <a
              href={otherUserProfile?.socials?.twitter}
              className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#2CA2FC] to-[#258AD7]'
            >
              <TiSocialTwitter size={30} className='text-white object-cover ' />
            </a>
          ) : null}
          {otherUserProfile && socialsUnavailable ? (
            <a
              href={otherUserProfile?.socials?.instagram}
              className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#E33F78] to-[#625CDE]'
            >
              <FaInstagram size={30} className='text-white object-cover ' />
            </a>
          ) : null}
          {otherUserProfile && socialsUnavailable ? (
            <a
              href={otherUserProfile?.socials?.github}
              className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-black'
            >
              <AiFillGithub size={30} className='text-white object-cover ' />
            </a>
          ) : null}
          {otherUserProfile && socialsUnavailable ? (
            <a
              href={otherUserProfile?.socials?.linkedIn}
              className='w-10 h-10  flex items-center border-none justify-center overflow-hidden bg-white'
            >
              <AiFillLinkedin size={60} className='text-blue-400 ' />
            </a>
          ) : null}
        </div>

        {/* Follow author implementation */}
        <button
          onClick={() => {
            if (!user) {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              return navigate('/login');
            }
            followAuthor(otherUserProfile?._id);
          }}
          className={`${
            alreadyFollowed ? 'bg-gray-700 ' : 'bg-blue-500'
          } px-8 py-2 rounded-md my-4 text-white`}
        >
          {alreadyFollowed ? 'Unfollow' : 'Follow'}
        </button>
      </div>

      {/* Display Author articles component  */}
      <OthersProfileArticle />
    </main>
  );
};

export default OthersProfile;
