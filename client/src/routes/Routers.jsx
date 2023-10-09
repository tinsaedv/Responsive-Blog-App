import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import Home from '../pages/Home';
import Profile from '../pages/Dashboard_Children/Profile';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Article from '../pages/Articles/Article';
import AllArticles from '../pages/Articles/AllArticles';
import { useUserStore } from '../App/useAuthStore';
import OthersProfile from '../pages/Profile/OthersProfile';
import SideBar from '../components/SideBar';
import PostArticle from '../pages/Dashboard_Children/PostArticle';
import PageNotFound from '../pages/Page not found/PageNotFound';
import DashBoard from '../pages/DashBoard';
import AllUserArticles from '../pages/Dashboard_Children/AllUserArticles.component';
import UpdateArticle from '../components/Dashboard/User Articles/UpdateArticle.component';
import Settings from '../pages/Dashboard_Children/Settings';
import LikedArticles from '../pages/Dashboard_Children/LikedArticles';

const MainContent = () => {
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  return (
    <>
      {!user || (location.pathname === '/dashboard' && <SideBar />)}
      {!user || (location.pathname === '/dashboard/profile' && <SideBar />)}
      {!user || (location.pathname === '/dashboard/postArticle' && <SideBar />)}
      {!user || (location.pathname === '/dashboard/articles' && <SideBar />)}
      {!user || (location.pathname === '/dashboard/update' && <SideBar />)}
      {!user || (location.pathname === '/dashboard/settings' && <SideBar />)}
      {!user ||
        (location.pathname === '/dashboard/likedArticles' && <SideBar />)}

      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={user ? <Home /> : <Register />} />
        <Route path='/login' element={user ? <Home /> : <Login />} />
        <Route path='dashboard/*' element={user ? <DashBoard /> : <Login />}>
          <Route
            path='articles'
            element={user ? <AllUserArticles /> : <Login />}
          />
          <Route path='update' element={user ? <UpdateArticle /> : <Login />} />
          <Route path='profile' element={user ? <Profile /> : <Login />} />
          <Route
            path='postArticle'
            element={user ? <PostArticle /> : <Login />}
          />
          <Route
            path='likedArticles'
            element={user ? <LikedArticles /> : <Login />}
          />
          <Route path='settings' element={user ? <Settings /> : <Login />} />
        </Route>
        <Route path='/article/:id' element={<Article />} />
        <Route path='/articles' element={<AllArticles />} />
        <Route path='/articles/:category' element={<AllArticles />} />
        {/* <Route path='/post' element={user ? <PostArticle /> : <Login />} /> */}
        <Route path='/users/:id' element={<OthersProfile />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      {location.pathname === '/dashboard/postArticle' ||
      location.pathname === '/dashboard/update' ||
      location.pathname === '/dashboard/profile' ||
      location.pathname === '/dashboard/articles' ||
      location.pathname === '/dashboard/settings' ||
      location.pathname === '/dashboard/likedArticles' ? null : (
        <Footer />
      )}
    </>
  );
};

const Routers = () => {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
};

export default Routers;
