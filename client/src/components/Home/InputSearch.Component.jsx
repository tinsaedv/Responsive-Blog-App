import { ImSearch } from 'react-icons/im';
import { useArticleStore } from '../../App/useArticleStore';
const InputSearch = () => {
  const { getArticles, setSearchQuery } = useArticleStore((state) => ({
    getArticles: state.getArticles,
    setSearchQuery: state.setSearchQuery,
  }));
  function handleOnChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleOnClick() {
    getArticles();
  }

  return (
    <div className='relative mx-[20%] h-[3rem] sm:h-[3.5rem] mb-[1rem] rounded-md shadow-md overflow-hidden'>
      <ImSearch className='absolute sm:top-[1.4rem] top-[1rem] left-[1.06rem] text-[#959EAD]' />
      <input
        onChange={handleOnChange}
        onKeyDown={(e) => e.key === 'Enter' && getArticles()}
        type='text'
        placeholder='Search article'
        className='w-full sm:h-full outline-none pl-[2.75rem] py-[0.81rem] italic placeholder:italic font-bold text-[#959EAD]'
      />
      <button
        onClick={handleOnClick}
        className='absolute bg-[#1565D8] sm:top-[0.5rem] sm:block hidden top-[.21rem] right-[.5rem] rounded-md font-bold text-white w-[5.875rem] h-[2.5rem]'
      >
        Search
      </button>
    </div>
  );
};

export default InputSearch;
