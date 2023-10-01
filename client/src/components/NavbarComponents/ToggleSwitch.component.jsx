import { useEffect, useState } from 'react';
import { useProfileStore } from '../../App/useUserProfileStore';
import './ToggleSwitch.css';

const ToggleSwitch = () => {
  const { pageTheme, setPageTheme } = useProfileStore((state) => ({
    pageTheme: state.pageTheme,
    setPageTheme: state.setPageTheme,
  }));

  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setPageTheme('dark');
    } else {
      setPageTheme('light');
    }
  }, [setPageTheme]);

  useEffect(() => {
    if (pageTheme === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [pageTheme]);

  function handleThemeSwitch() {
    setPageTheme(pageTheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('Theme', JSON.stringify(pageTheme));
  }

  useEffect(() => {
    const theme = localStorage.getItem('Theme');
    if (theme === '"dark"') {
      setIsChecked(true);
    }
  }, [isChecked]);

  return (
    <div className='toggle-switch'>
      <label className='switch-label'>
        <input
          onClick={handleThemeSwitch}
          type='checkbox'
          defaultChecked={isChecked}
          className='checkbox'
        />
        <span className='slider'></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
