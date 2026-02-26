import React from 'react';
import { Link } from 'react-router-dom';
import { socialLinks } from '../data';
import * as LucideIcons from 'lucide-react';

const Footer: React.FC = () => {
  // Dynamically get Lucide icons
  const IconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={20} /> : null;
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Marri Venkata Siva Naga <span className="text-amber-500">Yaswanth</span>
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
              Web Developer student passionate about creating innovative websites that make a difference.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400 transition-colors"
                  aria-label={link.name}
                >
                  {IconComponent(link.icon)}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Marri Venkata Siva Naga Yaswanth. All rights reserved.
            </p>
          </div>
        </div>

        {/* Hidden admin links */}
        <div className="mt-6 flex justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Link
            to="/projects/add"
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            + Project
          </Link>
          <Link
            to="/certifications/add"
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            + Certification
          </Link>
          <Link
            to="/skills/add"
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            + Skill
          </Link>
          <Link
            to="/resume/update"
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            + Resume
          </Link>
          <Link
            to="/login"
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Manage
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;