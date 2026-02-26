import React, { useEffect } from 'react';
import Certifications from '../sections/Certifications';

const CertificationsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Certifications | Yaswanth Portfolio';
  }, []);

  return <Certifications />;
};

export default CertificationsPage;
