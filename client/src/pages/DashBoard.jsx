import { Outlet } from 'react-router-dom';

const DashBoard = () => {
  return (
    <div className='h-[100vh] mx-[4rem]'>
      <Outlet />
    </div>
  );
};

export default DashBoard;
