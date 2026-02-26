import React, { useEffect } from 'react';
import Home from '../sections/Home';
import About from '../sections/About';
import Education from '../sections/Education';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Certifications from '../sections/Certifications';
import Contact from '../sections/Contact';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Marri Venkata Siva Naga Yaswanth | Building Digital Solutions';
  }, []);

  return (
    <>
      <Home />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </>
  );
};

export default HomePage;
