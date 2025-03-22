
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Book, User, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300',
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">LearnBridge</span>
        </NavLink>
        
        <div className="hidden md:flex space-x-6">
          <NavLink 
            to="/"
            className={({ isActive }) => cn(
              'nav-link',
              isActive ? 'active text-primary' : 'text-foreground hover:text-primary'
            )}
          >
            Courses
          </NavLink>
          <NavLink 
            to="/dashboard"
            className={({ isActive }) => cn(
              'nav-link',
              isActive ? 'active text-primary' : 'text-foreground hover:text-primary'
            )}
          >
            My Learning
          </NavLink>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary transition-colors hover:bg-secondary/80"
            aria-label="Dashboard"
          >
            <BarChart className="h-5 w-5 text-primary" />
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary transition-colors hover:bg-secondary/80"
            aria-label="User Profile"
          >
            <User className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
