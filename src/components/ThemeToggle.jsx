import { useTheme } from './ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle-floating ${darkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;