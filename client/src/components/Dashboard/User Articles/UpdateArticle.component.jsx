import { useArticleStore } from '../../../App/useArticleStore';
import UpdateArticleQuill from './UpdateArticleQuill.component';
import UpdateTags from './UpdateTags';
import UpdateArticleForm from './UpdateArticleForm.component';
import Footer from '../../Footer';
import ThumbnailUploadInput from '../../Image Upload/ThumbnailUploadInput';

const UpdateArticle = () => {
  const { updateArticle, articleId } = useArticleStore((state) => ({
    updateArticle: state.updateArticle,
    articleId: state.articleId,
  }));

  function handleOnSubmit() {
    updateArticle(articleId);
  }

  return (
    <main className=' flex flex-col justify-center items-center lg:ml-[5rem]  bg-gray-100 p-3 rounded-md'>
      <UpdateArticleForm />
      {/* post article Text editor */}
      <UpdateArticleQuill />

      <UpdateTags />

      {/* post article form component */}

      <ThumbnailUploadInput />
      <button
        className='bg-blue-600 px-4 py-2 mx-[30rem] rounded-md text-white'
        onClick={handleOnSubmit}
      >
        Update
      </button>
      <Footer />
    </main>
  );
};

export default UpdateArticle;
