import frontPic from '../assets/LIve Chat.png';
import Articles from '../components/Home/HomeArticles.component';
import InputSearch from '../components/Home/InputSearch.Component';
import { useArticleStore } from '../App/useArticleStore';
import { useEffect } from 'react';

const Home = () => {
  const { searchQuery, getArticles } = useArticleStore((state) => ({
    searchQuery: state.searchQuery,
    getArticles: state.getArticles,
  }));

  useEffect(() => {
    if (searchQuery === '') {
      getArticles();
    }
  }, [searchQuery, getArticles]);

  return (
    <main className='relative '>
      <section className='flex items-center justify-center gap-4 mb-[2.5rem] '>
        <div className=' grid grid-cols-1 lg:w-[25.6875rem] lg:mx-[9rem] place-items-center'>
          <h1 className='sm:w-[33.6875rem] sm:text-[3rem] lg:text-[3.5rem] lg:leading-[4.25rem] sm:leading-[3.75rem] min-w-[17rem] font-Roboto  text-[1.9375rem] leading-[2.5rem] font-bold text-center mx-[1.5rem] sm:mx-[7.12rem] mt-[6.5rem] mb-[1rem]'>
            Read the most interesting articles
          </h1>
          <p className='leading-[1.75rem] min-w-[17rem] sm:w-[33.6875rem] sm:text-[1.25rem]  text-[#5A7184] dark:text-gray-400 text-center  sm:mx-[7.12rem] mx-[1.5rem] mb-[3.75rem]'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
          <div className='relative mx-[1rem] sm:w-[33.6875rem] min-w-[17rem]'>
            {/* input search compunent */}
            <InputSearch />

            <button
              onClick={() => getArticles()}
              className='bg-[#1565D8] sm:hidden rounded-[0.5rem] w-[17rem] text-white font-openSans font-bold text-[1rem] px-[6.81rem] py-[0.81rem]'
            >
              Search
            </button>
          </div>

          <div className='mx-[1.5rem] sm:w-[33.6875rem]'>
            <div>
              <p className='text-[#5A7184] dark:text-gray-400 font-openSans font-bold text-[0.875rem] italic mt-[1rem] mb-[0.75rem]'>
                Popular Tags :
              </p>
            </div>
            <div>
              <button className='bg-[#E2EDFB] mb-[0.75rem] italic text-[#1565D8] mr-[0.66rem] text-center font-openSans font-bold text-[ 0.875rem] px-[1.20rem] py-[0.38rem] rounded-[0.25rem]'>
                Design
              </button>
              <button className='bg-[#E2EDFB] mb-[0.75rem] italic text-[#1565D8] mr-[0.66rem] text-center font-openSans font-bold text-[ 0.875rem] px-[1.20rem] py-[0.38rem] rounded-[0.25rem]'>
                User Experience
              </button>
              <button className='bg-[#E2EDFB] mb-[0.75rem] italic text-[#1565D8] mr-[0.66rem] text-center font-openSans font-bold text-[ 0.875rem] px-[1.20rem] py-[0.38rem] rounded-[0.25rem]'>
                User Interfaces
              </button>
            </div>
          </div>
        </div>
        <div className='hidden lg:block lg:h-[30.8125rem] lg:min-w-[30.75rem]'>
          <img className='w-full h-full object-cover' src={frontPic} alt='' />
        </div>
      </section>
      <Articles />
    </main>
  );
};

export default Home;
