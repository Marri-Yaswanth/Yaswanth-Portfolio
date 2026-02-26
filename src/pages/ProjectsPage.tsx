import React, { useEffect } from 'react';
import Projects from '../sections/Projects';

const ProjectsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Projects | Yaswanth Portfolio';
  }, []);

  return <Projects />;
};

export default ProjectsPage;
