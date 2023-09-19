import { useCallback, useEffect } from 'react';
import { useArticleStore } from '../../App/useArticleStore';

const LoadMore = () => {
  const { setCurrentPage, currentPage, articles, getArticles, endOfArticle } =
    useArticleStore((state) => ({
      setCurrentPage: state.setCurrentPage,
      articles: state.articles,
      currentPage: state.currentPage,
      getArticles: state.getArticles,
      endOfArticle: state.endOfArticle,
    }));

  useEffect(() => {
    getArticles();
  }, [currentPage]);

  console.log('currentPage', currentPage);
  console.log('endOfArticle', endOfArticle);

  return (
    <div>
      <button
        onClick={() => setCurrentPage()}
        className='bg-blue-300  py-2 px-4 text-black rounded-md'
      >
        Load more
      </button>
      {endOfArticle && <p> looks like You have reached the end</p>}
    </div>
  );
};

export default LoadMore;
