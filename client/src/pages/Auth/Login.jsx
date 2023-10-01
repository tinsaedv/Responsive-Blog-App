import { Link } from 'react-router-dom';
import { useAuthStore } from '../../App/useAuthStore';

const Login = () => {
  const {
    loginUser,
    loginLoading,
    setLoginInfo,
    loginError,
    continueWithGoogle,
  } = useAuthStore((state) => ({
    loginUser: state.loginUser,
    setLoginInfo: state.setLoginInfo,
    loginLoading: state.loginLoading,
    loginError: state.loginError,
    continueWithGoogle: state.continueWithGoogle,
  }));

  function handleInputChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setLoginInfo && setLoginInfo(name, value);
  }

  return (
    <form
      onSubmit={loginUser}
      value=''
      className='mt-[2rem] lg:mt-0  flex items-center mx-auto flex-col  w-[22.5rem] '
    >
      <p className='text-center font-Roboto font-bold  text-[1.5rem] mb-[1.3rem]'>
        Login
      </p>
      <label className='self-start text-[.9rem] text-[#5A7184]  mb-[0.75rem] font-openSans font-semibold'>
        Name Or Email
      </label>
      <input
        className='dark:text-gray-600 w-full mb-[1.5rem] outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        onChange={handleInputChange}
        name='nameOrEmail'
        type='text'
        placeholder='Enter name or email'
      />

      <label className='self-start  text-[.9rem] mb-[0.75rem] text-[#5A7184] font-openSans font-semibold'>
        Password
      </label>
      <input
        className='w-full outline-none dark:text-gray-600 mb-[1.5rem] placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1.25rem] rounded-lg'
        onChange={handleInputChange}
        name='password'
        type='password'
        placeholder='Enter password'
      />
      <Link className='self-start mb-[1.75rem] text-[#1565D8] font-openSans font-semibold text-[0.875rem]'>
        Forgot password?
      </Link>
      <button
        className='bg-[#1565D8] mb-[1.5rem] w-full py-[0.6rem] pl-[1.25rem] rounded-lg text-white font-openSans font-bold text-[1rem]'
        type='submit'
      >
        {loginLoading ? 'Please wait' : 'Login'}
      </button>
      {loginError?.error && (
        <p className='bg-pink-200 text-red-900 w-full py-[1rem] text-center'>
          {loginError?.message}
        </p>
      )}
      <div className='self-start mb-[10rem]'>
        <p className='text-[#5A7184] mr-[0.5rem] font-openSans font-semibold text-[0.875rem]'>
          You don&apos;t have an account?{' '}
          <Link
            className='text-[0.875rem] font-openSans font-bold text-[#1565D8]'
            to={'/register'}
          >
            Register here
          </Link>
        </p>
        <hr />
        <a
          href='http://localhost:4000/auth/google'
          // onClick={() => continueWithGoogle()}
          type='button'
          className='py-2 px-4 shadow-lg'
        >
          Continue with Google
        </a>
      </div>
    </form>
  );
};

export default Login;
