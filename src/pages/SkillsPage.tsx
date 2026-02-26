import React, { useEffect } from 'react';
import Skills from '../sections/Skills';

const SkillsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Skills | Yaswanth Portfolio';
  }, []);

  return <Skills />;
};

export default SkillsPage;
