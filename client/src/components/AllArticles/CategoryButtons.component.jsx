import { useCallback } from 'react';
import { useArticleStore } from '../../App/useArticleStore';
import Articles from '../Home/HomeArticles.component';
import { memo } from 'react';

const CategoryButtons = memo(({ menuItems, filteredItems, setItems }) => {
  const {
    setArticles,
    allArticles,
    articles,
    setSearchQuery,
    searchQuery,
    getArticles,
  } = useArticleStore((state) => ({
    setArticles: state.setArticles,
    allArticles: state.allArticles,
    articles: state.articles,
    setSearchQuery: state.setSearchQuery,
    searchQuery: state.searchQuery,
    getArticles: state.getArticles,
  }));

  console.log(menuItems);
  console.log('searchQuery', searchQuery);

  // const handleOnclick = useCallback(
  //   (e) => {
  //     setSearchQuery(e.target.value);
  //     getArticles();
  //   },
  //   [searchQuery]
  // );
  return (
    <div
      className='w-fit flex-wrap
    flex gap-4 mx-[4%]  my-10'
    >
      {searchQuery === '' && (
        <>
          <button
            onClick={() => {
              setItems(articles);
            }}
            className='bg-blue-500 text-sm sm:text-base py-2 px-2 sm:py-2 sm:px-4 text-white  rounded-md'
          >
            All
          </button>
          {menuItems?.map((category) => (
            <button
              key={category}
              value={category}
              onClick={() => filteredItems(category)}
              className='bg-blue-500 text-sm sm:text-base py-2 px-2 sm:py-2 sm:px-4 text-white rounded-md'
            >
              {category}
            </button>
          ))}
        </>
      )}
    </div>
  );
});

export default CategoryButtons;
