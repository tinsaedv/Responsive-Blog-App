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
    if (pageTheme === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [pageTheme]);

  function handleThemeSwitch(e) {
    const newTheme = e.target.checked ? 'dark' : 'light';
    setIsChecked(e.target.checked);
    setPageTheme(newTheme);
    localStorage.setItem('Theme', JSON.stringify(newTheme));
  }

  // Merge the first and third useEffect hooks
  useEffect(() => {
    const theme = localStorage.getItem('Theme');
    if (theme === '"dark"') {
      setIsChecked(true);
      setPageTheme('dark');
    } else if (theme === '"light"') {
      setIsChecked(false);
      setPageTheme('light');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsChecked(true);
      setPageTheme('dark');
    } else {
      setIsChecked(false);
      setPageTheme('light');
    }
  }, [setPageTheme]);

  return (
    <div className='toggle-switch'>
      <label className='switch-label'>
        <input
          onChange={handleThemeSwitch}
          type='checkbox'
          checked={isChecked}
          className='checkbox'
        />
        <span className='slider'></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
