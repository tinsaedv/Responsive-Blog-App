import { useArticleStore } from '../../App/useArticleStore';

import { memo } from 'react';

const CategoryButtons = memo(({ menuItems, filteredItems, setItems }) => {
  const {
    articles,

    searchQuery,
  } = useArticleStore((state) => ({
    articles: state.articles,

    searchQuery: state.searchQuery,
  }));

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
