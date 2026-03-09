import React, { useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Determine if glass effect should be active (scrolled OR mobile menu open)
  const showGlass = scrolled || isOpen;

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Scroll to top on route change (non-homepage)
  useEffect(() => {
    if (!isHomePage) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isHomePage]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
        ? 'text-amber-500 dark:text-amber-400 font-medium'
        : 'text-gray-700 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400'
    }`;
  };

  const getMobileLinkClass = (href: string) => {
    const isActive = activeSection === href;
    return `block px-4 py-3 rounded-xl transition-all duration-300 text-base font-medium ${
      isActive
        ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10'
        : 'text-gray-700 hover:text-amber-500 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:text-amber-400 dark:hover:bg-gray-800/50'
    }`;
  };

  return (
    <>
      <nav
        ref={menuRef}
        className={`fixed w-full z-50 transition-all duration-300 ${
          showGlass
            ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg shadow-gray-200/20 dark:shadow-black/20 border-b border-white/20 dark:border-gray-700/30 py-2'
            : 'bg-transparent py-4'
        }`}
        style={{ WebkitBackdropFilter: showGlass ? 'blur(24px)' : 'none' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 dark:text-white transition-colors"
            >
              Yaswanth.<span className="text-amber-500">Dev</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
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

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 focus:outline-none transition-colors"
                aria-label="Toggle Menu"
                aria-expanded={isOpen}
              >
                <span className={`absolute transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}>
                  <Menu size={22} />
                </span>
                <span className={`absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}>
                  <X size={22} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay + panel */}
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-down mobile menu */}
      <div
        className={`fixed left-0 right-0 z-45 md:hidden transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          top: showGlass ? '56px' : '72px',
          zIndex: 45,
        }}
      >
        <div
          className="mx-3 sm:mx-4 mt-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 shadow-xl shadow-gray-200/30 dark:shadow-black/30 overflow-hidden"
          style={{ WebkitBackdropFilter: 'blur(40px)' }}
        >
          <div className="flex flex-col p-3 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={getMobileLinkClass(link.href)}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isOpen ? `slideUp 0.3s ease-out ${index * 50}ms both` : 'none',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
