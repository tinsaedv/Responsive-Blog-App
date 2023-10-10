import ThumbnailUploadInput from '../../components/Image Upload/ThumbnailUploadInput';
import { useArticleStore } from '../../App/useArticleStore';
import Tags from '../../components/Dashboard/Tags';
import PostArticleForm from '../../components/Dashboard/PostArticleForm.component';
import PostArticleQuill from '../../components/Dashboard/PostArticleQuill.component';

const PostArticle = () => {
  const { postArticle } = useArticleStore((state) => ({
    postArticle: state.postArticle,
  }));

  function handleOnSubmit() {
    postArticle();
  }

  return (
    <main className=' flex flex-col justify-center items-center lg:ml-[5rem]  p-3 rounded-md'>
      {/* post article form component */}
      <PostArticleForm />
      {/* post article Text editor */}
      <PostArticleQuill />
      <Tags />
      <ThumbnailUploadInput />
      <button
        className='bg-blue-600 px-4 py-2 mx-[30rem] rounded-md text-white'
        onClick={handleOnSubmit}
      >
        Post
      </button>
    </main>
  );
};

export default PostArticle;
