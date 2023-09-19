import { useEffect } from 'react';
import { useProfileStore } from './App/useUserProfileStore';
import Routers from './routes/Routers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { getUserProfile } = useProfileStore((state) => ({
    getUserProfile: state.getUserProfile,
  }));

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  // console.log('userProfileApp', userProfile);
  return (
    <>
      <Routers />
      <ToastContainer />
    </>
  );
}

export default App;
