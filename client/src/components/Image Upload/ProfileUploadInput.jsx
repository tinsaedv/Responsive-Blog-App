import { FiUpload } from 'react-icons/fi';

import { useProfilePictureStore } from '../../App/useUserProfileStore';

function ProfileUploadInput() {
  const { setProfilePictureUrl } = useProfilePictureStore((state) => ({
    setProfilePictureUrl: state.setProfilePictureUrl,
  }));

  function handleImageInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setProfilePictureUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <label
        htmlFor='dropzone-file'
        className='flex flex-col cursor-pointer justify-center w-[10rem] h-64 bg-[#222222]/40 '
      >
        <FiUpload className='w-full text-white' size={40} />
        <input
          onChange={handleImageInput}
          id='dropzone-file'
          type='file'
          className='hidden'
        />
      </label>
    </div>
  );
}

export default ProfileUploadInput;
