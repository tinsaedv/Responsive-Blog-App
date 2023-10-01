import { useProfileStore } from '../../App/useUserProfileStore';
import PropTypes from 'prop-types';

const EditProfile = ({ editIsClicked, setEditIsClicked }) => {
  const {
    setSocialInfos,
    updateUserSocials,

    userProfile,
    setName,
    setBio,
    setProfession,
    nameValue,
    bioValue,
    facebookValue,
    twitterValue,
    instagramValue,
    githubValue,
    linkedInValue,
    professionValue,
  } = useProfileStore((state) => ({
    setSocialInfos: state.setSocialInfos,
    updateUserSocials: state.updateUserSocials,

    userProfile: state.userProfile,
    setName: state.setName,
    setBio: state.setBio,
    setProfession: state.setProfession,
    nameValue: state.nameValue,
    bioValue: state.bioValue,
    facebookValue: state.facebookValue,
    twitterValue: state.twitterValue,
    instagramValue: state.instagramValue,
    githubValue: state.githubValue,
    linkedInValue: state.linkedInValue,
    professionValue: state.professionValue,
  }));

  function handleOnSubmit(e) {
    e.preventDefault();
    updateUserSocials(userProfile?._id);
    setEditIsClicked(false);
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setSocialInfos(name, value);
  }

  return (
    <form
      className={`${
        editIsClicked ? 'block' : 'hidden'
      } relative flex flex-col p-5 rounded-md shadow-md lg:min-w-[50%] w-[90%] bg-gray-50 dark:bg-gray-700 sm:w-[70%]  md:w-[60%] top-[3rem]`}
    >
      <label>Username:</label>
      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='name'
        defaultValue={nameValue}
        onChange={(e) => setName(e.target.value)}
        placeholder='Type your name here'
      />

      <label>Bio:</label>

      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='bio'
        defaultValue={bioValue}
        onChange={(e) => setBio(e.target.value)}
        placeholder='Type your bio here'
      />

      <label>Profession:</label>

      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='bio'
        defaultValue={professionValue}
        onChange={(e) => setProfession(e.target.value)}
        placeholder='Type your Profession here'
      />
      <label>Facebook:</label>

      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='facebook'
        defaultValue={facebookValue}
        onChange={handleOnChange}
        placeholder='https://www.facebook.com/username'
      />
      <label>Twitter:</label>

      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='twitter'
        defaultValue={twitterValue}
        onChange={handleOnChange}
        placeholder='https://www.twitter.com/username'
      />
      <label>Instagram:</label>

      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='instagram'
        defaultValue={instagramValue}
        onChange={handleOnChange}
        placeholder='https://www.instagram.com/username'
      />
      <label>Github:</label>

      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='github'
        defaultValue={githubValue}
        onChange={handleOnChange}
        placeholder='https://www.github.com/username'
      />
      <label>LinkedIn:</label>

      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        name='linkedIn'
        defaultValue={linkedInValue}
        onChange={handleOnChange}
        placeholder='https://www.linkedIn.com/username'
      />
      <div className='flex justify-evenly mt-4'>
        <button
          onClick={handleOnSubmit}
          className='bg-blue-600 py-2 px-4 rounded-md text-white'
        >
          Save
        </button>
        <button
          type='button'
          onClick={() => {
            setEditIsClicked(false);
            //to scroll to top when cancel button is pressed
            window.scrollTo({
              top: 0,
              behavior: 'smooth', // smooth scrolling animation
            });
          }}
          className='bg-gray-600 py-2 px-4 rounded-md text-white'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

EditProfile.propTypes = {
  editIsClicked: PropTypes.bool.isRequired,
  setEditIsClicked: PropTypes.func.isRequired,
};

export default EditProfile;
