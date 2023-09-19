import ThumbnailUploadInput from '../../components/Image Upload/ThumbnailUploadInput';
import { useArticleStore } from '../../App/useArticleStore';
import Tags from '../../components/Dashboard/Tags';
import PostArticleForm from '../../components/Dashboard/PostArticleForm.component';

import Footer from '../../components/Footer';
import PostArticleQuill from '../../components/Dashboard/PostArticleQuill.component';

const PostArticle = () => {
  const { postArticle, summary } = useArticleStore((state) => ({
    summary: state.summary,
    postArticle: state.postArticle,
  }));

  function handleOnSubmit() {
    postArticle();
  }

  console.log('summary', summary);
  return (
    <main className=' flex flex-col justify-center items-center lg:ml-[5rem]  bg-gray-100 p-3 rounded-md'>
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
      <Footer />
    </main>
  );
};

export default PostArticle;
