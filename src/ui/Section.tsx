import React, { ReactNode } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import SectionHeading from '../components/SectionHeading';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  subtitle,
  className = '',
  children
}) => {
  return (
    <AnimatedSection id={id} className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeading title={title} subtitle={subtitle} />
        {children}
      </div>
    </AnimatedSection>
  );
};

export default Section; 