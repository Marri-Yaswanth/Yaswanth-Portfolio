import React, { useEffect } from 'react';
import Contact from '../sections/Contact';

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact | Yaswanth Portfolio';
  }, []);

  return <Contact />;
};

export default ContactPage;
