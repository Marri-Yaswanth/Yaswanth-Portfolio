import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../data';
import ThemeToggle from './ThemeToggle';

// Map section IDs to route paths
const sectionToRoute: Record<string, string> = {
  home: '/',
  about: '/about',
  education: '/education',
  skills: '/skills',
  projects: '/projects',
  certifications: '/certifications',
  contact: '/contact',
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('/');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top on route change (non-homepage)
  useEffect(() => {
    if (!isHomePage) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isHomePage]);

  // Intersection Observer for scroll-based highlighting on homepage
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection(location.pathname);
      return;
    }

    const sectionIds = Object.keys(sectionToRoute);

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const route = sectionToRoute[id];
          if (route) {
            setActiveSection(route);
          }
        }
      });
    };

    // Use a threshold and rootMargin that favors sections near the top of viewport
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isHomePage, location.pathname]);

  const getLinkClass = (href: string) => {
    const isActive = activeSection === href;
    return `transition-colors duration-300 ${
      isActive
        ? 'text-amber-500 dark:text-amber-400'
        : 'text-gray-600 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400'
    }`;
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg shadow-gray-200/20 dark:shadow-black/20 border-b border-white/20 dark:border-gray-700/30 py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-xl font-bold text-gray-800 dark:text-white transition-colors"
          >
            Yaswanth.<span className="text-amber-500">Dev</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={getLinkClass(link.href)}
              >
                {link.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={getLinkClass(link.href)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
