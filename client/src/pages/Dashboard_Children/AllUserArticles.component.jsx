import { useEffect, useState } from 'react';
import { useArticleStore } from '../../App/useArticleStore';
import { useProfileStore } from '../../App/useUserProfileStore';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { CiMenuKebab } from 'react-icons/ci';
import { BiSolidPencil } from 'react-icons/bi';
import { BsTrashFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import DeleteArticleModal from '../../components/Dashboard/AllUserArticles/DeleteArticleModal.component';
import Footer from '../../components/Footer';
const AllUserArticles = () => {
  const navigate = useNavigate();
  const { userProfile } = useProfileStore((state) => ({
    userProfile: state.userProfile,
  }));

  const {
    userArticles,
    getUserArticlesById,
    deleteArticlesById,
    getArticleContent,
    userArticleLoading,
    editingArticleId,
    setEditingArticleId,
    getArticleById,
  } = useArticleStore((state) => ({
    userArticles: state.userArticles,
    getUserArticlesById: state.getUserArticlesById,
    deleteArticlesById: state.deleteArticlesById,
    getArticleContent: state.getArticleContent,
    userArticleLoading: state.userArticleLoading,
    editingArticleId: state.editingArticleId,
    setEditingArticleId: state.setEditingArticleId,
    getArticleById: state.getArticleById,
  }));

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile._id) {
      getUserArticlesById(userProfile._id);
    }
  }, [userProfile, getUserArticlesById]);

  let slicedUserArticles = userArticles;

  slicedUserArticles = userArticles?.map((article) => {
    if (article.summary.length > 70) {
      return { ...article, summary: article.summary.substring(0, 45) + '...' };
    }
    return article;
  });

  return (
    <div className='mb-[10rem]'>
      {/* if  userArticleLoading is true open loading animation or display content*/}
      {userArticleLoading ? (
        <div className='mx-[45%] my-[20%] h-full'>
          {/* Loading animation */}{' '}
          <div className='lds-ellipsis'>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className='lg:mx-[10rem] '>
          <p className='font-Roboto font-semibold text-[1.5rem] mb-5 text-center'>
            Your articles
          </p>
          {slicedUserArticles.length === 0 ? (
            <div className='text-center'>
              Seems like you have not posted any article!
            </div>
          ) : (
            <div className='flex flex-col   gap-[1.6rem] flex-wrap mx-10'>
              {Array.isArray(slicedUserArticles) &&
                slicedUserArticles?.map((post) => (
                  <div
                    key={post?._id}
                    className='flex bg-[#ececec]  rounded-[0.75rem] items-center relative gap-4'
                  >
                    <Link
                      to={`/article/get/${post?._id}`}
                      onClick={() => {
                        getArticleById(post?._id);
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        });
                      }}
                      className='flex gap-3 cursor-pointer w-full'
                    >
                      <div className=' w-[15rem] h-[9rem] sm:w-[full] sm:h-[full] rounded-[0.75rem] overflow-hidden'>
                        <img
                          className='object-cover w-full h-full'
                          src={post?.thumbnail}
                          alt=''
                        />
                      </div>

                      <div>
                        <h1 className='text-[#0D2436] mb-[0.51rem] font-Roboto sm:text-[1rem] text-[0.875rem] font-medium'>
                          {post?.title}
                        </h1>
                        <p>{post.summary}</p>
                        <p className='font-openSans text-[0.625rem] font-light'>
                          {moment(post?.createdAt).format('MMM Do YY')}
                        </p>
                      </div>
                    </Link>

                    <div className='relative'>
                      <CiMenuKebab
                        className='text-xl'
                        onClick={() => {
                          setMenuOpen(true);
                          setDeleteOpen(false);
                          setEditingArticleId(post?._id);
                        }}
                      />

                      {post?._id === editingArticleId && (
                        <div
                          className={`${
                            menuOpen ? 'block' : 'hidden'
                          } w-full h-full absolute   z-30 top-0 right-0`}
                        >
                          <div
                            onClick={(e) => {
                              setMenuOpen(false);
                              e.stopPropagation();
                            }}
                            className={`shadow-lg w-[8rem] relative bg-gray-200 h-[6rem]  rounded-md justify-center p-2 flex flex-col`}
                          >
                            <AiOutlineClose
                              onClick={() => setMenuOpen(false)}
                              className=' absolute top-0 right-0 text-[1.4rem] hover:shadow-md shadow-sm cursor-pointer text-gray-500 '
                            />
                            <button
                              onClick={() => {
                                getArticleContent(post?._id);
                                navigate('/dashboard/update');
                              }}
                              className=' text-black py-1 items-center gap-2 flex hover:shadow-md hover:bg-gray-100 rounded-sm'
                            >
                              <BiSolidPencil color='blue' /> <p>Edit</p>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteOpen(!deleteOpen);
                                setEditingArticleId(post?._id);
                              }}
                              className={` text-black py-1 items-center gap-2 flex hover:shadow-md hover:bg-gray-100 rounded-sm`}
                            >
                              <BsTrashFill color='red' /> <p>Delete</p>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {post?._id === editingArticleId && (
                      <DeleteArticleModal
                        deleteOpen={deleteOpen}
                        post={post}
                        deleteArticlesById={deleteArticlesById}
                        setDeleteOpen={setDeleteOpen}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AllUserArticles;
