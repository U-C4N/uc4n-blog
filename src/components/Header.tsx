import React from 'react';
import { Github, Twitter, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Header({ darkMode, setDarkMode }: HeaderProps) {
  const { socialLinks } = useAuth();

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="h-[27px] hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl font-bold text-gray-800 dark:text-white">af</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link to="/blog" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Blog</Link>
          <Link to="/projects" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Projects</Link>
          <div className="flex items-center space-x-4 ml-4">
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Twitter size={20} />
            </a>
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Github size={20} />
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}