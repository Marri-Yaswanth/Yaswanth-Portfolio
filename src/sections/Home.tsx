import React, { useEffect, useState } from 'react';
import { ArrowDown, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aboutMe, socialLinks } from '../data';
import useTypewriter from '../hooks/useTypewriter';
import * as LucideIcons from 'lucide-react';

const particles = [
  { cls: 'animate-particle-1', size: 'w-3 h-3', color: 'bg-amber-500/30', top: '15%', left: '10%', delay: '0s' },
  { cls: 'animate-particle-2', size: 'w-2 h-2', color: 'bg-yellow-400/20', top: '25%', left: '80%', delay: '1s' },
  { cls: 'animate-particle-3', size: 'w-4 h-4', color: 'bg-amber-500/20', top: '60%', left: '15%', delay: '2s' },
  { cls: 'animate-particle-1', size: 'w-2 h-2', color: 'bg-blue-400/25', top: '70%', left: '75%', delay: '3s' },
  { cls: 'animate-particle-2', size: 'w-3 h-3', color: 'bg-amber-500/15', top: '40%', left: '50%', delay: '0.5s' },
  { cls: 'animate-particle-3', size: 'w-2 h-2', color: 'bg-yellow-300/20', top: '80%', left: '35%', delay: '1.5s' },
  { cls: 'animate-particle-1', size: 'w-1.5 h-1.5', color: 'bg-amber-500/20', top: '10%', left: '60%', delay: '4s' },
  { cls: 'animate-particle-2', size: 'w-2.5 h-2.5', color: 'bg-blue-300/15', top: '50%', left: '90%', delay: '2.5s' },
];

const Home: React.FC = () => {
  const { displayed: typedTitle, done: titleDone } = useTypewriter(aboutMe.title, 50, 600);
  const [arrowVisible, setArrowVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setArrowVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamically get Lucide icons
  const IconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={24} /> : null;
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated floating background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-500/30 dark:bg-amber-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${p.size} ${p.color} ${p.cls}`}
            style={{ top: p.top, left: p.left, animationDelay: p.delay }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-32 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 dark:text-white leading-tight">
              Hi, I'm <span className="text-amber-500">{aboutMe.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed h-[2em]">
              {typedTitle}
              {!titleDone && <span className="typewriter-cursor" />}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto md:mx-0">
              {aboutMe.introduction}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link
                to="/contact"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors flex items-center space-x-2"
              >
                <Mail size={20} />
                <span>Contact Me</span>
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-transparent border border-gray-300 hover:border-amber-500 hover:text-amber-500 dark:border-gray-600 dark:hover:border-amber-400 dark:hover:text-amber-400 text-gray-700 dark:text-gray-300 rounded-full transition-all flex items-center space-x-2"
              >
                <span>About me</span>
                <ArrowDown size={20} />
              </Link>
              <Link
                to="/projects"
                className="px-6 py-3 bg-transparent border border-gray-300 hover:border-amber-500 hover:text-amber-500 dark:border-gray-600 dark:hover:border-amber-400 dark:hover:text-amber-400 text-gray-700 dark:text-gray-300 rounded-full transition-all flex items-center space-x-2"
              >
                <span>Projects</span>
              </Link>
            </div>

            <div className="flex justify-center md:justify-start space-x-6 mt-8">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
                  aria-label={link.name}
                >
                  {IconComponent(link.icon)}
                </a>
              ))}
            </div>
          </div>

          <div className="md:w-5/12 relative">
            {/* Animated border */}
            <div className="relative w-64 md:w-80 h-64 md:h-80 mx-auto">
              <div className="absolute -inset-1 rounded-full bg-amber-500 opacity-70 blur-sm animate-pulse" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl transform transition-transform hover:scale-105">
                <img
                  src={aboutMe.photoUrl}
                  alt={aboutMe.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform rotate-12 animate-float">
              <span>👋</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-700 ${arrowVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Link
          to="/about"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-amber-500"
          aria-label="Scroll Down"
        >
          <ArrowDown size={20} />
        </Link>
      </div>
    </section>
  );
};

export default Home;