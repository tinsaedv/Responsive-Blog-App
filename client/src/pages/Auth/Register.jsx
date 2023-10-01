import { Link } from 'react-router-dom';
import { useAuthStore } from '../../App/useAuthStore';

const Register = () => {
  const { registerUser, setRegisterInfo, registerLoading, registerError } =
    useAuthStore((state) => ({
      registerUser: state.registerUser,
      registerLoading: state.registerLoading,
      registerError: state.registerError,
      setRegisterInfo: state.setRegisterInfo,
    }));

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRegisterInfo(name, value);
  }

  return (
    <form
      onSubmit={registerUser}
      className='mt-[1rem] lg:mt-0  flex items-center mx-auto flex-col  w-[22.5rem] '
    >
      <p className='text-center font-Roboto font-bold  text-[1.5rem] mb-[1.3rem]'>
        Register
      </p>
      <label className='self-start text-[.9rem] text-[#5A7184] mb-[0.75rem] font-openSans font-semibold'>
        Name
      </label>
      <input
        className='w-full dark:text-gray-600 mb-[1.5rem] outline-none placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1rem] rounded-lg'
        onChange={handleInputChange}
        type='text'
        name='name'
        placeholder='Enter name'
      />
      <label className='self-start text-[.9rem] mb-[0.75rem] text-[#5A7184] font-openSans font-semibold'>
        Email address
      </label>
      <input
        className='w-full dark:text-gray-600 outline-none mb-[1.5rem] placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1.25rem] rounded-lg'
        onChange={handleInputChange}
        type='email'
        name='email'
        autoComplete='off'
        placeholder='Enter email'
      />
      <label className='self-start mb-[0.75rem] text-[.9rem] text-[#5A7184] font-openSans font-semibold'>
        Password
      </label>
      <input
        name='password'
        className='w-full dark:text-gray-600 outline-none mb-[1.75rem] placeholder:text-[.9rem] placeholder:text-[#959EAD] font-semibold py-[.6rem] pl-[1.25rem] rounded-lg'
        onChange={handleInputChange}
        type='password'
        placeholder='Enter password'
      />

      <button
        className='bg-[#1565D8] mb-[1.5rem] w-full py-[0.6rem] pl-[1.25rem] rounded-lg text-white font-openSans font-bold text-[1rem]'
        type='submit'
      >
        {registerLoading ? 'Loading' : 'Register'}
      </button>
      {registerError?.error && (
        <p className='bg-pink-200 text-red-700 w-full py-[1rem] text-center'>
          {registerError?.message}
        </p>
      )}
      <div className='self-start mb-[10rem]'>
        <p className='text-[#5A7184] mr-[0.5rem] font-openSans font-semibold text-[0.875rem]'>
          You have an account?{' '}
          <Link
            className='text-[0.875rem] font-openSans font-bold text-[#1565D8]'
            to={'/login'}
          >
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Register;
