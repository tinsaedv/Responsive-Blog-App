import { TiSocialFacebook, TiSocialTwitter } from 'react-icons/ti';
import { FaInstagram } from 'react-icons/fa';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';
import { useProfileStore } from '../../App/useUserProfileStore';

const UserSocialLinks = () => {
  const { userProfile } = useProfileStore((state) => ({
    userProfile: state.userProfile,
  }));
  return (
    <div className='flex gap-5 mt-[1rem]'>
      {userProfile && userProfile?.socials?.facebook !== '' ? (
        <a
          target='_blank'
          rel='noreferrer'
          href={userProfile?.socials?.facebook}
          className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-[#3179C2]'
        >
          <TiSocialFacebook size={30} className='text-white object-cover ' />
        </a>
      ) : null}
      {userProfile && userProfile?.socials?.twitter !== '' ? (
        <a
          target='_blank'
          rel='noreferrer'
          href={userProfile?.socials?.twitter}
          className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#2CA2FC] to-[#258AD7]'
        >
          <TiSocialTwitter size={30} className='text-white object-cover ' />
        </a>
      ) : null}
      {userProfile && userProfile?.socials?.instagram !== '' ? (
        <a
          target='_blank'
          rel='noreferrer'
          href={userProfile?.socials?.instagram}
          className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#E33F78] to-[#625CDE]'
        >
          <FaInstagram size={30} className='text-white object-cover ' />
        </a>
      ) : null}
      {userProfile && userProfile?.socials?.github !== '' ? (
        <a
          target='_blank'
          rel='noreferrer'
          href={userProfile?.socials?.github}
          className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-black'
        >
          <AiFillGithub size={30} className='text-white object-cover ' />
        </a>
      ) : null}
      {userProfile && userProfile?.socials?.linkedIn !== '' ? (
        <a
          target='_blank'
          rel='noreferrer'
          href={userProfile?.socials?.linkedIn}
          className='w-10 h-10  flex items-center border-none justify-center overflow-hidden bg-white'
        >
          <AiFillLinkedin size={60} className='text-blue-400 ' />
        </a>
      ) : null}
    </div>
  );
};

export default UserSocialLinks;
