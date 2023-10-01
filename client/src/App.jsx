import { useEffect } from 'react';
import { useProfileStore } from './App/useUserProfileStore';
import Routers from './routes/Routers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { getUserProfile, pageTheme } = useProfileStore((state) => ({
    getUserProfile: state.getUserProfile,

    pageTheme: state.pageTheme,
  }));

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  // useEffect(() => {
  //   const theme = localStorage.getItem('Theme');
  //   if (theme) {
  //     setPageTheme(JSON.parse(theme));
  //   }
  // }, [setPageTheme]);

  useEffect(() => {
    const theme = localStorage.getItem('Theme');
    console.log('theme', theme);
    if (theme === '"dark"') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [pageTheme]);

  return (
    <>
      <Routers />
      <ToastContainer />
    </>
  );
}

export default App;
