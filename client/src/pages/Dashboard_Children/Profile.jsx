import { useCallback, useEffect, useState } from 'react';
import { useProfileStore } from '../../App/useUserProfileStore';
import { BiSolidUserCircle, BiSolidPencil } from 'react-icons/bi';
import verified from '../../assets/Icons/Icon.svg';

import UploadInput from '../../components/Image Upload/ProfileUploadInput';

import { useArticleStore } from '../../App/useArticleStore';
import EditProfile from '../../components/Profile/EditProfile.component';
import UserSocialLinks from '../../components/Profile/UserSocialLinks.component';
import ProfileRecentArticles from '../../components/Profile/ProfileRecentArticles.component';

const Profile = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [editIsClicked, setEditIsClicked] = useState(false);
  const { userProfile, getProfileInfoValue } = useProfileStore((state) => ({
    userProfile: state.userProfile,
    getProfileInfoValue: state.getProfileInfoValue,
  }));

  const { userArticles, getUserArticlesById } = useArticleStore((state) => ({
    userArticles: state.userArticles,
    getUserArticlesById: state.getUserArticlesById,
  }));

  useEffect(() => {
    getUserArticlesById(userProfile?._id);
  }, [userProfile, getUserArticlesById]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  //function to format number for follower, following and article count
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
    <main className='flex mt-5 sm:mt-0 lg:ml-[9%] justify-center flex-col gap-5 dark:bg-gray-800'>
      <div className=' flex lg:mx-[15%]  gap-5 justify-center items-center flex-col lg:flex-row'>
        <div className='flex sm:w-[80%] sm:min-w-[25rem] p-2   rounded-2xl backdrop-blur-sm   shadow-xl bg-gray-200 dark:bg-gray-600   flex-col items-center justify-center'>
          <BiSolidPencil
            onClick={() => {
              setEditIsClicked(!editIsClicked);
              getProfileInfoValue();
            }}
            className='self-end text-[1.5rem] shadow-lg cursor-pointer rounded-lg '
          />
          {userProfile && userProfile.profilePicture !== '' ? (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className='w-[160px]  relative h-[160px] rounded-full overflow-hidden'
            >
              {' '}
              <img
                className='w-full h-full object-cover'
                src={userProfile?.profilePicture}
                alt=''
              />
              {isHovered && (
                <div className='absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out'>
                  <UploadInput className='text-white text-2xl bg-gray-900 p-2 rounded-full opacity-0 hover:opacity-100' />
                </div>
              )}
            </div>
          ) : (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className='w-[160px] transition-all ease-in duration-150  relative h-[160px] rounded-full overflow-hidden'
            >
              {' '}
              <BiSolidUserCircle
                size={60}
                className='text-black h-full w-full'
              />
              {isHovered && (
                <div className='absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out'>
                  <UploadInput className='text-white text-2xl bg-gray-900 p-2 rounded-full opacity-0 hover:opacity-100' />
                </div>
              )}
            </div>
          )}
          <div className='relative'>
            {' '}
            <p className='mb-1 text-2xl md:text-4xl tracking-tight font-extrabold text-center dark:text-gray-100 '>
              {userProfile && userProfile?.name}
            </p>
            {/* Author profession */}
            {userProfile && userProfile?.profession && (
              <p className='mb-5 text-xl md:text-2xl tracking-tight font-bold text-center text-gray-500 dark:text-gray-400'>
                {userProfile?.profession}
              </p>
            )}
            {userProfile && userProfile?.stats?.verified ? (
              <div className='flex gap-[0.5rem] absolute top-0 right-[-5rem]'>
                <img src={verified} alt='' />
                <p className='text-[#5A7184] sm:text-[0.875rem] text-[0.75rem] font-openSans italic'>
                  Verified
                </p>
              </div>
            ) : null}
          </div>

          <div className='w-[70%]'>
            {/* Author bio */}
            {userProfile?.bio && (
              <p className='gap-3 dark:text-gray-300  items-center italic font-medium text-gray-600  my-3'>
                &quot;{userProfile?.bio}&quot;
              </p>
            )}
          </div>

          <div className='flex gap-5'>
            <p className='font-openSans dark:text-gray-300 font-semibold'>
              Followers: {formatCount(userProfile?.stats?.followersCount)}
            </p>
            <p className='font-openSans dark:text-gray-300 font-semibold'>
              Following: {formatCount(userProfile?.stats?.followingCount)}
            </p>
            <p className='font-openSans dark:text-gray-300 font-semibold'>
              Articles: {formatCount(userProfile?.stats?.articlesCount)}
            </p>
          </div>
          <p className='mt-[1rem] font-openSans dark:text-gray-100 font-semibold italic text-[1rem]'>
            Follow me on social media!
          </p>

          {/* This is current users social link component */}
          <UserSocialLinks />
        </div>
        <EditProfile
          editIsClicked={editIsClicked}
          setEditIsClicked={setEditIsClicked}
        />
      </div>
      <div className=' flex my-10   gap-5 justify-center items-center flex-col md:flex-row'>
        {userArticles && userArticles.length >= 1 ? (
          <ProfileRecentArticles />
        ) : (
          <div>You have not posted any Articles</div>
        )}
      </div>
    </main>
  );
};

export default Profile;
