import { FiUpload } from 'react-icons/fi';

import { useArticleStore } from '../../App/useArticleStore';

function ThumbnailUploadInput() {
  const { thumbnail, setThumbnail } = useArticleStore((state) => ({
    thumbnail: state.thumbnail,
    setThumbnail: state.setThumbnail,
  }));

  function handleImageInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setThumbnail(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className='flex items-center justify-center  w-full h-full my-[2rem]'>
      <label
        htmlFor='dropzone-file'
        className='flex flex-col items-center justify-center min-w-[60%] h-[20rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
      >
        <p>Click below to add Thumbnail</p>
        {thumbnail ? (
          <div className='w-full h-full relative'>
            <img
              className='w-full h-full object-cover'
              src={thumbnail}
              alt=''
            />
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
            <svg
              aria-hidden='true'
              className='w-10 h-10 mb-3 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              ></path>
            </svg>
            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold'>Click to upload</span> or drag and
              drop
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
        )}
        <input
          onChange={handleImageInput}
          id='dropzone-file'
          type='file'
          className='hidden'
          multiple
        />
      </label>
    </div>
  );
}

export default ThumbnailUploadInput;
