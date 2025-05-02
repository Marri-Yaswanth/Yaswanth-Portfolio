import React from 'react';
import { ArrowDown, Github as GitHub, Linkedin, Mail } from 'lucide-react';
import { aboutMe, socialLinks } from '../data';
import * as LucideIcons from 'lucide-react';

const Home: React.FC = () => {
  // Dynamically get Lucide icons
  const IconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={24} /> : null;
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-teal-300 dark:bg-teal-800 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-32 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 dark:text-white leading-tight">
              Hi, I'm <span className="text-teal-500">{aboutMe.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {aboutMe.title}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto md:mx-0">
              {aboutMe.introduction}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a
                href="#contact"
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-colors flex items-center space-x-2"
              >
                <Mail size={20} />
                <span>Contact Me</span>
              </a>
              <a
                href="#about"
                className="px-6 py-3 bg-transparent border border-gray-300 hover:border-teal-500 hover:text-teal-500 dark:border-gray-600 dark:hover:border-teal-400 dark:hover:text-teal-400 text-gray-700 dark:text-gray-300 rounded-full transition-all flex items-center space-x-2"
              >
                <span>About me</span>
                <ArrowDown size={20} />
              </a>
              <a
                href="#projects"
                className="px-6 py-3 bg-transparent border border-gray-300 hover:border-teal-500 hover:text-teal-500 dark:border-gray-600 dark:hover:border-teal-400 dark:hover:text-teal-400 text-gray-700 dark:text-gray-300 rounded-full transition-all flex items-center space-x-2"
              >
                <span>Projects</span>
                {/* <ArrowDown size={20} /> */}
              </a>
            </div>

            <div className="flex justify-center md:justify-start space-x-6 mt-8">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                  aria-label={link.name}
                >
                  {IconComponent(link.icon)}
                </a>
              ))}
            </div>
          </div>

          <div className="md:w-5/12 relative">
            <div className="relative w-64 md:w-80 h-64 md:h-80 mx-auto overflow-hidden rounded-full border-4 border-white dark:border-gray-800 shadow-xl transform transition-transform hover:scale-105">
              <img
                src={aboutMe.photoUrl}
                alt={aboutMe.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform rotate-12">
              <span>👋</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a
          href="#about"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-teal-500"
          aria-label="Scroll Down"
        >
          <ArrowDown size={20} />
        </a>
      </div>
    </section>
  );
};

export default Home;