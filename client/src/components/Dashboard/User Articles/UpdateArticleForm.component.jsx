import { useArticleStore } from '../../../App/useArticleStore';

const UpdateArticleForm = () => {
  const {
    setUpdateTitle,
    setUpdateSummary,
    setUpdateCategory,
    updateTitle,
    updateSummary,
    updateCategory,
  } = useArticleStore((state) => ({
    setUpdateTitle: state.setUpdateTitle,
    setUpdateSummary: state.setUpdateSummary,
    setUpdateCategory: state.setUpdateCategory,
    updateTitle: state.updateTitle,
    updateSummary: state.updateSummary,
    updateCategory: state.updateCategory,
  }));

  return (
    <form className='flex min-w-[80%] justify-center flex-col mx-[10rem] mb-[2rem] gap-3'>
      <label>Title:</label>
      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        value={updateTitle}
        onChange={(e) => setUpdateTitle(e.target.value)}
        placeholder='Enter article title'
      />
      <label>Summary:</label>
      <input
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        type='text'
        value={updateSummary}
        onChange={(e) => setUpdateSummary(e.target.value)}
        placeholder='Enter article summary'
      />
      <label>Category:</label>
      <select
        className='dark:text-gray-600 w-full  outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        value={updateCategory}
        name='category'
        onChange={(e) => setUpdateCategory(e.target.value)}
      >
        <option value=''>--Select Category--</option>
        <option value='Finance'>Finance</option>
        <option value='Art'>Art</option>
        <option value='Technology'>Technology</option>
        <option value='Health'>Health</option>
        <option value='Business'>Business</option>
        <option value='Programming'>Programming</option>
        <option value='Gaming'>Gaming</option>
        <option value='Fitness'>Fitness</option>
        <option value='DIY'>DIY</option>
        <option value='Music'>Music</option>
        <option value='News'>News</option>
        <option value='Fashion'>Fashion</option>
        <option value='Education'>Education</option>
        <option value='Cooking'>Cooking</option>
      </select>
    </form>
  );
};

export default UpdateArticleForm;
