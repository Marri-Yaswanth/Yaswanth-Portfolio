import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './sections/Home';
import About from './sections/About';
import Education from './sections/Education';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import { useTheme } from './hooks/useTheme';
import './styles/animations.css';

function App() {
  useTheme(); // Initialize theme

  useEffect(() => {
    document.title = 'Marri Venkata Siva Naga Yaswanth | Building Digital Solutions';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/20 via-transparent to-transparent dark:from-teal-900/20 pointer-events-none"></div>
      <Navbar />
      
      <main className="relative">
        <Home />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;