import React, { useEffect } from 'react';
import Education from '../sections/Education';

const EducationPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Education | Yaswanth Portfolio';
  }, []);

  return <Education />;
};

export default EducationPage;
