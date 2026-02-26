import React, { useEffect } from 'react';
import About from '../sections/About';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About | Yaswanth Portfolio';
  }, []);

  return <About />;
};

export default AboutPage;
