import { Link, NavLink } from 'react-router-dom';

import { SlMenu } from 'react-icons/sl';
import { FaUserCircle } from 'react-icons/fa';

import logo from '../assets/logo.png';
import { useUserStore } from '../App/useAuthStore';
import { useProfileStore } from '../App/useUserProfileStore';
import { useState } from 'react';

const NavBar = () => {
  const { user } = useUserStore((state) => ({ user: state.user }));

  const { userProfile } = useProfileStore((state) => ({
    userProfile: state.userProfile,
  }));

  const [isOpen, setIsOpen] = useState(false);

  function handleIsOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <header className=' grid items-center  backdrop-blur-sm z-[2]  bg-[#f7fbff]/80 h-[4rem] lg:h-[6.25rem]  fixed w-full top-0'>
      <div className='flex mx-10  justify-between items-center'>
        <div>
          <img src={logo} alt='' />
        </div>

        <nav className='flex gap-6 items-center'>
          <div
            className='hidden md:flex md:flex-row gap-[2.75rem]
              items-center w-fit left-0 font-openSans'
          >
            <NavLink
              to={'/'}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) =>
                isActive
                  ? 'active-link pb-[7px]   text-[#183B56] font-bold  text-[1rem] relative'
                  : 'navLinks pb-[7px]   text-[#183B56] font-bold  text-[1rem] relative'
              }
            >
              Home
            </NavLink>
            <NavLink
              to={'/articles'}
              onClick={() => window.scrollTo(0, 0)}
              className={({ isActive }) =>
                isActive
                  ? 'active-link pb-[7px]   text-[#183B56] text-[1rem] font-bold relative'
                  : 'navLinks pb-[7px]   text-[#183B56] text-[1rem] font-bold relative'
              }
            >
              Articles
            </NavLink>
          </div>{' '}
          <div
            className={` ${
              !isOpen
                ? 'hidden'
                : 'flex absolute  top-[4rem] flex-col md:flex md:flex-row '
            } md:hidden transition-all duration-150 items-center h-[17rem] font-openSans justify-center backdrop-blur-sm  z-10 bg-[#f7fbff]/100 left-0 w-full `}
          >
            <NavLink
              to={'/'}
              onClick={() => {
                window.scrollTo(0, 0);
                setIsOpen(false);
              }}
              className={
                'hover:bg-[#d3e9ff]/50 py-6 w-full text-center text-[#183B56]'
              }
            >
              Home
            </NavLink>
            <NavLink
              to={'/articles'}
              onClick={() => {
                window.scrollTo(0, 0);
                setIsOpen(false);
              }}
              className={
                'hover:bg-[#d3e9ff]/50 py-6 w-full text-center text-[#183B56]'
              }
            >
              Articles
            </NavLink>

            {!user ? (
              <NavLink
                to={'/login'}
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className={
                  'border-[#1565D8] hover:bg-[#1565D8] font-bold transition-all duration-150 hover:text-white border-2 px-[1.44rem] py-[0.4rem] lg:px-[2.44rem] block sm:hidden  lg:py-[0.81rem] text-[#1565D8] rounded-full'
                }
              >
                Sign in
              </NavLink>
            ) : (
              <Link
                className={
                  'hover:bg-[#d3e9ff]/50 py-6 w-full text-center text-[#183B56]'
                }
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                to={'/dashboard/profile'}
              >
                Profile
              </Link>
            )}
          </div>{' '}
          {!user ? (
            <NavLink
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
              to={'/login'}
              className={
                'border-[#1565D8] hover:bg-[#1565D8] font-bold transition-all duration-150 hover:text-white border-2 px-[1.44rem] py-[0.4rem] lg:px-[2.44rem] hidden sm:block  lg:py-[0.81rem] text-[#1565D8] rounded-full'
              }
            >
              Sign in
            </NavLink>
          ) : (
            <Link
              to={'/dashboard/profile'}
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
              className='cursor-pointer'
            >
              {userProfile && userProfile?.profilePicture !== '' ? (
                <div className='w-10 hidden sm:block h-10 rounded-full overflow-hidden'>
                  {' '}
                  <img
                    className='w-full h-full object-cover'
                    src={userProfile?.profilePicture}
                    alt=''
                  />
                </div>
              ) : (
                <FaUserCircle size={40} className='' />
              )}
            </Link>
          )}
          <SlMenu size={30} className='md:hidden' onClick={handleIsOpen} />
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
